"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
  },
};

export interface PageWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      className={cn("min-h-screen", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
PageWrapper.displayName = "PageWrapper";

export { PageWrapper };
