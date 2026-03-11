"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Mic2,
    Mail,
    Award,
    Settings,
    LogOut,
    ChevronLeft,
    Cloud,
    Bell,
    Search,
    Menu,
    X,
    Calendar,
    Heart,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Avatar, Divider, Input } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Attendees", icon: Users, href: "/admin/attendees" },
    { label: "Speakers", icon: Mic2, href: "/admin/speakers" },
    { label: "Agenda", icon: Calendar, href: "/admin/agenda" },
    { label: "Sponsors", icon: Heart, href: "/admin/sponsors" },
    { label: "Organizers", icon: Shield, href: "/admin/organizers" },
    { label: "Emails", icon: Mail, href: "/admin/emails" },
    { label: "Certificates", icon: Award, href: "/admin/certificates" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export const AdminSidebar = ({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen
}: {
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (v: boolean) => void;
}) => {
    const pathname = usePathname();

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden">
            {/* Brand */}
            <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--electric)] text-white shadow-glow">
                        <Cloud size={20} />
                    </div>
                    {!isCollapsed && (
                        <span className="font-display font-bold text-[var(--text-1)] tracking-tight">
                            AWS Admin
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/5 text-[var(--text-3)] transition-colors"
                >
                    <ChevronLeft className={cn("transition-transform", isCollapsed && "rotate-180")} size={16} />
                </button>
            </div>

            <Divider className="opacity-5 mx-4" />

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative duration-200",
                            pathname === item.href
                                ? "bg-[var(--electric)]/10 text-[var(--electric-light)]"
                                : "text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text-1)]"
                        )}
                    >
                        <item.icon size={20} className={cn(
                            "shrink-0",
                            pathname === item.href ? "text-[var(--electric)]" : "text-[var(--text-3)] group-hover:text-[var(--text-1)] transition-colors"
                        )} />
                        {!isCollapsed && <span>{item.label}</span>}

                        {/* Active Indicator */}
                        {pathname === item.href && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--electric)] rounded-r-full"
                            />
                        )}

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-elevated z-50">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)]/10">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--error)]/70 hover:bg-[var(--error)]/5 hover:text-[var(--error)] transition-all group">
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className={cn(
                "hidden lg:block fixed left-0 top-0 bottom-0 z-50 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-72 z-[70]"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export const AdminHeader = ({ setIsMobileOpen }: { setIsMobileOpen: (v: boolean) => void }) => {
    return (
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--panel)] text-[var(--text-1)]"
                >
                    <Menu size={20} />
                </button>
                <span className="font-display text-xl font-bold text-[var(--text-1)] hidden sm:inline-block">
                    Dashboard
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={16} />
                    <Input
                        className="pl-10 h-10 bg-[var(--void)]/50 border-[var(--border)] focus:border-[var(--electric)]/40 transition-all text-xs"
                        placeholder="Global search..."
                    />
                </div>

                <button className="relative h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-[var(--text-2)] transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--ember)] border-2 border-[var(--surface)]" />
                </button>

                <Divider className="h-8 w-px bg-[var(--border)] vertical m-0" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <span className="block text-sm font-bold text-[var(--text-1)]">Admin Tidding</span>
                        <span className="block text-[10px] uppercase font-mono tracking-widest text-[var(--success)]">Cloud Architect</span>
                    </div>
                    <Avatar name="Admin Tidding" className="h-10 w-10 border-2 border-[var(--electric)] shadow-glow" />
                </div>
            </div>
        </header>
    );
};

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[var(--void)]">
            <AdminSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={cn(
                "transition-all duration-300",
                isCollapsed ? "lg:pl-20" : "lg:pl-64"
            )}>
                <AdminHeader setIsMobileOpen={setIsMobileOpen} />
                <main className="p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
