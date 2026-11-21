import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || undefined,
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }
});
