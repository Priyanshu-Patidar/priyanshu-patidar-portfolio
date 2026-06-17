import type { Experience, Education, Certification } from '@/types'

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'CDAC Bangalore',
    role: 'Full Stack Java Developer Training',
    period: 'Aug 2025 – Feb 2026',
    type: 'training',
    points: [
      'Completed intensive 6-month Advanced Computing PG Diploma, achieving top A+ grade (78%)',
      'Mastered enterprise Java: Core Java, Spring Boot, Microservices, REST APIs, Angular, Hibernate/JPA',
      'Built two major capstone projects: SmartCarParking (Spring Boot + MySQL + JWT) and E-Commerce (MERN Stack)',
      'Trained in CI/CD pipelines (GitLab CI), Docker, AWS, and Agile/Scrum methodology',
    ],
    color: '#00d4ff',
  },
  {
    id: 2,
    company: 'Acmegrade Pvt. Ltd',
    role: 'Data Science Intern',
    period: 'Jan 2023 – Mar 2023',
    type: 'work',
    points: [
      'Analyzed real-world business datasets under the founder\'s direct guidance, delivering actionable insights using Python (Pandas, NumPy, Matplotlib)',
      'Developed and integrated ML models into REST APIs, improving end-to-end data processing pipeline efficiency by 25%',
      'Preprocessed and cleaned large datasets, reducing data inconsistency errors by ~30%',
      'Collaborated with cross-functional teams on data analysis and visualization deliverables, consistently meeting deadlines',
    ],
    color: '#f59e0b',
  },
]

export const educations: Education[] = [
  {
    id: 1,
    institution: 'CDAC Bangalore',
    degree: 'Post Graduation Diploma in Advanced Computing',
    grade: 'A+ Grade (78%)',
    period: 'Aug 2025 – Feb 2026',
    icon: '🎓',
    color: '#00d4ff',
  },
  {
    id: 2,
    institution: 'Parul University',
    degree: 'B.Tech — Computer Science & Engineering',
    grade: '70%',
    period: '2020 – 2024',
    icon: '🏛️',
    color: '#8b5cf6',
  },
]

export const certifications: Certification[] = [
  {
    id: 1,
    title: 'IBM Data Science Professional Certificate',
    issuer: 'IBM',
    icon: '🏅',
    color: '#0f62fe',
    year: '2023',
  },
  {
    id: 2,
    title: 'IBM Machine Learning Professional Certificate',
    issuer: 'IBM',
    icon: '🤖',
    color: '#0f62fe',
    year: '2023',
  },
  {
    id: 3,
    title: 'Data Science Training Certificate',
    issuer: 'Acmegrade Pvt. Ltd',
    icon: '📊',
    color: '#f59e0b',
    year: '2023',
  },
]
