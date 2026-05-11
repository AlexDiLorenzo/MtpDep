import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://montpellierdepannage.com',
  trailingSlash: 'ignore',
  compressHTML: true,
  output: "hybrid",
  adapter: cloudflare()
});