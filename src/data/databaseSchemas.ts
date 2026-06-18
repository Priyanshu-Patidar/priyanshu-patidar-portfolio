// Step 23 / Feature 3 — Database Schema / ER Viewer.
// Entities, fields, keys, and relationships derived from each project's
// actual implementation (JPA/Hibernate entities, Supabase/pgvector schema,
// Mongoose models, EF Core entities).

export interface SchemaField {
  name: string
  type: string
  pk?: boolean   // primary key
  fk?: string    // foreign key — references "Entity.field"
}

export interface SchemaEntity {
  name: string
  purpose: string
  icon?: string
  x?: number
  y?: number
  fields: SchemaField[]
}

export interface SchemaRelationship {
  from: string           // entity name
  to: string             // entity name
  type: '1:1' | '1:N' | 'N:M' | 'one-to-one' | 'one-to-many' | 'many-to-many'
  label: string          // short description of the relationship
}

export interface DatabaseSchema {
  title?: string
  dbType: string          // e.g. "H2 (in-memory) via JPA/Hibernate"
  entities: SchemaEntity[]
  relationships: SchemaRelationship[]
}

export const DATABASE_SCHEMAS: Record<number, DatabaseSchema> = {
  // 1 — SmartCar Parking Management System
  1: {
    title: 'Parking Lot ER Diagram',
    dbType: 'H2 In-Memory Database via JPA/Hibernate',
    entities: [
      {
        name: 'ParkingLot',
        icon: '🏢',
        x: 20, y: 50,
        purpose: 'Stores the configuration of a parking lot: its dimensions and pedestrian exit positions.',
        fields: [
          { name: 'lot_id', type: 'Long', pk: true },
          { name: 'rows', type: 'Integer' },
          { name: 'columns', type: 'Integer' },
          { name: 'exits', type: 'JSON / List<Position>' },
        ],
      },
      {
        name: 'Bay',
        icon: '🅿️',
        x: 50, y: 50,
        purpose: 'Represents a single parking bay within a lot — its position, occupancy, and accessibility restriction.',
        fields: [
          { name: 'bay_id', type: 'Long', pk: true },
          { name: 'lot_id', type: 'Long', fk: 'ParkingLot.lot_id' },
          { name: 'index', type: 'Integer' },
          { name: 'occupied', type: 'Boolean' },
          { name: 'accessible_only', type: 'Boolean' },
        ],
      },
      {
        name: 'Car',
        icon: '🚗',
        x: 80, y: 50,
        purpose: 'A vehicle currently parked in a bay — its registration and type (standard or disabled).',
        fields: [
          { name: 'car_id', type: 'Long', pk: true },
          { name: 'bay_id', type: 'Long', fk: 'Bay.bay_id' },
          { name: 'registration', type: 'String' },
          { name: 'type', type: 'Enum (STANDARD, DISABLED)' },
        ],
      },
    ],
    relationships: [
      { from: 'ParkingLot', to: 'Bay', type: '1:N', label: 'One ParkingLot has many Bays' },
      { from: 'Bay', to: 'Car', type: '1:1', label: 'A Bay holds at most one Car at a time' },
    ],
  },

  // 2 — AI Resume Analyzer (RAG System)
  2: {
    title: 'RAG Database Schema',
    dbType: 'Supabase (PostgreSQL) with pgvector extension',
    entities: [
      {
        name: 'resumes',
        icon: '📄',
        x: 30, y: 30,
        purpose: 'Stores uploaded resume metadata and raw extracted text.',
        fields: [
          { name: 'id', type: 'UUID', pk: true },
          { name: 'user_id', type: 'UUID' },
          { name: 'filename', type: 'Text' },
          { name: 'raw_text', type: 'Text' },
          { name: 'created_at', type: 'Timestamp' },
        ],
      },
      {
        name: 'resume_chunks',
        icon: '🧩',
        x: 70, y: 30,
        purpose: 'Chunked sections of a resume with their vector embeddings, used for semantic search.',
        fields: [
          { name: 'id', type: 'UUID', pk: true },
          { name: 'resume_id', type: 'UUID', fk: 'resumes.id' },
          { name: 'section', type: 'Text' },
          { name: 'content', type: 'Text' },
          { name: 'embedding', type: 'vector(1536)' },
        ],
      },
      {
        name: 'job_descriptions',
        icon: '💼',
        x: 30, y: 70,
        purpose: 'Stores job description text and its embedding for similarity matching.',
        fields: [
          { name: 'id', type: 'UUID', pk: true },
          { name: 'title', type: 'Text' },
          { name: 'description', type: 'Text' },
          { name: 'embedding', type: 'vector(1536)' },
        ],
      },
      {
        name: 'analyses',
        icon: '📊',
        x: 70, y: 70,
        purpose: 'A single match-analysis result linking a resume to a job description, with the AI-generated score and feedback.',
        fields: [
          { name: 'id', type: 'UUID', pk: true },
          { name: 'resume_id', type: 'UUID', fk: 'resumes.id' },
          { name: 'job_id', type: 'UUID', fk: 'job_descriptions.id' },
          { name: 'match_score', type: 'Integer' },
          { name: 'feedback', type: 'Text' },
          { name: 'created_at', type: 'Timestamp' },
        ],
      },
    ],
    relationships: [
      { from: 'resumes', to: 'resume_chunks', type: '1:N', label: 'One resume is split into many chunks' },
      { from: 'resumes', to: 'analyses', type: '1:N', label: 'One resume can be analyzed against many job descriptions' },
      { from: 'job_descriptions', to: 'analyses', type: '1:N', label: 'One job description can be matched against many resumes' },
    ],
  },

  // 3 — Smart Employee Management Portal (.NET / EF Core)
  3: {
    title: 'Employee Portal ERD',
    dbType: 'SQL Server via Entity Framework Core',
    entities: [
      {
        name: 'Department',
        icon: '🏢',
        x: 30, y: 50,
        purpose: 'Represents an organizational department that employees belong to.',
        fields: [
          { name: 'DepartmentId', type: 'int', pk: true },
          { name: 'Name', type: 'nvarchar(100)' },
          { name: 'Location', type: 'nvarchar(100)' },
        ],
      },
      {
        name: 'Employee',
        icon: '👤',
        x: 70, y: 50,
        purpose: 'Stores employee records including personal details and department assignment.',
        fields: [
          { name: 'EmployeeId', type: 'int', pk: true },
          { name: 'DepartmentId', type: 'int', fk: 'Department.DepartmentId' },
          { name: 'FullName', type: 'nvarchar(100)' },
          { name: 'Email', type: 'nvarchar(100)' },
          { name: 'JoiningDate', type: 'datetime' },
          { name: 'Salary', type: 'decimal' },
        ],
      },
    ],
    relationships: [
      { from: 'Department', to: 'Employee', type: '1:N', label: 'One Department has many Employees' },
    ],
  },

  // 4 — Flickart E-Commerce (MERN / Mongoose)
  4: {
    title: 'E-Commerce Schema',
    dbType: 'MongoDB via Mongoose ODM',
    entities: [
      {
        name: 'User',
        icon: '👤',
        x: 20, y: 30,
        purpose: 'Registered users — both customers and admins, distinguished by role.',
        fields: [
          { name: '_id', type: 'ObjectId', pk: true },
          { name: 'name', type: 'String' },
          { name: 'email', type: 'String' },
          { name: 'password', type: 'String (bcrypt hash)' },
          { name: 'role', type: "Enum ('user','admin')" },
        ],
      },
      {
        name: 'Product',
        icon: '📦',
        x: 80, y: 30,
        purpose: 'Catalog items available for purchase, including Cloudinary-hosted images.',
        fields: [
          { name: '_id', type: 'ObjectId', pk: true },
          { name: 'name', type: 'String' },
          { name: 'price', type: 'Number' },
          { name: 'category', type: 'String' },
          { name: 'images', type: '[String] (Cloudinary URLs)' },
          { name: 'stock', type: 'Number' },
        ],
      },
      {
        name: 'Order',
        icon: '🛒',
        x: 50, y: 70,
        purpose: 'A placed order linking a user to the products they purchased, with payment status.',
        fields: [
          { name: '_id', type: 'ObjectId', pk: true },
          { name: 'user', type: 'ObjectId', fk: 'User._id' },
          { name: 'items', type: '[{ product: ObjectId, qty: Number }]' },
          { name: 'totalAmount', type: 'Number' },
          { name: 'paymentStatus', type: "Enum ('pending','paid','failed')" },
          { name: 'stripePaymentId', type: 'String' },
          { name: 'createdAt', type: 'Date' },
        ],
      },
    ],
    relationships: [
      { from: 'User', to: 'Order', type: '1:N', label: 'One User can place many Orders' },
      { from: 'Product', to: 'Order', type: 'N:M', label: 'Orders reference many Products (via items array); a Product can appear in many Orders' },
    ],
  },
}
