// Lightweight inline SVG tech icons — no external dependencies
// All icons are simplified but recognizable brand representations

interface IconProps { size?: number; className?: string }

export function JavaIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149z" fill="#5382a1"/>
      <path d="M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218z" fill="#5382a1"/>
      <path d="M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573z" fill="#e76f00"/>
      <path d="M19.435 20.155s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.749-.89 1.254-.999.527-.115.828-.094.828-.094-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.818z" fill="#5382a1"/>
      <path d="M9.292 12.83s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-.897.585c-3.523.927-10.328.495-8.361-.568 1.667-.895 1.414-.89 1.414-.89z" fill="#5382a1"/>
      <path d="M17.116 17.584c3.583-1.862 1.927-3.653.77-3.413-.283.059-.409.11-.409.11s.105-.165.304-.236c2.272-.799 4.019 2.354-.738 3.603 0 .001.056-.049.073-.064z" fill="#5382a1"/>
      <path d="M14.401 0s2.494 2.494-2.367 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.192-7.627z" fill="#e76f00"/>
      <path d="M9.734 23.924c3.442.22 8.728-.122 8.853-1.751 0 0-.241.618-2.851 1.108-2.954.552-6.596.488-8.752.134 0 0 .442.366 2.75.509z" fill="#5382a1"/>
    </svg>
  )
}

export function SpringBootIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#6DB33F"/>
      <path d="M8 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M16 8c0 2.2-1.8 4-4 4S8 10.2 8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
    </svg>
  )
}

export function ReactIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  )
}

export function AngularIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 6.5l1.5 12.5L12 22l8.5-3L22 6.5z" fill="#DD0031"/>
      <path d="M12 2v20l8.5-3L22 6.5z" fill="#C3002F"/>
      <path d="M12 5L7 17h1.9l1-2.5h4.2L15.1 17H17L12 5z" fill="white"/>
      <path d="M12 8.5l1.6 4H10.4L12 8.5z" fill="#DD0031"/>
    </svg>
  )
}

export function NodeJsIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v10l9 5 9-5V7z" fill="#339933"/>
      <path d="M12 2L3 7l9 5 9-5z" fill="#00982c" opacity="0.7"/>
      <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontFamily="Arial" fontWeight="bold" fill="white">JS</text>
    </svg>
  )
}

export function MongoDBIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 2 5 7 5 12c0 3.5 1.5 6.5 4 8.5l1 1.5 1-1.5c.5-1 .8-2 .8-3V12c0-.5.2-1 .7-1.3L12 10l-.5.7c.5.3.7.8.7 1.3v5.5c0 1-.3 2-.8 3l-1 1.5V22" fill="#47A248"/>
      <path d="M12 2C16 2 19 7 19 12c0 3.5-1.5 6.5-4 8.5l-1 1.5-1-1.5c-.5-1-.8-2-.8-3V12c0-.5-.2-1-.7-1.3L12 10l.5.7c-.5.3-.7.8-.7 1.3v5.5c0 1 .3 2 .8 3l1 1.5" fill="#4FAD45"/>
    </svg>
  )
}

export function MySQLIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#4479A1"/>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="#4479A1" strokeWidth="1.5"/>
      <path d="M8 9l2 3-2 3M11 9h4M11 12h3M11 15h4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

export function DockerIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 12H9M13 8H9M13 16H9" stroke="#0DB7ED" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="9" y="7" width="4" height="2" rx="0.5" fill="#0DB7ED" opacity="0.3"/>
      <rect x="9" y="11" width="4" height="2" rx="0.5" fill="#0DB7ED" opacity="0.6"/>
      <path d="M4 14c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4V10H4v4z" fill="#0DB7ED" opacity="0.2" stroke="#0DB7ED" strokeWidth="1.5"/>
      <path d="M20 10s1-1 1-3c-1 0-2.5.5-3 2" stroke="#0DB7ED" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="1" fill="#0DB7ED"/>
    </svg>
  )
}

export function AWSIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 14l-2 5h3l.5-2h2.5l.5 2h3l-2-5h-5.5z" fill="#FF9900"/>
      <path d="M8.5 11l1 3h1l1-3" fill="#FF9900"/>
      <path d="M15 14l-1 5h2.5l.3-1.5h1.5l.2 1.5H21l-1-5h-5z" fill="#FF9900"/>
      <path d="M17 11l.8 3h.8l.7-3" fill="#FF9900"/>
      <path d="M4 9c0-2.8 3.6-5 8-5s8 2.2 8 5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M6 9.5c1 .5 3.5.5 6 0s5 .5 6 1" stroke="#FF9900" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function GitIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.2 11.2L12.8 1.8a1.1 1.1 0 00-1.6 0L9.3 3.7l2 2a1.3 1.3 0 011.7 1.7l2 2a1.3 1.3 0 011.3 2.1 1.3 1.3 0 01-1.8 0 1.3 1.3 0 010-1.8l-1.9-1.9v5a1.3 1.3 0 01.3 2.1 1.3 1.3 0 01-1.8 0 1.3 1.3 0 010-1.8V7.5a1.3 1.3 0 01-.7-1.7l-2-2L1.8 11.2a1.1 1.1 0 000 1.6l9.4 9.4c.4.4 1.1.4 1.6 0l9.4-9.4c.4-.5.4-1.2 0-1.6z" fill="#F05032"/>
    </svg>
  )
}

export function GithubIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

export function TypeScriptIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill="#3178C6"/>
      <path d="M14 10h-3.5v8H9v-8H5.5V8.5H14V10z" fill="white"/>
      <path d="M15 14.5c0 .8.6 1.2 1.5 1.2.8 0 1.3-.3 1.3-.9 0-.7-.5-.9-1.5-1.2-1.5-.4-2.3-1-2.3-2.2 0-1.3 1-2.1 2.5-2.1 1.6 0 2.5.8 2.5 2.1h-1.5c0-.7-.4-1-1-1s-1 .3-1 .8c0 .5.4.8 1.3 1 1.6.5 2.5 1.1 2.5 2.4 0 1.4-1.1 2.2-2.8 2.2-1.8 0-2.8-.9-2.8-2.3H15z" fill="white"/>
    </svg>
  )
}

export function PythonIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 2C8 2 7 3.5 7 5v2h5v1H5.5C3.5 8 2 9.5 2 12s1.5 4 3.5 4H7v-2.5C7 11 8 10 11.5 10H16V5c0-1.5-1-3-4.5-3zM10 5.5a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB"/>
      <path d="M12.5 22c3.5 0 4.5-1.5 4.5-3v-2h-5v-1h6.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H17v2.5C17 13 16 14 12.5 14H8v5c0 1.5 1 3 4.5 3zM14 18.5a1 1 0 110-2 1 1 0 010 2z" fill="#FFD43B"/>
    </svg>
  )
}

export function LangChainIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="6" height="8" rx="2" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="1.2"/>
      <rect x="9" y="5" width="6" height="8" rx="2" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="1.2"/>
      <rect x="16" y="8" width="6" height="8" rx="2" fill="#1C3C3C" stroke="#2DD4BF" strokeWidth="1.2"/>
      <path d="M8 12h1M15 9h1" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function PostmanIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FF6C37"/>
      <path d="M7 12h7M11 9l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7.5" cy="12" r="1" fill="white"/>
    </svg>
  )
}

export function LeetCodeIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 3L7 10.5M7 10.5L13.5 18M7 10.5h10" stroke="#FFA116" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 14h4M16 14h4" stroke="#FFA116" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

export function LinkedInIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export function HibernateIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#BCAE79"/>
      <path d="M7 17V7M17 17V7M7 12h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function JWTIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#D63AFF" opacity="0.8"/>
      <text x="12" y="15" textAnchor="middle" fontSize="4.5" fontFamily="monospace" fontWeight="bold" fill="white">JWT</text>
    </svg>
  )
}

// Platform icons for coding profiles
export function GFGIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#2F8D46"/>
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontFamily="Arial" fontWeight="bold" fill="white">GFG</text>
    </svg>
  )
}

export function CodeChefIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#5B4638"/>
      <path d="M12 5c-2 0-3.5 1.5-3.5 3.5 0 1 .4 2 1 2.5-1 .5-2 1.5-2 3 0 2.2 2 4 4.5 4s4.5-1.8 4.5-4c0-1.5-1-2.5-2-3 .6-.5 1-1.5 1-2.5C15.5 6.5 14 5 12 5z" fill="#FFF" opacity="0.9"/>
    </svg>
  )
}

// Map tech name to icon component
const TECH_ICON_MAP: Record<string, React.FC<IconProps>> = {
  'Java': JavaIcon,
  'Spring Boot': SpringBootIcon,
  'React': ReactIcon,
  'ReactJS': ReactIcon,
  'Angular': AngularIcon,
  'Node.js': NodeJsIcon,
  'NodeJS': NodeJsIcon,
  'MongoDB': MongoDBIcon,
  'MySQL': MySQLIcon,
  'Docker': DockerIcon,
  'AWS': AWSIcon,
  'Git': GitIcon,
  'GitHub': GithubIcon,
  'TypeScript': TypeScriptIcon,
  'Python': PythonIcon,
  'LangChain': LangChainIcon,
  'LangGraph': LangChainIcon,
  'Postman': PostmanIcon,
  'Hibernate': HibernateIcon,
  'JWT': JWTIcon,
  'LeetCode': LeetCodeIcon,
  'LinkedIn': LinkedInIcon,
  'CodeChef': CodeChefIcon,
  'GFG': GFGIcon,
}

export function getTechIcon(name: string, size = 20) {
  const Icon = TECH_ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} />
}

export { TECH_ICON_MAP }
