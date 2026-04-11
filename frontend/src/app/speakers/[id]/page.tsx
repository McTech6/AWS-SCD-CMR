"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Skeleton,
  Divider
} from "@/components/ui";
import {
  Linkedin,
  Twitter,
  Github,
  MessageSquare,
  ExternalLink,
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft
} from "lucide-react";
import { PageWrapper, Navbar, Footer, Section } from "@/components/layout";
import { getSpeakerById } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SpeakerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [speaker, setSpeaker] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        setIsLoading(true);
        const response = await getSpeakerById(id as string);
        if (response.success) {
          setSpeaker(response.data);
          setError(null);
        } else {
          throw new Error(response.message || "Speaker not found");
        }
      } catch (err) {
        console.error("Fetch speaker error:", err);
        setError(err instanceof Error ? err.message : "Failed to load speaker");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchSpeaker();
  }, [id]);

  if (isLoading) {
    return (
      <PageWrapper className="bg-[var(--void)]">
        <Navbar />
        <main className="min-h-screen pt-32 lg:pt-40">
          <Section>
            <div className="mx-auto max-w-5xl">
              <Skeleton className="h-10 w-32 mb-12" />
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Skeleton className="aspect-square w-full rounded-3xl mb-8" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-8" />
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <Skeleton className="h-12 w-3/4 mb-6" />
                  <Skeleton className="h-32 w-full mb-12" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          </Section>
        </main>
        <Footer />
      </PageWrapper>
    );
  }

  if (error || !speaker) {
    return (
      <PageWrapper className="bg-[var(--void)]">
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-1)] mb-4">404</h1>
            <p className="text-[var(--text-2)] mb-8">{error || "Speaker not found"}</p>
            <Button variant="primary" onClick={() => router.push("/speakers")}>
              Return to Speakers
            </Button>
          </div>
        </main>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-[var(--void)]">
      <Navbar />
      <main className="min-h-screen pt-24 lg:pt-32">
        {/* Back Button */}
        <Section className="py-8">
            <div className="mx-auto max-w-6xl">
                <button 
                  onClick={() => router.push("/speakers")}
                  className="group flex items-center gap-2 text-sm font-bold tracking-widest text-[var(--text-3)] uppercase hover:text-[var(--electric-light)] transition-colors"
                >
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Architects
                </button>
            </div>
        </Section>

        {/* Profile Hero */}
        <Section className="pt-0 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              
              {/* Profile Image & Quick Links */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-[var(--radius-3xl)] overflow-hidden border-2 border-[var(--border)] bg-[var(--surface)] shadow-elevated"
                >
                  <img 
                    src={speaker.photoUrl || speaker.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.user.name)}&size=512&background=random`}
                    alt={speaker.user.name} 
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>

                <div className="mt-8 space-y-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-4 font-bold">— Professional Links</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {speaker.linkedinUrl && (
                        <a href={speaker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#0077b5]/10 text-[#0077b5]">
                                <Linkedin size={20} />
                            </div>
                            <span className="font-bold text-sm">LinkedIn Profile</span>
                            <ExternalLink size={14} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                    )}
                    {speaker.twitterHandle && (
                        <a href={speaker.twitterHandle} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black/50 text-white border border-white/10">
                                <Twitter size={20} />
                            </div>
                            <span className="font-bold text-sm">Follow on X</span>
                            <ExternalLink size={14} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                    )}
                    {speaker.githubUrl && (
                        <a href={speaker.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--electric)]/40 hover:bg-[var(--electric)]/5 transition-all group">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black text-white">
                                <Github size={20} />
                            </div>
                            <span className="font-bold text-sm">GitHub Projects</span>
                            <ExternalLink size={14} className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Speaker Content */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge variant="outline" className="mb-6 bg-[var(--electric)]/10 text-[var(--electric-light)] font-mono uppercase tracking-[0.2em] px-4 py-1.5 border-[var(--electric)]/20 shadow-glow">
                    {speaker.track?.replace(/_/g, ' ') || "General"}
                  </Badge>

                  <h1 className="font-display text-5xl font-black text-[var(--text-1)] tracking-tight sm:text-7xl mb-4">
                    {speaker.user.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-12">
                    <p className="text-xl text-[var(--electric-light)] font-black uppercase tracking-tighter">
                      {speaker.role}
                    </p>
                    <div className="h-1 w-1 rounded-full bg-[var(--text-3)] opacity-30" />
                    <p className="text-xl text-[var(--text-2)] font-bold">
                      {speaker.company}
                    </p>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    <div className="p-6 rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] shadow-inset">
                        <Calendar size={20} className="text-[var(--electric)] mb-3" />
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--text-3)] mb-1">Session Date</span>
                        <span className="text-[var(--text-1)] font-bold">May 23, 2026</span>
                    </div>
                    <div className="p-6 rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] shadow-inset">
                        <MapPin size={20} className="text-[var(--ember)] mb-3" />
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--text-3)] mb-1">Location</span>
                        <span className="text-[var(--text-1)] font-bold">Main Hall Alpha</span>
                    </div>
                    <div className="p-6 rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] shadow-inset">
                        <Clock size={20} className="text-[var(--success)] mb-3" />
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--text-3)] mb-1">Duration</span>
                        <span className="text-[var(--text-1)] font-bold">45 Minutes</span>
                    </div>
                  </div>

                  {/* Section: Bio */}
                  <div className="mb-20">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-8 font-bold">— Full Intelligence (Bio)</h3>
                    <div className="relative">
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--electric)] to-transparent opacity-20" />
                        <p className="text-xl leading-relaxed text-[var(--text-2)] font-medium italic text-pretty">
                          "{speaker.bio}"
                        </p>
                    </div>
                  </div>

                  {/* Section: Presentation */}
                  <div className="relative p-10 lg:p-16 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--panel)] shadow-elevated overflow-hidden mb-20">
                    <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--electric)]/5 blur-[100px]" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Badge variant="outline" className="border-[var(--success)]/30 text-[var(--success)] font-mono uppercase text-[10px] tracking-widest">Confirmed Keynote</Badge>
                            <Badge variant="outline" className="border-[var(--ember)]/30 text-[var(--ember)] font-mono uppercase text-[10px] tracking-widest">{speaker.sessionType || "Talk"}</Badge>
                        </div>

                        <h2 className="font-display text-3xl font-black text-[var(--text-1)] leading-tight sm:text-4xl mb-8 tracking-tight">
                            {speaker.talkTitle}
                        </h2>

                        <div className="space-y-6">
                            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] font-bold">Briefing Details</h4>
                            <p className="text-lg leading-relaxed text-[var(--text-2)] font-medium whitespace-pre-line">
                                {speaker.talkAbstract || speaker.topic}
                            </p>
                        </div>
                    </div>
                  </div>

                  {/* Track Focus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--surface)]">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-6 font-bold">Track Focus</h4>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-[var(--electric)]/10 flex items-center justify-center text-[var(--electric)]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <span className="block text-[var(--text-1)] font-bold">{speaker.track?.replace(/_/g, ' ')}</span>
                                <span className="text-xs text-[var(--text-3)]">Official Event Track</span>
                            </div>
                        </div>
                     </div>
                     <div className="p-8 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--surface)]">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-6 font-bold">Architect Level</h4>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-[var(--ember)]/10 flex items-center justify-center text-[var(--ember)]">
                                <Clock size={24} />
                            </div>
                            <div>
                                <span className="block text-[var(--text-1)] font-bold">{speaker.experienceLevel?.replace(/_/g, ' ') || "Advanced"}</span>
                                <span className="text-xs text-[var(--text-3)]">Years of Cloud Expertise</span>
                            </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </PageWrapper>
  );
}
