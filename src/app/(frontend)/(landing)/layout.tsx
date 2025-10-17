import { Navbar } from "@/modules/layouts/components/navbar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function LandingLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-amber-50">
      <Navbar />
      {children}
    </main>
  );
}
