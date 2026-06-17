// Case Study content for the top 2 projects (Step 23 / Feature 5).
// Each case study follows the 12-section structure:
// 1. Problem Statement, 2. Business Need, 3. System Design, 4. Database Design,
// 5. Technology Selection, 6. Development Process, 7. Challenges Faced,
// 8. Solutions Implemented, 9. Performance Optimizations, 10. Results & Outcomes,
// 11. Screenshots Gallery (reuses project.screenshots), 12. Future Improvements

export interface CaseStudySection {
  problemStatement: string
  businessNeed: string
  technologySelection: { tech: string; why: string }[]
  developmentTimeline: { phase: string; tasks: string[] }[]
  challengesAndSolutions: { challenge: string; solution: string }[]
  performanceOptimizations: string[]
  resultsAndOutcomes: string[]
  futureImprovements: string[]
}

export const CASE_STUDIES: Record<number, CaseStudySection> = {
  // ─── Project 1: SmartPark — Enterprise Smart Parking SaaS ───────────────────────
  1: {
    problemStatement:
      "Traditional parking facilities lack real-time visibility, leading to inefficient space utilization, " +
      "driver frustration, and lost revenue opportunities. Operators cannot dynamically adjust pricing based " +
      "on demand, and existing systems often rely on legacy monolithic architectures that are difficult to scale " +
      "or integrate with modern web and mobile frontends.",
    businessNeed:
      "A modern, full-stack SaaS platform that provides real-time occupancy synchronization, dynamic rule-based " +
      "surge pricing, and a highly responsive operator dashboard. The system must handle high-throughput updates " +
      "efficiently while providing a frictionless, contactless booking experience for drivers across devices.",
    technologySelection: [
      { tech: 'Java 17 + Spring Boot 3.2', why: 'Provides a robust, enterprise-grade backend foundation with built-in support for Event-Driven Architecture (EDA) and WebSockets.' },
      { tech: 'React 18 + Tailwind + Framer Motion', why: 'Enables a highly responsive, modern glassmorphism UI with smooth transitions and predictable state management via Redux Toolkit.' },
      { tech: 'WebSockets (STOMP)', why: 'Essential for real-time synchronization of parking slot occupancy across all connected client dashboards without expensive HTTP polling.' },
      { tech: 'Spring Application Events', why: 'Decouples core business logic from cross-cutting concerns (notifications, auditing, analytics), allowing async processing and improving API throughput.' },
      { tech: 'JWT + Spring Security', why: 'Provides stateless, secure authentication with refresh token rotation, suitable for distributed cloud deployments.' },
    ],
    developmentTimeline: [
      { phase: 'Phase 1 — Architecture & Core API', tasks: ['Designed the Event-Driven Architecture and domain model', 'Implemented RESTful APIs for parking lot management and reservations', 'Configured Spring Security with stateless JWT authentication'] },
      { phase: 'Phase 2 — Real-time & Pricing Engine', tasks: ['Integrated STOMP WebSockets for live occupancy broadcasting', 'Built the dynamic surge pricing engine based on occupancy thresholds (70%/90%) and temporal rules', 'Implemented async Spring Events for audit logging and analytics'] },
      { phase: 'Phase 3 — Frontend & Dashboard', tasks: ['Developed the React 18 frontend with Tailwind CSS glassmorphism UI', 'Integrated Redux Toolkit for global state management', 'Built the interactive multi-floor visualization and real-time operator command center'] },
      { phase: 'Phase 4 — Optimization & Deployment', tasks: ['Resolved JPA N+1 query issues using JOIN FETCH strategies', 'Implemented React.lazy for route-based code splitting (40% bundle size reduction)', 'Deployed backend to Render/Railway and frontend to Vercel'] },
    ],
    challengesAndSolutions: [
      { challenge: 'Database Query Inefficiency (N+1 Problem) — Fetching parking lots along with their numerous nested slots and reservations resulted in hundreds of sequential database queries, severely degrading API response times.', solution: 'Refactored JPA queries to utilize JOIN FETCH and entity graphs, aggregating related data in a single optimized query, which reduced database round-trips by up to 99%.' },
      { challenge: 'Real-time State Synchronization — Ensuring that all operator dashboards reflect the exact same slot availability instantaneously without overloading the server with polling requests.', solution: 'Implemented a WebSocket-based messaging architecture using STOMP over SockJS, pushing targeted slot-update events to subscribed clients only when state changes occur.' },
      { challenge: 'Decoupling Heavy Operations — Synchronously writing audit logs and updating analytics metrics during a parking reservation blocked the main thread and increased user latency.', solution: 'Adopted an Event-Driven Architecture (EDA) using Spring Application Events (@Async), offloading non-critical tasks to background threads and maximizing the throughput of the core reservation API.' },
    ],
    performanceOptimizations: [
      'Resolved N+1 query problems using JOIN FETCH, reducing database round-trips by up to 99%',
      'Reduced initial frontend bundle size by 40% through React.lazy route-based code splitting',
      'Eliminated HTTP polling overhead by utilizing STOMP WebSockets for real-time data sync',
      'Asynchronous processing of audit logs and analytics via Spring Events to unblock the main HTTP thread',
    ],
    resultsAndOutcomes: [
      'Successfully deployed a production-ready SaaS platform with a live React frontend (Vercel) and Spring Boot backend',
      'Achieved real-time, sub-second occupancy synchronization across all connected clients',
      'Implemented a fully functional dynamic surge pricing engine that automatically adjusts rates based on live capacity',
      'Demonstrated advanced full-stack capabilities, bridging complex backend enterprise patterns with a premium modern UI',
    ],
    futureImprovements: [
      'Implement Redis caching for frequently accessed, read-heavy data like parking lot configurations and base pricing',
      'Add a dedicated mobile application using React Native or Flutter, sharing the same REST and WebSocket APIs',
      'Integrate a real payment gateway (e.g., Stripe) to process reservations and variable duration fees',
      'Deploy the full stack to AWS using EKS (Kubernetes) and RDS for massive horizontal scalability',
    ],
  },

  // ─── Project 2: AI Resume Analyzer (RAG System) ───────────────────────────
  2: {
    problemStatement:
      "Traditional Applicant Tracking Systems (ATS) rely on brittle keyword matching — a resume can be a " +
      "strong fit for a role but get filtered out simply because it doesn't contain the exact phrasing the " +
      "job description uses. Candidates have no way to understand *why* they were rejected or what specific " +
      "skill gaps to address, and recruiters waste time manually screening resumes that keyword filters " +
      "either over- or under-include.",
    businessNeed:
      "Build a tool that evaluates a resume against a job description the way a thoughtful human reviewer " +
      "would — understanding semantic meaning, not just keyword overlap — and returns an actionable match " +
      "score plus specific skill-gap feedback in real time, so candidates can improve their resumes and " +
      "recruiters get a more meaningful first-pass signal.",
    technologySelection: [
      { tech: 'LangChain + LangGraph', why: 'LangGraph\'s stateful graph model was the right fit for orchestrating two distinct multi-step pipelines (Ingestion and Retrieval) with clear, debuggable state transitions rather than a single monolithic prompt chain.' },
      { tech: 'OpenAI API (gpt-4o + embeddings)', why: 'Best-in-class embedding quality for semantic search, and gpt-4o for generating nuanced, human-readable feedback rather than generic boilerplate.' },
      { tech: 'Supabase (pgvector)', why: 'Gives a managed Postgres database with native vector similarity search — avoids running a separate dedicated vector DB (e.g. Pinecone) while keeping relational data (users, jobs, resumes) in the same store.' },
      { tech: 'Next.js + TypeScript', why: 'Server components and API routes in one framework simplify the full-stack setup, and TypeScript catches integration errors between the LLM pipeline types and the UI early.' },
      { tech: 'Turborepo + GitHub Actions + Docker', why: 'Monorepo structure keeps frontend, backend, and shared types in sync; CI/CD via GitHub Actions and containerization via Docker make the Vercel deployment reproducible.' },
    ],
    developmentTimeline: [
      { phase: 'Week 1 — Architecture & Data Pipeline Design', tasks: ['Designed the two-pipeline architecture (Ingestion vs Retrieval)', 'Set up Supabase project with pgvector extension enabled', 'Designed the chunking strategy for resume text'] },
      { phase: 'Week 2 — Ingestion Pipeline', tasks: ['Built PDF parsing and text extraction', 'Implemented chunking + OpenAI embeddings generation', 'Stored embeddings in pgvector with metadata (section, page)'] },
      { phase: 'Week 3 — Retrieval Pipeline & LangGraph Orchestration', tasks: ['Implemented semantic similarity search against job description embeddings', 'Built the LangGraph agent to orchestrate retrieval → LLM scoring → feedback generation', 'Added real-time streaming of LLM responses to the frontend'] },
      { phase: 'Week 4 — Frontend, CI/CD & Deployment', tasks: ['Built the Next.js upload + chat-style feedback UI', 'Set up Turborepo monorepo structure with shared types', 'Configured GitHub Actions CI/CD pipeline', 'Deployed to Vercel and verified end-to-end streaming in production'] },
    ],
    challengesAndSolutions: [
      { challenge: 'Optimal chunking strategy — chunks too large lose retrieval precision (the relevant sentence gets buried among irrelevant ones); chunks too small lose context (a bullet point about "led a team of 5" means nothing without the surrounding role context).', solution: 'Used a sliding-window chunking strategy with overlap, chunking by resume section (experience entry, education entry, skills block) rather than fixed character counts — preserves semantic units while keeping chunks small enough for precise retrieval.' },
      { challenge: 'Architecting two coordinated LangGraph stateful graphs — the Ingestion graph (parse → chunk → embed → store) and Retrieval graph (query → search → score → feedback) need to share data but run on different triggers (upload vs. analysis request).', solution: 'Designed both graphs around a shared Supabase schema as the integration point — Ingestion writes to pgvector, Retrieval reads from it — so the two graphs are decoupled in execution but consistent in data, and each can be tested independently.' },
      { challenge: 'Streaming LLM responses through a Node.js backend to a React frontend — naive request/response would mean the user stares at a blank screen for 10-15 seconds while gpt-4o generates the full analysis.', solution: 'Used OpenAI\'s streaming API combined with Server-Sent Events through the Next.js API route, so tokens render in the UI as a chat-style typing effect the moment they\'re generated — perceived latency drops from ~12s to under 1s for first content.' },
    ],
    performanceOptimizations: [
      'pgvector index (HNSW) on embedding columns for sub-100ms similarity search even as the resume/job corpus grows',
      'Streaming responses (SSE) eliminate the "blank screen" wait — first tokens appear in under 1 second',
      'Chunk-level caching — re-analyzing the same resume against a new job description reuses existing embeddings instead of re-embedding the whole document',
      'Turborepo remote caching speeds up CI builds by skipping unchanged packages',
    ],
    resultsAndOutcomes: [
      'Fully deployed, publicly accessible live demo on Vercel — the only project in the portfolio with a live URL',
      'End-to-end RAG pipeline: PDF → chunks → embeddings → vector search → LLM feedback, all automated',
      'Real-time streaming feedback — AI-generated match score and skill-gap analysis appear as they\'re generated',
      'Most architecturally sophisticated project in the portfolio — demonstrates the full modern LLM-application stack (parsing, embedding, retrieval, generation, streaming, orchestration)',
    ],
    futureImprovements: [
      'Add multi-resume comparison — rank several resumes against the same job description',
      'Support DOCX and plain-text uploads in addition to PDF',
      'Add a "rewrite suggestion" mode that proposes specific bullet-point rewrites to close identified gaps',
      'Cache job-description embeddings so repeat analyses against popular job postings are instant',
      'Add authentication so users can save analysis history across sessions',
    ],
  },
}
