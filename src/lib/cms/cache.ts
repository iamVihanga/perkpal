import { getPageData, PageWithContent } from "./page-data";

// In-memory cache for page data (in production, you'd use Redis or similar)
const pageCache = new Map<
  string,
  { data: PageWithContent; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedPageData(
  slug: string
): Promise<PageWithContent | null> {
  const cacheKey = `page:${slug}`;
  const cached = pageCache.get(cacheKey);

  // Check if cache is valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Fetch fresh data
  const data = await getPageData(slug);

  if (data) {
    pageCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  return data;
}

export function invalidatePageCache(slug?: string) {
  if (slug) {
    pageCache.delete(`page:${slug}`);
  } else {
    pageCache.clear();
  }
}

// Preload common pages
export async function preloadPages() {
  const commonSlugs = ["/", "about", "contact", "faq"];

  await Promise.all(commonSlugs.map((slug) => getCachedPageData(slug)));
}
