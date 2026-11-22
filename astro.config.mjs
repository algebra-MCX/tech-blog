import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const base = process.env.PUBLIC_UNIFIED_SITE === 'true' ? '/blog/' : '/';

export default defineConfig({
  base,
  outDir: process.env.SITE_OUTPUT || './dist',
  cacheDir: './.astro/cache',
  site: process.env.SITE_URL ?? 'https://tech-blog-chi.vercel.app',
  integrations: [mdx(), sitemap({
    filter: page => !['/search/', '/404/'].includes(new URL(page).pathname.slice(base.length - 1))
  })],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true
    }
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }
});
