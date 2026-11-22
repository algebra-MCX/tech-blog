# Independent learning site

The learning site is an Astro application in `learning/`. It imports the shared layout, fonts and styles from `../src`.

From the repository root:

```sh
npm ci
npm --prefix learning ci
node scripts/preview-sites.mjs
```

In the existing learning project on Vercel, connect `algebra-MCX/tech-blog` on branch `main`. Set Root Directory to `learning` and enable **Include source files outside of the Root Directory in the Build Step**. The checked-in `learning/vercel.json` installs dependencies and builds to `dist` from that directory.

Set `SITE_URL` in Production to the public learning URL. Both sites use `PUBLIC_HOMEPAGE_URL` for the personal homepage link, which defaults to https://algebra-mcx.github.io/.

Keep existing research-blog guide URLs until the independent learning site is public and its replacement routes have been verified. Keep the research reading guide at `/guides/how-to-read/`.
