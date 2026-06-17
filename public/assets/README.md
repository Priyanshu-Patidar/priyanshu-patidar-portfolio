# 📁 Media & Asset Management Guide

This file tells you exactly **where to drop files** and **which code file controls what**.
You should never need to touch `.tsx` files just to swap an image — only edit this folder
or the small "data" files listed below.

---

## 🗂️ Folder Structure

```
public/assets/
├── favicon.svg                          ← Browser tab icon (already done)
├── images/
│   ├── portfolio/
│   │   ├── profile.webp                 ← YOUR PROFILE PHOTO (hero circular image)
│   │   └── og-image.svg                 ← Social share preview (LinkedIn/Twitter)
│   ├── projects/
│   │   ├── ai-resume-analyzer/          ← AI Resume Analyzer screenshots
│   │   │   ├── ai-resume-analyzer-1.webp
│   │   │   ├── ai-resume-analyzer-2.webp
│   │   │   ├── ai-resume-analyzer-3.webp
│   │   │   ├── ai-resume-analyzer-4.webp
│   │   │   └── ai-resume-analyzer-5.webp
│   │   ├── smart-parking/               ← SmartCar Parking System screenshots
│   │   │   ├── smart-parking-1.webp ... smart-parking-5.webp
│   │   ├── ecommerce/                   ← Flickart E-Commerce screenshots
│   │   │   ├── ecommerce-1.webp ... ecommerce-5.webp
│   │   ├── employee-portal/             ← Smart Employee Portal (.NET) screenshots
│   │   │   ├── employee-portal-1.webp ... employee-portal-5.webp
│   │   ├── uber-analysis/                ← Uber Data Analysis screenshots
│   │   │   ├── uber-analysis-1.webp ... uber-analysis-5.webp
│   │   └── parkinsons-prediction/        ← Parkinson's Prediction screenshots
│   │       ├── parkinsons-prediction-1.webp ... parkinsons-prediction-5.webp
│   ├── certificates/                     ← Real certificate images
│   │   ├── ibm-data-science.jpg
│   │   ├── ibm-machine-learning.jpg
│   │   └── acmegrade-internship.jpg
│   ├── logos/                            ← Company/org logos (CDAC, Acmegrade, IBM)
│   ├── icons/                            ← Any extra custom icons
│   └── architecture/                     ← (Optional) static architecture images,
│                                            if you ever want to replace the built-in SVGs
├── resume/
│   └── Priyanshu_Patidar_Resume.pdf      ← YOUR RESUME PDF
└── videos/                                ← (Optional) intro/demo videos
```

---

## ✅ Naming Convention (REQUIRED)

Each project folder uses: `{project-slug}-{1 to 5}.webp`

| Project | Slug | Files |
|---|---|---|
| AI Resume Analyzer | `ai-resume-analyzer` | `ai-resume-analyzer-1.webp` … `-5.webp` |
| SmartCar Parking | `smart-parking` | `smart-parking-1.webp` … `-5.webp` |
| Flickart E-Commerce | `ecommerce` | `ecommerce-1.webp` … `-5.webp` |
| Smart Employee Portal | `employee-portal` | `employee-portal-1.webp` … `-5.webp` |
| Uber Data Analysis | `uber-analysis` | `uber-analysis-1.webp` … `-5.webp` |
| Parkinson's Prediction | `parkinsons-prediction` | `parkinsons-prediction-1.webp` … `-5.webp` |

**Just drop files with these exact names into the matching folder — no code changes needed.**
The first image (`-1.webp`) is automatically used as the card thumbnail too.
If a file is missing, the gallery shows "Project Screenshots Coming Soon" — nothing breaks.

---

## 🛠️ Which Code File Controls What

| What you want to change | File to edit |
|---|---|
| Project descriptions, tech stack, features, challenges, impact, GitHub/Live links | `src/data/projects.ts` |
| Screenshot paths (only if you rename folders/files) | `src/data/projects.ts` → `screenshots: [...]` array per project |
| Architecture diagrams (the SVG system diagrams in each project modal) | `src/components/ui/ArchitectureDiagrams.tsx` |
| Personal info, email, phone, social links, resume path, profile photo path | `src/data/constants.ts` |
| Skills & proficiency levels | `src/data/skills.ts` |
| Experience / Education / Certifications | `src/data/experience.ts` |
| Achievement timeline | `src/data/constants.ts` → `ACHIEVEMENT_TIMELINE` |
| Visitor counter / project view counter logic | `src/hooks/index.ts` → `useVisitorCount`, `useProjectViews` |
| Navbar links | `src/data/constants.ts` → `NAV_ITEMS` |
| EmailJS configuration (Service ID, Template IDs, Public Key) | `src/data/constants.ts` → `EMAILJS_CONFIG` |

---

## 🖼️ Profile Photo & Resume — Quick Start

1. Drop your photo at: `public/assets/images/portfolio/profile.webp`
2. Drop your resume at: `public/assets/resume/Priyanshu_Patidar_Resume.pdf`

Both paths are already wired in `src/data/constants.ts` — no code change needed.

---

## 🏅 Certificates

Drop real certificate images into `public/assets/images/certificates/`:
- `ibm-data-science.jpg`
- `ibm-machine-learning.jpg`
- `acmegrade-internship.jpg`

Until added, an SVG placeholder certificate renders automatically with a "View Certificate" modal.

---

## 👁 View Counters

- **Portfolio Views** (Hero badge) and **Project Views** (inside each project modal) use
  [CountAPI](https://countapi.xyz) — a free, no-signup hit-counter API.
- They persist permanently and increment once per visitor session.
- If CountAPI is ever unreachable, the counters fall back to `localStorage` so the UI
  never breaks — numbers simply won't sync across devices in that case.
- No environment variables or backend setup required — works immediately on Vercel.

---

## 🚀 Vercel Deployment

1. Push this project to a GitHub repo.
2. Import the repo on [vercel.com](https://vercel.com) → it auto-detects Vite.
3. `vercel.json` (already included) sets build command, caching headers, and SPA rewrites.
4. No environment variables required for default functionality.
5. Build command: `npm run build` · Output directory: `dist`

---

## 🔌 LeetCode Stats API (Server-Side)

LeetCode statistics are fetched via a **Vercel Serverless Function** at `/api/leetcode` (`api/leetcode.ts`), which calls the official `leetcode.com/graphql` endpoint server-side — the browser never talks to LeetCode directly, avoiding CORS entirely.

- **Endpoint**: `/api/leetcode` (GET, no params — username is hardcoded server-side)
- **Caching**: 1-hour in-memory cache on the server + `Cache-Control` header for edge/browser caching + client-side localStorage cache as a third layer
- **Fallback chain**: live GraphQL call → stale server cache → stale client cache → static known-good values (UI never shows broken/empty stats)
- **Local development**: `npm run dev` automatically serves `/api/leetcode` via a Vite dev-middleware (see `vite.config.ts`) — no need to run `vercel dev` separately
- **To change the LeetCode username**: edit `LEETCODE_USERNAME` in `api/leetcode.ts`
- **Refresh button**: the Stats section includes a manual refresh button that bypasses the client cache and re-fetches from `/api/leetcode`
