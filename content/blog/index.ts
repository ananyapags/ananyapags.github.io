export interface BlogPost {
  jobId: number
  name: string
  slug: string
  status: "COMPLETED" | "RUNNING" | "QUEUED"
  runtime: string
  stack: string[]
  benchmarks: {
    label: string
    value: string
  }[]
  summary: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    jobId: 4035,
    name: "Intro",
    slug: "introduction-performance-engineering",
    status: "COMPLETED",
    runtime: "0h 30m",
    stack: ["HPC", "CUDA", "Triton", "PyTorch", "Systems Engineering"],
    benchmarks: [
      { label: "Goal", value: "Understand how systems actually run" },
      { label: "Focus", value: "Performance engineering & scalable infrastructure" },
      { label: "Vision", value: "Build faster and more efficient compute systems" },
    ],
    summary:
      "A story about how my habit of optimizing everyday decisions (like finding the perfect pair of trail runners) mirrors the mindset behind performance engineering and HPC systems.",
    content: `# Why Performance Engineering?
  
  I’m a huge fan of optimization in everyday life, even outside of engineering.
  
  For example, when I’m shopping  (whether it’s clothes, accessories, home decor, or something practical like trail running shoes)  my brain naturally turns the whole thing into a small optimization problem. If I’m looking for a new pair of trail runners, I’m not just asking “do these look good?” I’m thinking about a whole set of tradeoffs: how comfortable they are, how durable they’ll be, whether they work for the terrain I run on, how they fit with the rest of my gear, and of course whether they actually fit my budget.
  
  Somewhere in my head there’s a little multi-variable equation running:
  
  \`\`\`
  style + comfort + durability + price + practicality
  → best overall choice
  \`\`\`
  
  It’s never just one factor. It’s always the balance.
  
  That same way of thinking is weirdly similar to how I started approaching computing systems.
  
  When I first began working with machine learning models and GPU workloads, I assumed performance was mostly about the model itself. If something was slow, maybe the architecture needed improvement or the algorithm needed tuning. But over time I started noticing the same kind of tradeoffs I see when making everyday decisions.
  
  A model might look efficient, but the GPU could still be underutilized. A distributed job might scale across multiple machines, but communication overhead could quietly eat the speedup. A kernel might be mathematically simple but still dominate runtime because of memory access patterns.
  
  It started to feel less like just running code and more like solving an optimization puzzle.
  
  Instead of a fashion or shopping problem, the variables looked something like this:
  
  \`\`\`
  compute throughput
  + memory bandwidth
  + data pipeline speed
  + communication overhead
  + scheduling constraints
  → overall system performance
  \`\`\`
  
  That realization pulled me toward **performance engineering** and **high-performance computing (HPC)**.
  
  Performance engineering is essentially the art of understanding how complex systems behave under real workloads and figuring out how to make them run more efficiently. It’s not just about writing faster code. It’s about understanding the entire stack: how applications interact with frameworks, how frameworks translate work into kernels, how kernels execute on hardware, and how clusters move data between machines.
  
  Conceptually the stack looks something like this:
  
  \`\`\`
  Application / Model
  ↓
  Framework (PyTorch, TensorFlow, etc.)
  ↓
  Kernel Libraries (CUDA, Triton, BLAS)
  ↓
  Runtime Scheduling
  ↓
  Hardware (cores, caches, memory hierarchy)
  ↓
  Cluster Infrastructure (networking, schedulers, storage)
  \`\`\`
  
  Performance problems can appear at any level of that stack. A GPU might stall waiting for memory. A dataloader might not feed data fast enough. A distributed job might slow down because synchronization happens too frequently. Sometimes the bottleneck isn’t where you expect at all.
  
  That’s what makes performance engineering interesting to me. It turns computing into a kind of investigation. You measure the system, observe where time is actually going, and gradually build a mental model of why the workload behaves the way it does.
  
  The deeper I’ve gone into it, the more I’ve realized that modern computing, especially large-scale AI systems,  depends heavily on **systems-level thinking**. Algorithms are important, but so are memory hierarchies, data pipelines, networking, and scheduling infrastructure.
  
  Outside of the technical side, I also care a lot about mentorship and representation in engineering. I’ve been involved with **ACM-W**, and I enjoy helping others build confidence exploring technical fields that sometimes seem intimidating at first.
  
  This blog is mostly a record of what I’m learning as I explore this space.
  
  Some posts will be deep dives into technical topics like GPU kernels, distributed training systems, and performance profiling. Others will document experiments where I try to understand why a system behaves the way it does.
  
  ---
  
  ## Topics I’ll Cover
  
  Some of the areas I plan to explore here include:
  
  • GPU architecture and parallel computing  
  • CUDA and Triton kernel optimization  
  • Memory hierarchy and data movement  
  • Benchmarking and profiling techniques  
  • Distributed systems and cluster infrastructure  
  • Parallel programming with OpenMP, MPI, and NCCL  
  • Debugging performance bottlenecks in real workloads  
  • Designing scalable AI and HPC systems
  
  Some posts will focus on specific technologies. Others will focus on the broader question of **why systems behave the way they do**.
  
  Either way, the goal is the same: understanding how complex systems run at scale, and how to make them run faster and more efficiently.`
  },
  {
    jobId: 4036,
    name: "Benchmarking_Insights",
    slug: "performance-benchmarking",
    status: "COMPLETED",
    runtime: "06h 42m",
    stack: ["Python", "C++", "Profilers", "Nsight", "Perf Tools"],
    benchmarks: [
      { label: "CPU-GPU Sync Overhead", value: "-25%" },
      { label: "Execution Consistency", value: "+18%" },
      { label: "Profiling Coverage", value: "100%" }
    ],
    summary:
      "A structured breakdown of how I benchmark performance in practice: define the metric, establish a clean baseline, inspect utilization and data flow, and use profiler evidence to reason about bottlenecks instead of guessing.",
    content: `# Building a System for Performance Benchmarking

Performance work gets romanticized a lot.

People love saying things like optimize the system, make it faster, improve throughput, reduce latency, but in practice benchmarking is usually much less glamorous. Most of the time it is me staring at a terminal, trying not to jump to conclusions, and forcing myself to prove where time is actually going before I touch the code.

That is the real process.

This post is my breakdown of how I think about benchmarking as a system, not just a one-off test. I still wanted the structure to be clean, but I also wanted it to sound like how I actually think through this stuff while debugging.

> **Key Takeaway**  
> Benchmarking is not just run it and see if it feels faster. It is building a repeatable way to answer where time is going, what is actually bottlenecking the workload, and whether a change really helped.

## Outline

1. Define what performance means for the workload
2. Establish a baseline I trust
3. Check whether the GPU is waiting on CPU, I/O, or communication
4. Use profiler timelines to see what is really happening
5. Turn the whole thing into a repeatable feedback loop

---

## What Performance Benchmarking Actually Means

Before I benchmark anything, I try to define what better even means for the workload I am looking at. Because faster is vague.

For one system, performance might mean lower end-to-end runtime, higher GPU utilization, or more stable iteration times. For another system, it might mean lower latency, lower memory usage, or fewer stalls from I/O and communication. That part matters a lot, because if I start benchmarking without deciding what I care about, I end up collecting a lot of numbers with no story.

In my head, benchmarking usually starts with a short checklist of metrics and what each one is telling me:

- **End-to-end runtime**: total wall-clock time, which tells me whether the system is actually faster
- **Step time**: duration of each iteration, which helps me spot instability and variance
- **Throughput**: useful work completed over time, which is usually the best measure of output
- **GPU utilization**: whether the accelerator is busy, which helps detect starvation or underuse
- **CPU utilization**: whether host-side work is overloaded, which helps expose loader or orchestration bottlenecks
- **Memory usage**: whether I am capacity-bound, which matters for scaling and batch size
- **Communication time**: whether distributed sync dominates, which becomes critical in multi-GPU training

So for me, performance benchmarking is really just: define the metric, measure the system, locate the bottleneck, validate the fix, and repeat.

That is the loop.

---

## Step 1: Define Performance Before You Touch Anything

This is the part people skip, and then later they wonder why all their numbers are confusing.

Before I run anything, I want to write down the workload, the environment, and what would count as a real improvement. If I am benchmarking a GPU training job, I usually want to know the model, the batch size, the number of GPUs, the precision mode, the input setup, the exact launch command, and which metrics matter most.

### Benchmark definition example

\`\`\`text
Model: ResNet-50
Workload: training
Batch size: 256 global, 64 per GPU
GPUs: 4
Precision: FP32
Framework: PyTorch
Launcher: torchrun
Primary metric: images/sec
Secondary metrics: step time, GPU utilization
\`\`\`

The reason I do this is simple. Otherwise I will end up comparing two runs that are not actually comparable. Maybe one used a different batch size. Maybe one used mixed precision. Maybe one ran on a busier machine. Maybe one had a different launch setup. That is how fake performance improvements happen.

---

## Step 2: Establish a Baseline I Trust

I do not like optimizing anything until I have one baseline run that feels honest.

Not perfect. Just honest.

A baseline gives me something real to compare against later. Without that, I am just changing things and hoping the numbers move in the right direction.

What I usually record in a baseline is pretty simple:

- **Runtime**: total runtime and average step time
- **Utilization**: GPU utilization, CPU utilization, and memory usage
- **Reproducibility**: the exact command used and notes about the environment
- **Comparison**: enough detail to rerun the same setup later

### Example baseline launch

\`\`\`bash
torchrun --nproc_per_node=4 train.py \\
  --batch-size 64 \\
  --epochs 1 \\
  --workers 8
\`\`\`

Then the first thing I usually do is just watch the GPUs:

\`\`\`bash
watch -n 1 nvidia-smi
\`\`\`

### Mock terminal output

\`\`\`text
Every 1.0s: nvidia-smi

+-----------------------------------------------------------------------------+
| GPU  Name        Util  Memory | Temp  Power Draw    | Processes              |
|===============================+======================+========================|
| 0    Tesla V100     41%  8142MiB/32510MiB | 61C  167W | python 792341         |
| 1    Tesla V100     39%  8128MiB/32510MiB | 60C  165W | python 792341         |
| 2    Tesla V100     42%  8135MiB/32510MiB | 61C  168W | python 792341         |
| 3    Tesla V100     40%  8119MiB/32510MiB | 60C  166W | python 792341         |
+-----------------------------------------------------------------------------+
\`\`\`

The first thing I notice here is that the GPUs are clearly doing something, but they are only around 40% utilized. That does not tell me the answer yet, but it tells me there is probably something worth investigating.

Low GPU utilization does not automatically mean the GPU code is bad. It might mean the CPU is too slow, the data pipeline is too slow, the batch size is too small, there is too much waiting or synchronization, or the work on each step is simply too small. At this point I try really hard not to guess. I just move to the next clue.

---

## Step 3: Confirm the Problem With Better Counters

A quick glance is useful, but I usually want one more level of confirmation.

\`\`\`bash
nvidia-smi dmon -s u
\`\`\`

### Mock terminal output

\`\`\`text
# gpu    pwr gtemp    sm   mem
# Idx      W     C     %     %
    0    167    61    39    21
    1    165    60    41    22
    2    168    61    40    20
    3    166    60    38    21
\`\`\`

The main thing I care about here is the **sm** column. If it stays low, then I know the GPUs are not just having one random dip. The underutilization is probably real.

### Visual summary

\`\`\`text
GPU 0  [########------------] 39%
GPU 1  [########------------] 41%
GPU 2  [########------------] 40%
GPU 3  [########------------] 38%
\`\`\`

> **Key Takeaway**  
> Once the counters confirm low utilization, the next question is not "why is the GPU bad?" It is "what is upstream of the GPU?"

---

## Step 4: Check the CPU Side and the Data Path

One thing I have learned pretty quickly is that a GPU can look underused even when the real problem is somewhere else. If the host side is too slow, the GPU just ends up waiting.

So I usually check the CPU side next:

\`\`\`bash
htop
ps -o pid,psr,pcpu,comm -p 792341
\`\`\`

### Mock process snapshot

\`\`\`text
  PID PSR %CPU COMMAND
792341  11 378 python
\`\`\`

What I am trying to understand here is pretty basic. Is the CPU extremely busy? Are only a few cores doing all the work? Is the process barely using CPU at all? Does it look active, or like it is waiting?

If CPU use is high and GPU use is low, that points me toward host-side overhead. If CPU use is low and GPU use is low, then I start thinking the program is waiting on something else.

Then I usually look at system activity too:

\`\`\`bash
iostat -xm 1
\`\`\`

### Mock terminal output

\`\`\`text
avg-cpu:  %user   %system %iowait   %idle
          21.34    4.12   18.76    55.78

Device            r/s     rkB/s   %util await
disk0           428.0   51200.0   82.1  11.3
disk1           401.0   48896.0   79.8  10.9
\`\`\`

If waiting time is high while the GPU is underutilized, that starts to suggest the program may not be getting data fast enough. And once I believe that, the possible fixes change a lot. Instead of saying optimize the kernel, I start thinking about using more workers, reducing preprocessing cost, prefetching more aggressively, caching more carefully, or simplifying the input pipeline.

That is why I like checking this early. It keeps me from optimizing the wrong thing.

---

## Step 5: If It Is Distributed, Check Communication

If I am using multiple GPUs, another possibility is that the devices are spending too much time waiting for each other.

That can happen when the per-GPU batch size is small, synchronization happens too often, communication overhead is large relative to compute, or one rank is slower than the others.

So I often enable debug logging for the communication library:

\`\`\`bash
export NCCL_DEBUG=INFO
export NCCL_DEBUG_SUBSYS=ALL
\`\`\`

I am not trying to read every line like a novel. Mostly I want to notice repeated long waits, communication-heavy behavior, warnings, or signs that synchronization is taking a huge part of the step.

If communication is dominating, then low GPU utilization is not really a GPU problem. It means the GPUs are spending too much time waiting on coordination. That changes the kinds of fixes I would test: larger per-GPU batch size, better overlap between compute and communication, less frequent synchronization, or a different parallel setup.

---

## Step 6: Use a Profiler So I Can Stop Guessing

This is where the story usually becomes much clearer.

Once I have a few clues, I want a real timeline. So I run Nsight Systems:

\`\`\`bash
nsys profile -o profile_report python train.py
\`\`\`

Or for distributed training:

\`\`\`bash
nsys profile -o profile_report \\
  torchrun --nproc_per_node=4 train.py --batch-size 64 --workers 8
\`\`\`

What I like about a timeline is that it shows different parts of the system at once: CPU work, CUDA calls, GPU kernels, memory copies, communication, and empty gaps where nothing useful is happening.

### Mock timeline

\`\`\`text
CPU Thread:    [prepare batch][copy][idle][prepare batch][copy]
GPU Stream 0:  [kernels.....][idle.....][kernels.....][idle.....]
Comm Stream:   [sync....]                [sync....]
\`\`\`

At that point I am basically asking: are there empty spaces on the GPU timeline, and what do those spaces line up with? If they line up with CPU work, I start thinking dataloader or preprocessing. If they line up with communication, I start thinking synchronization. If the whole thing looks stop-and-go, then at least I know the system is not being fed smoothly.

This is usually where I can stop saying it seems slow and start saying something more useful, like the GPU is waiting for batches, communication is taking too long, the kernels are too small, or the CPU side is not keeping up.

---

## Step 7: Ask Whether the Workload Is Just Too Small

Sometimes the answer is honestly simpler than I expect. Sometimes the workload is just too small to keep the GPU busy.

That happens when the per-GPU batch size is tiny, the model is small, there are lots of short kernels, or launch overhead starts mattering more than the work itself.

### Quick calculation

\`\`\`text
per-GPU batch = global batch / number of GPUs
\`\`\`

\`\`\`text
global batch = 256
GPUs = 8
per-GPU batch = 32
\`\`\`

If each GPU is only getting a small amount of work, then low utilization may not mean something is broken. It may just mean the job is too light. And if that is the case, the fixes look different too. I start thinking about increasing batch size, reducing fragmentation, fusing more work together, or making each step do more useful work.

---

## Step 8: Check for Stragglers and Hardware Weirdness

I also try not to assume every GPU is behaving exactly the same.

Sometimes one device runs hotter, clocks differently, or just ends up being the slow one in a synchronized job.

\`\`\`bash
nvidia-smi
nvidia-smi -q -d TEMPERATURE
\`\`\`

### Mock terminal output

\`\`\`text
GPU 0 Temp : 61 C
GPU 1 Temp : 60 C
GPU 2 Temp : 62 C
GPU 3 Temp : 77 C
\`\`\`

If one GPU looks noticeably different, that might matter more than I think. In synchronized multi-GPU training, one slow participant can make the rest wait.

> **Key Takeaway**  
> Distributed performance is often limited by the slowest part of the system, not the average part.

---

## Example: How I Would Debug 40% GPU Utilization

If someone told me "my GPU utilization is only 40%," this is basically the exact sequence I would follow.

1. Confirm it stays low with \`watch -n 1 nvidia-smi\`.
2. Validate it with \`nvidia-smi dmon -s u\`.
3. Check the CPU side with \`htop\` and \`ps -o pid,psr,pcpu,comm -p <PID>\`.
4. Inspect system activity with \`iostat -xm 1\`.
5. If it is distributed, inspect communication with \`NCCL_DEBUG=INFO\`.
6. Profile the timeline with \`nsys profile -o profile_report python train.py\`.
7. Ask whether the GPU simply has too little work.
8. Check for one slow or unusual participant.

### Symptom map

- **GPU has empty gaps**: it is probably waiting on something upstream
- **CPU is very busy while GPU is not**: host-side work may be too slow
- **Communication takes a long time**: multi-GPU synchronization may be the bottleneck
- **Everything is active but utilization is still low**: the workload may simply be too small
- **One GPU looks different from the rest**: one straggler may be slowing the whole job

That feels a lot more useful to me than just saying the GPU should be higher.

---

## What the Numbers Do and Do Not Mean

A metric by itself usually does not explain the whole story.

- **40% GPU utilization** does not automatically mean the GPU code is bad. It might mean the GPU is waiting, communication is expensive, or the workload is too small.
- **High CPU usage** does not automatically mean the CPU is definitely the bottleneck. It might just mean useful preprocessing is happening correctly.
- **Better runtime with lower utilization** does not mean the metrics are contradictory. It can mean overhead dropped even if utilization did not rise.

That is why I try not to panic over one number. I try to look for a pattern across multiple numbers instead.

---

## My Rule: Profile Before Forming a Strong Opinion

This is probably the biggest lesson in the whole process.

It is really easy to assume the problem is the GPU, the kernel, the framework, or the hardware.

And then after profiling, it turns out the actual issue is data loading, waiting, communication, too little work per GPU, or too much host-side overhead.

So I try to keep one simple rule in my head:

**I am not allowed to be too confident until the profiler backs me up.**

That mindset saves a lot of wasted time.

---

## Quick Command Checklist

\`\`\`bash
watch -n 1 nvidia-smi
nvidia-smi dmon -s u
htop
ps -o pid,psr,pcpu,comm -p <PID>
iostat -xm 1
export NCCL_DEBUG=INFO
export NCCL_DEBUG_SUBSYS=ALL
nsys profile -o profile_report python train.py
nvidia-smi -q -d TEMPERATURE
\`\`\`

---


## Where I Want to Take This Next

Eventually I want this process to feel reusable across different kinds of systems:

- single-GPU experiments
- distributed training
- CUDA kernels
- inference workloads
- larger HPC jobs

Because even when the exact bottleneck changes, the thought process usually stays pretty similar:

**measure honestly, profile carefully, and let the data tell me what matters.**`
  },
  {
    jobId: 4037,
    name: "Coding_GPU_Puzzles_With_SashaRush",
    slug: "coding-gpu-kernels-sasha-rush-puzzles",
    status: "QUEUED",
    runtime: "12h 00m",
    stack: ["CUDA", "Numba", "Python", "GPU Programming", "Parallel Computing"],
    benchmarks: [
      { label: "GPU Puzzles Completed", value: "12/12" },
      { label: "Speedup vs CPU", value: "30×" },
      { label: "Key Insight", value: "Parallelism through Threads & Memory" },
    ],
    summary:
      "Learned GPU programming by completing Sasha Rush’s GPU Puzzles: coding custom kernels in Numba to understand how deep learning runs on hardware.",
    content: `# Coding and Building GPU Kernels with Sasha Rush’s Puzzles (Upcoming)

I’m planning to dive into **[GPU Puzzles by Sasha Rush](https://github.com/srush/GPU-Puzzles)**, an interactive notebook series that teaches GPU programming by having you write your own CUDA-style kernels using **Numba**.

What I like about it is that it strips away a lot of the abstraction. Instead of only seeing the PyTorch or framework side of things, you get pushed closer to the actual mechanics of how parallelism, threads, memory access, and synchronization work on the hardware.

## Outline

1. Why I want to work through GPU Puzzles
2. What I’m hoping to learn from each puzzle
3. How this connects back to deep learning systems
4. What this post will eventually turn into

---

## Why I Want to Work Through GPU Puzzles

One thing I keep coming back to is that I don’t just want to know that GPUs are fast. I want to understand **why** they are fast, and more importantly, why they are sometimes not fast at all.

That means getting closer to the kernel level. It means understanding how threads cooperate within a block, how work gets mapped across the device, what shared memory actually buys you, and where synchronization starts becoming expensive. The puzzles seem like a good way to build intuition instead of just memorizing terminology.

---

## What I’m Hoping to Learn

This will be one of my upcoming posts where I document what I learn while solving each puzzle, from understanding how threads cooperate within blocks, to optimizing shared vs global memory, to managing synchronization and avoiding race conditions. The goal is to build real intuition for how GPUs execute deep learning workloads, not just from a framework perspective but from the raw kernel level.
I’m especially interested in how these exercises sharpen my understanding of:

• parallelism across threads and blocks  \n• memory hierarchy and access patterns  \n• synchronization and race conditions  \n• how kernel design choices affect runtime and efficiency

---

## Why This Matters for Deep Learning

A lot of deep learning work happens at a level where you call a high-level operation and trust the framework to handle the rest. That abstraction is useful, but it can also hide the reasons why performance looks the way it does. Working through small kernel puzzles feels like a way to bridge that gap. Instead of only knowing that a workload is memory-bound or synchronization-heavy, I want to be able to recognize the low-level patterns that create those bottlenecks in the first place. That kind of understanding feels especially important if I want to get better at performance engineering, kernel optimization, and hardware-aware ML systems.

---

## What This Post Will Eventually Become

Once I’ve worked through the puzzles, I want this post to turn into something much more detailed: notes on each puzzle, what concept it was teaching, what confused me at first, what performance tradeoff it exposed, and how it connects back to real deep learning workloads. I also want to include performance experiments and visual breakdowns of how different kernel design choices affect runtime and efficiency. For now, this page is a placeholder for that journey: a future write-up on learning to think like a GPU.
`,
  },
  {
    jobId: 4038,
    name: "LLM_Training_Journey",
    slug: "training-llms-under-hardware-constraints",
    status: "RUNNING",
    runtime: "04h 15m",
    stack: ["HPC", "SLURM", "CUDA", "PyTorch", "FSDP", "Distributed Training", "Systems Engineering"],
    benchmarks: [
      { label: "Scratch Training Target", value: "GPT-2 Small (124M)" },
      { label: "Fine-Tuning Target", value: "Mistral-7B with FSDP" },
      { label: "Primary Hardware", value: "2× V100 32GB per node (WAVE HPC)" },
    ],
    summary:
      "Documenting my experience learning large language model training on constrained HPC infrastructure. From training GPT-2 Small from scratch to experimenting with FSDP fine-tuning of Mistral-7B, this post focuses on the real systems friction behind LLM work on a university cluster.",
    content: `Most posts about training LLMs assume you’re sitting on a dream setup—rows of A100s, perfect NVLink, infinite memory, and GPU utilization magically pinned at 100%. That’s…not my reality (yet—manifesting that post-grad paycheck). I’m working on my university’s HPC cluster, which is powerful but very real: mixed hardware, shared queues, and the occasional existential crisis while staring at SLURM like “why has my job been pending for 40 minutes, did I anger the scheduler gods?” Honestly, my “cluster” is just whatever GPUs I’m lucky enough to get that day. But weirdly, that constraint is what makes it interesting, mainly because you can’t brute force anything. You actually have to think: does this even fit in memory? are my GPUs doing real work or just vibing? am I compute-bound or getting wrecked by memory bandwidth? is my dataloader silently sabotaging me? and is NCCL communication about to become my villain arc? It ends up feeling less like “training models” and more like real performance engineering—which, if we’re being honest, is just debugging but with higher stakes and fancier graphs.

## Outline

1) Hardware overview: the compute and infrastructure environment I am working with
2) Baseline experiments using GPT-2 Small
3) Observations about training system behavior and bottlenecks
4) The role of storage bandwidth and data pipelines
5) Scaling experiments with Mistral-7B using FSDP
6) Operational constraints: scheduling, resource limits, and SLURM

---

## What the Hardware Reality Actually Looks Like

In theory there are more GPUs across the uni cluster, but the hardware I usually work with as a CS master's student looks more like this:

\`\`\`
1 node  → 2 allocated GPUs
2 nodes → 4 allocated GPUs (if multi-node access is available)
\`\`\`

**GPU Node Specification (Dell PowerEdge R740)**
\`\`\`
→ Node Type: Dell PowerEdge R740
→ GPUs per node: 2 allocated (out of 4 available)
→ GPU Model: Tesla V100-PCIE-32GB
→ Total VRAM (allocated): 64 GB (2 × 32GB)
→ Interconnect: PCIe (no NVLink)
→ Power limit: 250W per GPU
→ CPU: Intel Xeon Gold 6148 @ 2.4GHz
→ 20 cores per processor × 2 sockets = 40 physical cores
→ With hyperthreading: 80 threads total
→ System Memory: 384 GB DDR4
→ Local Storage: 1.92 TB SSD per node
→ Shared Storage: NFS (for datasets and home directories)
\`\`\`

That constraint shaped how I approached learning LLM systems. Instead of immediately trying to run the biggest model possible, I started with something small enough that I could actually experiment, profile, and iterate.

---

## Why I Started With GPT-2 Small

The first model I trained from scratch was:

\`\`\`
GPT-2 Small
124M parameters
1–2 V100 GPUs
\`\`\`

It's small enough to run comfortably on my hardware, but still large enough to expose real transformer training behavior. That made it perfect for learning the system. Even at this scale, you still run into many of the same issues that appear in larger training runs: GPU utilization, batch sizing, optimizer overhead, dataloader throughput, distributed synchronization, and kernel launch efficiency. The difference is that experiments complete in **hours instead of weeks**, which means you can actually iterate and learn from each run.

---

## What GPT-2 Small Actually Taught Me

One of the first things GPT-2 Small taught me is that **on my setup, the model itself was rarely the bottleneck**.

**What my profiler showed me on the first naive run:**

\`\`\`
GPU Utilization: 37% (spiking between 15-80%)
Memory Utilization: 42%
Tokens/second: 1,200
Step time: 2.3 seconds
Estimated time to completion: 14 hours
\`\`\`

Early on I thought transformer training was mostly a modeling problem, but once I started running jobs and looking at profiler traces it became obvious that the surrounding system matters just as much.

The GPU does not magically reach perfect utilization because a training script exists. If the input pipeline is slow, the GPU waits. If the batch size is poorly chosen, the GPU waits. If CPU preprocessing lags behind, the GPU waits. If synchronization happens too frequently, the GPU waits. A lot of "GPU inefficiency" is really just **GPU starvation**.

This is also where I started thinking about hardware signals instead of just loss curves. I began looking at achieved TFLOPs versus theoretical peak, SM occupancy, memory bandwidth utilization, tokens-per-second throughput, and overall GPU duty cycle. Transformer attention is a good example of the tradeoff here. Because attention scales quadratically with sequence length, longer sequences increase both compute and memory traffic. Depending on sequence length, batch size, and kernel efficiency, the workload can shift between being compute-bound and memory-bound. In other words, the GPU can have plenty of theoretical FLOPs available and still spend time waiting on memory movement.

A simple conceptual breakdown that helped me reason about the training loop looked like this:

\`\`\`
Forward pass
↓
Backward pass
↓
Gradient synchronization
↓
Optimizer step
\`\`\`

Even though that loop looks simple, there are a lot of places where performance can disappear. GPT-2 Small turned out to be a great playground for learning how to **read the shape of a training run** and optimize it.

---

## Why the Storage System Started Mattering So Much While Training

One thing that became obvious once I moved to larger datasets was that **the storage system matters a lot more than I expected**. The WAVE cluster stores most datasets on shared NFS storage, which is great for capacity but not ideal for workloads that perform lots of small random file reads.

Early versions of my training runs used datasets stored as thousands of individual files, and what I noticed was that GPU utilization would randomly dip even though the model itself wasn't doing anything unusual. The dataloader was waiting on NFS. Each tiny file access meant another network round trip, which added latency to the input pipeline. When the GPU finishes its current batch but the next batch has not arrived yet, the device just sits idle.

**The problem I was seeing:**
\`\`\`
Step 47: GPU util 78%, step time 1.8s
Step 48: GPU util 12%, step time 4.2s <- what's going on here???
Step 49: GPU util 81%, step time 1.7s
\`\`\`

The fix that many large-scale training pipelines use is repacking datasets into **large sequential shards**. Instead of storing millions of tiny files, the dataset gets packed into larger archive containers:

\`\`\`
dataset/
  shard-0000.tar
  shard-0001.tar
  shard-0002.tar
\`\`\`

This turns the workload from many small random I/O operations into large sequential reads, which storage systems handle much more efficiently. The dataloader can stream data from these shards instead of constantly opening and closing files across the network. Once I started thinking about dataset layout as part of the performance problem, it became much easier to understand why input pipelines sometimes limit tokens/sec even when the GPU still has compute headroom.

After repacking my dataset into sequential shards and setting a better number of dataloader workers, here is what the optimized GPT-2 Small run looked like:

\`\`\`
GPU Utilization: 82% (stable between 78-85%)
Memory Utilization: 45%
Tokens/second: 3,840
Step time: 0.9 seconds
Estimated time to completion: 4.5 hours
\`\`\`

---

## Moving From GPT-2 Small to Mistral-7B

After getting comfortable with GPT-2 Small, I wanted to experiment with something closer to a modern open LLM workflow, which led me to **Mistral-7B**. Obviously I am not training a 7B parameter model from scratch on this cluster. That would be shitshow. But **fine-tuning** it is actually feasible with the right memory-saving techniques.

**For Mistral-7B at FP16:**

\`\`\`
Model parameters:     7B × 2 bytes = 14 GB
Gradients:            7B × 2 bytes = 14 GB
Optimizer states:     Adam states are much larger and quickly dominate memory
Activations:          Additional per-GPU memory depending on batch size and sequence length

Total without optimization: well beyond a single 32 GB V100
\`\`\`

The trick that makes this possible is **FSDP**. Instead of every GPU storing the full training state, FSDP shards model parameters, gradients, and optimizer state across GPUs. But activations still remain local to each GPU, so memory does not scale down perfectly.

A more accurate mental model is:

\`\`\`
Without sharding
→ full parameters on every GPU
→ full gradients on every GPU
→ full optimizer states on every GPU
→ memory becomes the wall

With FSDP
→ parameters are sharded
→ gradients are sharded
→ optimizer states are sharded
→ activations still stay local
\`\`\`

Then you layer on additional techniques:

\`\`\`
FSDP
+ mixed precision
+ CPU offload
+ activation checkpointing
+ gradient accumulation
\`\`\`

That combination is what makes fine-tuning a model like Mistral-7B feel realistic on smaller hardware. The moment I stopped thinking "does the model fit?" and started thinking "which parts of the training state can I shard, offload, or recompute?" the problem became much more manageable.

---

## What Becomes the Bottleneck After Memory

Once memory pressure is reduced, the next bottleneck often becomes **communication**. In PyTorch distributed training, that usually means NCCL collectives like all-reduce, all-gather, reduce-scatter, and broadcast. With FSDP, parameter shards often need to be gathered and redistributed during forward and backward passes. That means part of each training step can end up dominated by communication instead of compute.

On smaller setups like mine, usually two V100s, the issue is often not just raw bandwidth. It is also latency and synchronization stalls. If gradient buckets are too small, NCCL ends up launching many small collectives, which creates inefficient communication patterns. In those cases, GPUs finish their backward pass and then sit idle waiting for synchronization to finish.

Conceptually the tradeoff looks like this:

\`\`\`
Without sharding → memory becomes the main wall
With sharding → memory pressure drops → communication overhead becomes much more visible
\`\`\`

One of the important ideas here is **overlap**. In a better setup, communication overlaps with computation so gradient synchronization is happening while other layers are still doing useful work. In a worse setup, communication becomes a hard stop where the GPUs just wait.

Another thing that became interesting while profiling was spotting cases where the workload launched too many small kernels. Transformer workloads can easily spend time on launch overhead and memory movement if kernels are not fused well. This is one reason fused attention implementations and other optimized kernels matter so much. They reduce unnecessary memory traffic and make better use of the GPU.

---

## The Other Very Real Constraint: SLURM and the 48-Hour Wall

Another very real constraint in this environment is **SLURM**, and more specifically the fact that long jobs do not get to run forever. On paper it is easy to imagine a training run continuing until convergence. In practice, the cluster has a **48-hour wall time**, which means any serious training run has to be designed to survive interruption.

That made checkpointing feel a lot less like a nice extra feature and a lot more like part of the core system design. If a run is going to be cut off at 48 hours, I need the job to save enough state that the next submission can resume cleanly instead of starting over. That means checkpointing not just model weights, but also optimizer state, scheduler state, scaler state for mixed precision, global step, epoch progress, and random seeds when possible.

Conceptually the flow becomes:

\`\`\`
train
↓
periodic checkpoint save
↓
SLURM wall time hit
↓
resubmit job
↓
load checkpoint
↓
continue from last saved step
\`\`\`

This changes the engineering mindset. Suddenly I care about checkpoint frequency, checkpoint size, save overhead, and how reliable restart logic is. Save too often and I waste time writing huge state files. Save too rarely and I risk losing hours of training when the job gets killed. On shared systems, checkpointing also has to compete with storage bandwidth, especially if multiple jobs are writing large files at the same time.

For GPT-2 Small this is relatively easy to manage, but for Mistral-7B fine-tuning it becomes more serious. In FSDP, checkpointing is trickier because the model state is sharded across ranks, so restart logic has to be much more careful.

---

## Three Mistakes That Cost Me Time

**Mistake #1: Assuming the network setup "just works"**

I submitted multi-node jobs and wondered why they were slower than single-node. That was my first lesson that distributed training only looks simple from far away. If the communication path is wrong, or if the job is not actually using the interconnect you think it is, scaling can get worse instead of better.

**Fix:** Always test communication and validate your distributed setup before assuming you are getting the bandwidth or latency you expect.

**Mistake #2: Using shared storage like it was local disk**

My first few runs trained directly from NFS. GPU utilization looked like a heart monitor: spike, stall, spike, stall. Every time the dataloader hit storage latency, the GPU sat idle.

**Fix:** Treat data placement as part of performance engineering. Repack files into sequential shards, use enough dataloader workers, and move hot data to local SSD when possible.

**Mistake #3: Treating restart logic like an afterthought**

It is easy to focus on model code and ignore operational details until the first long job dies. Once that happens, checkpointing stops feeling optional.

**Fix:** Design long runs so they can resume cleanly. Save the full training state, test restart behavior early, and assume the scheduler will eventually interrupt your job because it probably will.

---

## Why These Two Models Have Been So Useful

Right now GPT-2 Small and Mistral-7B give me two useful ends of the learning spectrum.

\`\`\`
GPT-2 Small
→ great for learning training mechanics
→ easy to profile
→ fast iteration
→ builds intuition

Mistral-7B + FSDP
→ more realistic LLM workflow
→ introduces sharding
→ makes memory pressure real
→ makes communication overhead visible
\`\`\`

Together they cover two very different system regimes. One taught me how to profile and reason about training behavior. The other forced me to think much harder about sharding, memory layout, communication, and restartability.

---

## Final Thoughts

The biggest lesson so far is that large language model training is **not just about the model**. It is about the entire system: memory layout, kernel efficiency, communication patterns, dataloader throughput, storage bandwidth, checkpoint and restart behavior, and scheduler constraints.

Working on a constrained HPC cluster makes those dynamics impossible to ignore, and honestly that is probably the best possible way to learn how large-scale AI systems actually work.`
},
]
