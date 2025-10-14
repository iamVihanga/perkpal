This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- Dev Notes -->

- Milestone 03 - Wrapping up "Perks" CRUD (UI and API) - Phase 01

<!-- Fixes in journal -->

1. Remove update id from use journal table filters - Done
2. Remove IDImageViewer from column, replace it with proper component - Done
3. Refactor listing / new / update pages layout with standard way - Done

- Analyse whole pages / sections / content fields database architecture, zod schemas, api routes and handlers, react queries, listing / creating / deleting / updating / reordering components etc. and all related features.

- then get a brief idea about how I tried to make little CMS type of content management system here.

- And have a in deep analyse into nextjs app router pages in (frontend) route group. in site-settings path, Im using every admin related management components to manage these contents.

And I need from you to prepare static pages in nextjs standard app router pages with proper RSC - React server components & nextjs server side data fetching best practices with helpof contents in my database.
you must use src/lib/rpc/server/index.ts file's server side rpc client to fetch cms data.

- And you must keep focus on render those pages / sections and every content fields in landing and other static pages in SEO optimized way. Im highly demand page performance and SEO optimizations here.
