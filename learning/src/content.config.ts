import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(), titleZh: z.string(), description: z.string(), descriptionZh: z.string(),
    publishDate: z.coerce.date(),
    category: z.enum(['concepts', 'quickstarts', 'playbooks', 'learning-paths']),
    domains: z.array(z.enum(['algorithms','data','infra'])),
    tags: z.array(z.string()).default([]), draft: z.boolean().default(false)
  })
});
const guidesZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides-zh' }),
  schema: z.object({ source: z.string() })
});
export const collections = {guides, guidesZh};
