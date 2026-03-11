import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = "#FF6B2C",
  size = "md",
  className,
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const percent = (safeValue / max) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full overflow-hidden rounded-full bg-brand-border-light dark:bg-brand-border-dark", sizeMap[size])}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={safeValue}
          role="progressbar"
        />
      </div>
      {showLabel ? <p className="mt-1 text-right text-xs text-brand-text-secondary">{Math.round(percent)}%</p> : null}
    </div>
  );
}
