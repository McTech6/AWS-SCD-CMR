import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--electric)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] motion-btn disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--electric)] text-white hover:bg-[var(--electric-light)] hover:shadow-[var(--shadow-glow)]",
        ghost:
          "text-[var(--text-1)] hover:bg-white/5 hover:text-white",
        outline:
          "border border-[var(--border)] bg-transparent hover:bg-white/5 hover:border-[var(--electric)]",
        ember:
          "bg-[var(--ember)] text-white hover:opacity-90 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]",
        danger:
          "bg-[var(--error)] text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        xs: "h-7 px-2 text-[10px]",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
