Most posts about training LLMs assume you’re sitting on a dream setup. My situation is different, with an smaller/older onPrem HPC cluster, which isstill pretty powerful, but has the following considerations: mixed hardware and shared queues. But weirdly, these constraints are what makes running jobs even more interesting, mainly because you can’t brute force anything. I really wanted to see how LLMs behave under resource pressures.

## Outline

1) Hardware overview: the compute and infrastructure environment that I am working with
2) Baseline experiments using GPT-2 Small
3) Observations about training system behavior and bottlenecks
4) The role of storage bandwidth and data pipelines
5) Scaling experiments with Mistral-7B using FSDP
6) Operational constraints: scheduling, resource limits, and SLURM

---

## What the Hardware Reality Actually Looks Like

In theory there are more GPUs across the cluster, but the hardware I usually work with looks more like this:

```
1 node  → 2 allocated GPUs
2 nodes → 4 allocated GPUs (if multi-node access is available)
```

**GPU Node Specification (Dell PowerEdge R740)**
```
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
```

That constraint shaped how I approached learning LLM systems. Instead of immediately trying to run the biggest model possible, I started with something small enough that I could actually experiment, profile, and iterate.

---

## Why I Started With GPT-2 Small

The first model I trained from scratch was:

```
GPT-2 Small
124M parameters
1–2 V100 GPUs
```
---

## What GPT-2 Small Actually Taught Me

One of the first things GPT-2 Small taught me is that **on my setup, the model itself was rarely the bottleneck**.

**What my profiler showed me on the first naive run:**

```
GPU Utilization: 37% (spiking between 15-80%)
Memory Utilization: 42%
Tokens/second: 1,200
Step time: 2.3 seconds
Estimated time to completion: 14 hours
```

GPUs don’t reach high utilization by default. If the input pipeline, CPU preprocessing, or batching is off, the GPU just waits. A lot of “inefficiency” is really GPU starvation. That shifted my focus from just loss curves to system metrics: achieved TFLOPs vs peak, SM occupancy, memory bandwidth, and tokens/sec. Attention makes this tradeoff clear: its quadratic scaling can push workloads between compute-bound and memory-bound. Even with high theoretical FLOPs, the GPU can still bottleneck on memory movement.

A simple conceptual breakdown that helped me reason about the training loop looked like this:

```
Forward pass
↓
Backward pass
↓
Gradient synchronization
↓
Optimizer step
```

Even though that loop looks simple, there are a lot of places where performance can disappear.

---

## Why the Storage System Started Mattering So Much While Training

One thing that became obvious once I moved to larger datasets was that **the storage system matters a lot more than I expected**. The WAVE cluster stores most datasets on shared NFS storage, which is great for capacity but not ideal for workloads that perform lots of small random file reads.

Early versions of my training runs used datasets stored as thousands of individual files, and what I noticed was that GPU utilization would randomly dip even though the model itself wasn't doing anything unusual. The dataloader was waiting on NFS. Each tiny file access meant another network round trip, which added latency to the input pipeline. When the GPU finishes its current batch but the next batch has not arrived yet, the device just sits idle.

**The problem I was seeing:**
```
Step 47: GPU util 78%, step time 1.8s
Step 48: GPU util 12%, step time 4.2s <- what's going on here???
Step 49: GPU util 81%, step time 1.7s
```

The fix that many large-scale training pipelines use is repacking datasets into **large sequential shards**. Instead of storing millions of tiny files, the dataset gets packed into larger archive containers:

```
dataset/
  shard-0000.tar
  shard-0001.tar
  shard-0002.tar
```

This turns the workload from many small random I/O operations into large sequential reads, which storage systems handle much more efficiently. The dataloader can stream data from these shards instead of constantly opening and closing files across the network. Once I started thinking about dataset layout as part of the performance problem, it became much easier to understand why input pipelines sometimes limit tokens/sec even when the GPU still has compute headroom.

After repacking my dataset into sequential shards and setting a better number of dataloader workers, here is what the optimized GPT-2 Small run looked like:

```
GPU Utilization: 82% (stable between 78-85%)
Memory Utilization: 45%
Tokens/second: 3,840
Step time: 0.9 seconds
Estimated time to completion: 4.5 hours
```

---

## Moving From GPT-2 Small to Mistral-7B

After getting comfortable with GPT-2 Small, I wanted to experiment with something closer to a modern open LLM workflow, which led me to **Mistral-7B**. I am not and cannot train a 7B parameter model from scratch on this cluster. **Fine-tuning** it is actually feasible with the right memory-saving techniques.

**Math For Mistral-7B at FP16:**

```
Model parameters:     7B × 2 bytes = 14 GB
Gradients:            7B × 2 bytes = 14 GB
Optimizer states:     Adam states are much larger and quickly dominate memory
Activations:          Additional per-GPU memory depending on batch size and sequence length

Total without optimization: well beyond a single 32 GB V100
```

Instead of every GPU storing the full training state, I used **FSDP** to shard model parameters, gradients, and optimizer state across GPUs. But activations still remain local to each GPU, so memory does not scale down perfectly.

A more accurate mental model is:

```
Without sharding
→ full parameters on every GPU
→ full gradients on every GPU
→ full optimizer states on every GPU
→ memory becomes the wall :/

With FSDP
→ parameters are sharded
→ gradients are sharded
→ optimizer states are sharded
→ activations still stay local
```

Then you layer on additional techniques:

```
FSDP
+ mixed precision
+ CPU offload
+ activation checkpointing
+ gradient accumulation
```

That combination is what makes fine-tuning a model like Mistral-7B feel realistic to iterate on smaller hardware. 

---

## What Becomes the Bottleneck After Memory

Once memory pressure is reduced, the next bottleneck often becomes **communication**. In PyTorch distributed training, that usually means NCCL collectives like all-reduce, all-gather, reduce-scatter, and broadcast. With FSDP, parameter shards often need to be gathered and redistributed during forward and backward passes. That means part of each training step can end up dominated by communication instead of compute.

On smaller setups like mine, usually two V100s, the issue is often not just raw bandwidth. It is also latency and synchronization stalls. If gradient buckets are too small, NCCL ends up launching many small collectives, which creates inefficient communication patterns. In those cases, GPUs finish their backward pass and then sit idle waiting for synchronization to finish.

Conceptually the tradeoff looks like this:

```
Without sharding → memory becomes the main wall
With sharding → memory pressure drops → communication overhead becomes much more visible
```

One of the important ideas here is **overlap**. In a better setup, communication overlaps with computation so gradient synchronization is happening while other layers are still doing useful work. In a worse setup, communication becomes a hard stop where the GPUs just wait.

Another thing that became interesting while profiling was spotting cases where the workload launched too many small kernels. Transformer workloads can easily spend time on launch overhead and memory movement if kernels are not fused well. This is one reason fused attention implementations and other optimized kernels matter so much...expect a future post digging deeper on this. They reduce unnecessary memory traffic and make better use of the GPU.

---

## The Other Very Real Constraint: SLURM and the 48-Hour Wall

Another very real constraint in this environment is the **SLURM** wall, and more specifically the fact that long jobs do not get to run forever. On paper it is easy to imagine a training run continuing until convergence. In practice, the cluster has a **48-hour wall time**, which means any serious training run has to be designed to survive interruption.

That made checkpointing feel a lot less like a nice extra feature and a lot more like part of the core system design. If a run is going to be cut off at 48 hours, I need the job to save enough state that the next submission can resume cleanly instead of starting over. That means checkpointing not just model weights, but also optimizer state, scheduler state, scaler state for mixed precision, global step, epoch progress, and random seeds when possible.

Conceptually the flow becomes:

```
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
```

Suddenly, I have t care about checkpoint frequency, checkpoint size, save overhead, and how reliable restart logic is. Save too often and I waste time writing huge state files. Save too rarely and I risk losing hours of training when the job gets killed. On shared systems, checkpointing also has to compete with storage bandwidth, especially if multiple jobs are writing large files at the same time.

For GPT-2 Small this is relatively easy to manage, but for Mistral-7B fine-tuning it becomes more serious. In FSDP, checkpointing is trickier because the model state is sharded across ranks, so restart logic has to be much more careful.

---

## Mistakes That Cost Me Time

**Mistake #1: Using shared storage like it was local disk**

My first few runs trained directly from NFS. GPU utilization looked like a heart monitor: spike, stall, spike, stall. Every time the dataloader hit storage latency, the GPU sat idle.

**Fix:** Treat data placement as part of performance engineering. Repack files into sequential shards, use enough dataloader workers, and move hot data to local SSD when possible.

**Mistake #2: Treating restart logic like an afterthought**

It is easy to focus on model code and ignore operational details until the first long job dies. Once that happens, checkpointing stops feeling optional.

**Fix:** Design long runs so they can resume cleanly. Save the full training state, test restart behavior early (like 90-96% of the run), and assume the scheduler will eventually interrupt your job because it probably will.

---

## Why These Two Models Have Been So Useful

Right now GPT-2 Small and Mistral-7B give me two useful ends of the learning spectrum.
The former taught me how to profile and reason about training behavior. The other forced me to think much harder about sharding, memory layout, communication, and restartability.

---

## Final Thoughts

Working on a constrained HPC cluster makes every single dynamic hard to ignore, and imo that is probably the best possible way to learn how large-scale AI systems actually work.
