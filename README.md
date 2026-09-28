# MCX systems notebook

An Astro-based personal research site with editorial typography, lightweight mathematical geometry, content collections, dark mode, and minimal client-side JavaScript.

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
- Geometric visual system: `src/components/Geometry.astro`

Writing supports Markdown and MDX, syntax highlighting, KaTeX math, Mermaid diagrams, responsive tables, and breakout figures. Set `draft: true` in frontmatter to exclude an entry from routes, archives, RSS, and the sitemap.

## Required personalization

Copy `.env.example` to `.env` and replace the example domain, social URLs, and email address. Search the content for `TODO` before publishing: benchmark details, hardware, contribution status, biography, and profiler captures were deliberately not invented.

The fallback canonical domain is `https://example.com`; production builds should set `SITE_URL`.
