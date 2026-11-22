import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  publicDir: '../public',
  integrations: [sitemap()],
  cacheDir:'./.astro/cache',
  site: process.env.SITE_URL || 'https://learning-preview.invalid',
  markdown: {
    remarkPlugins:[remarkMath],rehypePlugins:[rehypeKatex],
    shikiConfig:{themes:{light:'github-light',dark:'github-dark'},wrap:true}
  },
  vite:{server:{fs:{allow:['..']}}}
});
