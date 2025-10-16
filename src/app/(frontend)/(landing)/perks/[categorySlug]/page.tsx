import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WireframeNavbar } from "@/components/layout/wireframe-navbar";
import { getClient } from "@/lib/rpc/server";
import { generateCategorySchema } from "@/lib/seo/perk-schema";

// ISR: Revalidate every 30 minutes
export const revalidate = 1800;

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  subcategoryId?: string;
  location?: string;
  status?: string;
  redemptionMethod?: string;
  sort?: string;
}

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<SearchParams>;
}

// Generate static params for categories
export async function generateStaticParams() {
  try {
    const rpcClient = await getClient();
    const response = await rpcClient.api.categories.$get({
      query: { limit: "100" }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (
      data.data?.map((category) => ({
        categorySlug: category.slug
      })) || []
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Fetch category data
async function getCategoryData(categorySlug: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.categories.$get({
    query: {
      limit: "1",
      search: categorySlug // This might need adjustment based on your API
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data?.find((cat) => cat.slug === categorySlug) || null;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams
}: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryData(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found - PerkPal",
      description: "The requested category could not be found."
    };
  }

  const { search } = await searchParams;

  const title = category.seoTitle || `${category.name} Perks - PerkPal`;
  const description =
    category.seoDescription ||
    `Discover amazing ${category.name.toLowerCase()} perks and deals. ${
      category.description || ""
    }`.trim();

  let finalTitle = title;
  let finalDescription = description;

  if (search) {
    finalTitle = `Search: "${search}" in ${category.name} - PerkPal`;
    finalDescription = `Search results for "${search}" in ${category.name} category.`;
  }

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/perks/${categorySlug}`,
      ...(category.opengraphImage?.url && {
        images: [
          {
            url: category.opengraphImage.url,
            width: 1200,
            height: 630,
            alt: finalTitle
          }
        ]
      })
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      ...(category.opengraphImage?.url && {
        images: [category.opengraphImage.url]
      })
    },
    alternates: {
      canonical: `/perks/${categorySlug}`
    }
  };
}

export default async function CategoryPerksPage({
  params,
  searchParams
}: PageProps) {
  const { categorySlug } = await params;
  const {
    page = "1",
    limit = "12",
    search = "",
    subcategoryId = "",
    location = "",
    status = "",
    redemptionMethod = "",
    sort = "desc"
  } = await searchParams;

  // Create URL search params object for pagination
  const urlSearchParams = {
    page,
    limit,
    search,
    subcategoryId,
    location,
    status,
    redemptionMethod,
    sort
  };

  try {
    // Fetch category data
    const category = await getCategoryData(categorySlug);

    if (!category) {
      notFound();
    }

    const rpcClient = await getClient();

    // Fetch perks for this category
    const perksResponse = await rpcClient.api.perks.$get({
      query: {
        page,
        limit,
        categoryId: category.id,
        ...(search && { search }),
        ...(subcategoryId && { subcategoryId }),
        ...(location && { location }),
        ...(status && { status }),
        ...(redemptionMethod && { redemptionMethod }),
        sort: sort as "asc" | "desc" | undefined
      }
    });

    if (!perksResponse.ok) {
      throw new Error("Failed to fetch perks");
    }

    const perksData = await perksResponse.json();

    // Fetch subcategories for this category
    const subcategoriesResponse = await rpcClient.api.subcategories.$get({
      query: {
        categoryId: category.id,
        limit: "100"
      }
    });

    const subcategoriesData = subcategoriesResponse.ok
      ? await subcategoriesResponse.json()
      : { data: [] };

    // Generate structured data
    const structuredData = generateCategorySchema(
      category,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (perksData.data || []) as any
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Wireframe Navigation */}
        <WireframeNavbar currentPage="perks" />

        <div className="p-8">
          {/* Page Header */}
          <header className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold">
              {search
                ? `Search: "${search}" in ${category.name}`
                : `${category.name} Perks`}
            </h1>
            <p className="text-gray-600 mt-2">
              {category.description ||
                `Discover amazing ${category.name.toLowerCase()} perks and deals`}
            </p>

            {/* Breadcrumb */}
            <nav className="mt-4 text-sm">
              <Link href="/" className="text-blue-600 hover:underline">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/perks" className="text-blue-600 hover:underline">
                Perks
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{category.name}</span>
            </nav>
          </header>

          {/* SEO Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />

          {/* Subcategories Section */}
          {subcategoriesData.data && subcategoriesData.data.length > 0 && (
            <div className="mb-8 border border-gray-300 p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">
                Browse by Subcategory
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {subcategoriesData.data.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/perks/${categorySlug}?subcategoryId=${subcategory.id}`}
                    className={`p-3 border rounded text-sm text-center hover:bg-gray-100 transition-colors ${
                      subcategoryId === subcategory.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium">{subcategory.name}</div>
                    {subcategory.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {subcategory.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filters Section - Wireframe */}
          <div className="mb-8 border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">
                  Search in {category.name}
                </label>
                <div className="text-sm text-gray-600">
                  Current: {search || "None"}
                </div>
              </div>

              {/* Subcategory Filter */}
              {subcategoriesData.data && subcategoriesData.data.length > 0 && (
                <div className="border border-gray-200 p-3 rounded">
                  <label className="block text-sm font-medium mb-1">
                    Subcategory
                  </label>
                  <div className="text-sm text-gray-600">
                    {subcategoriesData.data.find((s) => s.id === subcategoryId)
                      ?.name || "All"}
                  </div>
                </div>
              )}

              {/* Location Filter */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <div className="text-sm text-gray-600">
                  {location || "All Locations"}
                </div>
              </div>

              {/* Sort */}
              <div className="border border-gray-200 p-3 rounded">
                <label className="block text-sm font-medium mb-1">Sort</label>
                <div className="text-sm text-gray-600">
                  {sort === "asc" ? "Oldest First" : "Newest First"}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(search || subcategoryId || location || status) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {search && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Search: {search}
                    </span>
                  )}
                  {subcategoryId && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Subcategory:{" "}
                      {
                        subcategoriesData.data?.find(
                          (s) => s.id === subcategoryId
                        )?.name
                      }
                    </span>
                  )}
                  {location && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Location: {location}
                    </span>
                  )}
                  <Link
                    href={`/perks/${categorySlug}`}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                  >
                    Clear All
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {perksData.data?.length || 0} of{" "}
              {perksData.meta?.totalCount || 0} perks in {category.name}
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
                      href={`/perks/${categorySlug}/${perk.slug}`}
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

                  {/* Subcategory Badge */}
                  {perk.subcategory && (
                    <div className="mt-2">
                      <Link
                        href={`/perks/${categorySlug}?subcategoryId=${perk.subcategory.id}`}
                        className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                      >
                        {perk.subcategory.name}
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
                No perks found in {category.name}
              </h3>
              <p className="text-gray-500">
                {search
                  ? `No perks match your search for "${search}" in this category`
                  : "No perks are currently available in this category with the selected filters"}
              </p>
              <div className="mt-4 space-x-4">
                {search && (
                  <Link
                    href={`/perks/${categorySlug}`}
                    className="text-blue-600 hover:underline"
                  >
                    View all {category.name} perks
                  </Link>
                )}
                <Link href="/perks" className="text-blue-600 hover:underline">
                  Browse all perks
                </Link>
              </div>
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
                      href={`/perks/${categorySlug}?${new URLSearchParams({
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
                      href={`/perks/${categorySlug}?${new URLSearchParams({
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

          {/* Category Info Debug */}
          <div className="mt-8 border border-gray-300 p-4 rounded">
            <h3 className="font-semibold mb-2">Category Debug Info</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(
                {
                  category: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description
                  },
                  searchParams,
                  totalCount: perksData.meta?.totalCount,
                  dataLength: perksData.data?.length,
                  subcategoriesCount: subcategoriesData.data?.length
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
    console.error("Error loading category perks:", error);

    return (
      <div className="min-h-screen bg-gray-50">
        <WireframeNavbar currentPage="perks" />
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Category
            </h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the category perks. Please try again
              later.
            </p>
            <Link href="/perks" className="text-blue-600 hover:underline">
              Browse all perks
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
