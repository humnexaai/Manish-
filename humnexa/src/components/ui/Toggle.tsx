"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md";
  className?: string;
}

export function Toggle({ label, checked, onChange, size = "md", className }: ToggleProps) {
  const dimensions = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumbSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const translate = checked ? (size === "sm" ? "translate-x-4" : "translate-x-5") : "translate-x-0";

  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? "Toggle"}
        className={cn(
          "relative rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40",
          dimensions,
          checked ? "bg-brand-primary" : "bg-gray-300 dark:bg-gray-700",
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform duration-200",
            thumbSize,
            translate,
          )}
        />
      </button>
      {label ? <span className="text-sm text-brand-text-light dark:text-brand-text-dark">{label}</span> : null}
    </label>
  );
}
