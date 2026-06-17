// Step 23 / Feature 1 — Interactive System Design View.
// Architecture nodes derived from each project's actual implementation
// (verified against README/repo structure, not generic placeholders).
// Each node carries the metadata needed for hover tooltips and the
// click-to-open side panel: purpose, responsibilities, technologies, and
// data flow direction.

export interface ArchNode {
  id: string
  label: string
  sublabel: string
  x: number          // percentage-based position (0-100) for layout
  y: number
  layer: 'frontend' | 'backend' | 'data' | 'auth' | 'external' | 'admin'
  color: string
  purpose: string
  responsibilities: string[]
  technologies: string[]
  dataFlow: string    // short description of what flows in/out of this node
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
}

export interface ProjectArchitecture {
  title: string
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export const ARCHITECTURE_NODES: Record<number, ProjectArchitecture> = {
  // 1 — SmartCar Parking Management System
  1: {
    title: 'SmartCar Parking — Spring Boot Architecture',
    nodes: [
      {
        id: 'client', label: 'Client Layer', sublabel: 'Postman / Swagger UI', x: 50, y: 8,
        layer: 'frontend', color: '#f59e0b',
        purpose: 'Entry point for all API consumers — developers exploring the API via Swagger UI, or automated clients via Postman/curl.',
        responsibilities: ['Send HTTP requests to REST endpoints', 'Render the auto-generated Swagger documentation', 'Provide API keys/Basic-Auth credentials'],
        technologies: ['Swagger UI', 'Postman', 'HTTP/REST'],
        dataFlow: 'Sends JSON requests → receives JSON responses + HTTP status codes',
      },
      {
        id: 'controller', label: 'REST Controller', sublabel: 'Spring MVC', x: 25, y: 35,
        layer: 'backend', color: '#f59e0b',
        purpose: 'Exposes the 12+ REST endpoints (create lot, park, unpark, print state) and maps HTTP requests to service-layer calls.',
        responsibilities: ['Route incoming requests to the correct handler', 'Validate request payloads', 'Serialize responses to JSON', 'Return correct HTTP status codes'],
        technologies: ['Spring Boot', 'Spring MVC', '@RestController'],
        dataFlow: 'Receives HTTP request → delegates to ParkingService → returns HTTP response',
      },
      {
        id: 'security', label: 'Spring Security', sublabel: 'RBAC + Basic Auth', x: 75, y: 35,
        layer: 'auth', color: '#ef4444',
        purpose: 'Enforces role-based access control so only ADMIN users can manage lot configuration, while USER and ADMIN can both park/unpark.',
        responsibilities: ['Authenticate incoming requests via Basic Auth', 'Authorize endpoints by role (@PreAuthorize)', 'Reject unauthorized requests with 401/403'],
        technologies: ['Spring Security', 'Basic Auth', '@PreAuthorize'],
        dataFlow: 'Intercepts every request before it reaches the controller method',
      },
      {
        id: 'parkingservice', label: 'ParkingService', sublabel: 'Proximity Algorithm', x: 25, y: 62,
        layer: 'backend', color: '#fbbf24',
        purpose: 'Contains the core business logic: the snake-lane bay numbering and Manhattan-distance proximity allocation algorithm.',
        responsibilities: ['Find the closest free bay to a given pedestrian exit', 'Enforce accessible-bay restrictions for disabled vehicles', 'Update bay occupancy state on park/unpark'],
        technologies: ['Java', 'Spring @Service'],
        dataFlow: 'Reads/writes Bay and Car entities via JPA repositories',
      },
      {
        id: 'billing', label: 'BillingService', sublabel: 'Future extension point', x: 75, y: 62,
        layer: 'backend', color: '#fbbf24',
        purpose: 'Placeholder service layer designed for future fee-calculation logic based on parking duration.',
        responsibilities: ['Calculate parking duration on unpark', 'Compute fees (planned)'],
        technologies: ['Java', 'Spring @Service'],
        dataFlow: 'Would read Car entry/exit timestamps to compute charges',
      },
      {
        id: 'db', label: 'H2 Database', sublabel: 'JPA / Hibernate', x: 50, y: 88,
        layer: 'data', color: '#64748b',
        purpose: 'Zero-setup in-memory persistence layer storing ParkingLot, Bay, and Car entities via JPA/Hibernate.',
        responsibilities: ['Persist parking lot configuration', 'Track bay occupancy state', 'Support fast in-memory reads for the allocation algorithm'],
        technologies: ['H2 Database', 'JPA', 'Hibernate'],
        dataFlow: 'Receives entity writes from ParkingService, serves entity reads for allocation queries',
      },
    ],
    edges: [
      { from: 'client', to: 'controller', label: 'HTTP' },
      { from: 'client', to: 'security', label: 'Auth header' },
      { from: 'controller', to: 'parkingservice' },
      { from: 'security', to: 'billing' },
      { from: 'parkingservice', to: 'db', label: 'JPA' },
      { from: 'billing', to: 'db', label: 'JPA' },
    ],
  },

  // 2 — AI Resume Analyzer (RAG System)
  2: {
    title: 'AI Resume Analyzer — RAG Architecture',
    nodes: [
      {
        id: 'upload', label: 'PDF Upload', sublabel: 'React UI', x: 12, y: 50,
        layer: 'frontend', color: '#8b5cf6',
        purpose: 'The Next.js frontend where a user uploads their resume PDF and a target job description.',
        responsibilities: ['Accept PDF file upload', 'Accept job description text input', 'Render streaming AI feedback as a chat-style UI'],
        technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
        dataFlow: 'Sends PDF + job description to the backend → receives streamed text tokens',
      },
      {
        id: 'parser', label: 'Text Parser', sublabel: 'LangChain', x: 32, y: 20,
        layer: 'backend', color: '#6d28d9',
        purpose: 'Extracts raw text from the uploaded PDF and splits it into semantically meaningful chunks (by resume section).',
        responsibilities: ['PDF text extraction', 'Section-aware chunking with overlap', 'Attach metadata (section, page) to each chunk'],
        technologies: ['LangChain', 'Node.js', 'PDF parsing libs'],
        dataFlow: 'Resume PDF in → array of text chunks out',
      },
      {
        id: 'jobinput', label: 'Job Description', sublabel: 'Input', x: 32, y: 80,
        layer: 'frontend', color: '#7c3aed',
        purpose: 'Captures the job description text that the resume will be matched against.',
        responsibilities: ['Validate non-empty input', 'Pass text to the embedding step'],
        technologies: ['React', 'Next.js API routes'],
        dataFlow: 'Plain text in → forwarded to OpenAI embeddings',
      },
      {
        id: 'embeddings', label: 'Embeddings', sublabel: 'OpenAI API', x: 55, y: 20,
        layer: 'external', color: '#00d4ff',
        purpose: 'Converts text chunks and job descriptions into high-dimensional vector embeddings for semantic similarity search.',
        responsibilities: ['Generate embeddings for resume chunks', 'Generate embeddings for job descriptions', 'Return vectors for storage'],
        technologies: ['OpenAI API (text-embedding model)'],
        dataFlow: 'Text in → 1536-dimension vector out',
      },
      {
        id: 'pgvector', label: 'pgvector DB', sublabel: 'Supabase', x: 55, y: 80,
        layer: 'data', color: '#0099cc',
        purpose: 'Stores resume chunk embeddings and job description embeddings, and performs fast similarity search via an HNSW index.',
        responsibilities: ['Store vector embeddings alongside relational metadata', 'Run nearest-neighbor similarity search', 'Persist analysis results'],
        technologies: ['Supabase', 'PostgreSQL', 'pgvector'],
        dataFlow: 'Embeddings in → ranked similar chunks out on query',
      },
      {
        id: 'llm', label: 'LLM Feedback', sublabel: 'GPT-4o Stream', x: 80, y: 50,
        layer: 'external', color: '#10b981',
        purpose: 'Generates the human-readable match score and skill-gap feedback, streamed token-by-token to the frontend.',
        responsibilities: ['Synthesize retrieved chunks + job description into a prompt', 'Generate match score', 'Generate actionable feedback', 'Stream response via SSE'],
        technologies: ['OpenAI gpt-4o', 'Server-Sent Events'],
        dataFlow: 'Retrieved context + job description in → streamed feedback text out',
      },
    ],
    edges: [
      { from: 'upload', to: 'parser' },
      { from: 'upload', to: 'jobinput' },
      { from: 'parser', to: 'embeddings' },
      { from: 'jobinput', to: 'pgvector' },
      { from: 'embeddings', to: 'pgvector' },
      { from: 'pgvector', to: 'llm' },
      { from: 'embeddings', to: 'llm' },
    ],
  },

  // 3 — Smart Employee Management Portal (.NET)
  3: {
    title: 'Smart Employee Portal — ASP.NET Core MVC Architecture',
    nodes: [
      {
        id: 'views', label: 'Razor Views', sublabel: 'Bootstrap 5 + jQuery', x: 16, y: 30,
        layer: 'frontend', color: '#3b82f6',
        purpose: 'Server-rendered Razor views providing the CRUD UI for employees and departments.',
        responsibilities: ['Render employee/department forms and lists', 'Run jQuery client-side validation', 'Submit form posts to MVC controllers'],
        technologies: ['Razor Views', 'Bootstrap 5', 'jQuery Validation'],
        dataFlow: 'User input in → HTTP POST to controller; ViewModel in → rendered HTML out',
      },
      {
        id: 'controllers', label: 'MVC Controllers', sublabel: 'C# .NET 8 + Validation', x: 50, y: 30,
        layer: 'backend', color: '#60a5fa',
        purpose: 'Handle CRUD requests for Employee and Department entities, applying server-side Data Annotations validation.',
        responsibilities: ['Map HTTP routes to actions', 'Validate incoming data with Data Annotations', 'Coordinate with EF Core for persistence'],
        technologies: ['ASP.NET Core MVC', 'C# (.NET 8)', 'Data Annotations'],
        dataFlow: 'HTTP request in → validated model → EF Core call → view/response out',
      },
      {
        id: 'efcore', label: 'EF Core ORM', sublabel: 'LINQ + Migrations', x: 84, y: 30,
        layer: 'data', color: '#93c5fd',
        purpose: 'Object-relational mapper translating C# entity operations into SQL, and managing schema migrations.',
        responsibilities: ['Translate LINQ queries to SQL', 'Track entity changes', 'Apply schema migrations'],
        technologies: ['Entity Framework Core', 'LINQ'],
        dataFlow: 'C# LINQ queries in → SQL out; SQL result sets in → C# entities out',
      },
      {
        id: 'dataannotations', label: 'Data Annotations', sublabel: 'Server Validation', x: 16, y: 70,
        layer: 'backend', color: '#2563eb',
        purpose: 'Declarative server-side validation attributes on model properties (Required, StringLength, etc.) enforced before persistence.',
        responsibilities: ['Enforce required fields', 'Enforce string length / format constraints', 'Reject invalid model state'],
        technologies: ['C# Data Annotations'],
        dataFlow: 'Model in → validated or rejected with errors',
      },
      {
        id: 'storedprocs', label: 'Stored Procedures', sublabel: 'Complex DB ops', x: 50, y: 70,
        layer: 'data', color: '#1d4ed8',
        purpose: 'SQL Server stored procedures handling complex reporting queries that are clearer to express directly in SQL than via LINQ.',
        responsibilities: ['Run multi-table aggregate reports', 'Execute complex joins efficiently'],
        technologies: ['SQL Server', 'T-SQL'],
        dataFlow: 'Parameters in → result set out, called alongside EF Core',
      },
      {
        id: 'sqlserver', label: 'SQL Server DB', sublabel: 'Employee / Dept tables', x: 84, y: 70,
        layer: 'data', color: '#1e40af',
        purpose: 'Relational database storing Employee and Department records with a foreign-key relationship.',
        responsibilities: ['Persist Employee and Department tables', 'Enforce referential integrity'],
        technologies: ['Microsoft SQL Server'],
        dataFlow: 'Receives writes from EF Core and stored procedures, serves reads to both',
      },
    ],
    edges: [
      { from: 'views', to: 'controllers' },
      { from: 'controllers', to: 'efcore' },
      { from: 'controllers', to: 'dataannotations' },
      { from: 'dataannotations', to: 'storedprocs' },
      { from: 'efcore', to: 'sqlserver' },
      { from: 'storedprocs', to: 'sqlserver' },
    ],
  },

  // 4 — Flickart E-Commerce (MERN)
  4: {
    title: 'Flickart E-Commerce — MERN + Stripe + Cloudinary',
    nodes: [
      {
        id: 'react', label: 'React + Redux', sublabel: 'Vite Frontend', x: 12, y: 50,
        layer: 'frontend', color: '#10b981',
        purpose: 'The customer- and admin-facing single-page app, with Redux managing global cart and auth state.',
        responsibilities: ['Render product catalog and cart UI', 'Manage cart state via Redux', 'Trigger checkout flow'],
        technologies: ['React.js', 'Redux', 'Vite', 'TailwindCSS'],
        dataFlow: 'User actions in → Redux state updates → API calls to Express backend',
      },
      {
        id: 'express', label: 'Express.js API', sublabel: 'Node.js Server', x: 35, y: 20,
        layer: 'backend', color: '#10b981',
        purpose: 'REST API server handling product, order, and user endpoints.',
        responsibilities: ['Expose product/order/auth REST endpoints', 'Validate and process requests', 'Coordinate with MongoDB and external services'],
        technologies: ['Node.js', 'Express.js'],
        dataFlow: 'HTTP requests in → MongoDB queries / Stripe calls / Cloudinary calls → JSON responses out',
      },
      {
        id: 'jwt', label: 'JWT Auth', sublabel: 'bcrypt', x: 35, y: 80,
        layer: 'auth', color: '#22c55e',
        purpose: 'Stateless authentication using JSON Web Tokens, with passwords hashed via bcrypt.',
        responsibilities: ['Issue JWTs on login', 'Verify JWTs on protected routes', 'Hash and verify passwords'],
        technologies: ['JWT', 'bcrypt'],
        dataFlow: 'Credentials in → JWT out; JWT in on each request → verified user identity out',
      },
      {
        id: 'mongodb', label: 'MongoDB', sublabel: 'Products/Orders', x: 60, y: 20,
        layer: 'data', color: '#47a248',
        purpose: 'NoSQL database storing User, Product, and Order collections.',
        responsibilities: ['Persist product catalog', 'Persist orders and order history', 'Store user accounts'],
        technologies: ['MongoDB', 'Mongoose'],
        dataFlow: 'Document writes/reads from Express API',
      },
      {
        id: 'cloudinary', label: 'Cloudinary CDN', sublabel: 'Image Storage', x: 60, y: 80,
        layer: 'external', color: '#3448c5',
        purpose: 'CDN-backed image hosting for product photos, decoupling image storage from the application database.',
        responsibilities: ['Store uploaded product images', 'Serve images via CDN URLs', 'Handle image transformations'],
        technologies: ['Cloudinary'],
        dataFlow: 'Image upload in → CDN URL out, stored as a reference in MongoDB',
      },
      {
        id: 'stripe', label: 'Stripe API', sublabel: 'Payments', x: 85, y: 50,
        layer: 'external', color: '#6772e5',
        purpose: 'Processes real credit/debit card payments for checkout.',
        responsibilities: ['Create payment intents', 'Process card payments', 'Confirm payment success/failure'],
        technologies: ['Stripe API'],
        dataFlow: 'Order total in → payment confirmation out, recorded against the Order in MongoDB',
      },
    ],
    edges: [
      { from: 'react', to: 'express' },
      { from: 'react', to: 'jwt', label: 'login' },
      { from: 'express', to: 'mongodb' },
      { from: 'express', to: 'cloudinary' },
      { from: 'express', to: 'stripe' },
      { from: 'jwt', to: 'mongodb' },
    ],
  },
}
