"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import { Section } from "@/components/layout";
import { MapPin, Calendar, Clock, Navigation, ExternalLink } from "lucide-react";

export const VenueSection = () => {
    return (
        <Section id="venue" className="py-24 lg:py-32 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--ember)]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-16 text-center">
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] px-4 py-1">
                        Event Location
                    </Badge>
                    <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-5xl lg:text-7xl tracking-tighter">
                        Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ember)] to-[var(--electric)]">Us</span>.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-[var(--text-2)] text-lg">
                        Join us at the heart of Douala for a full day of cloud innovation, networking, and learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                    {/* Info Cards */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {/* Venue Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-[var(--electric)]/30 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--electric)]/10 text-[var(--electric)]">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-1">Venue</p>
                                    <h3 className="font-display text-xl font-extrabold text-[var(--text-1)]">IUC Logbessou</h3>
                                    <p className="mt-1 text-sm text-[var(--text-2)]">Institut Universitaire de la Côte</p>
                                    <p className="mt-1 text-sm text-[var(--text-3)]">Logbessou, Douala, Cameroon</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Date Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex-1 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-[var(--electric)]/30 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ember)]/10 text-[var(--ember)]">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-1">Date</p>
                                    <h3 className="font-display text-xl font-extrabold text-[var(--text-1)]">May 23, 2026</h3>
                                    <p className="mt-1 text-sm text-[var(--text-2)]">Saturday</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Time Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-[var(--electric)]/30 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-3)] mb-1">Time</p>
                                    <h3 className="font-display text-xl font-extrabold text-[var(--text-1)]">9:00 AM – 6:00 PM</h3>
                                    <p className="mt-1 text-sm text-[var(--text-2)]">Doors open at 8:30 AM</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Directions Button */}
                        <motion.a
                            href="https://maps.app.goo.gl/FhZErNUY4HiL72PE8"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="group flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--electric)]/30 bg-[var(--electric)]/5 p-6 hover:bg-[var(--electric)]/10 hover:border-[var(--electric)]/60 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <Navigation size={20} className="text-[var(--electric)]" />
                                <span className="font-bold text-[var(--text-1)]">Get Directions</span>
                            </div>
                            <ExternalLink size={16} className="text-[var(--electric)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.a>
                    </div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] shadow-elevated min-h-[450px]"
                    >
                        <div className="relative w-full" style={{ minHeight: "450px" }}>
                            <iframe
                                src="https://maps.google.com/maps?q=IUC+Logbessou+Douala+Cameroon&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: "450px", filter: "invert(90%) hue-rotate(180deg)" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="IUC Logbessou Douala - Event Venue"
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="relative -mt-8">
                                    <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 6px 16px rgba(220,38,38,0.8))" }}>
                                        <path d="M20 0C8.954 0 0 8.954 0 20c0 15 20 32 20 32s20-17 20-32C40 8.954 31.046 0 20 0z" fill="#DC2626"/>
                                        <circle cx="20" cy="20" r="8" fill="white"/>
                                        <circle cx="20" cy="20" r="4.5" fill="#DC2626"/>
                                    </svg>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-3 bg-red-600/40 rounded-full blur-md" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
};
