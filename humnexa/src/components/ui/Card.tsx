"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

const paddingClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({ children, className, padding = "md", hover = false, onClick, header, footer }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-brand-border-light bg-brand-card-light text-brand-text-light dark:border-brand-border-dark dark:bg-brand-card-dark dark:text-brand-text-dark",
        paddingClasses[padding],
        hover && "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {header ? <div className="mb-3">{header}</div> : null}
      {children}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
