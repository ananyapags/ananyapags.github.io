## Background

Coming into this, I was very much a high-level programmer without much systems-level thinking.The last time I really thought about memory or low-level behavior was back in my first-year C++ classes. When I started with CUDA, I found myself copying patterns form the holy text: [*Programming Massively Parallel Processors*](https://www.elsevier.com/books/programming-massively-parallel-processors/kirk/978-0-12-811986-0) without fully understanding why they worked or what tradeoffs they involved. This is my attempt to explain those concepts in a simple, teachable way: how I’d explain the logic to even my youngest students.

---

| Term used | Meaning |
| --- | --- |
| **worker** | thread |
| **team** | block |
| **whiteboard** | fast memory |

---

| Puzzle | Conceptual intuition |
| --- | --- |
| **Puzzle 1 – Map** | Think of this like giving every number in a list its own tiny worker. Instead of one loop doing all the work, each worker just handles one number and adds 10. **The big idea:** everyone works at the same time, but each person only focuses on their own spot. |
| **Puzzle 2 – Zip** | Now each worker looks at two lists instead of one and combines them. It’s like pairing things up where each worker grabs one value from each list and adds them. **The idea:** each worker can pull from multiple places, not just one. |
| **Puzzle 3 – Guards** | Sometimes you accidentally hire more workers than you need. So you tell them: “only work if your number actually exists.” **The idea:** always check your boundaries. |
| **Puzzle 4 – Map 2D** | Instead of a line of numbers, now you have a grid (like a spreadsheet). Each worker is responsible for one cell in that grid. **The idea:** same logic as before, just in two directions instead of one. |
| **Puzzle 5 – Broadcast** | Here, one list is stretched across another. Imagine adding a row to every row in a table. Each worker figures out which values to combine even if the shapes don’t match perfectly. **The idea:** sometimes data is reused across many positions. |
| **Puzzle 6 – Blocks** | Now we admit: one group of workers isn’t enough. So we split them into teams (blocks), and each team handles part of the work. **The idea:** break big problems into smaller chunks and assign them to groups. |
| **Puzzle 7 – Blocks 2D** | Same idea, but now teams are arranged in a grid too. So you have groups working across rows and columns. **The idea:** organize work both horizontally and vertically. |
| **Puzzle 8 – Shared Memory** | Workers in the same team can share a whiteboard (fast memory). Instead of each person going far away to get data, they write it once and everyone nearby uses it. **The idea:** sharing locally is faster than everyone doing their own thing. |
| **Puzzle 9 – Pooling** | Now workers need to look at their neighbors to do their job (like summing nearby values). So they share data and wait for each other before continuing. **The idea:** sometimes work depends on nearby results, not just your own. |
| **Puzzle 10 – Dot Product** | Everyone does a small piece of work, and then all the results get combined into one final answer. It’s like everyone calculating part of a total score, then adding them up. **The idea:** parallel work often ends with combining results. |
| **Puzzle 11 – Convolution** | Each worker looks at a small window of values and computes something from it. It’s like sliding a filter across data. **The idea:** focus on local patterns instead of the whole dataset at once. |
| **Puzzle 12 – Prefix Sum** | Instead of adding everything at once, workers combine values step by step in a structured way. It’s like building a total gradually by pairing things up. **The idea:** some problems need coordination over multiple steps. |
| **Puzzle 13 – Axis Sum** | Now you’re doing sums across one direction (like summing each row in a table). Different teams handle different rows at the same time. **The idea:** you can split work across dimensions. |
| **Puzzle 14 – Matrix Multiply** | This is everything combined. Workers reuse data, collaborate in teams, and carefully organize who computes what. Instead of doing random work, it’s very structured and efficient. **The idea:** performance comes from smart organization, not just doing more work. |

---

## What This Changed For Me

After this, I stopped guessing when it came to performance. Before, if my model was slow, I’d think “maybe batch size” or “maybe the GPU isn’t being used well.” Now I immediately saw what’s actually happening under the hood: are threads idle, is memory access inefficient, am I launching too many small kernels, is this memory-bound?

This simplistic way of thinking maps across almost everything in ML systems, from NCCL communication (reductions), Triton/CUDA kernels, and even LLM inference where you’re constantly batching, tiling, and managing memory. It’s the same mental model, just at different scales/applications.

---

## Final Note

To make this more concrete, I connected each puzzle to a PyTorch equivalent, so you (mainly more for me) can see how each concept could show up in real code.
I’ve laid it out side by side for easy reference.

---

| Puzzle | PyTorch Mapping | Conceptual Intuition  |
| --- | --- | --- |
| **Puzzle 1 – Map** | This is the basic idea behind elementwise ops in PyTorch, like `x + 10`, `relu(x)`, `sigmoid(x)`, or `x * 2`. Each GPU thread handles one element, so conceptually it is just “one thread per value.” This matters because a huge amount of deep learning is really just lots of elementwise transforms happening over giant tensors. | Think of this like giving every number in a list its own tiny worker. Instead of one loop doing all the work, each worker just handles one number and adds 10. The big idea is: everyone works at the same time, but each person only focuses on their own spot. |
| **Puzzle 2 – Zip** | This maps to elementwise ops with two inputs, like `a + b`, `a * b`, or comparing two tensors. In PyTorch, a lot of layers and loss functions eventually boil down to this pattern. The GPU is basically pairing up matching positions and having each thread do a tiny math operation. | Now each worker looks at two lists instead of one and combines them. It’s like pairing things up: each worker grabs one value from each list and adds them. The idea is: each worker can pull from multiple places, not just one. |
| **Puzzle 3 – Guards** | This shows up anytime tensor sizes do not perfectly match the thread launch shape. Real kernels often launch a little extra work and then guard the edges with `if i < n`. In PyTorch, this is normal for almost every custom kernel because hardware likes regular launch sizes, but tensors are messy. | Sometimes you accidentally hire more workers than you need. So you tell them: “only work if your number actually exists.” This is just making sure no one tries to access something that isn’t there. The idea is: always check your boundaries. |
| **Puzzle 4 – Map 2D** | This maps to operations over matrices or images, where data is not just a flat list anymore. Think of applying an operation across a 2D tensor, image pixels, or attention score tables. It teaches you to think in rows and columns instead of just one long vector. | Instead of a line of numbers, now you have a grid (like a spreadsheet). Each worker is responsible for one cell in that grid. The idea is: same logic as before, just in two directions instead of one. |
| **Puzzle 5 – Broadcast** | This is directly PyTorch broadcasting, like adding a bias vector to every row of a matrix, or combining tensors of shape `[B, 1]` and `[1, D]`. This happens constantly in neural nets. Bias addition, normalization terms, masking, and lots of batch operations all use this idea. | Here, one list is stretched across another. Imagine adding a row to every row in a table. Each worker figures out which values to combine even if the shapes don’t match perfectly. The idea is: sometimes data is reused across many positions. |
| **Puzzle 6 – Blocks** | This maps to almost every real GPU kernel in PyTorch because tensors are usually much bigger than one block of threads. So the work gets split into chunks across many blocks. This is the first step toward understanding how big tensor ops scale on GPU. | Now we admit: one group of workers isn’t enough. So we split them into teams (blocks), and each team handles part of the work. The idea is: break big problems into smaller chunks and assign them to groups. |
| **Puzzle 7 – Blocks 2D** | This is how many image, matrix, and attention-related kernels are structured. Matrix-style data is usually divided into tiles across rows and columns. In PyTorch, this connects to 2D tensor ops, matrix multiply layouts, and convolution-style indexing. | Same idea, but now teams are arranged in a grid too. So you have groups working across rows and columns. The idea is: organize work both horizontally and vertically. |
| **Puzzle 8 – Shared Memory** | This maps to optimized kernels that reuse nearby data instead of rereading it from global memory. In PyTorch land, this is part of why fused kernels, tiled kernels, and custom Triton/CUDA code can be so much faster than naive implementations. Shared memory is one of the main tools for reducing wasted memory traffic. | Workers in the same team can share a whiteboard (fast memory). Instead of each person going far away to get data, they write it once and everyone nearby uses it. The idea is: sharing locally is faster than everyone doing their own thing. |
| **Puzzle 9 – Pooling** | This maps to moving-window ops like pooling layers, local smoothing, and stencil-like computations. MaxPool and AvgPool are the obvious deep learning examples. The important thing is that one output depends on nearby inputs, not just one element. | Now workers need to look at their neighbors to do their job (like summing nearby values). So they share data and wait for each other before continuing. The idea is: sometimes work depends on nearby results, not just your own. |
| **Puzzle 10 – Dot Product** | This maps to reductions, which are everywhere in PyTorch: `sum`, `mean`, norms, similarity scores, and parts of matrix multiply. A dot product is like the baby version of many larger GPU reductions. It teaches the “many threads produce one result” pattern. | Everyone does a small piece of work, and then all the results get combined into one final answer. It’s like everyone calculating part of a total score, then adding them up. The idea is: parallel work often ends with combining results. |
| **Puzzle 11 – 1D Convolution** | This directly maps to convolution layers in deep learning, just in a simpler 1D form. CNNs, signal processing, and sequence filters all use this idea. Even though PyTorch uses heavily optimized libraries underneath, the conceptual structure is the same: slide a filter over data and compute a local weighted sum. | Each worker looks at a small window of values and computes something from it. It’s like sliding a filter across data. The idea is: focus on local patterns instead of the whole dataset at once. |
| **Puzzle 12 – Prefix Sum** | This is not the most famous PyTorch op for beginners, but it is a core parallel pattern used under the hood in many systems tasks. Things like indexing, compaction, sorting-related steps, masking workflows, and some sparse operations depend on scan or prefix-sum logic. It is more of a systems primitive than a flashy model layer. | Instead of adding everything at once, workers combine values step by step in a structured way. It’s like building a total gradually by pairing things up. The idea is: some problems need coordination over multiple steps. |
| **Puzzle 13 – Axis Sum** | This maps directly to reductions along a dimension, like `x.sum(dim=1)` or `x.mean(dim=-1)`. In PyTorch, this shows up in loss calculations, normalization, statistics, and aggregating across batches, channels, or sequence length. | Now you’re doing sums across one direction (like summing each row in a table). Different teams handle different rows at the same time. The idea is: you can split work across dimensions. |
| **Puzzle 14 – Matrix Multiply** | This is the big one. It maps to `torch.matmul`, linear layers, attention score computation, projections in transformers, and basically the heart of modern deep learning. If you understand why matrix multiply uses tiling and shared memory, you are starting to understand why GPU optimization matters so much for LLMs. | This is everything combined. Workers reuse data, collaborate in teams, and carefully organize who computes what. Instead of doing random work, it’s very structured and efficient. The idea is: performance comes from smart organization, not just doing more work. |
