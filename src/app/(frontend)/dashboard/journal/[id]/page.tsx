import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UpdatePost } from "@/features/journal/components/update";

interface UpdatePostPageProps {
  params: {
    id: string;
  };
}

export default function UpdatePostPage({ params }: UpdatePostPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/journal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground">
            Update your blog post content and settings
          </p>
        </div>
      </div>

      <UpdatePost postId={params.id} />
    </div>
  );
}
