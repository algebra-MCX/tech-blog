import {writingEvidence,evidenceLabels} from '@/data/evidence';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { noteMap } from '@/data/library';

export async function GET(context: { site: URL }) {
  const writing = await getCollection('writing', ({ data }) => !data.draft);
  const guides = await getCollection('guides', ({ data }) => !data.draft);
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).filter(n => noteMap[n.id]?.noteCategory);
  const base = import.meta.env.BASE_URL;
  const posts = [
    ...writing.map(post => ({ title: `[${evidenceLabels[writingEvidence(post.id)].en}] ${post.data.title}`, description: post.data.description, pubDate: post.data.publishDate, link: `${base}writing/${post.id}/` })),
    ...guides.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `${base}guides/${post.id}/` })),
    ...notes.map(post => ({ title: post.data.title, description: post.data.topic, pubDate: post.data.publishDate, link: `${base}notes/${post.id}/` }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: 'Chenxi Ma — Projects, Guides & Notes',
    description: 'Algorithms, data and infrastructure: project notebooks, practical guides and technical judgment.',
    site: context.site,
    items: posts
  });
}
