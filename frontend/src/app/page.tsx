import { Navbar, Footer, PageWrapper } from "@/components/layout";
import {
  Hero,
  StatsBar,
  About,
  AgendaPreview,
  SpeakersPreview,
  SponsorsSection
} from "@/components/sections/landing";

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
