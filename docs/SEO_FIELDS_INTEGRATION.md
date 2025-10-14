# PerkPal CMS - SEO Fields Integration

## Database Schema SEO Fields

Each page in the database contains the following SEO fields:

```sql
-- From pages table
seo_title TEXT,                    -- Custom SEO title (overrides page title)
seo_description TEXT,              -- Meta description for search engines
og_image_id TEXT                   -- References media.id for Open Graph image
```

## How SEO Fields Are Used

### 1. Page Metadata Generation

The `generatePageMetadata()` function prioritizes SEO fields:

```typescript
// Priority order for title
const title = page.seoTitle || page.title || defaultTitle || "PerkPal";

// Priority order for description
const description = page.seoDescription || "Default description...";

// Open Graph image from database
const ogImage = page.ogImage; // Populated via relation
```

### 2. Structured Data (JSON-LD)

SEO fields are used in structured data for search engines:

```typescript
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": page.seoTitle || page.title,
  "description": page.seoDescription,
  "image": page.ogImage ? { url: page.ogImage.url } : undefined
}
```

### 3. Page Display

- **Page Title**: Shows `seoTitle` if available, otherwise falls back to `title`
- **Page Description**: Shows `seoDescription` if available
- **Open Graph**: Uses `ogImage` for social media sharing

## Admin Interface Integration

### Creating/Updating Pages

When creating or updating pages through the admin interface:

```typescript
// Example page creation payload
{
  title: "About Us",
  slug: "about",
  seoTitle: "About PerkPal - Company Information",
  seoDescription: "Learn about PerkPal's mission to bring you amazing perks and deals.",
  og_image_id: "uuid-of-uploaded-image",
  status: "published"
}
```

### Media Management

The `og_image_id` references the `media` table:

```sql
-- Media table structure
id TEXT PRIMARY KEY,
url TEXT,                          -- Image URL
filename TEXT,
seo_title TEXT,                   -- Alt text for image
seo_description TEXT              -- Image description
```

## Frontend Implementation

### 1. Static Pages

All static pages automatically use SEO fields:

```tsx
// Automatically generates metadata from database SEO fields
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData("/about");
  return generatePageMetadata(pageData, "About Us - PerkPal");
}
```

### 2. Dynamic Content

Page content respects SEO field priorities:

```tsx
// Page header uses SEO title if available
<h1>{pageData.seoTitle || pageData.title}</h1>;

// Meta description in page header
{
  pageData.seoDescription && <p>{pageData.seoDescription}</p>;
}
```

## SEO Best Practices Implemented

### 1. Title Optimization

- Use `seoTitle` for search-optimized titles
- Fallback to page `title` if no SEO title set
- Keep titles under 60 characters

### 2. Meta Descriptions

- Use `seoDescription` for compelling descriptions
- Keep descriptions 120-160 characters
- Include target keywords naturally

### 3. Open Graph Images

- Use `og_image_id` to reference optimized images
- Recommended size: 1200x630 pixels
- Automatically included in social media previews

### 4. Structured Data

- Automatic JSON-LD generation
- Uses SEO fields for enhanced search appearance
- Includes publication/modification dates

## Example: Complete Page SEO Setup

```typescript
// 1. Create page with SEO fields in admin
const pageData = {
  title: "Privacy Policy",
  slug: "privacy-policy",
  seoTitle: "Privacy Policy - How PerkPal Protects Your Data",
  seoDescription:
    "Read PerkPal's comprehensive privacy policy. Learn how we collect, use, and protect your personal information.",
  og_image_id: "privacy-og-image-uuid",
  status: "published"
};

// 2. Automatic metadata generation
// Title: "Privacy Policy - How PerkPal Protects Your Data"
// Description: "Read PerkPal's comprehensive privacy policy..."
// OG Image: Shows uploaded image in social previews

// 3. Structured data includes all SEO fields
// 4. Page displays optimized title and description
```

## SEO Field Validation

The Zod schemas ensure proper validation:

```typescript
seoTitle: z.string().nullable(),        // Optional, can be null
seoDescription: z.string().nullable(),  // Optional, can be null
og_image_id: z.string().nullable()      // Optional, references media.id
```

## Performance Benefits

1. **Server-Side Generation**: All SEO data fetched server-side
2. **Caching**: Page data cached for performance
3. **Static Generation**: Pages can be statically generated with SEO data
4. **Optimized Images**: OG images optimized through media system

This integration ensures every page has complete SEO optimization while maintaining flexibility for content managers to customize SEO fields per page.
