import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Journey', href: '#timeline' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export const PERSONAL_INFO = {
  name: 'Priyanshu Patidar',
  initials: 'PP',
  role: 'Java Full Stack Developer',
  location: 'Bangalore, Karnataka | Open to Relocation',
  email: 'priyanshupatidar1672@gmail.com',
  phone: '+91 9617248701',
  linkedin: 'http://linkedin.com/in/priyanshu-patidar-p1672',
  github: 'https://github.com/Priyanshu-Patidar',
  leetcode: 'https://leetcode.com/u/priyanshu1672',
  geeksforgeeks: 'https://www.geeksforgeeks.org/profile/priyanshupamjl3',
  codechef: 'https://www.codechef.com/users/priyanshu1672',
  instagram: 'https://www.instagram.com/priyanshu_.1672',
  profilePhoto: '/assets/images/portfolio/profile.webp',
  resumePDF: '/assets/resume/Priyanshu_Patidar_Resume.pdf',
  bio: "Results-driven Java Full Stack Developer and CDAC Bangalore 2026 A+ graduate, specializing in building enterprise-grade applications with Spring Boot, REST APIs, Microservices, Angular, and the MERN Stack. Hands-on experience with JWT-based security, JPA/Hibernate, MySQL, and cloud deployment using AWS and Docker. With 200+ LeetCode problems solved and real-world project experience, I build clean, scalable, and high-performance software.",
  typewriterRoles: [
    'Java Full Stack Developer',
    'Spring Boot Engineer',
    'MERN Stack Developer',
    'AI & RAG Systems Builder',
    'Enterprise Application Developer',
  ],
}

// EmailJS — configure these via Vercel Environment Variables
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  NOTIFICATION_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID || 'YOUR_NOTIFICATION_TEMPLATE_ID',
  AUTOREPLY_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'YOUR_AUTOREPLY_TEMPLATE_ID',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
}


export const FALLBACK_LEETCODE_STATS = {
  totalSolved: 200,
  easySolved: 80,
  mediumSolved: 95,
  hardSolved: 25,
  totalQuestions: 3000,
  ranking: undefined,
  acceptanceRate: undefined,
}

// About section highlight cards
export const ABOUT_HIGHLIGHTS = [
  { icon: '🎓', label: 'CDAC Bangalore', value: 'A+ Graduate (78%)', color: '#00d4ff' },
  { icon: '💻', label: 'LeetCode Problems', value: '200+ Solved', color: '#f59e0b' },
  { icon: '🌍', label: 'Location', value: 'Open to Relocation', color: '#10b981' },
  { icon: '☕', label: 'Primary Stack', value: 'Java Full Stack', color: '#8b5cf6' },
  { icon: '🏅', label: 'IBM Certified', value: 'Data Science & ML', color: '#3b82f6' },
  { icon: '🚀', label: 'Applications Built', value: '10+ Projects & Apps', color: '#ec4899' },
]

// Recruiter quick view cards
export const RECRUITER_QUICK_VIEW = [
  { icon: '🚀', label: 'LeetCode', value: '200+ Problems Solved', color: '#f59e0b' },
  { icon: '💼', label: 'Role', value: 'Java Full Stack Developer', color: '#00d4ff' },
  { icon: '🎓', label: 'Education', value: 'CDAC Bangalore A+', color: '#10b981' },
  { icon: '🏆', label: 'Certified', value: 'IBM Certified', color: '#8b5cf6' },
  { icon: '🌍', label: 'Availability', value: 'Open To Relocation', color: '#ec4899' },
  { icon: '⚡', label: 'Applications', value: '10+ Apps Built', color: '#f59e0b' },
]

// Achievement timeline
export const ACHIEVEMENT_TIMELINE = [
  { year: '2020', event: 'B.Tech Started', detail: 'Computer Science & Engineering, Parul University', icon: '🏛️', color: '#8b5cf6' },
  { year: '2023', event: 'Data Science Internship', detail: 'Acmegrade Pvt. Ltd — Python, ML, REST APIs', icon: '💼', color: '#f59e0b' },
  { year: '2024', event: 'B.Tech Completed', detail: 'Graduated with 70% — CSE, Parul University', icon: '🎓', color: '#10b981' },
  { year: '2025', event: 'CDAC Bangalore Started', detail: 'Post Graduation Diploma in Advanced Computing', icon: '🚀', color: '#00d4ff' },
  { year: '2026', event: 'CDAC A+ Achieved', detail: 'Top grade 78% — Full Stack Java + DevOps', icon: '🏆', color: '#00d4ff' },
  { year: '2026', event: 'AI Resume Analyzer', detail: 'Built RAG system with LangGraph + Supabase pgvector', icon: '🤖', color: '#8b5cf6' },
  { year: '2026', event: 'SmartCar Parking System', detail: 'Production-ready Spring Boot API for 500+ users', icon: '🚗', color: '#f59e0b' },
]

// All 6 project filters for reference
export const ALL_PROJECT_FILTERS = ['All', 'Java & Spring Boot', 'MERN Stack', 'AI & ML', 'Data Science', '.NET'] as const
