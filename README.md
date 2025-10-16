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

<!-- Prompts -->

Analyse how my current project is organized including

- Database Schemas
- Zod Schemas
- API Routes and Handlers
- React-query queries and mutations
- RPC Communication for both serverside and client side data fetching
  etc.

---

Then I need you to do following tasks in order

- Create new API routes and handlers group dedicated to get dashboard analytical data. the folder should be in "src\app\(backend)\routes". It should includes routes.ts, index.ts, handlers.ts like in all other route groups.

- Simultanously create appropiate zod schemas file for help that route group and client side operations as I have done for other entities.

- Prepare all queries & components required for rendering process on dashboard page in path "src\features", new folder called "overview" or "metrics" (any most suitable).

- These are the main overview metrics i need to render on dashboard page,

* Total deals live (Active)
* Number of leads collected (time-range filter)
* Recent submissions / top-performing perks (depends on leads)
* Any other 1 metric you suggest.

- You must use this following metric card for UI.
  "src\components\ui\section-card.tsx" (Customize it according to purpose. but keep UI same as it is)
