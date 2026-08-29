import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// Sitio completamente estático: se despliega en Cloudflare Pages sin runtime.
export default defineConfig({
  output: 'static',
  site: 'https://mapa-datacenters-espana.pages.dev',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'directory' },
  vite: {
    build: {
      // El GeoJSON de la red pesa; que no se incruste en el bundle.
      assetsInlineLimit: 0,
    },
  },
})
