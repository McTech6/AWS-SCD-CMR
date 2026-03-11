"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      id,
      maxLength,
      showCount = !!maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? React.useId();
    const currentLength = typeof value === "string" ? value.length : 0;

    const countColor =
      maxLength && currentLength >= maxLength
        ? "text-[var(--error)]"
        : maxLength && currentLength >= maxLength * 0.9
          ? "text-[var(--warning)]"
          : "text-[var(--text-3)]";

    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-[var(--text-2)]"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            "w-full min-h-[120px] resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-1)] transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--electric)] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--error)] focus:ring-[var(--error)]",
            className
          )}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          {error && (
            <p className="text-sm text-[var(--error)]" role="alert">
              {error}
            </p>
          )}
          {showCount && maxLength && (
            <span
              className={cn("ml-auto text-xs font-mono", countColor)}
              aria-live="polite"
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
