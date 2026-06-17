import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

// Linear interpolation
export function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t
}

// Smooth scroll to section
export function scrollToSection(href: string) {
  const id = href.replace('#', '')
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Check if element is in viewport
export function isInViewport(element: Element, threshold = 0.1) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold)
  )
}

// Format number with + suffix
export function formatStat(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`
  return `${value}+`
}

// Check if reduced motion is preferred
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if on mobile
export function isMobile() {
  return window.innerWidth < 768
}
