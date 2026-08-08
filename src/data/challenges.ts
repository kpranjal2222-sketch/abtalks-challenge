// 1. Types and Interfaces
export interface ChallengeDay {
  dayNum: number;
  title: string;
  description: string;
  phase: string;
  status: "completed" | "current" | "locked";
  techStack: string[];
  tasks: string[];
  proofUrl?: string;
  proofType?: "GitHub" | "Twitter" | "LinkedIn";
  timeSpent?: string;
}

// 2. Sample Data Creation
export const STATIC_CHALLENGES: Record<number, Partial<ChallengeDay>> = {
  1: {
    title: "Initial API Server Setup",
    description: "Kicking off the 60-day challenge! Setting up an Express.js API server with TypeScript, strict type interfaces, and routing.",
    phase: "Phase 1: Foundation",
    techStack: ["Node.js", "Express", "TypeScript"],
    tasks: [
      "Initialize project structure with tsconfig.json and package.json",
      "Setup express framework with strict router and route definitions",
      "Create a /api/health-check endpoint returning system uptime",
      "Configure automated dev execution using ts-node-dev or nodemon"
    ],
    proofUrl: "github.com/saurav-codes/ab-60/tree/day-1",
    proofType: "GitHub",
    timeSpent: "2h 15m"
  },
  2: {
    title: "Request Validation & Error Handling Middleware",
    description: "Build standard request body/query validation structures using Zod or custom schema validators, and construct global centralized exception handlers.",
    phase: "Phase 1: Foundation",
    techStack: ["TypeScript", "Zod", "Express"],
    tasks: [
      "Install and structure Zod validation schemas",
      "Build request query/body interceptor middleware",
      "Write a global central error handling middleware to sanitize stacktraces",
      "Verify mock validation responses with unit test endpoints"
    ],
    proofUrl: "github.com/saurav-codes/ab-60/tree/day-2",
    proofType: "GitHub",
    timeSpent: "1h 45m"
  },
  3: {
    title: "Dockerizing Your Local Dev Environment",
    description: "Containerize the local TypeScript server workspace and set up local network bindings for persistent development volumes.",
    phase: "Phase 1: Foundation",
    techStack: ["Docker", "Docker-Compose"],
    tasks: [
      "Create a multi-stage Dockerfile optimized for local caching",
      "Build docker-compose.yml with hot-reloading directory volumes",
      "Configure automated volume binding and clean port forwarding",
      "Verify container startup health logs successfully"
    ],
    proofUrl: "twitter.com/saurav_codes/status/day3",
    proofType: "Twitter",
    timeSpent: "3h 10m"
  },
  12: {
    title: "Database Schema & JWT Auth",
    description: "Configuring PostgreSQL database utilizing Prisma ORM. Creating strict user relationship schemas and writing route guards for secure user validation.",
    phase: "Phase 1: Habit",
    techStack: ["PostgreSQL", "Prisma", "JWT"],
    tasks: [
      "Define Prisma schema for User, Profile and Session entities",
      "Run DB migrations and seed local Docker-based database",
      "Implement JWT signing utility functions for authentication tokens",
      "Construct request authorization guards for protected endpoints"
    ],
    proofUrl: "linkedin.com/in/saurav-codes/posts/day12-prisma",
    proofType: "LinkedIn",
    timeSpent: "2h 40m"
  },
  13: {
    title: "Build & Secure JWT Authentication Router",
    description: "Create complete public and private authorization routes, secure cookies, and implement token-refresh loops to maintain persistent, bulletproof user sessions.",
    phase: "Phase 1: Habit",
    techStack: ["Express", "JWT", "BCrypt"],
    tasks: [
      "Write secure /api/auth/register using BCrypt hash salting (10 rounds)",
      "Build login controller establishing session cookies with HttpOnly flags",
      "Create route-guard middleware validating Authorization headers",
      "Verify invalid token attempts fail cleanly with standard HTTP 401 codes"
    ],
    timeSpent: "--"
  },
  24: {
    title: "Redis Query Caching Middleware",
    description: "Optimizing database queries by writing custom caching middleware using Redis. Successfully dropped response times on high-traffic API routes by 84%.",
    phase: "Phase 2: Scale",
    techStack: ["Redis", "PostgreSQL", "Prisma"],
    tasks: [
      "Setup Redis server container in local Docker orchestration",
      "Build client connector with auto-reconnection and retry limits",
      "Implement query middleware caching user feeds for up to 30 minutes",
      "Establish active query key-invalidation hooks on mutation actions"
    ]
  },
  45: {
    title: "Real-time WebSockets Sync",
    description: "Enabling smooth cursors and collaborative states in a whiteboarding app by setting up interactive multi-room WebSocket links using Socket.io.",
    phase: "Phase 2: Velocity",
    techStack: ["WebSockets", "Socket.io", "React"],
    tasks: [
      "Establish native socket listener within HTTP thread pool",
      "Implement multi-room grouping to isolate active visual sessions",
      "Optimize coordinates payload compression (sending bare integers)",
      "Integrate socket client-side state machine with rendering loop"
    ]
  },
  60: {
    title: "Production Dockerization & CI/CD",
    description: "Wrapping up the final day! Writing an optimized, multi-stage Docker build to package a full-stack node engine down to a lean 36MB production package.",
    phase: "Phase 3: Launch",
    techStack: ["Docker", "GitHub Actions", "AWS"],
    tasks: [
      "Author strict multi-stage Dockerfile stripping out all devDependencies",
      "Write GitHub Actions workflow validating linters, builds and tests",
      "Configure push-to-registry action pushing verified tags to production Docker Hub",
      "Set up target webhook for automated production pull-and-restart"
    ]
  }
};

// Generates full 60-day list procedurally, overlaying with static details
export const generateAllChallenges = (currentDay: number): ChallengeDay[] => {
  const list: ChallengeDay[] = [];
  
  // Data pools for varied generation
  const topics = [
    { name: "API Architecture", stack: ["Node.js", "Express", "TypeScript"] },
    { name: "Frontend State", stack: ["React", "Zustand", "TypeScript"] },
    { name: "Database Schema", stack: ["PostgreSQL", "Prisma", "SQL"] },
    { name: "CI/CD & DevOps", stack: ["Docker", "GitHub Actions", "AWS"] },
    { name: "UI/UX Components", stack: ["Tailwind", "Framer Motion", "CSS"] },
    { name: "Auth & Security", stack: ["JWT", "BCrypt", "Cookies"] }
  ];

  for (let d = 1; d <= 60; d++) {
    const staticData = STATIC_CHALLENGES[d];
    if (staticData) {
      // Use existing custom definition
      let status: "completed" | "current" | "locked" = "locked";
      if (d < currentDay) status = "completed";
      else if (d === currentDay) status = "current";

      list.push({
        dayNum: d,
        title: staticData.title!,
        description: staticData.description!,
        phase: staticData.phase!,
        status,
        techStack: staticData.techStack!,
        tasks: staticData.tasks!,
        proofUrl: staticData.proofUrl,
        proofType: staticData.proofType,
        timeSpent: staticData.timeSpent
      });
      continue;
    }

    // Generate varied fallback
    let status: "completed" | "current" | "locked" = "locked";
    if (d < currentDay) status = "completed";
    else if (d === currentDay) status = "current";

    let phase = "Phase 1: Foundation";
    if (d > 20 && d <= 45) phase = "Phase 2: Full-Stack Velocity";
    else if (d > 45) phase = "Phase 3: Production Polish & Demo Day";

    const topic = topics[d % topics.length];
    
    list.push({
      dayNum: d,
      title: `${topic.name} Optimization - Milestone ${d}`,
      description: `Iterate on ${topic.name.toLowerCase()} patterns. Focus on refining existing modules and improving performance benchmarks for this specific system component.`,
      phase: phase,
      status,
      techStack: topic.stack,
      tasks: [
        "Review current implementation constraints and technical debt",
        `Refactor ${topic.name.toLowerCase()} logic to optimize execution path`,
        "Write focused unit tests for the modified component",
        "Document performance gains or structural improvements"
      ]
    });
  }
  return list;
};
