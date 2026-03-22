"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Divider, Button } from "@/components/ui";
import { Section } from "@/components/layout";
import { Clock, Mic2, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAgendaItems } from "@/lib/api";
import Link from "next/link";

type AgendaItem = {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    track?: string;
    speaker?: string;
    sortOrder?: number;
};

const AgendaItem = ({
    time,
    title,
    speaker,
    track,
    index
}: {
    time: string;
    title: string;
    speaker?: string;
    track?: string;
    index: number;
}) => {
    return (
        <motion.div
            className="group relative flex gap-8 pb-12 last:pb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <div className="absolute top-0 left-4 bottom-0 w-px bg-[var(--border)] group-last:bg-transparent" />

            <div className="relative z-10 hidden flex-shrink-0 pt-1 text-right sm:block sm:w-28">
                <span className="font-mono text-sm tracking-tighter text-[var(--text-3)]">
                    {time}
                </span>
            </div>

            <div className="relative z-10 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--electric)] transition-colors group-hover:border-[var(--electric)] group-hover:shadow-glow">
                <div className="h-2 w-2 rounded-full bg-current" />
            </div>

            <div className="flex flex-col gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2 sm:hidden">
                    <span className="font-mono text-xs tracking-tighter text-[var(--text-3)]">
                        {time}
                    </span>
                    {track && <Badge variant="outline" className="text-[10px] uppercase">{track}</Badge>}
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="font-display text-lg font-bold text-[var(--text-1)] sm:text-xl">
                        {title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-2)]">
                        {speaker && (
                            <span className="inline-flex items-center gap-1.5 font-medium">
                                <Mic2 size={14} className="text-[var(--text-3)]" />
                                {speaker}
                            </span>
                        )}
                        {track && (
                            <span className="hidden items-center gap-1.5 sm:inline-flex">
                                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-widest">{track}</Badge>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyAgenda = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-[var(--electric)]/20 blur-3xl rounded-full" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--electric)]/30 bg-[var(--surface)]">
                    <Calendar size={40} className="text-[var(--electric)]" />
                </div>
            </div>

            <h3 className="font-display text-3xl font-extrabold text-[var(--text-1)] mb-4">
                Schedule Coming Soon
            </h3>
            <p className="text-[var(--text-2)] max-w-md mb-8 leading-relaxed">
                We're crafting an incredible lineup of sessions, workshops, and networking events.
                The full agenda will be revealed soon!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" asChild className="group">
                    <Link href="/register">
                        Register Now
                        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/speakers">
                        Meet the Speakers
                    </Link>
                </Button>
            </div>

            <div className="mt-12 flex items-center gap-2 text-sm text-[var(--text-3)]">
                <Sparkles size={16} className="text-[var(--electric)]" />
                <span className="font-mono uppercase tracking-widest">Stay Tuned for Updates</span>
            </div>
        </motion.div>
    );
};

export const AgendaPreview = () => {
    const [activeTrack, setActiveTrack] = React.useState("All");
    const [agendaItems, setAgendaItems] = React.useState<AgendaItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const tracks = ["All", "MAIN_STAGE", "WORKSHOP", "PANEL", "NETWORKING"];

    React.useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const response = await getAgendaItems(activeTrack === "All" ? undefined : activeTrack);
                if (response.success && response.data) {
                    setAgendaItems(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch agenda:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgenda();
    }, [activeTrack]);

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "XX:XX";
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const filteredAgenda = agendaItems.map(item => ({
        time: formatTime(item.startTime),
        title: item.title,
        speaker: item.speaker || "TBA",
        track: item.track?.replace(/_/g, ' ') || "General"
    }));

    return (
        <Section id="agenda" className="py-10 lg:py-14 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--electric)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="mb-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-end relative z-10">
                <div className="max-w-2xl">
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] px-4 py-1">The Schedule</Badge>
                    <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-5xl lg:text-7xl tracking-tighter">
                        What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)]">Happening</span>.
                    </h2>
                    <p className="mt-6 text-[var(--text-2)] text-lg leading-relaxed">
                        A power-packed day of technical sessions, hands-on workshops, and
                        high-intensity networking with the best in the cloud ecosystem.
                    </p>
                </div>

                {!isLoading && agendaItems.length > 0 && (
                    <div className="flex max-w-full items-center gap-2 p-1 overflow-x-auto scrollbar-none rounded-2xl sm:rounded-full bg-[var(--surface)] border border-[var(--border)]">
                        {tracks.map(track => (
                            <button
                                key={track}
                                onClick={() => setActiveTrack(track)}
                                className={cn(
                                    "px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap",
                                    activeTrack === track
                                        ? "bg-[var(--electric)] text-white shadow-glow"
                                        : "text-[var(--text-3)] hover:text-[var(--text-1)]"
                                )}
                            >
                                {track.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="mx-auto max-w-4xl relative z-10">
                {isLoading ? (
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/30 p-12 backdrop-blur-md shadow-card">
                        <div className="space-y-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex gap-8 animate-pulse">
                                    <div className="h-4 w-20 bg-[var(--border)] rounded" />
                                    <div className="h-8 w-8 bg-[var(--border)] rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-6 bg-[var(--border)] rounded w-3/4" />
                                        <div className="h-4 bg-[var(--border)] rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : agendaItems.length === 0 ? (
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/30 p-12 backdrop-blur-md shadow-card">
                        <EmptyAgenda />
                    </div>
                ) : (
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/30 p-4 backdrop-blur-md sm:p-12 shadow-card">
                        <div className="flex flex-col">
                            <AnimatePresence mode="popLayout">
                                {filteredAgenda.map((item, i) => (
                                    <AgendaItem key={i} {...item} index={i} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            {!isLoading && agendaItems.length > 0 && (
                <div className="mt-10 text-center">
                    <p className="text-[var(--text-3)] font-mono text-sm uppercase tracking-widest mb-8">Ready to join the cloud revolution?</p>
                    <Button variant="primary" size="lg" asChild className="group px-10 h-14 rounded-full shadow-glow">
                        <Link href="/register">
                            Register Now
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </Button>
                </div>
            )}

            <Divider className="mt-12 sm:mt-16 opacity-10" />
        </Section>
    );
};
