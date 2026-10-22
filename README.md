# MCX systems notebook

Chenxi Ma’s technical blog, built with Astro. Project notebooks, practical guides and technical perspectives across algorithms, data and infrastructure. Rounded typography, soft blue backgrounds and liquid glass match https://algebra-mcx.github.io/. English is the default, with a Chinese language switch and a fixed dark appearance.

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

Navigation is Start here / Quickstarts / Projects / Notes / Home. The blog root and the personal homepage's blog links open `/guides/how-to-read/`. The concise reading guide uses the same article layout as other guides and focuses on entry points, project reading order and evidence. Home returns to the personal homepage (including the language-aware CV icon); legacy About URLs do the same. Search indexes both languages and filters by type, project and domain. The small brand avatar is optimized into 32/64px WebP assets at build time.

Both sites use a fixed dark appearance. Theme controls and saved/system light-mode preferences are removed; language switching remains available.

Projects and Quickstarts share All / Systems / Algorithms / Hardware / Agents / Data navigation, with All selected by default. Each project has one `primaryCategory`, canonical `technicalTags` and a bilingual `researchContribution`. The shared registry is `src/data/research.ts`. Project relationship remains a compact independent filter: set `kind: own | contributor` in `projects.ts`. See [classification decisions and evidence](docs/research-taxonomy.md) for the migration and featured measurement boundaries. Upstream PR records and their last verified states are in `github-contributions.json`; authoring a proposed PR is distinguished from a merged contribution. PRs live under Code, while Articles retains the project's reading materials.

Repository star badges have a verified static fallback in `github-repositories.json`. They request the current public GitHub repository count when visible, and refresh every five minutes while the page is visible. Successful values are cached locally as a fallback; rate limits or network failures retain an available count. Contribution projects use the upstream repository's stars. No access token is shipped to the browser.

Each project has four fixed navigation links on separate pages: Overview (`/projects/:id/`), Start (`start/`), Articles (`articles/`) and Code (`resources/`). Articles has counted filters for Experiments, Debugging and Design, plus bilingual search. Start links carry `?project=:id` into guides so readers retain their project context and get a next step. Legacy section hashes redirect to their corresponding pages. Add a project in `projects.ts`, then assign articles in `writingMap` or legacy notes in `noteMap`. Repository links describe study/research context, not an implied upstream contribution.

Guides use `category: concepts | quickstarts | playbooks | learning-paths` and applicable `domains: [algorithms, data, infra]`. Chinese entries use `source: <English entry id>`. Quickstarts additionally require a `primaryCategory` and nonempty canonical `technicalTags`, validated by the content schema. The current Python examples require only the standard library.

Notes use `noteTopic: research | learning | investing | life | personal-finance` and `noteCategory: perspectives | decisions | questions` in `noteMap`. Personal notes need no project assignment. Omit `noteCategory` for a technical investigation that belongs inside a project. Existing URLs remain available. Update outline status only when the underlying evidence is ready. Reading times are computed from actual text.

The pinned homepage reading guide is `src/content/guides/how-to-read.md`, with its Chinese translation in `guides-zh/how-to-read.md`.

## Required personalization

Copy `.env.example` to `.env` and replace the example domain, social URLs, and email address. Search the content for `TODO` before publishing: benchmark details, hardware, contribution status, biography, and profiler captures were deliberately not invented.

The default canonical domain is `https://tech-blog-chi.vercel.app`; override it with `SITE_URL` only when changing the deployment domain.
