import { lazy, Suspense, useState, useEffect } from 'react'
import { useTheme } from '@/hooks'

import LoadingScreen from '@/components/sections/LoadingScreen'
import Navbar from '@/components/layout/Navbar'
import ScrollProgressBar from '@/components/layout/ScrollProgressBar'
import CustomCursor from '@/components/ui/CustomCursor'
import BackToTop from '@/components/ui/BackToTop'
const CommandPalette = lazy(() => import('@/components/ui/CommandPalette'))
import Hero from '@/components/sections/Hero'
import RecruiterQuickView from '@/components/sections/RecruiterQuickView'

const About               = lazy(() => import('@/components/sections/About'))
const Skills              = lazy(() => import('@/components/sections/Skills'))
const Projects            = lazy(() => import('@/components/sections/Projects'))
const Experience          = lazy(() => import('@/components/sections/Experience'))
const AchievementTimeline = lazy(() => import('@/components/sections/AchievementTimeline'))
const Education           = lazy(() => import('@/components/sections/Education'))
const Certifications      = lazy(() => import('@/components/sections/Certifications'))
const Services            = lazy(() => import('@/components/sections/Services'))
const Stats               = lazy(() => import('@/components/sections/Stats'))
const Contact             = lazy(() => import('@/components/sections/Contact'))
const Footer              = lazy(() => import('@/components/layout/Footer'))

// Step 22: Content-shaped skeleton loader instead of a blank spinner.
// Mimics the typical section layout (heading + grid of cards) so there's no
// jarring layout shift when the real section mounts.
function SectionFallback() {
  return (
    <div style={{ padding:'6rem 1.5rem', maxWidth:'1280px', margin:'0 auto' }} aria-hidden="true">
      {/* Heading skeleton */}
      <div style={{ width:'120px', height:'12px', borderRadius:'4px', background:'rgba(255,255,255,0.06)', marginBottom:'1rem', animation:'sk-pulse 1.6s ease-in-out infinite' }}/>
      <div style={{ width:'260px', height:'34px', borderRadius:'6px', background:'rgba(255,255,255,0.08)', marginBottom:'2.5rem', animation:'sk-pulse 1.6s ease-in-out infinite 0.1s' }}/>
      {/* Card grid skeleton */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            height:'180px', borderRadius:'16px',
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
            animation:`sk-pulse 1.6s ease-in-out infinite ${0.15 + i*0.1}s`,
          }}/>
        ))}
      </div>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
    </div>
  )
}

function useSEO() {
  useEffect(() => {
    const setMeta = (prop: string, content: string, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('og:title', 'Priyanshu Patidar | Java Full Stack Developer')
    setMeta('og:description', 'Enterprise Java Developer | Spring Boot | MERN Stack | AI & RAG Systems | CDAC Bangalore A+')
    setMeta('og:type', 'website')
    setMeta('og:image', '/seo/og-image.svg')
    setMeta('og:url', window.location.href)
    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', 'Priyanshu Patidar | Java Full Stack Developer', 'name')
    setMeta('twitter:description', 'Enterprise Java Developer | Spring Boot | MERN Stack | AI & RAG Systems', 'name')
    setMeta('twitter:image', '/seo/og-image.svg', 'name')

    // Canonical URL — prevents duplicate-content SEO issues
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = window.location.origin + window.location.pathname

    const jsonLd = {
      '@context': 'https://schema.org', '@type': 'Person',
      name: 'Priyanshu Patidar', jobTitle: 'Java Full Stack Developer',
      email: 'priyanshupatidar1672@gmail.com', url: window.location.href,
      sameAs: ['https://github.com/Priyanshu-Patidar','http://linkedin.com/in/priyanshu-patidar-p1672','https://leetcode.com/u/priyanshu1672'],
      address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressRegion: 'Karnataka', addressCountry: 'IN' },
      knowsAbout: ['Java','Spring Boot','React','Node.js','MySQL','MongoDB','Docker','AWS','AI/ML','LangChain'],
    }
    let script = document.querySelector('#json-ld') as HTMLScriptElement
    if (!script) { script = document.createElement('script'); script.id = 'json-ld'; script.type = 'application/ld+json'; document.head.appendChild(script) }
    script.textContent = JSON.stringify(jsonLd)
  }, [])
}

// Scroll restoration — reset to top on full page reload, preserve on SPA nav
function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])
}

export default function App() {
  useScrollRestoration()
  const { theme, toggleTheme } = useTheme()
  useSEO()

  const [loading, setLoading] = useState(() => !sessionStorage.getItem('portfolio-visited'))

  useEffect(() => { document.documentElement.className = theme }, [theme])

  return (
    <div style={{ position:'relative', minHeight:'100vh', backgroundColor:'var(--bg-primary)', color:'var(--text-primary)' }}>
      {loading && <LoadingScreen onComplete={() => { sessionStorage.setItem('portfolio-visited','1'); setLoading(false) }} />}

      <CustomCursor />
      <ScrollProgressBar />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <RecruiterQuickView />
        <Suspense fallback={<SectionFallback />}><About /></Suspense>
        <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
        <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
        <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
        <Suspense fallback={<SectionFallback />}><AchievementTimeline /></Suspense>
        <Suspense fallback={<SectionFallback />}><Education /></Suspense>
        <Suspense fallback={<SectionFallback />}><Certifications /></Suspense>
        <Suspense fallback={<SectionFallback />}><Stats /></Suspense>
        <Suspense fallback={<SectionFallback />}><Services /></Suspense>
        <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </main>

      <BackToTop />
      <Suspense fallback={null}><CommandPalette /></Suspense>
    </div>
  )
}
