import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { researchCategoryIds, researchAreaIds, researchAreas, technicalTagIds } from './data/research';

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

const writingZh = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing-zh' }),
  schema: z.object({ source: z.string() })
});

const notesZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes-zh' }),
  schema: z.object({ source: z.string() })
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(), titleZh: z.string(), description: z.string(), descriptionZh: z.string(),
    publishDate: z.coerce.date(),
    category: z.enum(['concepts', 'quickstarts', 'playbooks', 'learning-paths']),
    primaryCategory: z.enum(researchCategoryIds).optional(),
    researchAreas: z.array(z.enum(researchAreaIds)).optional(),
    technicalTags: z.array(z.enum(technicalTagIds)).optional(),
    domains: z.array(z.enum(['algorithms', 'data', 'infra'])),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  }).superRefine((guide, context) => {
    if (guide.category !== 'quickstarts') return;
    if (!guide.primaryCategory) context.addIssue({ code: 'custom', path: ['primaryCategory'], message: 'Quickstarts need one primary research category.' });
    if (!guide.researchAreas?.length || guide.researchAreas.some(id => researchAreas.find(area => area.id === id)?.category !== guide.primaryCategory)) context.addIssue({ code: 'custom', path: ['researchAreas'], message: 'Quickstarts need secondary areas belonging to their primary category.' });
    if (!guide.technicalTags?.length) context.addIssue({ code: 'custom', path: ['technicalTags'], message: 'Quickstarts need canonical technical tags.' });
  })
});
const guidesZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides-zh' }),
  schema: z.object({ source: z.string() })
});

export const collections = { writing, notes, writingZh, notesZh, guides, guidesZh };
