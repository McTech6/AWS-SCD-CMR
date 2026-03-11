"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();

    return (
      <div className="relative w-full">
        <input
          type={type}
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer h-12 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 pt-4 text-[var(--text-1)] transition-all duration-150",
            "placeholder:text-transparent",
            "focus:outline-none focus:ring-2 focus:ring-[var(--electric)] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--error)] focus:ring-[var(--error)]",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-2)] transition-all duration-150 pointer-events-none",
              "peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--electric)]",
              "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
              error && "text-[var(--error)] peer-focus:text-[var(--error)]"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-[var(--error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
