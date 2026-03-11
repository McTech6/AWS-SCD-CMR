import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Gradient rule: transparent → electric → transparent
 */
interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, vertical, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        vertical
          ? "w-px h-full bg-gradient-to-b from-transparent via-[var(--border)] to-transparent"
          : "h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent",
        className
      )}
      {...props}
    />
  )
);
Divider.displayName = "Divider";

export { Divider };
