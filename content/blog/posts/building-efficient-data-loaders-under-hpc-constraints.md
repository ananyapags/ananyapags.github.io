In past projects, my performance issues in the last 10-20% of GPU util almost always came down to **data loading and I/O**. 

---

So I'm working on a **dynamic data pipeline** for ML workloads on a shared HPC system.Inspired by [Nexa_Vortex](https://github.com/DarkStarStrix/Nexa_Vortex), I’m adding a simple **feedback loop** that adjusts things like workers, batching, and prefetching based on system signals to reduce GPU idle time.  

---

### Workload Plan
Run PyTorch training jobs on SLURM.

---

### Models + Datasets

- **Image task**
  - Model: ResNet-18  
  - Dataset: CIFAR-10  
  - Focus: image loading + CPU preprocessing  

---
- **Text task**
  - Model: Small GPT (4–6 layers) 
  - Dataset: WikiText-2  
  - Focus: tokenization + batching  

---

### Experiments

On **1 GPU**:

- vary `num_workers`, batch size, prefetch  
- test:
  - CPU bottlenecks  
  - I/O bottlenecks  
  - memory pressure  

Control logic:

- increase workers if GPU is idle  
- decrease if CPU/memory is too high  

---

### Scaling to 2 GPUs

- use DDP with 2 GPUs  
- compare:
  - single vs multi-GPU  
- check:
  - how does pipline behavior change?
  - can the pipeline keep up with higher demand? 

---

### What I’ll Measure

- GPU utilization  
- step time / throughput  
- CPU usage  
- data loading vs compute time  

---
Tools:

- `nvidia-smi`  
- PyTorch logging  
- system monitors  

---

### Goal

- reduce GPU idle time  
- understand where bottlenecks come from  
- compare image vs text pipelines  
- see how things change when scaling up GPUs  
- build a simple pipeline that adapts better than fixed settings  

---
