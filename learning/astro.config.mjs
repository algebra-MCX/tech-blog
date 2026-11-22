import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
const base = process.env.PUBLIC_UNIFIED_SITE === 'true' ? '/learning/' : '/';

export default defineConfig({
  publicDir: '../public',
  integrations: [sitemap({
    filter: page => !['/guides/', '/guides/how-to-read/'].includes(
      new URL(page).pathname.slice(base.length - 1)
    )
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
