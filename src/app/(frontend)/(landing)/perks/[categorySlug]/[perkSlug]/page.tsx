import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WireframeNavbar } from "@/components/layout/wireframe-navbar";
import { getClient } from "@/lib/rpc/server";
import {
  generatePerkSchema,
  generatePerkBreadcrumbSchema
} from "@/lib/seo/perk-schema";

// ISR: Revalidate every 1 hour for perk details
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    categorySlug: string;
    perkSlug: string;
  }>;
}

// Generate static params for perks
export async function generateStaticParams({
  params
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  try {
    const rpcClient = await getClient();

    // First, get the category to get its ID
    const categoriesResponse = await rpcClient.api.categories.$get({
      query: { limit: "100" }
    });

    if (!categoriesResponse.ok) {
      return [];
    }

    const { categorySlug } = await params;
    const categoriesData = await categoriesResponse.json();
    const category = categoriesData.data?.find(
      (cat) => cat.slug === categorySlug
    );

    if (!category) {
      return [];
    }

    // Then get perks for this category
    const perksResponse = await rpcClient.api.perks.$get({
      query: {
        categoryId: category.id,
        limit: "100"
      }
    });

    if (!perksResponse.ok) {
      return [];
    }

    const perksData = await perksResponse.json();
    return (
      perksData.data?.map((perk) => ({
        perkSlug: perk.slug
      })) || []
    );
  } catch (error) {
    console.error("Error generating static params for perks:", error);
    return [];
  }
}

// Fetch perk data
async function getPerkData(categorySlug: string, perkSlug: string) {
  try {
    const rpcClient = await getClient();

    // Use the get-one endpoint with slug
    const response = await rpcClient.api.perks["get-one"].$get({
      query: { slug: perkSlug }
    });

    if (!response.ok) {
      return null;
    }

    const perk = await response.json();

    // Verify the perk belongs to the correct category
    if (perk.category?.slug !== categorySlug) {
      return null;
    }

    return perk;
  } catch (error) {
    console.error("Error fetching perk data:", error);
    return null;
  }
}

// Generate metadata for SEO with JSON-LD schema
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { categorySlug, perkSlug } = await params;
  const perk = await getPerkData(categorySlug, perkSlug);

  if (!perk) {
    return {
      title: "Perk Not Found - PerkPal",
      description: "The requested perk could not be found."
    };
  }

  // Generate JSON-LD schema
  const perkSchema = generatePerkSchema(perk);
  const breadcrumbSchema = generatePerkBreadcrumbSchema(perk);

  const title = perk.seoTitle || `${perk.title} - ${perk.vendorName} | PerkPal`;
  const description =
    perk.seoDescription ||
    perk.shortDescription ||
    `Get exclusive ${perk.title} from ${perk.vendorName}. ${
      perk.longDescription || ""
    }`.substring(0, 160);

  return {
    title,
    description,
    keywords: perk.keywords?.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/perks/${categorySlug}/${perkSlug}`,
      siteName: "PerkPal",
      ...(perk.bannerImage?.url && {
        images: [
          {
            url: perk.bannerImage.url,
            width: 1200,
            height: 630,
            alt: perk.title
          }
        ]
      })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(perk.bannerImage?.url && {
        images: [perk.bannerImage.url]
      })
    },
    alternates: {
      canonical: `/perks/${categorySlug}/${perkSlug}`
    },
    // JSON-LD Schema injection
    other: {
      "script:ld+json": JSON.stringify([perkSchema, breadcrumbSchema])
    }
  };
}

export default async function PerkDetailPage({ params }: PageProps) {
  const { categorySlug, perkSlug } = await params;

  try {
    const perk = await getPerkData(categorySlug, perkSlug);

    if (!perk) {
      notFound();
    }

    // Generate structured data
    const perkSchema = generatePerkSchema(perk);
    const breadcrumbSchema = generatePerkBreadcrumbSchema(perk);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Wireframe Navigation */}
        <WireframeNavbar currentPage="perks" />

        <div className="p-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/perks" className="text-blue-600 hover:underline">
              Perks
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              href={`/perks/${categorySlug}`}
              className="text-blue-600 hover:underline"
            >
              {perk.category?.name || "Category"}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{perk.title}</span>
          </nav>

          {/* SEO Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([perkSchema, breadcrumbSchema])
            }}
          />

          {/* Perk Header */}
          <header className="mb-8 border-b pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Perk Image */}
              <div className="lg:col-span-1">
                <div className="w-full h-64 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                  {perk.bannerImage?.url ? (
                    <span className="text-gray-500">Main Perk Image</span>
                  ) : (
                    <span className="text-gray-500">No Image Available</span>
                  )}
                </div>

                {/* Vendor Logo */}
                {perk.logoImage?.url && (
                  <div className="mt-4 w-24 h-16 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">Vendor Logo</span>
                  </div>
                )}
              </div>

              {/* Perk Details */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Title and Status */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {perk.title}
                    </h1>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          perk.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {perk.status}
                      </span>
                      {perk.location && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {perk.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div className="border border-gray-200 p-4 rounded">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Vendor Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {perk.vendorName}
                      </div>
                      {/* Future fields - not yet in schema */}
                      {/* {perk.vendorEmail && (
                        <div>
                          <strong>Email:</strong> {perk.vendorEmail}
                        </div>
                      )}
                      {perk.vendorPhone && (
                        <div>
                          <strong>Phone:</strong> {perk.vendorPhone}
                        </div>
                      )}
                      {perk.vendorWebsite && (
                        <div>
                          <strong>Website:</strong>
                          <a
                            href={perk.vendorWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            {perk.vendorWebsite}
                          </a>
                        </div>
                      )} */}
                    </div>
                  </div>

                  {/* Validity */}
                  {(perk.startDate || perk.endDate) && (
                    <div className="border border-gray-200 p-4 rounded">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Validity Period
                      </h3>
                      <div className="space-y-1 text-sm">
                        {perk.startDate && (
                          <div>
                            <strong>Valid from:</strong>{" "}
                            {new Date(perk.startDate).toLocaleDateString()}
                          </div>
                        )}
                        {perk.endDate && (
                          <div>
                            <strong>Valid until:</strong>{" "}
                            {new Date(perk.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {perk.category && (
                      <Link
                        href={`/perks/${perk.category.slug}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                      >
                        {perk.category.name}
                      </Link>
                    )}
                    {perk.subcategory && (
                      <Link
                        href={`/perks/${categorySlug}?subcategoryId=${perk.subcategory.id}`}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
                      >
                        {perk.subcategory.name}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Perk Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Short Description */}
              {perk.shortDescription && (
                <div className="border border-gray-300 p-4 rounded">
                  <h2 className="text-xl font-semibold mb-3">
                    About This Perk
                  </h2>
                  <p className="text-gray-700 text-lg">
                    {perk.shortDescription}
                  </p>
                </div>
              )}

              {/* Full Description */}
              {perk.longDescription && (
                <div className="border border-gray-300 p-4 rounded">
                  <h2 className="text-xl font-semibold mb-3">Details</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {perk.longDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Redemption Information */}
              <div className="border border-gray-300 p-4 rounded">
                <h2 className="text-xl font-semibold mb-3">How to Redeem</h2>
                <div className="space-y-3">
                  <div>
                    <strong>Method:</strong>{" "}
                    {perk.redemptionMethod?.replace("_", " ").toUpperCase()}
                  </div>

                  {perk.redemptionMethod === "affiliate_link" &&
                    perk.affiliateLink && (
                      <div>
                        <strong>Link:</strong>
                        <a
                          href={perk.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          Visit Offer Page
                        </a>
                      </div>
                    )}

                  {perk.redemptionMethod === "coupon_code" &&
                    perk.couponCode && (
                      <div>
                        <strong>Coupon Code:</strong>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded font-mono">
                          {perk.couponCode}
                        </code>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {perk.redemptionMethod === "form_submission" && (
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Fill Submission Form
                    </button>
                  )}
                  {perk.redemptionMethod === "affiliate_link" &&
                    perk.affiliateLink && (
                      <a
                        href={perk.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-center"
                      >
                        Get This Offer
                      </a>
                    )}
                  <button className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-50">
                    Share This Perk
                  </button>
                </div>
              </div>

              {/* Perk Stats */}
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold mb-3">Perk Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>
                      {perk.createdAt
                        ? new Date(perk.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>
                      {perk.updatedAt
                        ? new Date(perk.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redemption:</span>
                    <span>{perk.redemptionMethod?.replace("_", " ")}</span>
                  </div>
                  {perk.keywords && perk.keywords.length > 0 && (
                    <div>
                      <span className="block mb-1">Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {perk.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-gray-100 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Links */}
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="font-semibold mb-3">Browse More</h3>
                <div className="space-y-2 text-sm">
                  <Link
                    href={`/perks/${categorySlug}`}
                    className="block text-blue-600 hover:underline"
                  >
                    More {perk.category?.name} perks
                  </Link>
                  <Link
                    href="/perks"
                    className="block text-blue-600 hover:underline"
                  >
                    All perks
                  </Link>
                  {perk.vendorName && (
                    <Link
                      href={`/perks?search=${encodeURIComponent(
                        perk.vendorName
                      )}`}
                      className="block text-blue-600 hover:underline"
                    >
                      More from {perk.vendorName}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mt-12 border border-gray-300 p-4 rounded">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <details>
              <summary className="cursor-pointer text-sm text-gray-600">
                View Perk Data
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    id: perk.id,
                    title: perk.title,
                    slug: perk.slug,
                    status: perk.status,
                    vendorName: perk.vendorName,
                    redemptionMethod: perk.redemptionMethod,
                    category: perk.category?.name,
                    subcategory: perk.subcategory?.name,
                    hasFormConfig: !!perk.leadFormConfig,
                    keywords: perk.keywords
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          </div>

          {/* JSON-LD Schema Display */}
          <div className="mt-4 border border-gray-300 p-4 rounded">
            <h3 className="font-semibold mb-2">JSON-LD Schema Preview</h3>
            <details>
              <summary className="cursor-pointer text-sm text-gray-600">
                View Generated Schema
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(perkSchema, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading perk details:", error);

    return (
      <div className="min-h-screen bg-gray-50">
        <WireframeNavbar currentPage="perks" />
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Perk
            </h1>
            <p className="text-gray-600 mb-4">
              There was an error loading the perk details. Please try again
              later.
            </p>
            <div className="space-x-4">
              <Link
                href={`/perks/${categorySlug}`}
                className="text-blue-600 hover:underline"
              >
                Back to Category
              </Link>
              <Link href="/perks" className="text-blue-600 hover:underline">
                Browse All Perks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
