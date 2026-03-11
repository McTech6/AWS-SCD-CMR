"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button, Spinner } from "@/components/ui";
import { Section } from "@/components/layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSponsors } from "@/lib/api";
import { ExternalLink } from "lucide-react";

type Sponsor = {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
    tier?: string;
    visible: boolean;
};

export const SponsorsSection = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await getSponsors();
                if (response.success) {
                    setSponsors(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch sponsors:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSponsors();
    }, []);

    const goldSponsors = sponsors.filter(s => s.tier === 'GOLD');
    const silverSponsors = sponsors.filter(s => s.tier === 'SILVER');
    const communitySponsors = sponsors.filter(s => s.tier === 'COMMUNITY');

    const sponsorGroups = [
        { 
            tier: "Strategic Partners", 
            badge: "Gold Tier", 
            sponsors: goldSponsors,
            gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            cardHeight: "h-48"
        },
        { 
            tier: "Technology Partners", 
            badge: "Silver Tier", 
            sponsors: silverSponsors,
            gridCols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            cardHeight: "h-36"
        },
    ].filter(group => group.sponsors.length > 0);

    if (isLoading) {
        return (
            <Section id="sponsors" className="py-24 lg:py-32 flex flex-col items-center justify-center">
                <div className="animate-pulse space-y-12 w-full">
                    <div className="h-4 bg-white/5 rounded w-24 mx-auto" />
                    <div className="h-12 bg-white/5 rounded w-1/2 mx-auto" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-32 bg-white/5 rounded-[var(--radius-xl)]" />
                        ))}
                    </div>
                </div>
            </Section>
        );
    }

    if (sponsors.length === 0) {
        return null; // Don't show section if no sponsors exist
    }

    return (
        <Section id="sponsors" className="py-24 lg:py-32 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--electric)]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--ember)]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.3em] text-[var(--electric-light)] px-6 py-1.5 border-[var(--electric)]/20 bg-[var(--electric)]/5">
                        Our Benefactors
                    </Badge>
                    <h2 className="font-display text-5xl font-black text-[var(--text-1)] sm:text-6xl lg:text-8xl tracking-tight">
                        Powering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric)] via-[var(--electric-light)] to-[var(--ember)]">Future</span> Cloud.
                    </h2>
                    <p className="mx-auto mt-8 max-w-2xl text-[var(--text-2)] text-xl leading-relaxed font-medium">
                        Collaborating with world-class technology providers to bridge the gap between academic theory and industry-grade cloud infrastructure.
                    </p>
                </motion.div>
            </div>

            <div className="flex flex-col gap-32 relative z-10">
                {/* Gold & Silver Tiers */}
                {sponsorGroups.map((group, groupIdx) => (
                    <div key={group.tier} className="flex flex-col">
                        <div className="flex items-center gap-6 mb-16">
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-[var(--electric-light)]">
                                {group.tier}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent opacity-30" />
                        </div>

                        <div className={`grid w-full gap-6 lg:gap-8 ${group.gridCols}`}>
                            {group.sponsors.map((sponsor, i) => (
                                <motion.a
                                    key={sponsor.id}
                                    href={sponsor.website || '#'}
                                    target={sponsor.website ? "_blank" : undefined}
                                    rel={sponsor.website ? "noopener noreferrer" : undefined}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`group relative flex ${group.cardHeight} w-full items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--surface)] border border-[var(--border)] p-10 transition-all duration-500 hover:border-[var(--electric)]/40 hover:shadow-glow hover:-translate-y-1`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric)]/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    
                                    <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                                        <div className="flex h-20 w-full items-center justify-center rounded-[var(--radius-xl)] bg-white/5 backdrop-blur-sm p-4 transition-all duration-500 group-hover:bg-white/10">
                                            <img
                                                src={sponsor.logoUrl}
                                                alt={sponsor.name}
                                                className="h-full w-auto max-w-full object-contain transition-all duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        
                                        <div className="text-center">
                                            <span className="font-display text-sm font-black uppercase tracking-widest text-[var(--text-2)] group-hover:text-[var(--electric-light)] transition-colors">
                                                {sponsor.name}
                                            </span>
                                        </div>

                                        {sponsor.website && (
                                            <div className="absolute top-0 right-0 h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 -translate-y-1">
                                                <ExternalLink size={12} className="text-[var(--electric-light)]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtle Glow Background */}
                                    <div className="absolute -inset-px rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--electric)]/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Community Partners Marquee */}
                {communitySponsors.length > 0 && (
                    <div className="mt-8 space-y-12">
                         <div className="flex items-center gap-6">
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-3)]">
                                Community Ecosystem
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent opacity-30" />
                        </div>

                        <div className="group relative overflow-hidden py-16 rounded-[var(--radius-3xl)] border border-[var(--border)] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm">
                            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--void)] to-transparent z-10" />
                            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--void)] to-transparent z-10" />

                            <div className="flex animate-marquee hover:[animation-play-state:paused] gap-16 whitespace-nowrap px-8">
                                {/* Duplicate for seamless loop */}
                                {[...communitySponsors, ...communitySponsors, ...communitySponsors].map((sponsor, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-6 px-4"
                                    >
                                        {sponsor.logoUrl && (
                                            <img 
                                                src={sponsor.logoUrl} 
                                                alt={sponsor.name} 
                                                className="h-8 w-auto opacity-70 group-hover:opacity-100 transition-all" 
                                            />
                                        )}
                                        <span className="font-display text-4xl font-black uppercase tracking-tighter text-[var(--text-3)]/30 transition-all duration-300 hover:text-[var(--electric-light)] hover:scale-110 cursor-default">
                                            {sponsor.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Call to Action Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-40 relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--electric)] to-[var(--ember)] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity rounded-[var(--radius-3xl)]" />

                <div className="relative overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border)] bg-[var(--surface)]/90 p-16 lg:p-24 text-center backdrop-blur-2xl">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent opacity-50" />
                    
                    <div className="mb-10 flex flex-col items-center">
                        <div className="h-20 w-px bg-gradient-to-b from-transparent to-[var(--electric)] mb-6" />
                        <h4 className="font-display text-4xl lg:text-5xl font-black text-[var(--text-1)] tracking-tight mb-6">
                            Architect the Future With Us.
                        </h4>
                        <p className="max-w-2xl text-[var(--text-2)] text-xl leading-relaxed font-medium">
                            Join the ranks of pioneers. Bridge the gap between education and 
                            enterprise by providing the next generation of cloud leaders with 
                            the tools they need to build tomorrow.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button variant="primary" size="lg" asChild className="w-full sm:w-auto px-16 h-16 rounded-full shadow-glow font-black uppercase tracking-widest text-xs min-w-[240px]">
                            <Link href="/sponsorship/apply">Secure Partnership</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="w-full sm:w-auto px-16 h-16 rounded-full border-[var(--border)] text-xs font-black uppercase tracking-widest hover:bg-white/5 min-w-[240px]">
                            <Link href="/sponsorship-deck.pdf">Get Prospectus</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </Section>
    );
};
