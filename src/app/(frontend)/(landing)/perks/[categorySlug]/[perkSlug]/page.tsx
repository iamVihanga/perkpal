import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
// import { CldImage } from "next-cloudinary";
import { ImageIcon, MapPin, Calendar, ExternalLink, Clock } from "lucide-react";
import { getClient } from "@/lib/rpc/server";
import {
  generatePerkSchema,
  generatePerkBreadcrumbSchema
} from "@/lib/seo/perk-schema";

import { Badge } from "@/components/ui/badge";
import { WireframeNavbar } from "@/components/wireframes/wireframe-navbar";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";

// ISR: Revalidate every 1 hour for perk details
export const revalidate = 3600;

// Disable static generation for now due to RPC client using cookies
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    categorySlug: string;
    perkSlug: string;
  }>;
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
                <div className="relative w-full h-64 bg-gray-200 border border-gray-300 rounded overflow-hidden">
                  {perk.bannerImage?.publicId || perk.bannerImage?.url ? (
                    <IDImageViewer
                      url={perk.bannerImage?.url}
                      width={600}
                      className="w-full h-full object-cover"
                      height={400}
                      alt={perk.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-sm">No Image Available</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vendor Logo */}
                {perk.logoImage &&
                  (perk.logoImage.publicId || perk.logoImage.url) && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="relative w-12 h-12 bg-white border border-gray-200 rounded overflow-hidden flex-shrink-0">
                        <IDImageViewer
                          url={perk.logoImage.url}
                          alt={`${perk.vendorName} logo`}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {perk.vendorName}
                        </div>
                        <div className="text-xs text-gray-500">Vendor</div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Perk Details */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Title and Status */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {perk.title}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        variant={
                          perk.status === "active" ? "default" : "destructive"
                        }
                        className="text-sm"
                      >
                        {perk.status}
                      </Badge>
                      {perk.location && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          {perk.location}
                        </Badge>
                      )}
                      {perk.isFeatured && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Featured
                        </Badge>
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
                      <Badge variant="outline" asChild>
                        <Link
                          href={`/perks/${perk.category.slug}`}
                          className="hover:bg-blue-50"
                        >
                          Category: {perk.category.name}
                        </Link>
                      </Badge>
                    )}
                    {perk.subcategory && (
                      <Badge variant="outline" asChild>
                        <Link
                          href={`/perks/${categorySlug}?subcategoryId=${perk.subcategory.id}`}
                          className="hover:bg-green-50"
                        >
                          {perk.subcategory.name}
                        </Link>
                      </Badge>
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
              <div className="border border-gray-300 p-4 rounded bg-gradient-to-br from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  How to Redeem
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm">
                      {perk.redemptionMethod?.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {perk.redemptionMethod === "affiliate_link" &&
                    perk.affiliateLink && (
                      <div className="bg-white p-4 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              Visit Partner Website
                            </p>
                            <p className="text-sm text-gray-600">
                              Click the link below to access this offer
                            </p>
                          </div>
                          <Link
                            href={perk.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Get Offer
                          </Link>
                        </div>
                      </div>
                    )}

                  {perk.redemptionMethod === "coupon_code" &&
                    perk.couponCode && (
                      <div className="bg-white p-4 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              Use Coupon Code
                            </p>
                            <p className="text-sm text-gray-600">
                              Copy this code and use it at checkout
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-2 bg-gray-100 rounded font-mono text-lg font-bold">
                              {perk.couponCode}
                            </code>
                            <span className="text-sm text-gray-500">
                              Click to copy
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  {perk.redemptionMethod === "form_submission" && (
                    <div className="bg-white p-4 rounded border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">
                            Fill Submission Form
                          </p>
                          <p className="text-sm text-gray-600">
                            Complete the form to access this offer
                          </p>
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Fill Form
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="border border-gray-300 p-4 rounded bg-white">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  {perk.redemptionMethod === "form_submission" && (
                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Fill Submission Form
                    </button>
                  )}
                  {perk.redemptionMethod === "affiliate_link" &&
                    perk.affiliateLink && (
                      <Link
                        href={perk.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Get This Offer
                      </Link>
                    )}
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors">
                    Share This Perk
                  </button>
                </div>
              </div>

              {/* Location & Availability */}
              <div className="border border-gray-300 p-4 rounded bg-white">
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="space-y-3">
                  {perk.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{perk.location}</span>
                    </div>
                  )}

                  {(perk.startDate || perk.endDate) && (
                    <div className="space-y-2">
                      {perk.startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            Valid from:{" "}
                            {new Date(perk.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {perk.endDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            Valid until:{" "}
                            {new Date(perk.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
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
