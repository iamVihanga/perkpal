import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreatePost } from "@/features/journal/components/create";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

export default function NewPostPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Create new Post"
          description="Write and publish a new blog post"
          actionComponent={
            <Button asChild icon={<ArrowLeft />} variant={"outline"}>
              <Link href="/dashboard/journal">Go Back</Link>
            </Button>
          }
        />

        <Separator />

        <CreatePost />
      </div>
    </PageContainer>
  );
}
