export type Theme = 'dark' | 'light'

export interface NavItem {
  label: string
  href: string
}

export interface Skill {
  name: string
  level: number
  icon?: string
}

export interface SkillCategory {
  category: string
  icon: string
  skills: Skill[]
}

export type ProjectFilter = 'All' | 'Java & Spring Boot' | 'MERN Stack' | 'AI & ML' | 'Data Science' | '.NET'

export interface Project {
  id: number
  title: string
  description: string
  longDescription?: string
  tech: string[]
  category: ProjectFilter
  github: string
  live?: string
  keyAPIs?: string[]
  features?: string[]
  challenges?: string[]
  impact?: string
  color: string
  icon: string
  featured?: boolean
  thumbnail?: string
  screenshots?: string[]
}

export interface Experience {
  id: number
  company: string
  role: string
  period: string
  type: 'work' | 'training'
  points: string[]
  color: string
}

export interface Education {
  id: number
  institution: string
  degree: string
  grade: string
  period: string
  icon: string
  color: string
}

export interface Certification {
  id: number
  title: string
  issuer: string
  icon: string
  color: string
  year?: string
  credentialUrl?: string
}

export interface LeetCodeStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalQuestions: number
  ranking?: number
  acceptanceRate?: number
  loading: boolean
  error: boolean
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  honeypot?: string
}

export interface QuickViewCard {
  icon: string
  label: string
  value: string
  color: string
}
