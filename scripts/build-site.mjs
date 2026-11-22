import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parse, serialize } from 'parse5';

const origin = new URL(process.env.SITE_URL || 'https://tech-blog-chi.vercel.app').origin;
const output = resolve('dist');
const sections = [
  { name: 'blog', cwd: process.cwd() },
  { name: 'learning', cwd: resolve('learning') }
];

function namespaceUrl(value, section, globalLink) {
  const legacyHomepage = 'https://algebra-mcx.github.io';
  if (value === legacyHomepage || value.startsWith(legacyHomepage + '/')) {
    return value.slice(legacyHomepage.length) || '/';
  }
  if (globalLink || !value.startsWith('/') || value.startsWith('//') ||
      value === `/${section}` || value.startsWith(`/${section}/`)) return value;
  return `/${section}${value}`;
}

async function namespacePages(directory, section) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await namespacePages(path, section);
    } else if (entry.name.endsWith('.html')) {
      const document = parse(await readFile(path, 'utf8'));
      const visit = node => {
        const attributes = node.attrs ?? [];
        const globalLink = attributes.some(attribute => attribute.name === 'data-cross-site');
        for (const attribute of attributes) {
          if (['href', 'src', 'action', 'poster'].includes(attribute.name)) {
            attribute.value = namespaceUrl(attribute.value, section, globalLink);
          } else if (attribute.name === 'srcset' && !attribute.value.includes('data:')) {
            attribute.value = attribute.value.split(',').map(candidate =>
              candidate.trim().replace(/^\S+/, url => namespaceUrl(url, section, globalLink))
            ).join(', ');
          }
        }
        node.childNodes?.forEach(visit);
      };
      visit(document);
      await writeFile(path, serialize(document));
    }
  }
}

const staging = await mkdtemp(join(tmpdir(), 'chenxi-site-'));
try {
  const assembled = join(staging, 'site');
  await mkdir(assembled);
  for (const section of sections) {
    const destination = join(assembled, section.name);
    const build = spawnSync('npm', ['run', 'build'], {
      cwd: section.cwd,
      stdio: 'inherit',
      env: { ...process.env, SITE_URL: origin, SITE_OUTPUT: destination, PUBLIC_UNIFIED_SITE: 'true' }
    });
    if (build.status !== 0) throw build.error ?? new Error(`The ${section.name} build failed.`);
    await namespacePages(destination, section.name);
  }
  await cp('homepage', assembled, { recursive: true });
  const homepage = join(assembled, 'index.html');
  await writeFile(homepage, (await readFile(homepage, 'utf8')).replaceAll('__SITE_ORIGIN__', origin));
  const sitemapParts = ['sitemap-home.xml'];
  for (const section of sections) {
    const files = await readdir(join(assembled, section.name));
    sitemapParts.push(...files.filter(file => /^sitemap-\d+\.xml$/.test(file)).map(file => `${section.name}/${file}`));
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
  await writeFile(join(assembled, 'sitemap-home.xml'), `${xml}<urlset xmlns="${namespace}"><url><loc>${origin}/</loc></url></urlset>\n`);
  await writeFile(join(assembled, 'sitemap.xml'), `${xml}<sitemapindex xmlns="${namespace}">${sitemapParts.map(path => `<sitemap><loc>${origin}/${path}</loc></sitemap>`).join('')}</sitemapindex>\n`);
  await writeFile(join(assembled, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await cp(join(assembled, 'blog', '404.html'), join(assembled, '404.html'));
  await cp(join(assembled, 'blog', 'favicon.svg'), join(assembled, 'favicon.svg'));
  await rm(output, { recursive: true, force: true });
  try {
    await rename(assembled, output);
  } catch (error) {
    if (error.code !== 'EXDEV') throw error;
    await cp(assembled, output, { recursive: true });
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}
