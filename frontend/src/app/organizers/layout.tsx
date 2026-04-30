import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet the Team | GENESIS 2026 Cameroon",
  description: "The dedicated student leaders and AWS Student Builder Group Leaders organizing the first Student Community Day in Douala, Cameroon.",
  openGraph: {
    title: "GENESIS Organizers | AWS Student Builder Groups Cameroon",
    description: "The student team behind Cameroon's biggest cloud summit.",
  },
};

export default function OrganizersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
