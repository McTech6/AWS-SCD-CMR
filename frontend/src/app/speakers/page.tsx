"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  Skeleton,
  Divider
} from "@/components/ui";
import { PageWrapper, Navbar, Footer, Section } from "@/components/layout";
import {
  Search,
  Linkedin,
  Twitter,
  Github,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  User,
  X,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPublicSpeakers } from "@/lib/api";

// Speaker Data Type
type Speaker = {
  id: string;
  name: string;
  role: string;
  company: string;
  topic: string;
  abstract: string;
  bio: string;
  track: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
};

const TRACKS = ["All", "Serverless", "Architecture", "Security", "AI & ML", "DevOps"];

const SpeakerCard = ({ speaker, onClick }: { speaker: Speaker, onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="group relative h-full cursor-pointer overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--electric)]/50 hover:shadow-glow"
      onClick={onClick}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[var(--border)] group-hover:border-[var(--electric)] transition-colors duration-300">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
            />
          </div>
          <Badge variant="outline" className="bg-[var(--electric)]/5 px-3 py-1 text-[10px] uppercase tracking-widest text-[var(--electric-light)] border-[var(--electric)]/20">
            {speaker.track}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-xl font-bold text-[var(--text-1)] group-hover:text-[var(--electric-light)] transition-colors">
            {speaker.name}
          </h3>
          <p className="text-sm font-medium text-[var(--text-2)]">
            {speaker.role} <span className="text-[var(--text-3)]">@</span> {speaker.company}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-2)]">
          {speaker.topic}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border)]/50">
          <div className="flex gap-3 text-[var(--text-3)]">
            {speaker.linkedin && <Linkedin size={16} className="hover:text-[var(--electric)] transition-colors" />}
            {speaker.twitter && <Twitter size={16} className="hover:text-[var(--electric)] transition-colors" />}
            {speaker.github && <Github size={16} className="hover:text-[var(--electric)] transition-colors" />}
          </div>
          <span className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-tighter text-[var(--text-3)] group-hover:text-[var(--electric-light)]">
            Details <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Inner Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,var(--electric-light)_0%,transparent_50%)]/5" />
    </motion.div>
  );
};

export default function SpeakersPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [activeTrack, setActiveTrack] = React.useState("All");
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<Speaker | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allSpeakers, setAllSpeakers] = React.useState<Speaker[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  React.useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicSpeakers(
          activeTrack === "All" ? undefined : activeTrack,
          debouncedSearch || undefined
        );

        if (response.success && response.data) {
          const formatted: Speaker[] = response.data.map((s: any) => ({
            id: s.id,
            name: s.user.name,
            role: s.role || "Speaker",
            company: s.company || "AWS Community",
            topic: s.talkTitle,
            abstract: s.talkAbstract || s.topic || "No abstract available.",
            bio: s.bio,
            track: s.track?.replace(/_/g, ' ') || "General",
            image: s.photoUrl || s.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.user.name)}`,
            linkedin: s.linkedinUrl,
            twitter: s.twitterHandle,
            github: s.githubUrl
          }));
          setAllSpeakers(formatted);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to fetch speakers");
        }
      } catch (err) {
        console.error("Speakers fetch error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching speakers.");
        setAllSpeakers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeakers();
  }, [activeTrack, debouncedSearch]);

  // Backend already filters by track and search, so we just use allSpeakers directly
  const filteredSpeakers = allSpeakers;

  return (
    <PageWrapper className="bg-[var(--void)]">
      <Navbar />

      <main className="min-h-screen">
        {/* Hero Section */}
        <Section className="pb-16 pt-32 lg:pt-40">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] underline decoration-[var(--electric)]/20 underline-offset-4">Event Visionaries</Badge>
              <h1 className="font-display text-5xl font-extrabold text-[var(--text-1)] sm:text-7xl lg:text-8xl">
                Meet the <span className="bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)] bg-clip-text text-transparent italic underline decoration-[var(--ember)]/30 decoration-wavy underline-offset-8">Architects.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-[var(--text-2)] lg:text-xl">
                Join our roster of industry pioneers and cloud evangelists as they
                break down the future of distributed systems and artificial intelligence.
              </p>
            </motion.div>
          </div>

          <Divider className="mt-20 opacity-10" />
        </Section>

        {/* Controls Section */}
        <Section className="py-0">
          <div className="sticky top-20 z-30 flex flex-col gap-8 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/80 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6 shadow-elevated">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={18} />
              <Input
                className="pl-11 h-12 bg-[var(--void)]/50 border-[var(--border)] focus:border-[var(--electric)]/50 transition-all font-medium text-[var(--text-1)]"
                placeholder="Search speakers or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {TRACKS.map((track) => (
                <button
                  key={track}
                  onClick={() => setActiveTrack(track)}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold transition-all duration-300",
                    activeTrack === track
                      ? "text-[var(--text-1)]"
                      : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                  )}
                >
                  {track}
                  {activeTrack === track && (
                    <motion.div
                      layoutId="active-track"
                      className="absolute inset-0 rounded-full border border-[var(--electric)]/30 bg-[var(--electric)]/10 shadow-glow"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between px-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-3)] font-bold">
              {filteredSpeakers.length} {filteredSpeakers.length === 1 ? 'Speaker' : 'Speakers'} Found
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-3)]"><LayoutGrid size={14} /></span>
              <div className="h-px w-8 bg-[var(--border)]" />
            </div>
          </div>
        </Section>

        {/* Grid Section */}
        <Section className="pt-12 pb-32">
          {error && (
            <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-500">
              <h3 className="font-bold">Oops! Could not load speakers.</h3>
              <p className="text-sm">
                Please check your connection or try again later. <br /> ({error})
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[320px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6">
                    <div className="flex justify-between items-start mb-6">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-7 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-8" />
                    <Divider className="opacity-10 mb-6" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))
              ) : filteredSpeakers.length > 0 ? (
                filteredSpeakers.map((speaker, i) => (
                  <SpeakerCard
                    key={speaker.id}
                    speaker={speaker}
                    onClick={() => setSelectedSpeaker(speaker)}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-3)] border border-[var(--border)]">
                    <User size={32} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[var(--text-1)]">No architects found.</h3>
                  <p className="mt-2 text-[var(--text-2)]">Try broadening your search or switching tracks.</p>
                  <Button
                    variant="ghost"
                    className="mt-8 text-[var(--electric)]"
                    onClick={() => { setSearch(""); setActiveTrack("All"); }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>
      </main>

      {/* Speaker Detail Modal */}
      <Modal open={!!selectedSpeaker} onOpenChange={() => setSelectedSpeaker(null)}>
        <ModalContent className="max-w-3xl overflow-hidden p-0 bg-[var(--void)] border-[var(--border)]">
          <AnimatePresence>
            {selectedSpeaker && (
              <div className="relative">
                {/* Banner / Header Image */}
                <div className="relative h-64 w-full sm:h-80">
                  <img
                    src={selectedSpeaker.image}
                    className="h-full w-full object-cover blur-xl opacity-30 saturate-200"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/50 to-transparent" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pt-16">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--electric)] shadow-glow"
                    >
                      <img src={selectedSpeaker.image} className="h-full w-full object-cover" alt={selectedSpeaker.name} />
                    </motion.div>
                    <Badge variant="outline" className="mb-4 bg-[var(--electric)] text-white font-mono uppercase tracking-[0.2em]">{selectedSpeaker.track}</Badge>
                    <h2 className="font-display text-3xl font-extrabold text-[var(--text-1)] sm:text-4xl">{selectedSpeaker.name}</h2>
                    <p className="mt-2 text-[var(--text-2)] font-medium">
                      {selectedSpeaker.role} @ <span className="text-[var(--text-1)]">{selectedSpeaker.company}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedSpeaker(null)}
                    className="absolute right-6 top-6 rounded-full bg-[var(--void)]/50 p-2 text-[var(--text-1)] backdrop-blur-md hover:bg-[var(--void)]/80 transition-colors z-50 border border-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-8 pb-12 sm:px-12">
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                    {/* Left: Bio & Social */}
                    <div className="lg:col-span-1 space-y-8">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-4 font-bold">— About the speaker</h4>
                        <p className="text-sm leading-relaxed text-[var(--text-2)] text-pretty italic">
                          "{selectedSpeaker.bio}"
                        </p>
                      </div>

                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-4 font-bold">— Network</h4>
                        <div className="flex flex-col gap-3">
                          {selectedSpeaker.linkedin && (
                            <a href={selectedSpeaker.linkedin} target="_blank" className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                              <Linkedin size={18} className="text-[var(--electric)]" />
                              LinkedIn Profile
                              <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                          {selectedSpeaker.twitter && (
                            <a href={selectedSpeaker.twitter} target="_blank" className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                              <Twitter size={18} className="text-[var(--electric)]" />
                              Follow on X
                              <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                          {selectedSpeaker.github && (
                            <a href={selectedSpeaker.github} target="_blank" className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                              <Github size={18} className="text-[var(--electric)]" />
                              GitHub Projects
                              <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </div>
                      </div>

                      <Button variant="ember" className="w-full h-12 shadow-glow font-bold tracking-tight">
                        Book 1:1 Coffee <MessageSquare className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Right: Talk Abstract */}
                    <div className="lg:col-span-2 space-y-8">
                      <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-4 font-bold">— The Presentation</h4>
                        <h3 className="font-display text-2xl font-bold text-[var(--text-1)] leading-tight mb-4">
                          {selectedSpeaker.topic}
                        </h3>
                        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-card">
                          <p className="text-base leading-relaxed text-[var(--text-2)] whitespace-pre-line">
                            {selectedSpeaker.abstract}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                          <span className="block text-[10px] font-mono text-[var(--text-3)] uppercase tracking-widest mb-1">Time Slot</span>
                          <span className="text-[var(--text-1)] font-bold">TBD (Schedule Release May 1st)</span>
                        </div>
                        <div className="flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
                          <span className="block text-[10px] font-mono text-[var(--text-3)] uppercase tracking-widest mb-1">Hall / Room</span>
                          <span className="text-[var(--text-1)] font-bold">Main Stage Alpha</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </ModalContent>
      </Modal>

      <Footer />
    </PageWrapper>
  );
}
