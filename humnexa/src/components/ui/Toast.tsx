"use client";

import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ShowToastOptions {
  message: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

const variantMeta: Record<ToastVariant, { icon: JSX.Element; ring: string }> = {
  success: { icon: <CheckCircle2 className="h-4 w-4 text-success" />, ring: "ring-success/30" },
  error: { icon: <AlertCircle className="h-4 w-4 text-error" />, ring: "ring-error/30" },
  warning: { icon: <TriangleAlert className="h-4 w-4 text-warning" />, ring: "ring-warning/30" },
  info: { icon: <Info className="h-4 w-4 text-info" />, ring: "ring-info/30" },
};

export function showToast({ message, variant = "info", actionLabel, onAction }: ShowToastOptions) {
  const meta = variantMeta[variant];
  toast.custom(
    (t) => (
      <div
        className={`flex min-w-72 items-center gap-3 rounded-lg border border-brand-border-dark bg-brand-card-dark px-3 py-2 text-sm text-brand-text-dark shadow-lg ring-1 ${meta.ring} ${
          t.visible ? "animate-slideRight" : "opacity-0"
        }`}
      >
        {meta.icon}
        <span className="flex-1">{message}</span>
        {actionLabel && onAction ? (
          <button
            type="button"
            className="rounded-md bg-brand-primary/20 px-2 py-1 text-xs text-brand-primary transition hover:bg-brand-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
            onClick={() => {
              onAction();
              toast.dismiss(t.id);
            }}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    ),
    { duration: 3500 },
  );
}
