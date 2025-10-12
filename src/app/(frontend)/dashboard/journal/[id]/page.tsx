import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UpdatePost } from "@/features/journal/components/update";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

interface UpdatePostPageProps {
  params: {
    id: string;
  };
}

export default function UpdatePostPage({ params }: UpdatePostPageProps) {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="View / Update Post"
          description={`View and update post: ${params.id}`}
          actionComponent={
            <Button asChild icon={<ArrowLeft />} variant={"outline"}>
              <Link href="/dashboard/journal">Go Back</Link>
            </Button>
          }
        />

        <Separator />

        <UpdatePost postId={params.id} />
      </div>
    </PageContainer>
  );
}
