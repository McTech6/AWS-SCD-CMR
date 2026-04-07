"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/speakers", label: "Speakers" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/organizers", label: "Organizers" },
  { href: "/#agenda", label: "Agenda" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/iwillbethere", label: "I will be there" },

];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("");
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname) {
      // Basic heuristic for active state
      if (pathname === "/") {
        // Only set home active if we don't have a hash active
        if (!activeTab.includes("#")) setActiveTab("/");
      } else {
        setActiveTab(pathname);
      }
    }
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ease-out",
        isScrolled ? "py-4" : "py-6"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={cn(
            "relative flex items-center justify-between rounded-full border transition-all duration-500 shadow-xl",
            isScrolled
              ? "border-[var(--border)] bg-[var(--surface)]/80 p-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--surface)]/60"
              : "border-transparent bg-transparent p-3"
          )}
        >
          {/* Logo brand */}
          <Link
            href="/"
            onClick={() => setActiveTab("/")}
            className="flex items-center gap-2 pl-4"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-white p-1">
              <img src="/images (1).png" alt="AWS Cloud Club Logo" className="h-full w-full object-contain rounded-full" />
            </div>
            <span className="font-display text-lg font-black tracking-tight text-[var(--text-1)] hidden sm:block">
              AWS Cloud Club
            </span>
          </Link>

          {/* Desktop Links with Framer Motion Active Pill */}
          <div className="hidden md:flex items-center gap-1 rounded-full bg-[var(--void)]/50 p-1 backdrop-blur-md border border-[var(--border)] relative">
            {navLinks.map((link) => {
              const isActive = activeTab === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveTab(link.href)}
                  className={cn(
                    "relative px-5 py-2 text-sm font-semibold transition-colors z-10",
                    isActive ? "text-white" : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[var(--electric)] to-[var(--ember)] shadow-md"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 pr-2">
            <Button variant="ghost" size="sm" asChild className="rounded-full font-bold">
              <Link href="/speak">Speak</Link>
            </Button>
            <Button variant="ember" size="sm" asChild className="rounded-full shadow-glow font-bold group">
              <Link href="/register">
                Register <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--void)]/50 border border-[var(--border)] backdrop-blur-md text-[var(--text-1)] md:hidden mr-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer with glassmorphism */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed inset-x-4 top-24 z-50 flex max-h-[calc(100vh-120px)] flex-col gap-2 overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-elevated backdrop-blur-xl md:hidden scrollbar-none"
            >
              {navLinks.map((link) => {
                const isActive = activeTab === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setActiveTab(link.href);
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "rounded-lg px-4 py-3 text-lg font-bold transition-all",
                      isActive
                        ? "bg-[var(--electric)]/10 text-[var(--electric)]"
                        : "text-[var(--text-1)] hover:bg-[var(--void)]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
                <Button variant="ghost" size="lg" className="w-full justify-start rounded-full font-bold" asChild>
                  <Link href="/speak" onClick={() => setIsMobileOpen(false)}>Apply as Speaker</Link>
                </Button>
                <Button variant="ember" size="lg" className="w-full justify-between rounded-full shadow-glow font-bold" asChild>
                  <Link href="/register" onClick={() => setIsMobileOpen(false)}>
                    Register Now <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
