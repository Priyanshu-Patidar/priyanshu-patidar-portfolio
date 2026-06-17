import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    icon: '💻',
    skills: [
      { name: 'Java', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Python', level: 78 },
    ],
  },
  {
    category: 'Frameworks',
    icon: '⚙️',
    skills: [
      { name: 'Spring Boot', level: 88 },
      { name: 'ReactJS', level: 82 },
      { name: 'NodeJS', level: 80 },
      { name: 'Angular', level: 75 },
      { name: 'Next.js', level: 72 },
      { name: 'LangChain', level: 70 },
      { name: 'LangGraph', level: 68 },
    ],
  },
  {
    category: 'Databases',
    icon: '🗄️',
    skills: [
      { name: 'MySQL', level: 85 },
      { name: 'MongoDB', level: 78 },
      { name: 'Oracle DB', level: 72 },
      { name: 'Supabase/pgvector', level: 68 },
    ],
  },
  {
    category: 'Web & APIs',
    icon: '🌐',
    skills: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 85 },
      { name: 'RESTful APIs', level: 88 },
      { name: 'MVC', level: 85 },
      { name: 'Swagger/OpenAPI', level: 80 },
    ],
  },
  {
    category: 'Tools & DevOps',
    icon: '🛠️',
    skills: [
      { name: 'Git', level: 88 },
      { name: 'Postman', level: 85 },
      { name: 'Maven', level: 80 },
      { name: 'Docker', level: 72 },
      { name: 'AWS', level: 65 },
      { name: 'GitLab CI', level: 70 },
      { name: 'Kubernetes', level: 60 },
    ],
  },
  {
    category: 'AI / ML',
    icon: '🤖',
    skills: [
      { name: 'RAG Architecture', level: 75 },
      { name: 'OpenAI API', level: 72 },
      { name: 'Vector Embeddings', level: 70 },
      { name: 'LangGraph Agents', level: 68 },
    ],
  },
  {
    category: 'Concepts',
    icon: '🧠',
    skills: [
      { name: 'OOP', level: 90 },
      { name: 'Design Patterns', level: 85 },
      { name: 'JWT', level: 85 },
      { name: 'JPA/Hibernate', level: 85 },
      { name: 'Microservices', level: 80 },
      { name: 'Agile/Scrum', level: 80 },
      { name: 'JUnit', level: 75 },
    ],
  },
]

// Tech cloud items for interactive visualization
export const techCloudItems = [
  { name: 'Java', color: '#f59e0b', size: 'lg' },
  { name: 'Spring Boot', color: '#10b981', size: 'lg' },
  { name: 'React', color: '#61dafb', size: 'lg' },
  { name: 'TypeScript', color: '#3178c6', size: 'md' },
  { name: 'Node.js', color: '#68a063', size: 'md' },
  { name: 'MySQL', color: '#4479a1', size: 'md' },
  { name: 'MongoDB', color: '#47a248', size: 'md' },
  { name: 'Docker', color: '#0db7ed', size: 'md' },
  { name: 'AWS', color: '#ff9900', size: 'sm' },
  { name: 'Python', color: '#3776ab', size: 'md' },
  { name: 'Next.js', color: '#ffffff', size: 'sm' },
  { name: 'Angular', color: '#dd0031', size: 'sm' },
  { name: 'LangChain', color: '#1c3c3c', size: 'sm' },
  { name: 'JWT', color: '#d63aff', size: 'sm' },
  { name: 'Git', color: '#f05032', size: 'sm' },
  { name: 'Kubernetes', color: '#326ce5', size: 'sm' },
  { name: 'OpenAI', color: '#10a37f', size: 'sm' },
  { name: 'REST APIs', color: '#00d4ff', size: 'md' },
]
