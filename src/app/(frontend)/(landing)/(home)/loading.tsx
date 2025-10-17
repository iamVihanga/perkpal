import { SITE_NAME } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="w-full h-screen bg-accent-green flex items-center justify-center absolute top-0 left-0 z-60">
      <div className="relative flex items-center justify-center size-96">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-palo font-black text-amber-200">
            {SITE_NAME}
          </h1>
        </div>

        <Loader2
          className="size-full text-amber-200 animate-spin absolute top-0 left-0"
          strokeWidth={0.1}
        />
      </div>
    </div>
  );
}
