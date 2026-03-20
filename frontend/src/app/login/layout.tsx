import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | GENESIS 2026",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
