import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I will be there | GENESIS 2026",
  robots: "noindex, nofollow",
};

export default function IWillBeThereLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
