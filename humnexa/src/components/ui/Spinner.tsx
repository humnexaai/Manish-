import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export function Spinner({ size = "md", color = "#FF6B2C", className }: SpinnerProps) {
  return (
    <span
      className={cn("inline-block animate-spin rounded-full border-solid border-r-transparent", sizeMap[size], className)}
      style={{ borderColor: `${color} transparent ${color} ${color}` }}
      aria-label="Loading"
    />
  );
}
