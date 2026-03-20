"use client";

import { motion } from "framer-motion";
import { Navbar, Footer, PageWrapper, Section } from "@/components/layout";
import { Badge, Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { getOrganizers } from "@/lib/api";
import { Linkedin, Twitter, Github, ChevronRight, User } from "lucide-react";

type Organizer = {
    id: string;
    name: string;
    role: string;
    club?: string;
    bio?: string;
    imageUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    githubUrl?: string;
};

export default function OrganizersPage() {
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const response = await getOrganizers(); // Public view (visible only)
                if (response.success) {
                    setOrganizers(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch organizers:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrganizers();
    }, []);

    return (
        <PageWrapper>
            <Navbar />
            <main className="min-h-screen bg-[var(--void)] pt-32 pb-24 overflow-hidden relative">
                {/* Ambient background rays */}
                <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-[var(--electric)]/[0.03] to-transparent pointer-events-none" />
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[var(--electric)]/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[var(--ember)]/5 blur-[120px] rounded-full pointer-events-none" />

                <Section className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Badge variant="outline" className="mb-6 uppercase tracking-[0.4em] text-[var(--electric-light)] px-6 py-2 border-[var(--electric)]/20 bg-[var(--electric)]/5">
                                The Hub Architects
                            </Badge>
                            <h1 className="font-display text-6xl md:text-8xl font-black text-[var(--text-1)] tracking-tighter mb-8 leading-[0.9]">
                                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric)] via-[var(--electric-light)] to-[var(--ember)]">Captains.</span>
                            </h1>
                            <p className="text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto font-medium">
                                Driven by a shared mission to democratize cloud education, our leadership team of AWS Cloud Club Captains is bridging the gap across the region.
                            </p>
                        </motion.div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-[450px] bg-white/5 rounded-[var(--radius-3xl)] animate-pulse" />
                            ))}
                        </div>
                    ) : organizers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {organizers.map((organizer, idx) => (
                                <motion.div
                                    key={organizer.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-b from-[var(--electric)]/20 to-transparent rounded-[var(--radius-3xl)] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                    
                                    <div className="relative h-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-3xl)] overflow-hidden flex flex-col transition-all duration-500 group-hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/5] overflow-hidden group-hover:bg-[var(--void)] transition-all duration-700">
                                            {organizer.imageUrl ? (
                                                <img 
                                                    src={organizer.imageUrl} 
                                                    alt={organizer.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[var(--void)] text-[var(--text-3)]">
                                                    <User className="w-20 h-20 opacity-10" />
                                                </div>
                                            )}
                                            
                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" />
                                            
                                            {/* Social Actions (Floating) */}
                                            <div className="absolute bottom-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                {organizer.linkedinUrl && (
                                                    <a href={organizer.linkedinUrl} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[var(--electric)] transition-colors border border-white/10">
                                                        <Linkedin size={18} />
                                                    </a>
                                                )}
                                                {organizer.twitterUrl && (
                                                    <a href={organizer.twitterUrl} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#1da1f2] transition-colors border border-white/10">
                                                        <Twitter size={18} />
                                                    </a>
                                                )}
                                                {organizer.githubUrl && (
                                                    <a href={organizer.githubUrl} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#333] transition-colors border border-white/10">
                                                        <Github size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 pb-10 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-black text-[var(--text-1)] tracking-tight group-hover:text-[var(--electric-light)] transition-colors">
                                                    {organizer.name}
                                                </h3>
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--electric-light)]">
                                                        {organizer.role}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-3)] font-mono font-medium opacity-60">
                                                        {organizer.club || "AWS Community"}
                                                    </span>
                                                </div>
                                            </div>

                                            {organizer.bio && (
                                                <p className="text-sm text-[var(--text-2)] leading-relaxed font-medium opacity-70 mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                                    {organizer.bio}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-6 border-t border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)] flex items-center gap-2">
                                                    Signal Verified <ChevronRight size={10} className="text-[var(--electric)]" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border border-dashed border-[var(--border)] rounded-[var(--radius-3xl)]">
                            <p className="text-[var(--text-3)] font-mono uppercase tracking-widest">Leadership core offline. Check later.</p>
                        </div>
                    )}
                </Section>

                {/* Footer CTA */}
                <Section className="mt-20">
                    <div className="relative p-12 lg:p-20 rounded-[var(--radius-3xl)] overflow-hidden border border-[var(--border)] bg-[var(--surface)] text-center">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--electric)]/5 blur-[100px] pointer-events-none" />
                        <h2 className="text-4xl font-black text-[var(--text-1)] mb-6">Build the Community with Us.</h2>
                        <p className="text-[var(--text-2)] max-w-xl mx-auto mb-10 text-lg">
                            Our clubs are always looking for passionate students to lead sessions, 
                            mentor peers, and architect the future of cloud.
                        </p>
                        <Button variant="primary" size="lg" className="rounded-full px-12 h-14 uppercase tracking-widest font-black text-xs shadow-glow">
                            Join your local club
                        </Button>
                    </div>
                </Section>
            </main>
            <Footer />
        </PageWrapper>
    );
}
