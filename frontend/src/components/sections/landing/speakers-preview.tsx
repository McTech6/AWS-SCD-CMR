"use client";

import { motion } from "framer-motion";
import { Badge, Divider, Button } from "@/components/ui";
import { Section } from "@/components/layout";
import { Linkedin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getPublicSpeakers } from "@/lib/api";
import { useEffect, useState } from "react";

type Speaker = {
    id: string;
    name: string;
    role: string;
    company: string;
    topic: string;
    track: string;
    image: string;
    linkedin?: string;
};

const SpeakerCard = ({
    name,
    role,
    company,
    topic,
    track,
    image,
    linkedin,
    index
}: Speaker & { index: number }) => {
    return (
        <motion.div
            className="perspective-1000 group relative h-[400px] w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <div className="relative h-full w-full transition-all duration-700 preserve-3d group-hover:rotate-y-180">
                {/* Front side */}
                <div className="absolute inset-0 backface-hidden flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 group-hover:border-[var(--electric)] group-hover:shadow-glow">
                    {/* Track Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest text-[var(--electric-light)]">
                            {track}
                        </Badge>
                    </div>

                    {/* Speaker Avatar */}
                    <div className="mx-auto mb-6 h-40 w-40 shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--border)] group-hover:border-[var(--electric)] transition-all duration-300 shadow-elevated">
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center text-center">
                        <h4 className="font-display text-xl font-bold text-[var(--text-1)] group-hover:text-[var(--electric-light)] transition-colors">
                            {name}
                        </h4>
                        <p className="mt-2 text-sm text-[var(--text-2)] line-clamp-2">
                            {role}
                        </p>
                        <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">
                            {company}
                        </p>
                    </div>

                    <div className="mt-auto flex w-full flex-col gap-4 border-t border-[var(--border)] pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">Topic</span>
                            <span className="inline-flex h-2 w-2 rounded-full bg-[var(--electric)] shadow-[0_0_8px_var(--electric)] animate-pulse" />
                        </div>
                        <h5 className="font-display text-sm font-bold text-[var(--text-1)] leading-tight">
                            {topic}
                        </h5>
                    </div>
                </div>

                {/* Back side - Flip content */}
                <div className="absolute inset-0 rotate-y-180 backface-hidden flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[var(--electric)] bg-[var(--panel)] p-8 shadow-glow text-center">
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <Badge variant="outline" className="mb-2 bg-[var(--electric)]/10 text-[var(--electric-light)]">Session Highlight</Badge>
                        <h4 className="font-display text-2xl font-extrabold text-[var(--text-1)]">{name}</h4>
                    </div>

                    <p className="mb-8 text-sm leading-relaxed text-[var(--text-2)]">
                        Explore the cutting-edge strategies and architectures that {name}
                        is implementing at {company} to redefine the cloud landscape.
                    </p>

                    <div className="flex w-full flex-col gap-3">
                        {linkedin && (
                            <Button variant="outline" size="default" className="w-full" asChild>
                                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                                    <Linkedin size={16} className="mr-2" /> LinkedIn Profile
                                </a>
                            </Button>
                        )}
                        <Button variant="ghost" size="default" className="w-full" asChild>
                            <Link href="/speakers">
                                View All Details <ExternalLink size={14} className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const SpeakersPreview = () => {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const response = await getPublicSpeakers();
                if (response.success && response.data) {
                    const formatted = response.data.slice(0, 4).map((s: any) => ({
                        id: s.id,
                        name: s.user.name,
                        role: s.role || "Speaker",
                        company: s.company || "AWS Community",
                        topic: s.talkTitle,
                        track: s.track?.replace(/_/g, ' ') || "General",
                        image: s.photoUrl || s.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.user.name)}`,
                        linkedin: s.linkedinUrl
                    }));
                    setSpeakers(formatted);
                }
            } catch (err) {
                console.error("Failed to fetch speakers:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpeakers();
    }, []);

    if (isLoading) {
        return (
            <Section className="py-16 lg:py-20 overflow-hidden">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-[400px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] animate-pulse" />
                    ))}
                </div>
            </Section>
        );
    }

    return (
        <Section className="relative overflow-hidden py-16 lg:py-20">
            <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl text-center md:text-left">
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] underline decoration-[var(--electric)]/20 underline-offset-4">Cloud Pioneers</Badge>
                    <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-5xl lg:text-6xl">
                        Meet the Experts.
                    </h2>
                    <p className="mt-4 text-[var(--text-2)] max-w-xl">
                        Learn from industry leaders who are building the most sophisticated cloud architectures in the world.
                        Real world experience, no fluff.
                    </p>
                </div>
                <Button variant="ember" size="lg" asChild className="group px-8">
                    <Link href="/speakers">
                        Meet All Speakers
                        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {speakers.map((speaker, i) => (
                    <SpeakerCard key={speaker.id} {...speaker} index={i} />
                ))}
            </div>

            <Divider className="mt-8 sm:mt-12 opacity-20" />
        </Section>
    );
};
