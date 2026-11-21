# AI Systems Learning Hub

Separate Astro application within the tech-blog repository, matching the research blog's visual design. All English/Chinese guides are copied and maintainable independently.

## Run

From the learning directory:

    npm install
    npm run build
    npm run dev

## Vercel deployment

Import the repository algebra-MCX/tech-blog as a NEW Vercel project.
Set Root Directory to learning and Framework to Astro.
Set PUBLIC_SITE_URL to the actual published new domain.
Optionally set PUBLIC_MAIN_BLOG_URL=https://tech-blog-chi.vercel.app

After verifying the learning site, set PUBLIC_LEARNING_URL in the existing blog's Vercel project to the new site's verified URL.
The original main-site guide links are intentionally preserved until the second site is deployed.

## Scope

The learning site contains curated bilingual guides and quickstarts, not a copy of the research posts. Original external references remain linked. Do not mirror unlicensed third-party source material.
