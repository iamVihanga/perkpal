"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetRecentSubmissions } from "../queries/use-get-recent-submissions";

interface RecentSubmissionsProps {
  limit?: number;
}

export function RecentSubmissions({ limit = 5 }: RecentSubmissionsProps) {
  const { data, isLoading, error } = useGetRecentSubmissions({ limit });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load recent submissions: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Loading recent lead submissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="animate-pulse bg-muted h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="animate-pulse bg-muted h-4 w-3/4 rounded" />
                  <div className="animate-pulse bg-muted h-3 w-1/2 rounded" />
                </div>
                <div className="animate-pulse bg-muted h-6 w-16 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>
          Latest lead submissions from your perks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent submissions found
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((submission) => (
              <div key={submission.id} className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {submission.perkTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.submittedAt), {
                      addSuffix: true
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(submission.data).length} fields
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a
                      href={`/dashboard/leads?perk=${submission.perkSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">View lead details</span>
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {data && data.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/leads">View all submissions</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
