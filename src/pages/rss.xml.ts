import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
  return rss({
    title: 'MCX Writing',
    description: 'Technical writing on AI systems, GPU performance, and distributed inference.',
    site: context.site,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishDate, link: `/writing/${post.id}/` }))
  });
}
