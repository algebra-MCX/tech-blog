import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    titleZh: z.string(),
    description: z.string(),
    descriptionZh: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().int().positive(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    eyebrow: z.string().optional(),
    eyebrowZh: z.string().optional()
  })
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    titleZh: z.string(),
    publishDate: z.coerce.date(),
    topic: z.string(),
    topicZh: z.string(),
    draft: z.boolean().default(false)
  })
});

export const collections = { writing, notes };
