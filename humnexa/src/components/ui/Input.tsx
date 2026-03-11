"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputVariant = "default" | "filled";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: InputVariant;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">
              {leftIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-sm text-brand-text-light outline-none transition-all placeholder:text-brand-text-secondary focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:text-brand-text-dark",
              variant === "filled"
                ? "border-transparent bg-brand-card-light dark:bg-brand-card-dark"
                : "border-brand-border-light bg-white dark:border-brand-border-dark dark:bg-brand-bg-dark/60",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-error focus-visible:ring-error/40 dark:border-error"
                : "focus-visible:border-brand-primary",
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">
              {rightIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-error">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-brand-text-secondary">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
