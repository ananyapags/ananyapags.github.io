# Why Performance Engineering?
  
  I’m a huge fan of optimization in everyday life, even outside of engineering.
  
  For example, when I’m shopping  (whether it’s clothes, accessories, home decor, or something practical like trail running shoes)  my brain naturally turns the whole thing into a small optimization problem. If I’m looking for a new pair of trail runners, I’m not just asking “do these look good?” I’m thinking about a whole set of tradeoffs: how comfortable they are, how durable they’ll be, whether they work for the terrain I run on, how they fit with the rest of my gear, and of course whether they actually fit my budget.
  
  ---

  Somewhere in my head there’s a little multi-variable equation running:
  
  ```
  style + comfort + durability + price + practicality
  → best overall choice
  ```

  ---
  
  I used to think performance in ML was mostly about the model, but I started noticing tradeoffs across the system, where things looked efficient on paper but broke down in practice due to hardware, communication, or memory behavior. It shifted from just running code to solving an optimization problem across the entire stack.
  
  ---

  Instead of a fashion or shopping problem, the variables looked something like this:
  
  ```
  compute throughput
  + memory bandwidth
  + data pipeline speed
  + communication overhead
  + scheduling constraints
  → overall system performance
  ```
  
  That realization pulled me toward **performance engineering** and **high-performance computing (HPC)**.
  
  ---

  To make sense of all this, I started breaking systems into layers (not because they’re perfectly separated) but because it helps me reason about where problems come from. What I’ve learned is that no layer exists in isolation. A decision in one part of the system almost always affects another.

  Conceptually the layers look something like this:
  
  ```
 Model → shapes compute, memory footprint, and communication patterns
↓
Framework → PyTorch, JAX, TensorFlow (defines execution + abstractions)
↓
Runtime & Kernels → CUDA, Triton, NCCL, BLAS (actual execution + communication)
↓
Scheduling → job placement, resource allocation (Slurm, Kubernetes)
↓
Hardware Architecture → GPU execution (SMs, warps, memory hierarchy)
↓
Hardware → GPUs, CPUs, interconnects (PCIe, NVLink), cluster topology
↓
Networking → data movement across nodes (InfiniBand, RDMA, GPUDirect)
↓
Storage → data access layers (NVMe, parallel FS, object storage)
↓
Experimentation → logging, tracking, reproducibility (W&B, metrics, eval)
  ```

  ---

  This work clicked for me because I’ve always been more interested in how systems behave end-to-end and how different pieces interact, rather than optimizing things in isolation. Performance engineering feels less like coding and more like investigation: measuring, diagnosing, and iterating to understand what’s actually happening under the hood. 
  
  --- 

  The goal NOT to be an expert in every layer, BUT to build enough intuition across the stack (or a sub-stack) to identify bottlenecks and improve how systems run.

  ---
  
  This blog is mostly a record of what I’m learning as I explore this space. Some posts will be deep dives into technical topics, others will document experiments where I try to understand why a system behaves the way it does.
  
