"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/speakers", label: "Speakers" },
  { href: "/organizers", label: "Organizers" },
  { href: "/#agenda", label: "Agenda" },
  { href: "/#sponsors", label: "Sponsors" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        "backdrop-blur-[24px] bg-[var(--void)]/80",
        isScrolled && "border-b border-[var(--border)]"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-lg font-extrabold text-[var(--text-1)]"
        >
          AWS Cloud Club
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--text-2)] transition-colors hover:text-[var(--text-1)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/speak">Apply as Speaker</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/register">Register Now</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          className="p-2 text-[var(--text-1)] md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 flex flex-col gap-6 bg-[var(--void)] p-6 md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-[var(--text-1)]"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-3">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/speak" onClick={() => setIsMobileOpen(false)}>
                Apply as Speaker
              </Link>
            </Button>
            <Button variant="primary" className="w-full" asChild>
              <Link href="/register" onClick={() => setIsMobileOpen(false)}>
                Register Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
