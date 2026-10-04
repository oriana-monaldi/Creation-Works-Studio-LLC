import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { legalDocument, englishLegalDocument } from './src/utils/legalDocument'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const origin = env.VITE_SITE_URL?.replace(/\/$/, '')
  const safeOrigin = origin && /^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(origin) ? origin : ''
  return {
    plugins: [
      react(),
      {
        name: 'creationworks-site-metadata',
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            if (
              ['/terms', '/terms/', '/terms/index.html', '/terms/en', '/terms/en/', '/terms/en/index.html'].includes((request.url || '').split('?')[0])
            ) {
              response.setHeader('Content-Type', 'text/html; charset=utf-8')
              response.end((request.url || '').startsWith('/terms/en') ? englishLegalDocument : legalDocument)
              return
            }
            next()
          })
        },
        transformIndexHtml(html) {
          if (!safeOrigin) return html
          return html
            .replace(
              '</head>',
              `<link rel="canonical" href="${safeOrigin}/"/><meta property="og:url" content="${safeOrigin}/"/></head>`,
            )
            .replace(/content="\/og-image.png"/g, `content="${safeOrigin}/og-image.png"`)
        },
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'terms/index.html', source: legalDocument })
          this.emitFile({ type: 'asset', fileName: 'terms/en/index.html', source: englishLegalDocument })
          this.emitFile({
            type: 'asset',
            fileName: 'robots.txt',
            source: `User-agent: *\nAllow: /\n${safeOrigin ? `Sitemap: ${safeOrigin}/sitemap.xml\n` : ''}`,
          })
          if (safeOrigin)
            this.emitFile({
              type: 'asset',
              fileName: 'sitemap.xml',
              source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${safeOrigin}/</loc></url></urlset>`,
            })
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/gsap/')) return 'animation'
            if (id.includes('/three/build/three.core')) return 'three-core'
            if (id.includes('/three/')) return 'three-webgl'
          },
        },
      },
    },
  }
})
