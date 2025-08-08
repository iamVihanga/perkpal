import React from "react";
import { SchoolIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted/10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <SchoolIcon className="size-4" />
          </div>
          <span className="font-heading text-primary/90 font-bold h-4 flex items-center gap-1">
            CodeVille
            <Separator orientation="vertical" />
            <span className="font-normal">Org</span>
          </span>
        </a>
        {children}
      </div>
    </div>
  );
}
