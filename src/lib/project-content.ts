import { getCollection } from 'astro:content';
import { type Project, projectContributions } from '@/data/projects';
import { writingMap, noteMap } from '@/data/library';

export const projectViews = [
  { id: 'overview', en: 'Overview', zh: '概览', suffix: '' },
  { id: 'start', en: 'Start', zh: '入门', suffix: 'start/' },
  { id: 'articles', en: 'Articles', zh: '文章', suffix: 'articles/' },
  { id: 'resources', en: 'Code', zh: '代码', suffix: 'resources/' }
] as const;
export type ProjectView = typeof projectViews[number]['id'];
export type ProjectItem = {
  id: string; href: string; title: string; titleZh: string;
  description?: string; descriptionZh?: string;
  kind: string; source: 'outline' | 'repository' | 'pull-request'; state?: string;
};
export async function getProjectContent(project: Project) {
  const [writing, notes, guides] = await Promise.all([
    getCollection('writing', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft)
  ]);
  const originals: ProjectItem[] = project.resources
    .filter(resource => ['experiments', 'debugging', 'design'].includes(resource.section))
    .map(resource => ({ id: resource.url, href: resource.url, title: resource.title, titleZh: resource.titleZh, kind: resource.section, source: 'repository' }));
  const outlines: ProjectItem[] = [
    ...writing.filter(entry => writingMap[entry.id]?.project === project.id)
      .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
      .map(entry => ({ id: entry.id, href: `/writing/${entry.id}/`, title: entry.data.title, titleZh: entry.data.titleZh, description: entry.data.description, descriptionZh: entry.data.descriptionZh, kind: writingMap[entry.id].section ?? 'design', source: 'outline' as const })),
    ...notes.filter(entry => noteMap[entry.id]?.project === project.id && !noteMap[entry.id]?.noteCategory)
      .map(entry => ({ id: entry.id, href: `/notes/${entry.id}/`, title: entry.data.title, titleZh: entry.data.titleZh, kind: noteMap[entry.id].section ?? 'design', source: 'outline' as const }))
  ];
  const starts = project.start.flatMap(id => { const entry = guides.find(guide => guide.id === id); return entry ? [entry] : []; });
  const prs: ProjectItem[] = projectContributions(project).map(pr => ({ id: pr.url, href: pr.url, title: `#${pr.number} · ${pr.title}`, titleZh: `#${pr.number} · ${pr.title}`, kind: 'design', source: 'pull-request', state: pr.state }));
  return { items: [...originals, ...outlines], originals, outlines, starts, prs };
}
