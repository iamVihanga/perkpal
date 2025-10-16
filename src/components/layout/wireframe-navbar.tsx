import React from "react";
import Link from "next/link";

interface WireframeNavbarProps {
  currentPage?: string;
}

export function WireframeNavbar({ currentPage }: WireframeNavbarProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms-of-service", label: "Terms" },
    { href: "/privacy-policy", label: "Privacy" }
  ];

  return (
    <nav className="bg-white border-b border-gray-300 p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="font-bold text-lg">
          <Link href="/">PerkPal</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm px-2 py-1 rounded border ${
                currentPage === item.href.slice(1) ||
                (currentPage === "landing" && item.href === "/")
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
