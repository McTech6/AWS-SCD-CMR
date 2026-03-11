"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Animated Particle Mesh Background (Pure CSS approach)
 */
const ParticleField = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Cinematic Background Image */}
            <div
                className="absolute inset-0 opacity-20 contrast-125 saturate-50 mix-blend-screen"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2000&auto=format&fit=crop')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--electric) 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />
            {/* Radial Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--void)_80%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--void)]/50 to-[var(--void)]" />
            {/* Dynamic particles using Framer Motion */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-[var(--electric)] opacity-30 shadow-[0_0_8px_var(--electric)]"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0.1
                    }}
                    animate={{
                        y: [null, "-100%"],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

/**
 * Flip Countdown (Simplified version for initial build)
 */
const CountdownItem = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)]">
                <div className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--electric-light)]">
                    {String(value).padStart(2, "0")}
                </div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)] opacity-30" />
            </div>
            <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">
                {label}
            </span>
        </div>
    );
};

export const Hero = () => {
    const [timeLeft, setTimeLeft] = React.useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    React.useEffect(() => {
        // Set target date for the event (e.g., 30 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 45);

        const timer = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const headline = "Architecting the Future of Cloud.";
    const words = headline.split(" ");

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[var(--void)] pt-16">
            <ParticleField />

            <div className="container relative z-10 mx-auto flex flex-col items-center px-6 text-center">
                {/* Badge Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-1.5 backdrop-blur-sm"
                >
                    <span className="text-xs font-medium tracking-tight text-[var(--text-2)]">
                        <span className="text-[var(--electric)]">☁</span> Student Community Day · Powered by AWS Cloud Club
                    </span>
                </motion.div>

                {/* Staggered Headline Reveal */}
                <h1 className="max-w-4xl font-display text-4xl font-extrabold tracking-tight text-[var(--text-1)] sm:text-6xl lg:text-7xl xl:text-8xl px-4">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.8, ease: "easeOut" }}
                            className="inline-block mr-[0.25em]"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                {/* Event Subtext */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-6 max-w-2xl text-lg text-[var(--text-2)] sm:text-xl px-4"
                >
                    Join 500+ students for a full day of hands-on workshops,
                    expert sessions, and cloud innovation.
                    <span className="block mt-4 font-black text-[var(--text-1)] uppercase tracking-[0.2em] text-sm sm:text-base bg-white/5 py-3 rounded-full border border-white/10 backdrop-blur-md">
                        XX Month XX · AWS Cloud Headquarters
                    </span>
                </motion.p>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-6"
                >
                    <Button variant="ember" size="lg" asChild className="w-full sm:w-auto px-12 h-14 rounded-full shadow-glow font-bold">
                        <Link href="/register">Register — It's Free</Link>
                    </Button>
                    <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto px-12 h-14 rounded-full border border-white/10 font-bold hover:bg-white/5">
                        <Link href="/speak">Apply to Speak</Link>
                    </Button>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-20 flex gap-3 sm:gap-6 lg:gap-8 flex-wrap justify-center overflow-hidden"
                >
                    <div className="flex flex-col items-center">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)]">
                            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-3)] opacity-20">XX</div>
                        </div>
                        <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">Days</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)]">
                            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-3)] opacity-20">XX</div>
                        </div>
                        <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">Hrs</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)]">
                            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-3)] opacity-20">XX</div>
                        </div>
                        <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">Min</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)]">
                            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-3)] opacity-20">XX</div>
                        </div>
                        <span className="mt-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-3)]">Sec</span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[var(--text-3)]"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={24} />
                </motion.div>
            </motion.div>
        </section>
    );
};
