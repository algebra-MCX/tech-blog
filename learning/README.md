# Independent learning site

The learning site is an Astro application in `learning/`. It imports the shared layout, fonts and styles from `../src`.

From the repository root:

```sh
npm ci
npm --prefix learning ci
node scripts/preview-sites.mjs
```

The production website publishes this app under `/learning/` in the [unified build](../README.md#website-build). Its public base and canonical origin are set by that build.
