import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | GENESIS 2026",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
