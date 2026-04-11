"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Input,
  Textarea,
  Badge,
  Badge as BadgeUI,
  Divider,
  Spinner,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  CalendarButton,
} from "@/components/ui";
import { PageWrapper, Navbar, Footer } from "@/components/layout";
import {
  Mic2,
  Gift,
  Camera,
  Upload,
  Linkedin,
  Twitter,
  Github,
  ChevronRight,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { applySpeaker } from "@/lib/api";
import toast from "react-hot-toast";

const speakSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  topic: z.string().min(10, "Topic must be descriptive (at least 10 chars)"),
  track: z.string().min(1, "Please select a track"),
  bio: z.string().max(300, "Bio must be under 300 characters").min(20, "Please provide a brief bio (at least 20 chars)"),
  experience: z.string().min(1, "Please select experience level"),
  sessionType: z.string().min(1, "Please select a session type"),
  linkedin: z.string().url("Must be a valid URL").regex(/linkedin\.com/, "Must be a LinkedIn URL"),
  twitter: z.string().optional(),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SpeakData = z.infer<typeof speakSchema>;

import { SpeakerForm } from "@/components/forms/speaker-form";

export default function SpeakPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<{ fullName: string; topic: string; track: string; bio: string; profilePhoto: string | null } | null>(null);

  const onSubmit = async (data: any, profilePhoto: string | null) => {
    setIsSubmitting(true);

    try {
      const trackMap: Record<string, string> = {
        "Serverless": "CLOUD_FUNDAMENTALS",
        "DevOps": "DEVOPS",
        "AI & ML": "AI_ML",
        "Security": "SECURITY",
        "Architecture": "CLOUD_FUNDAMENTALS",
        "Community Focused": "COMMUNITY_FOCUSED"
      };

      const experienceMap: Record<string, string> = {
        "0-1": "ZERO_TO_ONE",
        "1-3": "ONE_TO_THREE",
        "3-5": "THREE_TO_FIVE",
        "5+": "FIVE_PLUS"
      };
      
      const sessionTypeMap: Record<string, string> = {
        "Simple Talk": "TALK",
        "Interactive Demo": "DEMO",
        "Hands-on Workshop": "WORKSHOP",
        "Keynote": "KEYNOTE"
      };

      const response = await applySpeaker({
        name: data.fullName,
        email: data.email,
        topic: data.topic,
        talkTitle: data.topic,
        talkAbstract: data.talkAbstract,
        bio: data.bio,
        role: data.role,
        company: data.company,
        linkedinUrl: data.linkedin,
        twitterHandle: data.twitter,
        githubUrl: data.github,
        track: trackMap[data.track],
        experienceLevel: experienceMap[data.experience],
        sessionType: sessionTypeMap[data.sessionType] || "TALK",
        photoBase64: profilePhoto
      });

      if (response.success) {
        toast.success("Application submitted successfully! Status: Pending review");
        setSubmittedData({ ...data, profilePhoto });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Application failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="bg-[var(--void)]">
      <Navbar />

      <main className="min-h-screen pt-24 pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Hero Section */}
                <header className="mb-16 text-center">
                  <BadgeUI variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] underline decoration-[var(--electric)]/20 underline-offset-4">Call for Speakers</BadgeUI>
                  <h1 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-6xl">
                    Shape the Conversation. <br />
                    <span className="bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)] bg-clip-text text-transparent italic decoration-[var(--ember)]/30 decoration-wavy underline underline-offset-8">
                      Share Your Cloud Story.
                    </span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-2)]">
                    Connect with a global audience of student developers. We provide
                    the stage, you provide the innovation.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Mic2 size={16} className="text-[var(--electric)]" /> 30-min Slot
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Gift size={16} className="text-[var(--ember)]" /> Speaker Kit
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Camera size={16} className="text-[var(--success)]" /> Professional Photos
                    </div>
                  </div>
                </header>

                <SpeakerForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
              </motion.div>
            ) : (
              <motion.div
                key="success-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="mb-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)]">Application Received!</h2>
                  <p className="mt-4 text-[var(--text-2)]">Your speaker persona is now in review. Here's a preview of how you'll appear on site:</p>
                </div>

                {/* Speaker Card Preview */}
                <div className="relative w-full max-w-sm rounded-[var(--radius-xl)] border border-[var(--electric)] bg-[var(--panel)] p-8 shadow-glow overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-[var(--electric)]/10 blur-[40px]" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--electric)] shadow-glow bg-[var(--surface)]">
                      {submittedData?.profilePhoto ? (
                        <img src={submittedData.profilePhoto} className="h-full w-full object-cover" alt="Speaker" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--text-3)]">
                          <span className="text-3xl font-bold">{submittedData?.fullName.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <BadgeUI variant="outline" className="mb-4 bg-[var(--electric)]/10 text-[var(--electric-light)] uppercase tracking-widest">{submittedData?.track}</BadgeUI>
                    <h3 className="font-display text-2xl font-bold text-[var(--text-1)]">{submittedData?.fullName}</h3>
                    <p className="mt-4 text-sm text-[var(--text-2)] leading-relaxed">{submittedData?.bio}</p>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] w-full text-left">
                      <span className="block text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-3)] mb-2">Presentation Topic</span>
                      <h4 className="font-display text-lg font-bold text-[var(--text-1)] leading-tight">{submittedData?.topic}</h4>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-3)]"><Linkedin size={14} /></div>
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-3)]"><Twitter size={14} /></div>
                      <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-3)]"><Github size={14} /></div>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex flex-col gap-4 sm:flex-row items-center">
                  <Button variant="primary" size="lg" asChild className="px-12 h-14">
                    <Link href="/">Back to Home</Link>
                  </Button>
                  <CalendarButton className="w-full sm:w-auto px-12" />
                  <Button variant="ghost" size="lg" onClick={() => setIsSuccess(false)} className="h-14">Edit Application</Button>
                </div>

                <p className="mt-12 text-sm text-[var(--text-3)] font-mono text-center">
                  Decision estimated within 48 hours. Check your email for updates.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </PageWrapper>
  );
}
