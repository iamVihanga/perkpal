import { Metadata } from "next";
import Link from "next/link";
import { WireframeNavbar } from "@/components/layout/wireframe-navbar";
import { getClient } from "@/lib/rpc/server";
import { generatePerksListSchema } from "@/lib/seo/perk-schema";

// ISR: Revalidate every 30 minutes for perks listing
export const revalidate = 1800;

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  location?: string;
  status?: string;
  redemptionMethod?: string;
  sort?: string;
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { search, categoryId } = await searchParams;

  let title = "All Perks - PerkPal";
  let description =
    "Discover amazing perks and deals from various vendors. Find exclusive offers tailored just for you.";

  if (search) {
    title = `Search: "${search}" - Perks | PerkPal`;
    description = `Search results for "${search}" - Find the best perks and deals matching your search.`;
  }

  if (categoryId) {
    // You could fetch category name here for better SEO
    title = `Category Perks - PerkPal`;
    description = `Explore perks and deals in this category. Find exclusive offers and savings.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/perks`
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    alternates: {
      canonical: "/perks"
    }
  };
}

export default async function PerksPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Parse search params with defaults
  const {
    page = 1,
    limit = 12,
    search = "",
    categoryId = "",
    subcategoryId = "",
    location = "",
    status = "",
    redemptionMethod = "",
    sort = "desc"
  } = await searchParams;

  // Create URL search params object for pagination
  const urlSearchParams = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    categoryId,
    subcategoryId,
    location,
    status,
    redemptionMethod,
    sort
  };

  try {
    // Fetch perks data server-side
    const rpcClient = await getClient();

    const response = await rpcClient.api.perks.$get({
      query: {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(categoryId && { categoryId }),
        ...(subcategoryId && { subcategoryId }),
        ...(location && { location }),
        ...(status && { status }),
        ...(redemptionMethod && { redemptionMethod }),
        sort: sort as "asc" | "desc" | undefined
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch perks");
    }

    const perksData = await response.json();

    // Fetch categories for filters
    const categoriesResponse = await rpcClient.api.categories.$get({
      query: { limit: "100" }
    });

    const categoriesData = categoriesResponse.ok
      ? await categoriesResponse.json()
      : { data: [] };

    // Generate structured data
    const structuredData = generatePerksListSchema(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      perksData.data || ([] as any),
      search ? `Search results for "${search}"` : "All Perks"
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Wireframe Navigation */}
        <WireframeNavbar currentPage="perks" />

        <div className="p-8">
          {/* Page Header */}
          <header className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold">
              {search ? `Search: "${search}"` : "All Perks"}
            </h1>
            <p className="text-gray-600 mt-2">
              Discover amazing perks and deals from various vendors
            </p>

            {/* Breadcrumb */}
            <nav className="mt-4 text-sm">
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Perks</span>
            </nav>
          </header>

          {/* SEO Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />

          {/* Filters Section - Wireframe */}
          <div className="mb-8 border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">Search</label>
                <div className="text-sm text-gray-600">
                  Current: {search || "None"}
                </div>
              </div>

              {/* Category Filter */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <div className="text-sm text-gray-600">
                  {categoriesData.data?.find((c) => c.id === categoryId)
                    ?.name || "All"}
                </div>
              </div>

              {/* Location Filter */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <div className="text-sm text-gray-600">
                  {location || "All Locations"}
                </div>
              </div>

              {/* Status Filter */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="text-sm text-gray-600">{status || "All"}</div>
              </div>

              {/* Sort */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">Sort</label>
                <div className="text-sm text-gray-600">
                  {sort === "asc" ? "Oldest First" : "Newest First"}
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {perksData.data?.length || 0} of{" "}
              {perksData.meta?.totalCount || 0} perks
              {search && ` for "${search}"`}
            </div>
            <div className="text-sm text-gray-600">
              Page {page} of{" "}
              {Math.ceil((perksData.meta?.totalCount || 0) / Number(limit))}
            </div>
          </div>

          {/* Perks Grid - Wireframe */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {perksData.data?.map((perk) => (
              <div key={perk.id} className="border border-gray-300 p-4 rounded">
                {/* Perk Image Placeholder */}
                <div className="w-full h-32 bg-gray-200 border border-gray-300 mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {perk.bannerImage?.url ? "Image" : "No Image"}
                  </span>
                </div>

                {/* Perk Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    <Link
                      href={`/perks/${perk.category?.slug || "uncategorized"}/${
                        perk.slug
                      }`}
                      className="text-blue-600 hover:underline"
                    >
                      {perk.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {perk.shortDescription ||
                      perk.longDescription ||
                      "No description available"}
                  </p>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Vendor: {perk.vendorName}</div>
                    <div>
                      Status:{" "}
                      <span
                        className={
                          perk.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {perk.status}
                      </span>
                    </div>
                    {perk.location && <div>Location: {perk.location}</div>}
                    {perk.endDate && (
                      <div>
                        Valid until:{" "}
                        {new Date(perk.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  {perk.category && (
                    <div className="mt-2">
                      <Link
                        href={`/perks/${perk.category.slug}`}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                      >
                        {perk.category.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(!perksData.data || perksData.data.length === 0) && (
            <div className="text-center py-12 border border-gray-300 rounded">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No perks found
              </h3>
              <p className="text-gray-500">
                {search
                  ? `No perks match your search for "${search}"`
                  : "No perks are currently available with the selected filters"}
              </p>
              {search && (
                <Link
                  href="/perks"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View all perks
                </Link>
              )}
            </div>
          )}

          {/* Pagination - Wireframe */}
          {perksData.meta && perksData.meta.totalCount > Number(limit) && (
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-semibold mb-2">Pagination</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of{" "}
                  {Math.ceil(perksData.meta.totalCount / Number(limit))}
                </div>
                <div className="flex gap-2">
                  {Number(page) > 1 && (
                    <Link
                      href={`/perks?${new URLSearchParams({
                        ...urlSearchParams,
                        page: (Number(page) - 1).toString()
                      }).toString()}`}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      Previous
                    </Link>
                  )}
                  {Number(page) <
                    Math.ceil(perksData.meta.totalCount / Number(limit)) && (
                    <Link
                      href={`/perks?${new URLSearchParams({
                        ...urlSearchParams,
                        page: (Number(page) + 1).toString()
                      }).toString()}`}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-8 border border-gray-300 p-4 rounded">
            <h3 className="font-semibold mb-2">Debug Info</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(
                {
                  searchParams,
                  totalCount: perksData.meta?.totalCount,
                  dataLength: perksData.data?.length
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading perks:", error);

    return (
      <div className="min-h-screen bg-gray-50">
        <WireframeNavbar currentPage="perks" />
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Perks
            </h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the perks. Please try again later.
            </p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
