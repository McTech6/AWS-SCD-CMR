import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--electric)] bg-[var(--panel)] font-mono font-semibold text-[var(--text-1)] ring-2 ring-[var(--border)]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? name ?? "Avatar"}
          fill
          unoptimized={src.includes('ui-avatars.com')}
          className="object-cover"
        />
      ) : (
        <span>{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  )
);
Avatar.displayName = "Avatar";

export { Avatar };
