# Research blog and learning site

Both applications keep the existing dark glass design. Their shared global styles are identical.

## Independent deployments

| Site | Root directory | Build | Output |
| --- | --- | --- | --- |
| Research blog | repository root | `npm run build` | `dist` |
| Learning site | `learning` | `npm run build` | `dist` |

Create a second Vercel project from this repository, using `learning` as its Root Directory and Astro as its framework. Use a Node.js version supported by Astro (22 is used in CI). The learning application has its own package manifest, lockfile, Vercel configuration and bilingual content.

Set `PUBLIC_SITE_URL` on the learning project to its verified production origin. Set `PUBLIC_MAIN_BLOG_URL=https://tech-blog-chi.vercel.app`.

Deploy and check the learning homepage, `/guides/how-to-read/`, `/guides/expert-load-imbalance/`, language switching and the link back to research. Then set `PUBLIC_LEARNING_URL` on the research project to the learning site's verified production origin and redeploy research.

Once configured, the main navigation opens the separate site. Existing `/guides/` URLs redirect to the same path on the learning origin. Without the variable, existing guides remain available until migration can be completed, so readers do not encounter broken links. `/about-this-blog/` stays on the research site.

## Content responsibilities

- Research: original engineering, performance reports, open questions, code and evidence. Research outlines remain labeled and can be filtered separately.
- Learning: project-driven introductory paths, minimal experiments, concepts and measurement playbooks. Its introduction is independent from the research blog introduction.

## Local verification

Run `npm ci && npm run build` in each application. Preview the research and learning builds on separate ports. To verify migration locally, build research with `PUBLIC_LEARNING_URL=http://127.0.0.1:4322` and open an old guide URL. It must navigate to the corresponding learning page. Clear the variable for a build that keeps the migration fallback.
