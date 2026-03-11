import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-[var(--panel)] text-[var(--text-2)] border border-[var(--border)]",
  success: "bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30",
  warning: "bg-[var(--warning)]/20 text-[var(--warning)] border border-[var(--warning)]/30",
  error: "bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)]/30",
  outline:
    "bg-transparent text-[var(--text-2)] border border-[var(--border)]",
  electric:
    "bg-[var(--electric)]/20 text-[var(--electric-light)] border border-[var(--electric)]/30",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-0.5 text-xs font-mono font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
