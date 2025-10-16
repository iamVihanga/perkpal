"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DashboardMetrics,
  RecentSubmissions,
  TopPerformingPerks
} from "@/features/overview";

export function DashboardOverview() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your perk performance and lead generation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select
            value={period}
            onValueChange={(value: "7d" | "30d" | "90d" | "1y") =>
              setPeriod(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards */}
      <DashboardMetrics period={period} />

      {/* Secondary Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Submissions */}
        <RecentSubmissions limit={5} />

        {/* Top Performing Perks */}
        <TopPerformingPerks period={period} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/perks/new">Create New Perk</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/leads">View All Leads</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/categories">Manage Categories</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
