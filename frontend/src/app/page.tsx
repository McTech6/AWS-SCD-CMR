import type { Metadata } from "next";
import { Navbar, Footer, PageWrapper } from "@/components/layout";
import {
  Hero,
  StatsBar,
  About,
  AgendaPreview,
  SpeakersPreview,
  SponsorsSection
} from "@/components/sections/landing";

export const metadata: Metadata = {
  title: "GENESIS | AWS Student Community Day Cameroon 2026",
  description: "Igniting Cameroon's Cloud Journey – The First Student Community Day in Douala. Join 500+ student builders for a full day of cloud innovation.",
  keywords: ["AWS", "AWS Student Community Day", "Cameroon", "Douala", "Cloud Computing", "Student Event", "GENESIS 2026"],
  openGraph: {
    title: "GENESIS: From Campus to Cloud | Douala 2026",
    description: "The premier AWS event for student builders in Cameroon.",
    images: ["https://res.cloudinary.com/dqcsk8r4p/image/upload/v1710940000/genesis_og.png"],
  },
};

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <StatsBar />
        <About />
        <AgendaPreview />
        <SpeakersPreview />
        <SponsorsSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}
