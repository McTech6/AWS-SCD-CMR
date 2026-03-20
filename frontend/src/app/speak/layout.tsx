import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speak at GENESIS 2026 | Cameroon",
  description: "Join our roster of speakers at the first AWS Student Community Day in Douala, Cameroon. Share your cloud journey and technical expertise with 500+ builders.",
  openGraph: {
    title: "Apply to Speak | GENESIS 2026 Cameroon",
    description: "Share your cloud journey and expertise at Douala's biggest student cloud summit.",
  },
};

export default function SpeakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
