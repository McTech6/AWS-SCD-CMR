"use client";

import * as React from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const Counter = ({ value }: { value: number }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const springValue = useSpring(0, {
        mass: 1,
        stiffness: 100,
        damping: 30,
    });

    const display = useTransform(springValue, (current) =>
        Math.round(current).toLocaleString()
    );

    React.useEffect(() => {
        if (isInView) {
            springValue.set(value);
        }
    }, [isInView, value, springValue]);

    return <motion.span ref={ref}>{display}</motion.span>;
};

const StatItem = ({
    value,
    suffix,
    label
}: {
    value: number;
    suffix?: string;
    label: string
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center transition-all duration-300 hover:scale-[1.05]">
            <div className="flex items-baseline font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-5xl lg:text-6xl">
                <Counter value={value} />
                {suffix && <span className="ml-1 text-[var(--electric)]">{suffix}</span>}
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-3)] sm:text-sm">
                {label}
            </p>
        </div>
    );
};

export const StatsBar = () => {
    const [stats, setStats] = React.useState({
        registrations: 500,
        speakers: 12,
        workshops: 8,
        days: 1
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getPublicEventStats } = await import('@/lib/api');
                const response = await getPublicEventStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="w-full border-y border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[var(--border)] border-x border-[var(--border)] sm:grid-cols-4 sm:divide-y-0">
                <StatItem value={stats.registrations} suffix="+" label="Students Registered" />
                <StatItem value={stats.speakers} label="Expert Speakers" />
                <StatItem value={stats.workshops} label="Hands-on Workshops" />
                <StatItem value={stats.days} suffix="Epic Day" label="Innovation Journey" />
            </div>
        </section>
    );
};
