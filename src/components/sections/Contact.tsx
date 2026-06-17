import { useRef, useState, useEffect, useCallback } from 'react'
import { PERSONAL_INFO, EMAILJS_CONFIG } from '@/data/constants'

// ─── EmailJS loaded via CDN script tag (avoids npm restriction) ──────────────
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void
      send: (serviceId: string, templateId: string, params: Record<string, string>) => Promise<{ status: number }>
    }
  }
}

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// Load EmailJS SDK from CDN once. Returns 'loading' | 'ready' | 'unavailable'.
function useEmailJS() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  useEffect(() => {
    if (window.emailjs) { setStatus('ready'); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    script.onload = () => {
      try { window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY); setStatus('ready') }
      catch { setStatus('unavailable') }
    }
    script.onerror = () => setStatus('unavailable')
    document.head.appendChild(script)
    // Safety timeout — if CDN never responds, degrade gracefully
    const timeout = setTimeout(() => setStatus(s => s === 'loading' ? 'unavailable' : s), 6000)
    return () => clearTimeout(timeout)
  }, [])
  return status
}

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  honeypot: string // spam trap
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const EMPTY_FORM: FormData = { name: '', email: '', phone: '', subject: '', message: '', honeypot: '' }
const COOLDOWN_MS = 30_000

export default function Contact() {
  const { ref: sectionRef, visible } = useReveal()
  const emailJSStatus = useEmailJS()
  const emailJSReady = emailJSStatus === 'ready'
  const emailJSUnavailable = emailJSStatus === 'unavailable'
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [lastSent, setLastSent] = useState(0)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  // Cooldown countdown
  useEffect(() => {
    if (!lastSent) return
    const interval = setInterval(() => {
      const left = Math.max(0, COOLDOWN_MS - (Date.now() - lastSent))
      setCooldownLeft(Math.ceil(left / 1000))
      if (left === 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [lastSent])

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(t)
  }, [toast])

  const validate = useCallback((): boolean => {
    const e: Partial<FormData> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (!form.subject.trim() || form.subject.trim().length < 3) e.subject = 'Please enter a subject'
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    if (form.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number or leave blank'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (form.honeypot) return

    // Cooldown check
    if (Date.now() - lastSent < COOLDOWN_MS) {
      setToast({ msg: `Please wait ${cooldownLeft}s before sending again.`, type: 'error' })
      return
    }

    if (!validate()) return
    if (!emailJSReady) {
      setToast({ msg: 'Email service loading, please try again.', type: 'error' })
      return
    }

    setStatus('loading')

    const templateParams: Record<string, string> = {
      from_name: form.name.trim(),
      from_email: form.email.trim(),
      phone: form.phone.trim() || 'Not provided',
      subject: form.subject.trim(),
      message: form.message.trim(),
      to_name: 'Priyanshu',
      to_email: PERSONAL_INFO.email,
      source: 'Portfolio Website',
      reply_to: form.email.trim(),
    }

    try {
      // Send notification to Priyanshu
      await window.emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.NOTIFICATION_TEMPLATE_ID,
        templateParams
      )

      // Send auto-reply to visitor
      await window.emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.AUTOREPLY_TEMPLATE_ID,
        templateParams
      )

      setStatus('success')
      setForm(EMPTY_FORM)
      setLastSent(Date.now())
      setToast({ msg: "Message sent! I'll get back to you soon 🚀", type: 'success' })
    } catch {
      setStatus('error')
      setToast({ msg: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        style={{
          padding: '6rem 1.5rem',
          background: 'var(--bg-secondary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows */}
        <div style={{ position:'absolute', top:'10%', right:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(30px)', transition:'all 0.7s ease' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase', color:'#00d4ff', marginBottom:'0.75rem' }}>08 / Contact</div>
            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'clamp(2rem,4vw,3rem)', color:'var(--text-primary)', margin:'0 0 0.5rem' }}>
              Let's Work Together
            </h2>
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-muted)', margin:0, maxWidth:'480px' }}>
              Open to full-time roles, freelance projects, and collaboration. Drop me a message!
            </p>
            <div style={{ width:'50px', height:'3px', background:'linear-gradient(90deg,#00d4ff,transparent)', borderRadius:'2px', marginTop:'14px' }} />
          </div>

          {/* Two-column layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}>

            {/* Left — contact info */}
            <ContactInfo visible={visible} />

            {/* Right — form */}
            <ContactForm
              form={form}
              errors={errors}
              status={status}
              visible={visible}
              cooldownLeft={cooldownLeft}
              lastSent={lastSent}
              emailJSUnavailable={emailJSUnavailable}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '5rem',
          zIndex: 6000,
          padding: '0.9rem 1.4rem',
          borderRadius: '12px',
          background: 'rgba(10,15,30,0.96)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.35)' : 'rgba(239,68,68,0.35)'}`,
          color: toast.type === 'success' ? '#4ade80' : '#f87171',
          fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', fontWeight: '500',
          backdropFilter: 'blur(16px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${toast.type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)'}`,
          animation: 'toast-slide 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          maxWidth: '360px',
        }}>
          <span style={{ fontSize: '1rem' }}>{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes toast-slide {
          from { opacity:0; transform:translateY(20px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}

/* ─── Contact Info Panel ─────────────────────────────────────────────── */
function ContactInfo({ visible }: { visible: boolean }) {
  const contactItems = [
    { icon: '📧', label: 'Email', value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}` },
    { icon: '📱', label: 'Phone', value: PERSONAL_INFO.phone, href: `tel:${PERSONAL_INFO.phone}` },
    { icon: '📍', label: 'Location', value: PERSONAL_INFO.location, href: null },
    { icon: '💼', label: 'LinkedIn', value: 'priyanshu-patidar-p1672', href: PERSONAL_INFO.linkedin },
    { icon: '🐙', label: 'GitHub', value: 'Priyanshu-Patidar', href: PERSONAL_INFO.github },
  ]

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-40px)',
      transition: 'all 0.7s ease 0.15s',
    }}>
      {/* Availability card */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '18px',
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.2)',
        marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
          background: 'rgba(34,197,94,0.12)',
          border: '2px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem',
        }}>
          🟢
        </div>
        <div>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'0.95rem', color:'#4ade80', marginBottom:'0.2rem' }}>
            Available for Opportunities
          </div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--text-muted)' }}>
            Open to full-time, contract & freelance roles
          </div>
        </div>
      </div>

      {/* Contact items */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.75rem' }}>
        {contactItems.map((item, i) => (
          <div key={item.label} style={{
            display:'flex', alignItems:'center', gap:'0.85rem',
            padding:'0.85rem 1.1rem', borderRadius:'12px',
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.07)',
            transition:'all 0.25s ease',
            opacity: visible ? 1 : 0,
            transitionDelay: `${0.2 + i * 0.07}s`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.05)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}
          >
            <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{item.icon}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'2px' }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'var(--text-secondary)', textDecoration:'none', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  {item.value}
                </a>
              ) : (
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Social quick-links */}
      <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
        {[
          { href: PERSONAL_INFO.github, label: 'GitHub', icon: '🐙' },
          { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', icon: '💼' },
          { href: PERSONAL_INFO.leetcode, label: 'LeetCode', icon: '🏆' },
          { href: PERSONAL_INFO.instagram, label: 'Instagram', icon: '📸' },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            title={s.label}
            style={{
              width:'40px', height:'40px', borderRadius:'10px',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.1rem',
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.08)',
              transition:'all 0.25s ease',
              textDecoration:'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.08)'; e.currentTarget.style.borderColor='rgba(0,212,255,0.3)'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='none' }}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  )
}

/* ─── Contact Form ───────────────────────────────────────────────────── */
interface FormProps {
  form: FormData
  errors: Partial<FormData>
  status: FormStatus
  visible: boolean
  cooldownLeft: number
  lastSent: number
  emailJSUnavailable: boolean
  onChange: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

function ContactForm({ form, errors, status, visible, cooldownLeft, lastSent, emailJSUnavailable, onChange, onSubmit }: FormProps) {
  const inCooldown = lastSent > 0 && cooldownLeft > 0

  return (
    <div style={{
      padding:'2rem', borderRadius:'22px',
      background:'rgba(255,255,255,0.03)',
      border:'1px solid rgba(255,255,255,0.07)',
      backdropFilter:'blur(16px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(40px)',
      transition:'all 0.7s ease 0.25s',
      position:'relative', overflow:'hidden',
    }}>
      {/* Top glow line */}
      <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:'2px', background:'linear-gradient(90deg,transparent,#00d4ff,transparent)', borderRadius:'2px' }} />

      <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:'700', fontSize:'1.1rem', color:'var(--text-primary)', margin:'0 0 1rem' }}>
        Send a Message
      </h3>

      {/* Graceful degradation banner if EmailJS unavailable */}
      {emailJSUnavailable && (
        <div style={{
          padding:'0.85rem 1rem', borderRadius:'10px', marginBottom:'1.25rem',
          background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)',
        }}>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--text-secondary)', margin:'0 0 0.6rem', lineHeight:1.5 }}>
            ⚠️ Live form is temporarily unavailable. Reach out directly instead:
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            <a href={`mailto:${PERSONAL_INFO.email}?subject=Portfolio%20Inquiry`} style={fallbackBtnStyle('#f59e0b')}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(245,158,11,0.15)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(245,158,11,0.08)'}}>
              ✉️ Email Directly
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" style={fallbackBtnStyle('#0a66c2')}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(10,102,194,0.15)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(10,102,194,0.08)'}}>
              💼 LinkedIn
            </a>
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" style={fallbackBtnStyle('#94a3b8')}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(148,163,184,0.15)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(148,163,184,0.08)'}}>
              🐙 GitHub
            </a>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate style={{ opacity: emailJSUnavailable ? 0.5 : 1, pointerEvents: emailJSUnavailable ? 'none' : 'auto', transition:'opacity 0.3s ease' }}>
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          value={form.honeypot}
          onChange={onChange('honeypot')}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position:'absolute', left:'-9999px', opacity:0, pointerEvents:'none' }}
          autoComplete="off"
        />

        {/* Name + Email row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.85rem', marginBottom:'0.85rem' }}>
          <FormField label="Full Name *" error={errors.name}>
            <input
              type="text"
              placeholder="Priyanshu Patidar"
              value={form.name}
              onChange={onChange('name')}
              autoComplete="name"
              style={fieldStyle(!!errors.name)}
              onFocus={e => applyFocusStyle(e.currentTarget)}
              onBlur={e => removeFocusStyle(e.currentTarget, !!errors.name)}
            />
          </FormField>
          <FormField label="Email Address *" error={errors.email}>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange('email')}
              autoComplete="email"
              style={fieldStyle(!!errors.email)}
              onFocus={e => applyFocusStyle(e.currentTarget)}
              onBlur={e => removeFocusStyle(e.currentTarget, !!errors.email)}
            />
          </FormField>
        </div>

        {/* Phone + Subject row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.85rem', marginBottom:'0.85rem' }}>
          <FormField label="Phone (Optional)" error={errors.phone}>
            <input
              type="tel"
              placeholder="+91 9999999999"
              value={form.phone}
              onChange={onChange('phone')}
              autoComplete="tel"
              style={fieldStyle(!!errors.phone)}
              onFocus={e => applyFocusStyle(e.currentTarget)}
              onBlur={e => removeFocusStyle(e.currentTarget, !!errors.phone)}
            />
          </FormField>
          <FormField label="Subject *" error={errors.subject}>
            <input
              type="text"
              placeholder="Job Opportunity / Collaboration"
              value={form.subject}
              onChange={onChange('subject')}
              style={fieldStyle(!!errors.subject)}
              onFocus={e => applyFocusStyle(e.currentTarget)}
              onBlur={e => removeFocusStyle(e.currentTarget, !!errors.subject)}
            />
          </FormField>
        </div>

        {/* Message */}
        <div style={{ marginBottom:'1.25rem' }}>
          <FormField label="Message *" error={errors.message}>
            <textarea
              placeholder="Hi Priyanshu, I'd like to discuss..."
              value={form.message}
              onChange={onChange('message')}
              rows={5}
              style={{
                ...fieldStyle(!!errors.message),
                resize:'vertical', minHeight:'120px',
              }}
              onFocus={e => applyFocusStyle(e.currentTarget)}
              onBlur={e => removeFocusStyle(e.currentTarget, !!errors.message)}
            />
          </FormField>
          {/* Character count */}
          <div style={{ textAlign:'right', fontSize:'0.65rem', color: form.message.length < 10 ? '#ef4444' : 'var(--text-muted)', marginTop:'4px', fontFamily:'JetBrains Mono,monospace' }}>
            {form.message.length} chars {form.message.length < 10 ? `(min 10)` : '✓'}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading' || inCooldown}
          style={{
            width:'100%', padding:'0.85rem 1.5rem', borderRadius:'12px',
            background: status === 'success'
              ? 'linear-gradient(135deg,#22c55e,#16a34a)'
              : inCooldown
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg,#00d4ff,#0099cc)',
            border:'none', cursor: status === 'loading' || inCooldown ? 'not-allowed' : 'pointer',
            color: inCooldown ? 'var(--text-muted)' : '#0a0f1e',
            fontFamily:'Space Grotesk,sans-serif', fontWeight:'700',
            fontSize:'0.9rem', transition:'all 0.35s ease',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem',
            boxShadow: status === 'loading' || inCooldown ? 'none' : '0 0 20px rgba(0,212,255,0.3)',
            opacity: status === 'loading' || inCooldown ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (status !== 'loading' && !inCooldown) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0,212,255,0.5), 0 10px 30px rgba(0,0,0,0.3)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)'
          }}
        >
          {status === 'loading' ? (
            <>
              <Spinner /> Sending…
            </>
          ) : status === 'success' ? (
            <>✅ Message Sent!</>
          ) : inCooldown ? (
            <>⏳ Wait {cooldownLeft}s</>
          ) : (
            <>
              <SendIcon /> Send Message
            </>
          )}
        </button>

        {/* Footer note */}
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-muted)', textAlign:'center', margin:'0.85rem 0 0' }}>
          You'll receive an auto-reply confirmation. I typically respond within 24 hours.
        </p>
      </form>
    </div>
  )
}

/* ─── Form Field Wrapper ─────────────────────────────────────────────── */
function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display:'block', fontFamily:'Inter,sans-serif', fontSize:'0.75rem', fontWeight:'500', color:'var(--text-secondary)', marginBottom:'6px', letterSpacing:'0.02em' }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'#f87171', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function fallbackBtnStyle(color: string): React.CSSProperties {
  return {
    display:'inline-flex', alignItems:'center', gap:'5px',
    padding:'5px 12px', borderRadius:'7px',
    background: color+'14', border:`1px solid ${color}35`,
    color, textDecoration:'none', fontSize:'0.75rem', fontWeight:'600',
    fontFamily:'Space Grotesk,sans-serif', transition:'background 0.2s ease',
  }
}

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    width:'100%', padding:'0.65rem 0.9rem', borderRadius:'10px',
    background:'rgba(255,255,255,0.04)',
    border:`1px solid ${hasError ? '#ef444460' : 'rgba(255,255,255,0.1)'}`,
    color:'var(--text-primary)',
    fontFamily:'Inter,sans-serif', fontSize:'0.85rem',
    outline:'none', transition:'border-color 0.25s ease, box-shadow 0.25s ease',
    boxSizing:'border-box',
    boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
  }
}

function applyFocusStyle(el: HTMLElement) {
  el.style.borderColor = 'rgba(0,212,255,0.5)'
  el.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.08)'
}

function removeFocusStyle(el: HTMLElement, hasError: boolean) {
  el.style.borderColor = hasError ? '#ef444460' : 'rgba(255,255,255,0.1)'
  el.style.boxShadow = hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'
}

function Spinner() {
  return (
    <div style={{
      width:'16px', height:'16px', borderRadius:'50%',
      border:'2px solid rgba(10,15,30,0.3)',
      borderTopColor:'#0a0f1e',
      animation:'spin 0.8s linear infinite',
    }} />
  )
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}
