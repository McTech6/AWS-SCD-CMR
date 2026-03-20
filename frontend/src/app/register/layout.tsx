import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | GENESIS 2026 Cameroon",
  description: "Secure your spot at the first AWS Student Community Day in Douala, Cameroon. Registration is free for all students. Join us on May 23, 2026.",
  openGraph: {
    title: "Join GENESIS 2026 | AWS Student Community Day",
    description: "Register for the biggest student cloud event in Cameroon.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
