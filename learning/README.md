# Independent learning site

A separate Astro application in `learning/`, sharing the research site's layout, fonts and glass style from `../src`. Introductory guides and bilingual text remain under `learning/src/content`.

From the repository root:

```sh
npm ci
npm --prefix learning ci
npm --prefix learning run build
node scripts/preview-sites.mjs
```

For production, use a separate Vercel project rooted at the repository root, build `npm ci && npm --prefix learning ci && npm --prefix learning run build`, output `learning/dist`. This includes the shared files and independent dependency lock. Set `SITE_URL` to the public learning origin. Both sites use `PUBLIC_HOMEPAGE_URL` for the personal homepage link, which defaults to https://algebra-mcx.github.io/.

Old research-blog guide URLs remain available until the independent learning site is public and its replacement routes have been verified. Keep the research reading guide at `/guides/how-to-read/`.

The learning Vercel configuration is repository-root based. After approval, select it with `vercel --local-config learning/vercel.json`; do not deploy the root research configuration to the learning project. Project identities must be resolved before any deployment.
