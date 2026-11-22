import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
const base = process.env.PUBLIC_UNIFIED_SITE === 'true' ? '/learning/' : '/';

export default defineConfig({
  publicDir: '../public',
  integrations: [sitemap({
    filter: page => new URL(page).pathname !== base + 'guides/'
  })],
  base,
  outDir: process.env.SITE_OUTPUT || './dist',
  cacheDir:'./.astro/cache',
  site: process.env.SITE_URL || 'https://learning-preview.invalid',
  markdown: {
    remarkPlugins:[remarkMath],rehypePlugins:[rehypeKatex],
    shikiConfig:{themes:{light:'github-light',dark:'github-dark'},wrap:true}
  },
  vite:{server:{fs:{allow:['..']}}}
});
