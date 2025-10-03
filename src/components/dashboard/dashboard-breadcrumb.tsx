"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "../ui/breadcrumb";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const pathList = pathname.slice(1).split("/");

  const pathListFormatted = pathname
    .slice(1)
    .split("/")
    .map((path) => path.charAt(0).toUpperCase() + path.slice(1));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink
            href={`/${pathList[0]}`}
            className={cn(
              "text-sm font-medium transition-colors",
              pathList.length === 1 ? "dark:text-white text-black" : ""
            )}
          >
            {pathListFormatted[0]}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathList.length > 1 &&
          pathList.slice(1).map((path, index) => (
            <div key={index} className="flex items-center gap-2">
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${pathList[0]}/${path}`}
                  className={
                    pathList.length === index + 2
                      ? "dark:text-white text-black"
                      : ""
                  }
                >
                  {pathListFormatted[index + 1]}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
