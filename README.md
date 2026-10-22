# MCX systems notebook

Chenxi Ma’s technical blog, built with Astro. A quiet article list, rounded typography, soft blue backgrounds, and a transparent glass navigation match the personal homepage at https://algebra-mcx.github.io/. English is the default, with Chinese and dark-mode toggles.

## Run locally

```sh
npm install
npm run dev
```

Production validation:

```sh
npm run build
npm run preview
```

## Content

- Long-form writing: `src/content/writing/`
- Short notes: `src/content/notes/`
- Project metadata: `src/data/projects.ts`
- Site/contact metadata: `src/data/site.ts` via `.env`
- Shared design tokens: `src/styles/global.css`
- Shared navigation interactions: `src/scripts/glass.js`
- Blog: https://tech-blog-chi.vercel.app/

Writing supports Markdown and MDX, syntax highlighting, KaTeX math, Mermaid diagrams, responsive tables, and breakout figures. Set `draft: true` in frontmatter to exclude an entry from routes, archives, RSS, and the sitemap.

## Required personalization

Copy `.env.example` to `.env` and replace the example domain, social URLs, and email address. Search the content for `TODO` before publishing: benchmark details, hardware, contribution status, biography, and profiler captures were deliberately not invented.

The default canonical domain is `https://tech-blog-chi.vercel.app`; override it with `SITE_URL` only when changing the deployment domain.
