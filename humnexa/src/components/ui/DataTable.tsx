"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import { SkeletonParagraph } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface DataTableColumn<T extends Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  searchable?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
  emptyMessage = "No records found.",
  loading = false,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    let next = [...data];
    if (query) {
      const q = query.toLowerCase();
      next = next.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
    }
    if (sortBy) {
      next.sort((a, b) => {
        const aValue = String(a[sortBy] ?? "");
        const bValue = String(b[sortBy] ?? "");
        const result = aValue.localeCompare(bValue, undefined, { numeric: true });
        return direction === "asc" ? result : -result;
      });
    }
    return next;
  }, [data, query, sortBy, direction]);

  return (
    <div className={cn("space-y-3", className)}>
      {searchable ? (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-secondary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search table..."
            aria-label="Search table rows"
            className="w-full rounded-lg border border-brand-border-light bg-white py-2 pl-9 pr-3 text-sm outline-none focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-brand-border-dark dark:bg-brand-card-dark"
          />
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-brand-border-light dark:border-brand-border-dark">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-brand-card-light dark:bg-brand-card-dark">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="border-b border-brand-border-light px-4 py-3 text-left font-semibold dark:border-brand-border-dark">
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                      onClick={() => {
                        if (sortBy === column.key) {
                          setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                        } else {
                          setSortBy(column.key);
                          setDirection("asc");
                        }
                      }}
                    >
                      {column.label}
                      <ArrowDownUp className="h-3.5 w-3.5 text-brand-text-secondary" aria-hidden="true" />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <SkeletonParagraph />
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((row, idx) => (
                <tr key={idx} className="border-b border-brand-border-light transition hover:bg-brand-card-light/60 dark:border-brand-border-dark dark:hover:bg-brand-card-dark/60">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-brand-text-light dark:text-brand-text-dark">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-brand-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
