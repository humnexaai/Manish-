import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-brand-primary/15 text-brand-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
  info: "bg-info/15 text-info",
  outline:
    "border border-brand-border-light bg-transparent text-brand-text-light dark:border-brand-border-dark dark:text-brand-text-dark",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({ text, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full font-medium", variantClasses[variant], sizeClasses[size], className)}
    >
      {text}
    </span>
  );
}
