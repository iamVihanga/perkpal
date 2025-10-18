"use client";

import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  className?: string;
};

export function Navbar({ className }: Props) {
  const pathname = usePathname();

  return (
    <div className={cn("w-full bg-accent-green py-4", className)}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-amber-200 font-bold text-xl font-palo">
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link, index) => (
            <Link
              href={link.slug}
              key={index}
              className={cn(
                "text-amber-100 hover:text-amber-300 text-base tracking-wide transition-colors duration-100 ease-in-out font-palo font-light",
                pathname === link.slug && "text-amber-200 font-semibold"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Button
          className="bg-amber-400 hover:bg-amber-200 text-accent-green hover:text-accent-green rounded-lg"
          asChild
        >
          <Link href="/perks">Browse Perks</Link>
        </Button>
      </div>
    </div>
  );
}
