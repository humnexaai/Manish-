import { cn } from "@/lib/utils";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

export function Skeleton({ width, height, rounded = true, className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-brand-card-light via-brand-border-light to-brand-card-light dark:from-brand-card-dark dark:via-brand-border-dark dark:to-brand-card-dark",
        rounded ? "rounded-md" : "rounded-none",
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText() {
  return <Skeleton height={14} className="w-full" />;
}

export function SkeletonAvatar() {
  return <Skeleton width={40} height={40} className="rounded-full" />;
}

export function SkeletonCard() {
  return <Skeleton height={120} className="w-full rounded-xl" />;
}

export function SkeletonParagraph() {
  return (
    <div className="space-y-2">
      <SkeletonText />
      <SkeletonText />
      <SkeletonText />
    </div>
  );
}
