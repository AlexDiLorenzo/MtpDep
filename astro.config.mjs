import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://montpellierdepannage.com',
  trailingSlash: 'ignore',
  compressHTML: true,
  integrations: [
    sitemap({
      // Exclut les pages internes du sitemap public.
      filter: (page) => !page.includes('/pilotage'),
    }),
  ],
});
