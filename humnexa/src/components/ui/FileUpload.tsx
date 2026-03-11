"use client";

import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, UploadCloud } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface FileUploadProps {
  accept?: string[];
  maxSize: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ accept = [], maxSize, multiple = false, onUpload, className }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const acceptText = useMemo(() => (accept.length ? accept.join(",") : undefined), [accept]);

  const validateFiles = (files: File[]) => {
    for (const file of files) {
      if (accept.length && !accept.includes(file.type)) {
        return `Unsupported file type: ${file.name}`;
      }
      if (file.size > maxSize) {
        return `${file.name} exceeds ${formatBytes(maxSize)} limit`;
      }
    }
    return "";
  };

  const handleFileSelection = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const files = Array.from(incoming);
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSelectedFiles(files);
    onUpload(files);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-border-light p-4 text-center transition dark:border-brand-border-dark",
          dragging
            ? "border-brand-primary bg-brand-primary/10"
            : "hover:border-brand-primary hover:bg-brand-primary/5",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFileSelection(event.dataTransfer.files);
        }}
      >
        <UploadCloud className="mb-2 h-8 w-8 text-brand-primary" aria-hidden="true" />
        <p className="text-sm font-medium text-brand-text-light dark:text-brand-text-dark">
          Drag and drop files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-brand-text-secondary">Max file size: {formatBytes(maxSize)}</p>
        <input
          type="file"
          className="sr-only"
          multiple={multiple}
          accept={acceptText}
          aria-label="Upload file"
          onChange={(event) => handleFileSelection(event.target.files)}
        />
      </label>

      {error ? <p className="text-xs text-error">{error}</p> : null}

      {selectedFiles.length ? (
        <ul className="space-y-2">
          {selectedFiles.map((file) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : "";
            return (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-3 rounded-lg border border-brand-border-light bg-brand-card-light p-2 dark:border-brand-border-dark dark:bg-brand-card-dark"
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt={file.name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                  <div className="rounded-md bg-brand-primary/10 p-2 text-brand-primary">
                    {file.type.includes("image") ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-text-light dark:text-brand-text-dark">{file.name}</p>
                  <p className="text-xs text-brand-text-secondary">{formatBytes(file.size)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
