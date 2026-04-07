"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge as BadgeUI,
  Button,
  Spinner,
} from "@/components/ui";
import { PageWrapper, Navbar, Footer } from "@/components/layout";
import {
  Heart,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { applyVolunteer, getEventConfig } from "@/lib/api";
import toast from "react-hot-toast";

export default function VolunteerPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkConfig = async () => {
      try {
        const config = await getEventConfig();
        setIsOpen(config.data.volunteerAppsOpen);
      } catch (error) {
        setIsOpen(false);
      }
    };
    checkConfig();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await applyVolunteer({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        university: data.university,
        cloudClub: data.cloudClub,
        skills: data.skills
      });

      if (response.success) {
        toast.success("Application submitted! We'll be in touch soon.");
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      toast.error(error.message || "Application failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOpen === null) {
      return (
          <PageWrapper className="bg-[var(--void)] flex items-center justify-center min-h-screen">
              <Spinner className="h-8 w-8 text-[var(--electric)]" />
          </PageWrapper>
      );
  }

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
                  <BadgeUI variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)]">Join the Crew</BadgeUI>
                  <h1 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-6xl">
                    Join the <br />
                    <span className="bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)] bg-clip-text text-transparent italic underline decoration-[var(--ember)]/30 decoration-wavy underline-offset-8">
                      Volunteer Force.
                    </span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-2)]">
                    Be part of the team that makes AWS Student Community Day Cameroon happen. 
                    Gain experience, network with pros, and earn exclusive swag.
                  </p>

                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Heart size={16} className="text-[var(--error)]" /> Contribution
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Users size={16} className="text-[var(--electric)]" /> Networking
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-2)]">
                      <Star size={16} className="text-[var(--ember)]" /> Perks & Swag
                    </div>
                  </div>
                </header>

                {!isOpen ? (
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--panel)] p-12 text-center">
                        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-4">Applications are Currently Closed</h2>
                        <p className="text-[var(--text-2)] mb-8">Thank you for your interest! Volunteer applications are closed for now. Check back soon or follow us for updates.</p>
                        <Button variant="outline" asChild>
                            <Link href="/">Return Home</Link>
                        </Button>
                    </div>
                ) : (
                    <VolunteerForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-12">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-glow">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)]">Application Received!</h2>
                  <p className="mt-4 text-lg text-[var(--text-2)] max-w-lg mx-auto">
                    Thanks for stepping up! Our team will review your application and get back to you via email. 
                    Keep an eye on your inbox!
                  </p>
                </div>

                <div className="mt-12 flex gap-4">
                  <Button variant="primary" size="lg" asChild className="px-12 h-14">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </PageWrapper>
  );
}
