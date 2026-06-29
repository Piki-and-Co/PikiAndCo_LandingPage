import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://piki-and-co.com',
  output: 'static',
  integrations: [sitemap()],
});
