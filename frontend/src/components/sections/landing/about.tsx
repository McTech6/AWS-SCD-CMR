"use client";

import { motion } from "framer-motion";
import { Button, Divider } from "@/components/ui";
import { Section } from "@/components/layout";
import { Cloud, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const FeatureCard = ({
    icon: Icon,
    title,
    description
}: {
    icon: any;
    title: string;
    description: string
}) => {
    return (
        <div className="group relative rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--electric)] hover:shadow-glow">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--electric)]/10 text-[var(--electric)] transition-colors group-hover:bg-[var(--electric)] group-hover:text-white">
                <Icon size={20} />
            </div>
            <h3 className="mb-2 font-display text-lg font-bold text-[var(--text-1)]">{title}</h3>
            <p className="text-sm leading-relaxed text-[var(--text-2)]">{description}</p>
        </div>
    );
};

export const About = () => {
    return (
        <Section className="relative overflow-visible py-24 lg:py-32">
            {/* Decorative gradient blur */}
            <div className="absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-[var(--electric)]/5 blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
                {/* Left column: Text Content (55%) */}
                <motion.div
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-1.5 text-xs font-mono tracking-widest text-[var(--electric-light)] uppercase">
                        01. The Mission
                    </div>

                    <h2 className="mt-8 font-display text-4xl font-extrabold leading-tight tracking-tight text-[var(--text-1)] sm:text-5xl lg:text-6xl">
                        Democratizing <span className="text-gradient bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)] bg-clip-text text-transparent italic underline decoration-[var(--ember)]/30 decoration-wavy underline-offset-8">Cloud Mastery.</span>
                    </h2>

                    <div className="mt-8 flex flex-col gap-6 text-lg leading-relaxed text-[var(--text-2)] sm:text-xl">
                        <p>
                            AWS Student Community Day is more than just a conference — it&apos;s a gateway
                            into high-growth architecture and cloud engineering. We believe every
                            developer starts somewhere, and there&apos;s no better place than here.
                        </p>
                        <p className="text-base sm:text-lg">
                            Through peer-to-peer learning and mentorship from AWS ambassadors,
                            we connect students with the tools, knowledge, and community needed
                            to scale their careers.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FeatureCard
                            icon={Zap}
                            title="Hands-on Learning"
                            description="Deploy serverless apps, manage Kubernetes clusters, and build AI workflows in real-time."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Peer Networking"
                            description="Connect with 500+ like-minded student builders and potential employers from top tech firms."
                        />
                    </div>

                    <div className="mt-12 flex items-center gap-6">
                        <Button variant="outline" size="lg" asChild className="group">
                            <Link href="/register">
                                Learn our story
                                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Right column: Illustration / Visual (45%) */}
                <motion.div
                    className="relative lg:col-span-5"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--panel)] shadow-elevated">
                        <motion.div
                            className="h-full w-full"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                                alt="Cloud Infrastructure"
                                className="h-full w-full object-cover opacity-50 contrast-125 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                            />
                        </motion.div>

                        {/* Overlay stats/badges */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-t from-[var(--void)] via-transparent to-transparent">
                            <div className="text-center">
                                <span className="block font-mono text-xs uppercase tracking-[0.3em] text-[var(--electric-light)] mb-2">Cloud Infrastructure</span>
                                <span className="block font-display text-2xl font-bold text-[var(--text-1)] tracking-tight">Deployment Ready</span>
                            </div>
                        </div>

                        {/* Floating accent elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 top-1/4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/80 p-3 shadow-glow backdrop-blur-md"
                        >
                            <Zap size={24} className="text-[var(--ember)]" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-4 bottom-1/4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/80 p-3 shadow-glow backdrop-blur-md"
                        >
                            <Shield size={24} className="text-[var(--success)]" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <Divider className="mt-24 sm:mt-32 opacity-20" />
        </Section>
    );
};
