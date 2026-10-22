# MCX systems notebook

Chenxi Ma’s technical blog, built with Astro. Project notebooks, practical guides and technical perspectives across algorithms, data and infrastructure. Rounded typography, soft blue backgrounds and liquid glass match https://algebra-mcx.github.io/. English is the default, with Chinese and dark-mode toggles.

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

- Project articles (original URLs retained): `src/content/writing/`
- Guides and translations: `src/content/guides/`, `src/content/guides-zh/`
- Perspectives and legacy technical notes: `src/content/notes/`
- Project metadata: `src/data/projects.ts`
- Article ownership, sections and note categories: `src/data/library.ts`
- Site/contact metadata: `src/data/site.ts` via `.env`
- Shared design tokens: `src/styles/global.css`
- Shared navigation interactions: `src/scripts/glass.js`
- Blog: https://tech-blog-chi.vercel.app/

Writing supports Markdown and MDX, syntax highlighting, KaTeX math, Mermaid diagrams, responsive tables, and breakout figures. Set `draft: true` in frontmatter to exclude an entry from routes, archives, RSS, and the sitemap.

## Adjust the structure

Navigation is Home / Projects / Guides / Notes. Home returns to the personal homepage (including bilingual resumes); the wordmark returns to the blog index. Legacy About URLs redirect to the personal homepage. Search indexes both languages and filters by type, project and domain. The small brand avatar is optimized into 32/64px WebP assets at build time.

Each project has Overview, Start Here and Resources. Experiments, Debugging and Design appear when they contain entries or repository documents. Add a project in `projects.ts`, then assign articles in `writingMap` or legacy notes in `noteMap`. Repository links describe study/research context, not an implied upstream contribution.

Guides use `category: concepts | quickstarts | playbooks | learning-paths` and applicable `domains: [algorithms, data, infra]`. Chinese entries use `source: <English entry id>`. Python quickstarts require only the standard library.

Notes use `noteTopic: research | learning | investing | life | personal-finance` and `noteCategory: perspectives | decisions | questions` in `noteMap`. Personal notes need no project assignment. Omit `noteCategory` for a technical investigation that belongs inside a project. Existing URLs remain available. Update outline status only when the underlying evidence is ready. Reading times are computed from actual text.

The pinned homepage reading guide is `src/content/guides/how-to-read.md`, with its Chinese translation in `guides-zh/how-to-read.md`.

## Required personalization

Copy `.env.example` to `.env` and replace the example domain, social URLs, and email address. Search the content for `TODO` before publishing: benchmark details, hardware, contribution status, biography, and profiler captures were deliberately not invented.

The default canonical domain is `https://tech-blog-chi.vercel.app`; override it with `SITE_URL` only when changing the deployment domain.
