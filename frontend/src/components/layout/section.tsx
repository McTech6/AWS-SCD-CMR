import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Comp = "section", ...props }, ref) => (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        "mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12",
        className
      )}
      {...props}
    />
  )
);
Section.displayName = "Section";

export { Section };
