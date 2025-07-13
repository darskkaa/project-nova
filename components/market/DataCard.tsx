import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  isLoading?: boolean;
  className?: string;
}

export function DataCard({
  title,
  value,
  change,
  prefix = "",
  suffix = "",
  isLoading = false,
  className = "",
}: DataCardProps) {
  const isPositive = change ? change > 0 : null;
  const isNeutral = change === 0 || change === undefined;

  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <div className="mt-1 flex items-baseline">
          <span className="text-2xl font-semibold">
            {prefix}
            {value}
            {suffix}
          </span>
          {!isNeutral && (
            <span
              className={cn(
                "ml-2 flex items-center text-sm font-medium",
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <ArrowUp className="mr-0.5 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-0.5 h-4 w-4" />
              )}
              {Math.abs(change || 0).toFixed(2)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
