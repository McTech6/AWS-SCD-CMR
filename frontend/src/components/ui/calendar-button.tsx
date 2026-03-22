"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "./button";
import {
    Calendar,
    FileText,
    Layout,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Event Configuration
 */
const EVENT_DETAILS = {
    title: "AWS Student Community Day Cameroon",
    description: "The first AWS Student Community Day in Cameroon! Join student builders, Cloud Club captains, and AWS experts for a day of learning and networking.",
    location: "Douala, Cameroon",
    startTime: "2026-05-23T09:00:00Z",
    endTime: "2026-05-23T17:00:00Z",
};

/**
 * URL Generators
 */
const getGoogleCalendarUrl = () => {
    const startUTC = "20260523T080000Z";
    const endUTC = "20260523T160000Z";

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_DETAILS.title)}&dates=${startUTC}/${endUTC}&details=${encodeURIComponent(EVENT_DETAILS.description)}&location=${encodeURIComponent(EVENT_DETAILS.location)}`;
};

const getOutlookCalendarUrl = () => {
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(EVENT_DETAILS.title)}&startdt=2026-05-23T08:00:00Z&enddt=2026-05-23T16:00:00Z&body=${encodeURIComponent(EVENT_DETAILS.description)}&location=${encodeURIComponent(EVENT_DETAILS.location)}`;
};

const downloadIcs = () => {
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//AWS Cloud Club//SCD Cameroon//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${EVENT_DETAILS.title}`,
        `DESCRIPTION:${EVENT_DETAILS.description}`,
        `LOCATION:${EVENT_DETAILS.location}`,
        "DTSTART:20260523T080000Z",
        "DTEND:20260523T160000Z",
        "DTSTAMP:20260322T140000Z",
        "UID:aws-scd-cmr-2026@awscloudclub",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aws-scd-cameroon.ics";
    anchor.click();
    window.URL.revokeObjectURL(url);
};

export const CalendarButton = ({ className, children, variant = "ghost" }: { className?: string; children?: React.ReactNode, variant?: any }) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                {children ? (
                    <div className={className}>{children}</div>
                ) : (
                    <Button variant={variant} size="lg" className={cn("h-14 w-full group overflow-hidden relative", className)}>
                        <motion.div
                            className="flex items-center justify-center gap-2"
                            whileHover={{ x: 3 }}
                        >
                            Add to Calendar
                            <Calendar className="ml-2 h-4 w-4 text-[var(--ember)] group-hover:animate-bounce" />
                        </motion.div>

                        {/* Glow Effect */}
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--ember)]/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </Button>
                )}
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    align="center"
                    sideOffset={8}
                    className="z-[99] w-64 origin-top-right rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-elevated backdrop-blur-xl animate-in fade-in zoom-in duration-200"
                >
                    <div className="flex flex-col gap-1">
                        <span className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">
                            Select Platform
                        </span>

                        <button
                            onClick={() => window.open(getGoogleCalendarUrl(), "_blank")}
                            className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text-1)] transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Layout size={16} />
                            </div>
                            Google Calendar
                        </button>

                        <button
                            onClick={() => window.open(getOutlookCalendarUrl(), "_blank")}
                            className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text-1)] transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                <Clock size={16} />
                            </div>
                            Outlook / Microsoft
                        </button>

                        <button
                            onClick={downloadIcs}
                            className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text-1)] transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--electric)]/10 text-[var(--electric)] group-hover:bg-[var(--electric)] group-hover:text-white transition-colors">
                                <FileText size={16} />
                            </div>
                            Apple / .ics File
                        </button>
                    </div>

                    <Popover.Arrow className="fill-[var(--border)]" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
