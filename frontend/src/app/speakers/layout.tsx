import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speakers | GENESIS 2026 Cameroon",
  description: "Meet the industry experts and cloud architects speaking at GENESIS 2026 in Douala, Cameroon.",
  openGraph: {
    title: "GENESIS Speakers | AWS Student Community Day",
    description: "Learn from the architects of the future in Douala.",
  },
};

export default function SpeakersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
