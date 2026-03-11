"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-2xl",
};

const dotSizeMap: Record<AvatarSize, string> = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
};

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  const initial = (name || "H").charAt(0).toUpperCase();

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full border border-brand-border-light bg-brand-primary/20 text-brand-text-light dark:border-brand-border-dark dark:text-brand-text-dark",
          sizeMap[size],
        )}
        aria-label={`${name} avatar`}
      >
        {src ? (
          <Image src={src} alt={name} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-primary font-semibold text-white">
            {initial}
          </div>
        )}
      </div>
      {status ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-brand-bg-dark",
            dotSizeMap[size],
            status === "online" ? "bg-success" : "bg-gray-400",
          )}
          aria-label={status}
        />
      ) : null}
    </div>
  );
}
