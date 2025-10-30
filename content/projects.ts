export interface Project {
  id: string
  timestamp: string
  title: string
  emoji?: string
  summary: string
  details: {
    problem: string
    approach: string
    result: string
  }
  stack: string[]
  links?: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    id: "labubu-ai-shopper",
    timestamp: "2024-12-09T20:47:00Z",
    title: "LABUBU AI Shopping Bot",
    emoji: "🛍️",
    summary:
    "Built an AI-powered POPMART shopping bot that tracks restocks in real time and completes purchases in under a second.",
  details: {
    problem:
      "POP MART drops sell out in seconds, so it’s almost impossible for fans to grab new releases in time.",
      approach:
      "Developed a full-stack app with GPT-4, FastAPI, and Faiss to identify restocks and match products to user preferences in real time.",
    result:
      "Reached 95% match accuracy, sub-200 ms response time, and fully automated checkout, making it fast and effortless to catch new drops.",
  },
    stack: [ "MCP","GPT-4", "Python", "FastAPI", "React", "Firebase", "Faiss"],
    
  },
  {
    id: "triton-conv-optimization",
    timestamp: "2025-03-14T18:32:00Z",
    title: "Convolutional Layer Optimization with Triton",
    emoji: "🔬",
    summary:
      "Optimized 2D convolutional layers using custom Triton kernels to better understand and accelerate GPU performance for deep learning tasks.",
    details: {
      problem:
        "Most deep learning frameworks rely on cuDNN as a black box, making it hard to see how GPU kernels actually process convolutions or why some run faster than others.",
      approach:
        "I implemented 2D convolutions from scratch in Triton to experiment with memory hierarchy, thread mapping, and tiling strategies, comparing performance against PyTorch’s built-in convolution.",
      result:
        "Achieved up to 1.5× speedup on mid-sized feature maps and gained a deeper understanding of how memory access patterns drive GPU performance.",
    },
    stack: ["Triton", "PyTorch", "CUDA", "GPU Programming"],
    
  },
  {
    id: "gpu-matrix-inversion",
    timestamp: "2025-01-18T16:11:00Z",
    title: "High-Performance Matrix Inversion via Custom GPU Kernels",
    emoji: "🧮",
    summary:
      "Implemented Triton and OpenCL kernels to invert 5,000×5,000 matrices, cutting runtime ~50% vs a tuned CPU baseline.",
    details: {
      problem:
        "Matrix inversion is compute-heavy and memory-bound, with pivot steps that serialize work and limit throughput on large matrices.",
      approach:
        "Built block-based Gaussian elimination kernels in Triton (NVIDIA) and OpenCL (cross-vendor), using tiling, shared/local memory caching, coalesced access, and synchronization between pivot updates, with a C++/BLAS CPU baseline for comparison.",
      result:
        "Achieved ~1.5× speedup over the CPU path (≈50% runtime reduction) on 5k×5k doubles, validated correctness via A·A⁻¹ ≈ I and random-vector tests, and learned how memory layout and pivot synchronization dominate performance.",
    },
    stack: ["Triton", "OpenCL", "C++", "CUDA", "GPU Programming"],
    
   
  },
  {
    id: "parking-ticket-prevention",
    timestamp: "2025-04-12T09:42:00Z",
    title: "Parking Ticket Prevention Software",
    emoji: "🚗",
    summary:
      "Built a real-time streaming system that tracks parking enforcement vehicles and sends instant alerts to help drivers avoid tickets in San Francisco’s Inner Richmond neighborhood.",
    details: {
      problem:
        "Drivers in the Inner Richmond area of SF often received tickets due to unpredictable parking enforcement and lack of real-time alerts.",
      approach:
        "Created a data pipeline using Kafka for event streaming, Spark Streaming for real-time analytics, and AWS Lambda for instant alert dispatch, integrating location data from simulated enforcement vehicles.",
      result:
        "Enabled proactive compliance by delivering parking alerts in under five seconds, showcasing how real-time streaming and serverless systems can improve urban mobility.",
    },
    stack: ["Spark", "Kafka", "AWS Lambda", "PySpark", "AWS SNS", "Streaming Systems"],
    links: [
      { label: "Architecture Diagram", href: "#" },
      { label: "Source Code", href: "#" },
    ],
  },
  {
    id: "gpu-image-pipeline",
    timestamp: "2025-05-10T14:45:00Z",
    title: "GPU-Accelerated Image Processing Pipeline",
    emoji: "🎨",
    summary:
      "Built a GPU-based image processing pipeline that delivers up to 8× faster filtering performance than CPU implementations through CUDA optimization.",
    details: {
      problem:
        "Traditional CPU-based filters like blur and sharpen couldn’t handle high-resolution image processing efficiently, causing slow rendering and inconsistent performance.",
      approach:
        "Developed custom C++/CUDA kernels with PyTorch for preprocessing and benchmarking, focusing on thread-block tuning, shared memory caching, and memory coalescing for faster pixel operations.",
      result:
        "Achieved an 8× speedup over CPU implementations while maintaining pixel-level accuracy, validating GPU results against CPU references and optimizing kernel launch parameters for stability across image sizes.",
    },
    stack: ["CUDA", "PyTorch", "C++", "GPU Programming"],
    
  },
  {
    id: "esports-moderation-system",
    timestamp: "2025-02-19T10:37:00Z",
    title: "University Esports Discord Chat Moderation System",
    emoji: "🧠",
    summary:
      "Developed a serverless AI moderation system for esports Discord servers using AWS Bedrock and Lambda, processing 8k+ messages per minute with 96% accuracy and sub-100ms latency.",
    details: {
      problem:
        "Manual moderation in large Discord communities was slow and inconsistent, making it hard to detect toxic or inappropriate messages at scale.",
      approach:
        "Built an AI-powered moderation pipeline where Discord messages were streamed to AWS Lambda, classified in real time using Bedrock and fine-tuned SageMaker models, and logged in DynamoDB for transparency and analytics.",
      result:
        "Deployed across my university's 7 esports servers, maintaining 96% classification accuracy and under 100ms response time while processing over 8,000 messages per minute.",
    },
    stack: ["AWS Bedrock", "AWS Lambda", "AWS SageMaker", "AWS DynamoDB", "Python", "AWS SQS"],
    
  }
]
