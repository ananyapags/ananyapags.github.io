# Building a System for Performance Benchmarking

This post is my breakdown (and a bit of a mock case study) of how I think about benchmarking as a system. I still wanted the structure to be clean, but I also wanted it to sound like how I actually think through this stuff while debugging.

> **Key Takeaway**  
> Benchmarking  is building a repeatable way to answer where time is going, what is actually bottlenecking the workload, and whether a change really helped.

## My Generic Outline

1. Define what performance means for the workload
2. Establish a baseline I trust
3. Check whether the GPU is waiting on CPU, I/O, or communication
4. Use profiler timelines to see what is really happening
5. Turn the whole thing into a repeatable feedback loop

---

## What Performance Benchmarking Actually Means

Before I benchmark anything, I try to define what better even means for the workload I am looking at. Because faster is vague.

For one system, performance might mean lower end-to-end runtime, higher GPU utilization, or more stable iteration times. For another system, it might mean lower latency, lower memory usage, or fewer stalls from I/O and communication. That part matters a lot, because if I start benchmarking without deciding what I care about, I end up collecting a lot of numbers with no story.

Benchmarking usually starts with a short checklist of metrics and what each one is telling me:

- **End-to-end runtime**: total wall-clock time, which tells me whether the system is actually faster
- **Step time**: duration of each iteration, which helps me spot instability and variance
- **Throughput**: useful work completed over time, which is usually the best measure of output
- **GPU utilization**: whether the accelerator is busy, which helps detect starvation or underuse
- **CPU utilization**: whether host-side work is overloaded, which helps expose loader or orchestration bottlenecks
- **Memory usage**: whether I am capacity-bound, which matters for scaling and batch size
- **Communication time**: whether distributed sync dominates, which becomes critical in multi-GPU training

So for me, performance benchmarking loop is really just: define the metric, measure the system, locate the bottleneck, validate the fix, and repeat.

---
---

# How I Would Debug 40% GPU Utilization:

## Step 1: Define Performance Before You Touch Anything

Before I run anything, I want to write down the workload, the environment, and what would count as a real improvement. If I am benchmarking a GPU training job, I usually want to know the model, the batch size, the number of GPUs, the precision mode, the input setup, the exact launch command, and which metrics matter most.

### Benchmark definition example

```text
Model: ResNet-50
Workload: training
Batch size: 256 global, 64 per GPU
GPUs: 4
Precision: FP32
Framework: PyTorch
Launcher: torchrun
Primary metric: images/sec
Secondary metrics: step time, GPU utilization
```

---

## Step 2: Establish a Baseline I Trust

What I usually record in a baseline is pretty simple:

- **Runtime**: total runtime and average step time
- **Utilization**: GPU utilization, CPU utilization, and memory usage
- **Reproducibility**: the exact command used and notes about the environment
- **Comparison**: enough detail to rerun the same setup later

### Example baseline launch

```bash
torchrun --nproc_per_node=4 train.py \
  --batch-size 64 \
  --epochs 1 \
  --workers 8
```

Then the first thing I usually do is just watch the GPUs:

```bash
watch -n 1 nvidia-smi
```

### Mock terminal output

```text
Every 1.0s: nvidia-smi

+-----------------------------------------------------------------------------+
| GPU  Name        Util  Memory | Temp  Power Draw    | Processes              |
|===============================+======================+========================|
| 0    Tesla V100     41%  8142MiB/32510MiB | 61C  167W | python 792341         |
| 1    Tesla V100     39%  8128MiB/32510MiB | 60C  165W | python 792341         |
| 2    Tesla V100     42%  8135MiB/32510MiB | 61C  168W | python 792341         |
| 3    Tesla V100     40%  8119MiB/32510MiB | 60C  166W | python 792341         |
+-----------------------------------------------------------------------------+
```

The first thing I notice here is that the GPUs are clearly doing something, but they are only around 40% utilized. That does not tell me the answer yet, but it tells me there is probably something worth investigating. At this point I try really hard not to guess. I just move to the next clue.

---

## Step 3: Confirm the Problem With Better Counters

A quick glance is useful, but I usually want one more level of confirmation.

```bash
nvidia-smi dmon -s u
```

### Mock terminal output

```text
# gpu    pwr gtemp    sm   mem
# Idx      W     C     %     %
    0    167    61    39    21
    1    165    60    41    22
    2    168    61    40    20
    3    166    60    38    21
```

The main thing I care about here is the **sm** column. If it stays low, then I know the GPUs are not just having one random dip. The underutilization is probably real.


---

## Step 4: Check the CPU Side and the Data Path

One thing I have learned pretty quickly is that a GPU can look underused even when the real problem is somewhere else. If the host side is too slow, the GPU just ends up waiting.

So I usually check the CPU side next:

```bash
htop
ps -o pid,psr,pcpu,comm -p 792341
```

### Mock process snapshot

```text
  PID PSR %CPU COMMAND
792341  11 378 python
```

What I am trying to understand here is pretty basic. Is the CPU extremely busy? Are only a few cores doing all the work? Is the process barely using CPU at all? Does it look active, or like it is waiting?

If CPU use is high and GPU use is low, that points me toward host-side overhead. If CPU use is low and GPU use is low, then I start thinking the program is waiting on something else.

Then I usually look at system activity too:

```bash
iostat -xm 1
```

### Mock terminal output

```text
avg-cpu:  %user   %system %iowait   %idle
          21.34    4.12   18.76    55.78

Device            r/s     rkB/s   %util await
disk0           428.0   51200.0   82.1  11.3
disk1           401.0   48896.0   79.8  10.9
```

If waiting time is high while the GPU is underutilized, that starts to suggest the program may not be getting data fast enough. And once I believe that, the possible fixes change a lot. Instead of saying optimize the kernel, I start thinking about using more workers, reducing preprocessing cost, prefetching more aggressively, caching more carefully, or simplifying the input pipeline.

---

## Step 5: If It Is Distributed, Check Communication

If I am using multiple GPUs, another possibility is that the devices are spending too much time waiting for each other. That can happen when the per-GPU batch size is small, synchronization happens too often, communication overhead is large relative to compute, or one rank is slower than the others. So I often enable debug logging for the communication library:

```bash
export NCCL_DEBUG=INFO
export NCCL_DEBUG_SUBSYS=ALL
```

I want to notice repeated long waits, communication-heavy behavior, warnings, or signs that synchronization is taking a huge part of the step.

If communication is dominating, then low GPU utilization is not really a GPU problem. It means the GPUs are spending too much time waiting on coordination. That changes the kinds of fixes I would test: larger per-GPU batch size, better overlap between compute and communication, less frequent synchronization, or a different parallel setup.

---

## Step 6: Use an actual Profiler

Once I have a few clues, I want a real timeline. So I run Nsight Systems:

```bash
nsys profile -o profile_report python train.py
```

Or for distributed training:

```bash
nsys profile -o profile_report \
  torchrun --nproc_per_node=4 train.py --batch-size 64 --workers 8
```

What I like about a timeline is that it shows different parts of the system at once: CPU work, CUDA calls, GPU kernels, memory copies, communication, and empty gaps where nothing useful is happening.

### Mock timeline

```text
CPU Thread:    [prepare batch][copy][idle][prepare batch][copy]
GPU Stream 0:  [kernels.....][idle.....][kernels.....][idle.....]
Comm Stream:   [sync....]                [sync....]
```

At that point I am basically asking: are there empty spaces on the GPU timeline, and what do those spaces line up with? If they line up with CPU work, I start thinking dataloader or preprocessing. If they line up with communication, I start thinking synchronization. If the whole thing looks stop-and-go, then at least I know the system is not being fed smoothly.

---

## Step 7: Ask Whether the Workload Is Just Too Small

Sometimes the answer is honestly simpler than I expect. Sometimes the workload is just too small to keep the GPU busy. That happens when the per-GPU batch size is tiny, the model is small, there are lots of short kernels, or launch overhead starts mattering more than the work itself.

### Quick calculation

```text
per-GPU batch = global batch / number of GPUs
```

```text
global batch = 256
GPUs = 8
per-GPU batch = 32
```

If each GPU is only getting a small amount of work, then low utilization may not mean something is broken. It may just mean the job is too light. And if that is the case, the fixes look different too. I start thinking about increasing batch size, reducing fragmentation, fusing more work together, or making each step do more useful work.

---

## Step 8: Check for Stragglers and Hardware Weirdness

I also try not to assume every GPU is behaving exactly the same. Sometimes one device runs hotter, clocks differently, or just ends up being the slow one in a synchronized job.

```bash
nvidia-smi
nvidia-smi -q -d TEMPERATURE
```

### Mock terminal output

```text
GPU 0 Temp : 61 C
GPU 1 Temp : 60 C
GPU 2 Temp : 62 C
GPU 3 Temp : 77 C
```

If one GPU looks noticeably different, that might matter more than I think. In synchronized multi-GPU training, one slow participant can make the rest wait.

> **Key Takeaway**  
> Distributed performance is often limited by the slowest part of the system, not the average part.

---

### Symptom map

- **GPU has empty gaps**: it is probably waiting on something upstream
- **CPU is very busy while GPU is not**: host-side work may be too slow
- **Communication takes a long time**: multi-GPU synchronization may be the bottleneck
- **Everything is active but utilization is still low**: the workload may simply be too small
- **One GPU looks different from the rest**: one straggler may be slowing the whole job



