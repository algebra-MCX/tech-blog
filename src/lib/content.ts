import type { CollectionEntry } from 'astro:content';

export const byNewest = <T extends { data: { publishDate: Date } }>(a: T, b: T) =>
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf();

export const formatDate = (date: Date, style: 'short' | 'long' = 'short') =>
  new Intl.DateTimeFormat('en-US', style === 'long'
    ? { month: 'long', day: '2-digit', year: 'numeric' }
    : { month: 'short', day: '2-digit', year: 'numeric' }
  ).format(date);

export const formatCompactDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(date);

export type WritingEntry = CollectionEntry<'writing'>;
