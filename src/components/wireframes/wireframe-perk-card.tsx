"use client";

import React from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { ImageIcon, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PerkCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  perk: any; // Accept any perk object from API to avoid complex type definitions
}

export function WireframePerkCard({ perk }: PerkCardProps) {
  const categorySlug = perk.category?.slug || "uncategorized";
  const perkUrl = `/perks/${categorySlug}/${perk.slug}`;

  // Get the best available image (banner first, then logo)
  const imageData = perk.bannerImage || perk.logoImage;
  const imagePublicId = imageData?.publicId;
  const imageUrl = imageData?.url;

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRedemptionMethodLabel = (method?: string) => {
    switch (method) {
      case "affiliate_link":
        return "Visit Website";
      case "coupon_code":
        return "Use Code";
      case "form_submission":
        return "Get Details";
      default:
        return "Learn More";
    }
  };

  return (
    <div className="border border-gray-300 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Perk Image */}
      <div className="relative w-full h-48 bg-gray-100">
        {imagePublicId || imageUrl ? (
          <CldImage
            src={imagePublicId || imageUrl || ""}
            alt={perk.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 border border-gray-300">
            <div className="text-center text-gray-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`${getStatusColor(perk.status)} text-xs`}
          >
            {perk.status || "Unknown"}
          </Badge>
        </div>
      </div>

      {/* Perk Content */}
      <div className="p-4 space-y-3">
        {/* Vendor Logo (if different from banner) */}
        {perk.logoImage &&
          perk.bannerImage &&
          perk.logoImage.publicId !== perk.bannerImage.publicId && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded overflow-hidden border border-gray-200">
                <CldImage
                  src={perk.logoImage.publicId || perk.logoImage.url || ""}
                  alt={`${perk.vendorName} logo`}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs text-gray-600">{perk.vendorName}</span>
            </div>
          )}

        {/* Title */}
        <h3 className="font-semibold text-lg leading-tight">
          <Link
            href={perkUrl}
            className="text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {perk.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {perk.shortDescription ||
            (perk.longDescription &&
              perk.longDescription.replace(/<[^>]*>/g, "").substring(0, 100)) ||
            "No description available"}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          {perk.vendorName && (
            <div className="text-xs text-gray-500">
              Vendor: {perk.vendorName}
            </div>
          )}

          {perk.location && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {perk.location}
            </div>
          )}

          {perk.endDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              Valid until: {new Date(perk.endDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Category and Subcategory Tags */}
        <div className="flex flex-wrap gap-1">
          {perk.category && (
            <Link
              href={`/perks/${perk.category.slug}`}
              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
            >
              {perk.category.name}
            </Link>
          )}
          {perk.subcategory && (
            <Link
              href={`/perks/${categorySlug}/${perk.subcategory.slug}`}
              className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 transition-colors"
            >
              {perk.subcategory.name}
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={perkUrl}>View Details</Link>
          </Button>

          {perk.redemptionMethod === "affiliate_link" && perk.affiliateLink && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={perk.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {getRedemptionMethodLabel(perk.redemptionMethod)}
              </Link>
            </Button>
          )}
        </div>

        {/* Coupon Code Display */}
        {perk.redemptionMethod === "coupon_code" && perk.couponCode && (
          <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
            <div className="text-xs text-gray-600 mb-1">Coupon Code:</div>
            <div className="font-mono font-semibold text-sm bg-white px-2 py-1 border border-dashed border-gray-300 rounded">
              {perk.couponCode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
