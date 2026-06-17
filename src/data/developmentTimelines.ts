// Step 23 / Feature 2 — Project Development Timeline.
// A vertical, animated, scroll-revealed timeline shown inside each project's
// details modal, demonstrating planning and execution across 4 weekly phases.
//
// Projects 1 & 2 reuse the richer timeline already authored in caseStudies.ts
// (kept in sync here so the regular Project Modal and the Case Study modal
// show identical timelines without duplicating content).

export interface TimelinePhase {
  phase: string          // e.g. "Week 1 — Requirement Analysis & Design"
  tasks: string[]        // Tasks Completed
  tech?: string[]        // Technologies Used in this phase
  challenge?: string     // Key Challenge for this phase
  deliverable: string    // Deliverable for this phase
}

export const DEVELOPMENT_TIMELINES: Record<number, TimelinePhase[]> = {
  // 1 — SmartCar Parking Management System
  1: [
    {
      phase: 'Week 1 — Requirement Analysis & Design',
      tasks: ['Modeled the parking lot as a 2D grid with configurable size, exits, and accessible bays', 'Designed the REST resource model (ParkingLot, Bay, Car)', 'Drafted the OpenAPI spec before writing implementation code'],
      tech: ['Java', 'Spring Boot', 'OpenAPI'],
      challenge: 'Translating a real-world parking lot layout into a clean, configurable data model',
      deliverable: 'API design document + OpenAPI spec draft',
    },
    {
      phase: 'Week 2 — Core Allocation Algorithm',
      tasks: ['Implemented the snake-lane traversal for bay numbering', 'Built the Manhattan-distance proximity calculation', 'Wrote JUnit tests for edge cases (full lot, multiple exits)'],
      tech: ['Java', 'JUnit'],
      challenge: 'Snake-lane bay numbering matching real-world layouts',
      deliverable: 'Tested allocation algorithm module',
    },
    {
      phase: 'Week 3 — REST API & Security',
      tasks: ['Built all 12 REST endpoints (park, unpark, print state, etc.)', 'Added Spring Security with Basic Auth and USER/ADMIN roles', 'Enforced disabled-bay rules for D-type vehicles'],
      tech: ['Spring Boot', 'Spring Security', 'H2'],
      challenge: 'Role separation without over-engineering the auth layer',
      deliverable: 'Fully functional REST API with RBAC',
    },
    {
      phase: 'Week 4 — Documentation, Testing & Polish',
      tasks: ['Generated the full Swagger/OpenAPI YAML spec', 'Built the Postman collection covering all endpoints', 'Ran integration tests via single Maven command', 'Wrote setup README'],
      tech: ['Swagger', 'Postman', 'Maven'],
      challenge: 'Keeping documentation in sync with rapidly-evolving endpoints',
      deliverable: 'Production-ready, documented microservice',
    },
  ],

  // 2 — AI Resume Analyzer (RAG System)
  2: [
    {
      phase: 'Week 1 — Architecture & Data Pipeline Design',
      tasks: ['Designed the two-pipeline architecture (Ingestion vs Retrieval)', 'Set up Supabase project with pgvector extension', 'Designed the chunking strategy for resume text'],
      tech: ['Supabase', 'pgvector', 'LangGraph'],
      challenge: 'Choosing a chunking strategy that balances context vs precision',
      deliverable: 'Architecture diagram + Supabase schema',
    },
    {
      phase: 'Week 2 — Ingestion Pipeline',
      tasks: ['Built PDF parsing and text extraction', 'Implemented chunking + OpenAI embeddings generation', 'Stored embeddings in pgvector with metadata'],
      tech: ['LangChain', 'OpenAI API', 'pgvector'],
      challenge: 'Reliable PDF text extraction across varied resume formats',
      deliverable: 'Working Ingestion graph (PDF → embeddings → DB)',
    },
    {
      phase: 'Week 3 — Retrieval Pipeline & LangGraph Orchestration',
      tasks: ['Implemented semantic similarity search against job description embeddings', 'Built the LangGraph agent to orchestrate retrieval → LLM scoring → feedback', 'Added real-time streaming of LLM responses'],
      tech: ['LangGraph', 'OpenAI gpt-4o', 'Server-Sent Events'],
      challenge: 'Coordinating two stateful graphs sharing a common data store',
      deliverable: 'End-to-end RAG pipeline with streaming feedback',
    },
    {
      phase: 'Week 4 — Frontend, CI/CD & Deployment',
      tasks: ['Built the Next.js upload + chat-style feedback UI', 'Set up Turborepo monorepo structure with shared types', 'Configured GitHub Actions CI/CD', 'Deployed to Vercel'],
      tech: ['Next.js', 'Turborepo', 'GitHub Actions', 'Vercel'],
      challenge: 'Verifying streaming worked correctly in the Vercel production environment',
      deliverable: 'Live, publicly deployed AI Resume Analyzer',
    },
  ],

  // 3 — Smart Employee Management Portal (.NET)
  3: [
    {
      phase: 'Week 1 — Requirement Analysis & Database Design',
      tasks: ['Modeled Employee and Department entities and their relationships', 'Designed the SQL Server schema and initial EF Core migrations', 'Set up the ASP.NET Core MVC project structure'],
      tech: ['SQL Server', 'Entity Framework Core', 'ASP.NET Core'],
      challenge: 'Designing a department hierarchy that supports future org-chart features',
      deliverable: 'Database schema + initial EF Core migration',
    },
    {
      phase: 'Week 2 — Backend Development & Stored Procedures',
      tasks: ['Implemented MVC controllers for Employee and Department CRUD', 'Wrote SQL Server stored procedures for complex reporting queries', 'Added LINQ queries for flexible filtering'],
      tech: ['C# (.NET 8)', 'LINQ', 'Stored Procedures'],
      challenge: 'Making stored procedures and EF Core coexist without conflicts',
      deliverable: 'Working CRUD backend with reporting procedures',
    },
    {
      phase: 'Week 3 — Frontend & Validation',
      tasks: ['Built Razor Views with Bootstrap 5 for all CRUD screens', 'Added server-side Data Annotations validation', 'Added jQuery client-side validation matching server rules'],
      tech: ['Razor Views', 'Bootstrap 5', 'jQuery Validation'],
      challenge: 'Keeping client-side and server-side validation rules in sync',
      deliverable: 'Fully validated, responsive CRUD UI',
    },
    {
      phase: 'Week 4 — Testing, Bug Fixes & Deployment Prep',
      tasks: ['Manually tested all CRUD flows and edge cases', 'Fixed migration ordering issues discovered during testing', 'Wrote setup documentation for SQL Server connection configuration'],
      tech: ['SQL Server', 'EF Core Migrations'],
      challenge: 'EF Core migration lifecycle management as the schema evolved',
      deliverable: 'Stable, documented Employee Management Portal',
    },
  ],

  // 4 — Flickart E-Commerce (MERN)
  4: [
    {
      phase: 'Week 1 — Project Setup & Auth',
      tasks: ['Set up the MERN monorepo (client/ and backend/ directories)', 'Designed MongoDB schemas for Users, Products, Orders', 'Implemented JWT-based authentication with bcrypt password hashing'],
      tech: ['MongoDB', 'Express.js', 'JWT', 'Bcrypt'],
      challenge: 'Designing a User/Admin role model that scales to an admin dashboard',
      deliverable: 'Working auth API with role-based access',
    },
    {
      phase: 'Week 2 — Product Catalog & Cloudinary',
      tasks: ['Built product CRUD APIs', 'Integrated Cloudinary for product image upload and CDN delivery', 'Implemented category and search filtering'],
      tech: ['Cloudinary', 'Express.js', 'MongoDB'],
      challenge: 'Coordinating the client → backend → Cloudinary → MongoDB upload flow',
      deliverable: 'Product catalog with CDN-hosted images',
    },
    {
      phase: 'Week 3 — Cart, Checkout & Stripe Payments',
      tasks: ['Implemented Redux-based global cart state', 'Integrated Stripe payment gateway for checkout', 'Built order creation and order history APIs'],
      tech: ['Redux', 'Stripe API', 'React.js'],
      challenge: 'Integrating Stripe webhook handling for reliable payment confirmation',
      deliverable: 'Full checkout flow with real payment processing',
    },
    {
      phase: 'Week 4 — Admin Dashboard & Polish',
      tasks: ['Built the admin dashboard for product, category and order management', 'Added Material UI components for a polished admin UX', 'Tested the full buy-flow end-to-end'],
      tech: ['Material UI', 'TailwindCSS', 'React.js'],
      challenge: 'Keeping admin and customer-facing UIs visually consistent while serving different needs',
      deliverable: 'Production-ready e-commerce platform with admin panel',
    },
  ],

  // 5 — Uber Data Analysis
  5: [
    {
      phase: 'Week 1 — Data Exploration & Cleaning',
      tasks: ['Explored the Uber trip CSV structure and identified missing values', 'Built the Flask file-upload route with data preview', 'Implemented date parsing and feature engineering with Pandas'],
      tech: ['Python', 'Flask', 'Pandas'],
      challenge: 'Handling inconsistent date formats across CSV exports',
      deliverable: 'Clean, feature-engineered dataset pipeline',
    },
    {
      phase: 'Week 2 — Core Visualizations',
      tasks: ['Built rides-per-hour, per-day, and per-weekday histograms with Plotly', 'Implemented category and purpose grouped bar charts', 'Set up the PlotlyJSONEncoder for Jinja2 template rendering'],
      tech: ['Plotly Express', 'Jinja2'],
      challenge: 'Serializing Plotly figures correctly for server-rendered templates',
      deliverable: '5+ working interactive charts',
    },
    {
      phase: 'Week 3 — Additional Analysis Routes',
      tasks: ['Added day-vs-night distribution analysis', 'Built miles-by-category breakdowns', 'Expanded to 15 total Flask route handlers for different analysis views'],
      tech: ['Flask', 'NumPy', 'Matplotlib'],
      challenge: 'Avoiding code duplication across 15 similar but distinct route handlers',
      deliverable: '15-route Flask analysis application',
    },
    {
      phase: 'Week 4 — UI Polish & Testing',
      tasks: ['Styled the upload and results pages with HTML/CSS', 'Tested with multiple real Uber CSV exports for robustness', 'Wrote usage documentation'],
      tech: ['HTML/CSS', 'Flask'],
      challenge: 'Ensuring the app works statelessly without session management',
      deliverable: 'Polished, documented Uber data analysis tool',
    },
  ],

  // 6 — Parkinson's Disease Prediction
  6: [
    {
      phase: 'Week 1 — EDA & Data Understanding',
      tasks: ['Loaded the UCI Parkinson\'s voice-recording dataset (195 samples, 23 features)', 'Built correlation heatmaps and feature distribution plots', 'Identified class imbalance (~75% positive, 25% healthy)'],
      tech: ['Pandas', 'Seaborn', 'Jupyter Notebook'],
      challenge: 'Understanding which of the 22 biomarker features carry the most signal',
      deliverable: 'EDA notebook with correlation analysis',
    },
    {
      phase: 'Week 2 — Feature Selection & Preprocessing',
      tasks: ['Selected key biomarkers (MDVP:Fo, HNR, RPDE, DFA, spread1, PPE)', 'Applied StandardScaler normalization', 'Split data into train/test sets with stratification for class imbalance'],
      tech: ['scikit-learn', 'NumPy'],
      challenge: 'Feature selection from 22 correlated biomarker parameters',
      deliverable: 'Clean, normalized, stratified dataset',
    },
    {
      phase: 'Week 3 — Model Training & Evaluation',
      tasks: ['Trained an SVM classifier with cross-validation', 'Evaluated accuracy, precision, recall given the class imbalance', 'Tuned hyperparameters (kernel, C, gamma)'],
      tech: ['scikit-learn (SVM)', 'Matplotlib'],
      challenge: 'Class imbalance skewing naive accuracy metrics',
      deliverable: 'Trained SVM model with evaluation report',
    },
    {
      phase: 'Week 4 — Flask Deployment',
      tasks: ['Pickled the trained sklearn pipeline (scaler + model)', 'Built the Flask web interface for real-time prediction input', 'Tested end-to-end prediction flow with sample inputs'],
      tech: ['Flask', 'scikit-learn'],
      challenge: 'Correctly pickling the full sklearn pipeline (scaler + model) for inference',
      deliverable: 'Deployed Flask app for real-time Parkinson\'s prediction',
    },
  ],
}
