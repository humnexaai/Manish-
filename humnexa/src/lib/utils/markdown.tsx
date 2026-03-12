"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy } from "lucide-react";
import { copyToClipboard } from "./index";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";

function CodeBlock({ className, children }: { className?: string; children: ReactNode }) {
  const text = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "text";
  const lines = useMemo(() => text.split("\n"), [text]);

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-brand-border-light dark:border-brand-border-dark">
      <div className="flex items-center justify-between bg-brand-card-light px-3 py-2 dark:bg-brand-card-dark">
        <span className="text-xs font-medium text-brand-text-secondary">{language}</span>
        <button
          type="button"
          onClick={async () => {
            const copied = await copyToClipboard(text);
            showToast({ variant: copied ? "success" : "error", message: copied ? "Copied!" : "Copy failed" });
          }}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-brand-text-secondary hover:bg-brand-border-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:hover:bg-brand-border-dark/60"
          aria-label="Copy code block"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto bg-brand-bg-dark p-3 text-xs text-brand-text-dark">
        {lines.map((line, index) => (
          <div key={index} className="table-row">
            <span className="table-cell select-none pr-3 text-right text-brand-text-secondary">{index + 1}</span>
            <code className={cn("table-cell", className)}>{line}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-headings:text-brand-text-light dark:prose-headings:text-brand-text-dark prose-a:text-brand-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code(props) {
            const { className, children, ...rest } = props;
            const inline = !className;
            if (inline) {
              return (
                <code className="rounded bg-brand-card-light px-1 py-0.5 text-xs dark:bg-brand-card-dark" {...rest}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className} children={children} />;
          },
          a(props) {
            return (
              <a {...props} className="text-brand-primary underline-offset-2 hover:underline" target="_blank" rel="noreferrer" />
            );
          },
          img(props) {
            return <img {...props} loading="lazy" className="h-auto max-w-full rounded-lg" alt={props.alt || "Image"} />;
          },
          table(props) {
            return <table {...props} className="w-full border-collapse overflow-hidden rounded-lg text-sm" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
