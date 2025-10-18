/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Generate JSON-LD schema for a single perk following Schema.org Offer specification
 */
export function generatePerkSchema(perk: any) {
  const baseUrl =
    process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://venturenext.io";
  const perkUrl = perk.category?.slug
    ? `${baseUrl}/perks/${perk.category.slug}/${perk.slug}`
    : `${baseUrl}/perks/${perk.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: perk.title,
    description: perk.shortDescription || perk.longDescription,
    url: perkUrl,

    // Vendor/Organization information
    offeredBy: {
      "@type": "Organization",
      name: perk.vendorName,
      ...(perk.logoImage?.url && { logo: perk.logoImage.url })
    },

    // Availability based on status
    availability:
      perk.status === "Active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",

    // Validity dates
    ...(perk.startDate && {
      validFrom: new Date(perk.startDate).toISOString()
    }),
    ...(perk.endDate && { validThrough: new Date(perk.endDate).toISOString() }),

    // Images
    ...(perk.bannerImage?.url && { image: perk.bannerImage.url }),

    // Category information
    ...(perk.category && {
      category: {
        "@type": "Thing",
        name: perk.category.name,
        url: `${baseUrl}/perks/${perk.category.slug}`
      }
    }),

    // Additional perk-specific properties
    ...(perk.location && { areaServed: perk.location }),
    ...(perk.redemptionMethod && {
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "0",
        priceCurrency: "USD"
      }
    }),

    // Keywords for SEO
    ...(perk.keywords && { keywords: perk.keywords.join(", ") })
  };

  return schema;
}

/**
 * Generate JSON-LD schema for a list of perks (ItemList)
 */
export function generatePerksListSchema(
  perks: any[],
  listName: string,
  baseUrl: string = process.env.NEXT_PUBLIC_CLIENT_APP_URL ||
    "https://venturenext.io"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: perks.length,
    itemListElement: perks.map((perk, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: perk.title,
        description: perk.shortDescription || perk.longDescription,
        url: `${baseUrl}/perks/${perk.slug}`,
        offeredBy: {
          "@type": "Organization",
          name: perk.vendorName
        },
        availability:
          perk.status === "Active"
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
      }
    }))
  };
}

/**
 * Generate JSON-LD schema for category page with perks
 */
export function generateCategorySchema(
  category: any,
  perks: any[],
  baseUrl: string = process.env.NEXT_PUBLIC_CLIENT_APP_URL ||
    "https://perkpal.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Perks`,
    description:
      category.description ||
      `Discover amazing ${category.name.toLowerCase()} perks and deals`,
    url: `${baseUrl}/perks/${category.slug}`,

    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Perks`,
      numberOfItems: perks.length,
      itemListElement: perks.map((perk, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: generatePerkSchema(perk)
      }))
    },

    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Perks",
          item: `${baseUrl}/perks`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `${baseUrl}/perks/${category.slug}`
        }
      ]
    }
  };
}

/**
 * Generate breadcrumb schema for perk detail pages
 */
export function generatePerkBreadcrumbSchema(
  perk: any,
  baseUrl: string = process.env.NEXT_PUBLIC_CLIENT_APP_URL ||
    "https://perkpal.com"
) {
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Perks",
      item: `${baseUrl}/perks`
    }
  ];

  if (perk.category) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: perk.category.name,
      item: `${baseUrl}/perks/${perk.category.slug}`
    });

    breadcrumbs.push({
      "@type": "ListItem",
      position: 4,
      name: perk.title,
      item: `${baseUrl}/perks/${perk.category.slug}/${perk.slug}`
    });
  } else {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: perk.title,
      item: `${baseUrl}/perks/${perk.slug}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs
  };
}
