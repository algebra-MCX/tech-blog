import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { noteMap } from '@/data/library';

export async function GET(context: { site: URL }) {
  const writing = await getCollection('writing', ({ data }) => !data.draft);
  const guides = await getCollection('guides', ({ data }) => !data.draft);
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).filter(n => noteMap[n.id]?.noteCategory);
  const posts = [
    ...writing.map(post => ({ title: `[Working outline] ${post.data.title}`, description: post.data.description, pubDate: post.data.publishDate, link: `/writing/${post.id}/` })),
    ...guides.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/guides/${post.id}/` })),
    ...notes.map(post => ({ title: post.data.title, description: post.data.topic, pubDate: post.data.publishDate, link: `/notes/${post.id}/` }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  return rss({
    title: 'Chenxi Ma — Projects, Guides & Notes',
    description: 'Algorithms, data and infrastructure: project notebooks, practical guides and technical judgment.',
    site: context.site,
    items: posts
  });
}
