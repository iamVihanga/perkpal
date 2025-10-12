import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JournalTable from "@/features/journal/components/listing";
import { JournalTableActions } from "@/features/journal/components/journal-table/journal-table-actions";

export default function ManageJournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Link href="/dashboard/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <div className="flex items-center space-x-4">
            <JournalTableActions />
          </div>
        </CardHeader>
        <CardContent>
          <JournalTable />
        </CardContent>
      </Card>
    </div>
  );
}
