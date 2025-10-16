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

Well, previous developments are all done, this one is a new development...

- I need to prepare these pages in frontend landing page side (Which requires more SEO presence etc.)

* /perks — listing, global filters
* /perks/:category-slug — shows subcategories + perks under them
* /perks/:category-slug/:perk-slug — detail page

This perks nextjs path directory should be inside here: "src\app\(frontend)\(landing)"

And it should follow the best SEO and Nextjs best practices, Some of them I already have implemented in attached files.

And also I need this requirement related to perks listing feature also,
Which one is,

- JSON-LD schema support for each perks, My client requested basically,

"Product/Offer schema for perks (price not required; include
availability/validity)."

This is a sample code demonstrate brief idea about that,

---

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Your function to fetch perk data
async function getPerk(category: string, slug: string) {
// Fetch from your database
const perk = await db.perk.findUnique({
where: { slug, category },
include: { vendor: true, category: true }
});

if (!perk) return null;
return perk;
}

// Generate JSON-LD schema
function generatePerkSchema(perk: any) {
return {
'@context': 'https://schema.org',
'@type': 'Offer',
name: perk.title,
description: perk.shortDescription,
url: `https://yourdomain.com/perks/${perk.category.slug}/${perk.slug}`,
offeredBy: {
'@type': 'Organization',
name: perk.vendorName,
logo: perk.logoUrl
},
availability: perk.status === 'Active'
? 'https://schema.org/InStock'
: 'https://schema.org/OutOfStock',
...(perk.startDate && { validFrom: perk.startDate }),
...(perk.endDate && { validThrough: perk.endDate }),
...(perk.bannerUrl && { image: perk.bannerUrl })
};
}

// Metadata function (runs server-side)
export async function generateMetadata({
params
}: {
params: { category: string; slug: string }
}): Promise<Metadata> {
const perk = await getPerk(params.category, params.slug);

if (!perk) return {};

const schema = generatePerkSchema(perk);

return {
title: perk.seoTitle || perk.title,
description: perk.metaDescription || perk.shortDescription,
openGraph: {
title: perk.seoTitle || perk.title,
description: perk.metaDescription || perk.shortDescription,
images: perk.ogImage || perk.bannerUrl,
type: 'website',
},
// JSON-LD Schema
other: {
'script:ld+json': JSON.stringify(schema)
}
};
}

// Page component
export default async function PerkDetailPage({
params
}: {
params: { category: string; slug: string }
}) {
const perk = await getPerk(params.category, params.slug);

if (!perk) notFound();

return (
<div>
{/_ Your perk detail UI _/}
<h1>{perk.title}</h1>
{/_ ... rest of your content _/}
</div>
);
}

---

And make me those pages in wireframe design, I can apply the styles manually later.

- It must use server side rpc client as I done in current landing page pattern.
