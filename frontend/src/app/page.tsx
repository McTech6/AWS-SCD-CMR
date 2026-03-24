import type { Metadata } from "next";
import { Navbar, Footer, PageWrapper } from "@/components/layout";
import {
  Hero,
  StatsBar,
  About,
  AgendaPreview,
  SpeakersPreview,
  FAQ,
  SponsorsSection
} from "@/components/sections/landing";

export const metadata: Metadata = {
  title: "GENESIS | AWS Student Community Day Cameroon 2026",
  description: "Igniting Cameroon's Cloud Journey – The First Student Community Day in Douala. Join 500+ student builders for a full day of cloud innovation.",
  keywords: ["AWS", "AWS Student Community Day", "Cameroon", "Douala", "Cloud Computing", "Student Event", "GENESIS 2026"],
  openGraph: {
    title: "GENESIS: From Campus to Cloud | Douala 2026",
    description: "The premier AWS event for student builders in Cameroon. Join 500+ builders on May 23, 2026.",
    url: "https://awsscdcmr.com",
    siteName: "AWS Student Community Day Cameroon",
    images: [
      {
        url: "/themain.png",
        width: 1200,
        height: 630,
        alt: "GENESIS – AWS Student Community Day Cameroon 2026",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GENESIS: From Campus to Cloud | Douala 2026",
    description: "The premier AWS event for student builders in Cameroon. Join 500+ builders on May 23, 2026.",
    images: ["/themain.png"],
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
        <FAQ />
        <SponsorsSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}
