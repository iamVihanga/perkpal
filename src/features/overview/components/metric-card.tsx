import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  description?: string;
  period?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  change = 0,
  trend = "neutral",
  description,
  period,
  isLoading = false
}: MetricCardProps) {
  const formatChange = (changeValue: number) => {
    const prefix = changeValue > 0 ? "+" : "";
    return `${prefix}${changeValue.toFixed(1)}%`;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <IconTrendingUp className="size-3" />;
      case "down":
        return <IconTrendingDown className="size-3" />;
      default:
        return <IconMinus className="size-3" />;
    }
  };

  const getTrendVariant = () => {
    switch (trend) {
      case "up":
        return "default";
      case "down":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <Card className="min-h-[160px]">
        <CardHeader>
          <CardDescription className="animate-pulse bg-muted h-4 w-24 rounded" />
          <CardTitle className="animate-pulse bg-muted h-8 w-32 rounded" />
          <CardAction>
            <div className="animate-pulse bg-muted h-6 w-16 rounded" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="animate-pulse bg-muted h-4 w-40 rounded" />
          <div className="animate-pulse bg-muted h-4 w-32 rounded" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="min-h-[160px] from-primary/5 to-card bg-gradient-to-t shadow-sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums lg:text-3xl">
          {typeof value === "number" ? value.toLocaleString() : value}
        </CardTitle>
        <CardAction>
          <Badge variant={getTrendVariant()}>
            {getTrendIcon()}
            {formatChange(change)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium items-center">
          {trend === "up" && "Trending up"}
          {trend === "down" && "Trending down"}
          {trend === "neutral" && "No change"}
          {period && ` this ${period}`}
          {getTrendIcon()}
        </div>
        {description && (
          <div className="text-muted-foreground line-clamp-2">
            {description}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
