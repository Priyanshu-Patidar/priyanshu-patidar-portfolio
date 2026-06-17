import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only middleware so `npm run dev` also serves /api/leetcode locally,
// matching production behavior on Vercel (which auto-deploys files under
// /api as serverless functions). This avoids needing `vercel dev` just to
// test the LeetCode integration during local development.
function apiDevMiddleware(): Plugin {
  return {
    name: 'local-api-leetcode-dev-middleware',
    apply: 'serve', // dev server only — Vercel handles /api in production
    configureServer(server) {
      server.middlewares.use('/api/leetcode', async (_req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/leetcode.ts')
          const handler = mod.default
          const fakeReq = { method: 'GET', query: {} }
          const fakeRes = {
            status: (code: number) => { res.statusCode = code; return fakeRes },
            setHeader: (name: string, value: string) => res.setHeader(name, value),
            json: (body: unknown) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(body))
            },
          }
          await handler(fakeReq, fakeRes)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local /api/leetcode dev middleware failed', detail: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion', 'gsap'],
        },
      },
    },
  },
})
