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
      { label: "Goal", value: "Break into HPC & Performance Engineering" },
      { label: "Focus", value: "GPU optimization & distributed systems" },
      { label: "Vision", value: "Design faster AI infrastructure" },
    ],
    summary:
      "An introduction to my journey into performance engineering: why I’m obsessed with making systems faster, more efficient, and built to scale.",
    content: `# Why Performance Engineering?

I’m interested in how things run, not just how they work.  
Lately, I’ve been diving into **High-Performance Computing (HPC)** and **performance engineering**, studying how small architectural choices ripple across large-scale systems.

It started with simple curiosity where I wanted to understand why some models train faster than others, or why GPU utilization never quite hits 100%. That led me to learn **CUDA**, experiment with **Triton**, and look deeper into how frameworks like **PyTorch** translate high-level code into GPU kernels.

What keeps me hooked is how software and hardware meet. Every cache hit, memory copy, and thread scheduling decision changes performance in ways that are both measurable and fascinating. Optimizing for that intersection feels like solving a puzzle: part logic, part intuition.

Outside of code, I care about mentorship and representation in engineering. I’ve been involved with **ACM-W** and enjoy helping others build confidence in technical spaces.

This blog is a record of what I’m learning: from experiments in GPU optimization to lessons in scalability, profiling, and system design.

---

## Topics I’ll Cover

- Custom **CUDA** & **Triton** kernels  
- GPU memory hierarchy and caching  
- Parallelism with **OpenMP** & **MPI**  
- Benchmarking and profiling methods  
- Scalable AI and HPC infrastructure  
`,
  },
  {
    jobId: 4036,
    name: "Benchmarking_Insights",
    slug: "performance-benchmarking",
    status: "RUNNING",
    runtime: "06h 42m",
    stack: ["Python", "C++", "Profilers", "Nsight", "Perf Tools"],
    benchmarks: [
      { label: "CPU-GPU Sync Overhead", value: "-25%" },
      { label: "Execution Consistency", value: "+18%" },
      { label: "Profiling Coverage", value: "100%" },
    ],
    summary:
      "A breakdown of how performance benchmarking works in software: from defining metrics to learning what the numbers really mean.",
    content: `# Building a System for Performance Benchmarking (WIP)

This post is still under construction! I’m using it to outline how I approach **performance benchmarking** and how I plan to build a repeatable feedback loop for improving system speed over time.

---

## Outline of the process

- Step 1: Define “Performance” (Before You Touch Anything)
- Step 2: Establish a Baseline
- Step 3: Profile, Don’t Assume
- Step 4: Build the Feedback Loop
- Step 5: Interpret the Data
- Step 6: Share, Automate, and Iterate

---

## What’s Next

I’m still breaking this process down, you can expect each step here to be its own deep dive.  
Eventually, this will evolve into a reusable framework for profiling and benchmarking GPU-heavy workloads across different hardware.`,
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

I’m planning to dive into **[GPU Puzzles by Sasha Rush](https://github.com/srush/GPU-Puzzles)** an interactive notebook that teaches GPU programming by having you write your own CUDA-style kernels using **Numba**. It’s designed to strip away abstractions and show how parallelism, threads, and memory hierarchy actually work on the hardware level.

This will be one of my upcoming posts where I’ll document what I learn while solving each puzzle from understanding how threads cooperate within blocks, to optimizing shared vs global memory, to managing synchronization and avoiding race conditions. The goal is to build real intuition for how GPUs execute deep learning workloads, not just from a framework perspective but from the raw kernel level.

Once completed, I’ll share detailed notes, performance experiments, and visual breakdowns of how kernel design choices affect runtime and efficiency. For now, this page is a placeholder for that journey: a future write-up on learning to think like a GPU.
`,
  }
,  
]
