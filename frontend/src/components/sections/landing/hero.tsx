"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui";
import { ChevronDown, Rocket, Calendar as CalendarIcon } from "lucide-react";
import { CalendarButton } from "@/components/ui/calendar-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Animated Particle Mesh Background engineered for Light/Professional Theme
 */
const ParticleField = () => {
    const [mounted, setMounted] = React.useState(false);
    const [particles] = React.useState(() => 
        [...Array(30)].map((_, i) => ({
            size: Math.random() * 6 + 2,
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + 20 + "%",
            y: [0, Math.random() * -300 - 150],
            x: [0, Math.random() * 100 - 50],
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 5,
        }))
    );

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Cinematic Background Image (Multiply works great on white) */}
            <div
                className="absolute inset-0 opacity-[0.04] mix-blend-multiply saturate-0"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2000&auto=format&fit=crop')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {/* Dynamic Connecting Grid */}
            <div
                className="absolute inset-0 opacity-[0.2] mix-blend-multiply"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--electric) 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />
            {/* Vignette focused fading */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--void)]/70 to-[var(--void)]" />
            
            {/* Hardcore Flowing Particles */}
            {mounted && particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-t from-[var(--ember)] to-[var(--electric)] shadow-[0_0_12px_var(--electric)]"
                    style={{
                        width: p.size + "px",
                        height: p.size + "px",
                        left: p.left,
                        top: p.top,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        y: p.y,
                        x: p.x,
                        opacity: [0, 0.7, 0],
                        scale: [0, 1.5, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
};

export const Hero = () => {
    const { scrollY } = useScroll();
    const yTransform = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityTransform = useTransform(scrollY, [0, 300], [1, 1]); // Keep fully visible

    const [timeLeft, setTimeLeft] = React.useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    React.useEffect(() => {
        const targetDate = new Date("2026-05-23T09:00:00");

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

    const headline = "GENESIS: From Campus to Cloud";
    const words = headline.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 50, rotateX: -60, filter: "blur(10px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0, 
            filter: "blur(0px)",
            transition: { type: "spring" as const, stiffness: 100, damping: 15 }
        }
    };

    return (
        <section className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-[var(--void)] pt-24 pb-12 perspective-1000">
            <ParticleField />

            <motion.div 
                style={{ y: yTransform, opacity: opacityTransform }}
                className="container relative z-10 mx-auto flex flex-col items-center px-6 text-center"
            >


                {/* Hardcore Staggered 3D Headline Reveal */}
                <motion.h1 
                    className="max-w-4xl font-display text-3xl font-black tracking-tighter text-[var(--text-1)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl px-4 leading-[1.1] preserve-3d"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            variants={wordVariants}
                            className={cn(
                                "inline-block mr-[0.25em]",
                                (word === "GENESIS:" || word === "Cloud") && "text-transparent bg-clip-text bg-gradient-to-br from-[var(--electric)] to-[var(--ember)] filter drop-shadow-[0_0_15px_rgba(255,153,0,0.4)]"
                            )}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* Event Subtext with fade-up */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                    className="mt-8 max-w-2xl text-lg text-[var(--text-2)] sm:text-xl md:text-2xl font-medium px-4 leading-relaxed text-center"
                >
                    Igniting Cameroon's Cloud Journey – The First Student Community Day.
                    <div className="mt-6 flex items-center justify-center">
                        <CalendarButton>
                            <span className="font-extrabold text-[var(--electric)] uppercase tracking-[0.25em] text-xs sm:text-sm bg-[var(--surface)]/60 px-6 py-3 rounded-full border border-[var(--border)] shadow-sm backdrop-blur-md mix-blend-luminosity hover:mix-blend-normal transition-all duration-300 hover:scale-105 cursor-pointer">
                                May 23, 2026 · IUC Logbessou, Douala
                            </span>
                        </CalendarButton>
                    </div>
                </motion.div>

                {/* Pulsing CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.6, type: "spring" }}
                    className="mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 w-full px-6"
                >
                    <div className="relative group w-full sm:w-auto">
                        <div className="absolute inset-0 rounded-full bg-[var(--electric)] opacity-50 blur-xl group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 will-change-transform" />
                        <Button variant="ember" size="lg" asChild className="relative w-full sm:w-auto px-12 h-16 text-lg rounded-full font-black uppercase tracking-widest motion-btn overflow-hidden">
                            <Link href="/register">
                                <span className="relative z-10 flex items-center gap-2">
                                    Register — It's Free
                                </span>
                                {/* Shimmer sweep effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                            </Link>
                        </Button>
                    </div>
                    
                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto px-12 h-16 text-lg rounded-full font-bold hover:bg-[var(--electric)] hover:text-white hover:border-transparent transition-all duration-300 border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm motion-btn">
                        <Link href="/speak">Apply to Speak</Link>
                    </Button>

                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto px-12 h-16 text-lg rounded-full font-bold hover:bg-amber-500 hover:text-white hover:border-transparent transition-all duration-300 border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm motion-btn group">
                        <Link href="/iwillbethere">
                            <span className="relative z-10 flex items-center gap-2">
                                I Will Be There Poster
                            </span>
                        </Link>
                    </Button>
                </motion.div>

                {/* Hardcore Flipping Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.8, type: "spring" }}
                    className="mt-16 flex gap-4 sm:gap-6 lg:gap-10 flex-wrap justify-center overflow-visible preserve-3d"
                >
                    {Object.entries(timeLeft).map(([unit, value], index) => (
                        <motion.div 
                            key={unit} 
                            className="flex flex-col items-center group perspective-1000"
                            whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10 }}
                        >
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--panel)] shadow-elevated group-hover:border-[var(--electric)] transition-all duration-500">
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center font-display text-4xl sm:text-5xl lg:text-7xl font-black text-[var(--electric)] drop-shadow-md"
                                    key={value}
                                    initial={{ rotateX: 90, opacity: 0 }}
                                    animate={{ rotateX: 0, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    {String(value).padStart(2, "0")}
                                </motion.div>
                                <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)] opacity-50 shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                            </div>
                            <span className="mt-4 text-[10px] sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors duration-300">
                                {unit}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bouncing Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-3)] hover:text-[var(--electric)] transition-colors duration-300 cursor-pointer"
            >
                <Link href="#about">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-[var(--surface)]/50 p-3 rounded-full border border-[var(--border)] backdrop-blur-md hover:scale-110 transition-transform"
                    >
                        <ChevronDown size={28} />
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    );
};
