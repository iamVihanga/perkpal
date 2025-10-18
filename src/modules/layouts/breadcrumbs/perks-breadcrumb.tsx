import { useGetCategoryByID } from "@/features/categories/queries/use-get-category-by-id";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  className?: string;
};

export function PerksBreadcrumb({ className }: Props) {
  const pathname = usePathname();

  const isRootPage = pathname === "/perks";

  const isCategoryPage = pathname?.startsWith("/perks/") ?? false;
  const categoryId = isCategoryPage ? pathname.split("/perks/")[1] : null;

  const { data, isPending } = useGetCategoryByID(categoryId || "");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link
        href={`/`}
        className="font-palo text-accent-green/80 hover:text-accent-green hover:underline"
      >
        Home
      </Link>

      <ChevronRight strokeWidth={0.3} className="w-4 h-4 text-accent-green" />

      <Link
        href={`/perks`}
        className={cn(
          "font-palo text-accent-green/80 hover:text-accent-green hover:underline",
          {
            "font-medium text-accent-green": isRootPage
          }
        )}
      >
        Perks
      </Link>

      {!isPending && data && isCategoryPage && (
        <>
          <ChevronRight
            strokeWidth={0.3}
            className="w-4 h-4 text-accent-green"
          />

          <Link
            href={`/perks/${categoryId}`}
            className={cn(
              "font-palo text-accent-green/80 hover:text-accent-green hover:underline",
              {
                "font-medium text-accent-green": isCategoryPage
              }
            )}
          >
            {data.name}
          </Link>
        </>
      )}
    </div>
  );
}
