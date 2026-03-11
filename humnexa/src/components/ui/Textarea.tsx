"use client";

import { forwardRef, useEffect, useId, useRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxRows?: number;
  minRows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      maxRows = 8,
      minRows = 1,
      className,
      id,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const resize = () => {
      const textarea = internalRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      const computed = window.getComputedStyle(textarea);
      const lineHeight = parseInt(computed.lineHeight || "20", 10);
      const minHeight = minRows * lineHeight + 16;
      const maxHeight = maxRows * lineHeight + 16;
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    useEffect(() => {
      resize();
    }, [value, minRows, maxRows]);

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label htmlFor={textareaId} className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
            {label}
          </label>
        ) : null}
        <textarea
          id={textareaId}
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          rows={minRows}
          className={cn(
            "w-full resize-none rounded-lg border border-brand-border-light bg-white px-3 py-2 text-sm text-brand-text-light outline-none transition-all placeholder:text-brand-text-secondary focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark dark:text-brand-text-dark",
            error && "border-error focus-visible:border-error focus-visible:ring-error/40",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          maxLength={maxLength}
          value={value}
          onChange={(event) => {
            resize();
            onChange?.(event);
          }}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error ? (
            <p id={`${textareaId}-error`} className="text-xs text-error">
              {error}
            </p>
          ) : (
            <span />
          )}
          {typeof maxLength === "number" ? (
            <p className="text-xs text-brand-text-secondary">
              {String(value ?? "").length}/{maxLength}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
