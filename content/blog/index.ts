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
      { label: "Profiling Coverage", value: "100%" },
    ],
    summary:
      "A structured breakdown of how I benchmark performance in practice: define the metric, establish a clean baseline, inspect utilization and data flow, and use profiler evidence to reason about bottlenecks instead of guessing.",
  },
  {
    jobId: 4037,
    name: "Conceptual_Walkthrough_of_GPU_Puzzles",
    slug: "coding-gpu-kernels-sasha-rush-puzzles",
    status: "COMPLETED",
    runtime: "12h 00m",
    stack: ["CUDA", "Numba", "Python", "GPU Programming", "Parallel Computing"],
    benchmarks: [
      { label: "GPU Puzzles Completed", value: "12/12" },
      { label: "Speedup vs CPU", value: "30×" },
      { label: "Key Insight", value: "Parallelism through Threads & Memory" },
    ],
    summary:
      "Comprehended GPU programming logic by completing [Sasha Rush's GPU Puzzles](https://github.com/srush/GPU-Puzzles), building custom kernels in Numba to understand how deep learning runs on hardware.",
  },
  {
    jobId: 4038,
    name: "Making_Models_Actually_Robust",
    slug: "robust-training-under-constraints",
    status: "COMPLETED",
    runtime: "80h 00m",
    stack: ["PyTorch", "DDP", "NCCL","SLURM", "HPC"],
    benchmarks: [
      { label: "Speedup", value: "3 weeks → 5 days (DDP + optimization)" },
      { label: "Robustness", value: "83.3% worst-group accuracy" },
      { label: "Insight", value: "Data pipeline > compute bottlenecks" },
    ],
    summary:
      "Improving robustness with last-layer retraining while speeding up iteration under tight training time constraints.",
  },
  {
    jobId: 4039,
    name: "LLM_Training_Journey",
    slug: "training-llms-under-hardware-constraints",
    status: "COMPLETED",
    runtime: "14h 15m",
    stack: ["HPC", "SLURM", "CUDA", "PyTorch", "FSDP", "Distributed Training"],
    benchmarks: [
      { label: "Scratch Training Target", value: "GPT-2 Small (124M)" },
      { label: "Fine-Tuning Target", value: "Mistral-7B with FSDP" },
      { label: "Primary Hardware", value: "2× V100 32GB" },
    ],
    summary:
      "Documenting my experience learning large language model training on constrained HPC infrastructure.",
  },
  {
    jobId: 4040,
    name: "Dynamic_Data_Pipeline",
    slug: "building-efficient-data-loaders-under-hpc-constraints",
    status: "RUNNING",
    runtime: "02h 40m",
    stack: ["HPC", "SLURM", "PyTorch", "Python", "Rust", "PCie", "VDURA"],
    benchmarks: [
      { label: "Project Focus", value: "Adaptive data pipeline for shared HPC environments" },
      { label: "Primary Goal", value: "Efficient input pipelines under CPU, memory, and I/O constraints" },
      { label: "Target Environment", value: "University HPC allocation with shared storage and scheduled jobs" }
    ],
    summary: "WIP: This project builds a dynamic data pipeline that adapts to system constraints, optimizing I/O, memory, and concurrency to reduce input bottlenecks on shared HPC systems."
  },
  {
    jobId: 4041,
    name: "Cache_Scope",
    slug: "kv-telemetry-and-reuse-diagnostics-for-llm-serving",
    status: "RUNNING",
    runtime: "02h 40m",
    stack: ["vLLM", "LMCache", "Python", "Prometheus", "LLM Serving", "Observability"],
    benchmarks: [
      { label: "Project Focus", value: "Instance-level KV cache telemetry and reuse diagnostics" },
      { label: "Primary Goal", value: "Infer when reuse helps, recomputation dominates, or offloading is worth it" },
      { label: "Target Environment", value: "H100 LLM serving instance with vLLM + LMCache" },
    ],
    summary:
      "WIP: Building an observability layer for LLM serving that translates KV-cache telemetry into instance-specific recommendations on reuse, recomputation, and offloading.",
  },
  {
    jobId: 4042,
    name: "Scalable_Cloud_Training_Insights",
    slug: "understanding-scalable-training-in-the-cloud",
    status: "QUEUED",
    runtime: "00h 00m",
    stack: [
      "AWS",
      "EC2",
      "S3",
      "EFA",
      "Docker",
      "K8s"
    ],
    benchmarks: [
      { label: "Project Focus", value: "Understanding end-to-end cloud training pipelines" },
      { label: "Primary Goal", value: "Identify bottlenecks across storage, compute, orchestration, and networking" },
      { label: "Target Environment", value: "Cloud-based GPU training using EC2, S3, Docker, and Kubernetes" }
    ],
    summary: "TTD:Visual notes on how ML training behaves when shifting from on-prem to cloud, with a focus on identifying new bottlenecks in data, compute, and communication."
  },
  {
    jobId: 4043,
    name: "Batch_Size_in_Systolic_Arrays",
    slug: "batch-size-throughput-tradeoffs-tpu-style-accelerators",
    status: "QUEUED",
    runtime: "00h 00m",
    stack: [
      "uSystolic-Sim",
      "Systolic Arrays",
      "GEMM",
      "TPU Architecture",
      "Performance Modeling"
    ],
    benchmarks: [
      { label: "Project Focus", value: "Analyzing how batch size impacts throughput, utilization, and memory behavior in systolic-array accelerators" },
      { label: "Primary Goal", value: "Understand tradeoffs between small vs large batch execution on TPU-style architectures" },
      { label: "Target Insight", value: "Identify when increasing batch size improves utilization vs when it introduces memory or latency constraints" }
    ],
    summary: "Exploring how batch size drives throughput, utilization, and memory tradeoffs in systolic-array accelerators, revealing when larger batches help—and when they hurt."
  }
]

export function getBlogPostMeta(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
