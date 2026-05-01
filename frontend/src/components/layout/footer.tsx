import Link from "next/link";
import {
  MessageCircle,
} from "lucide-react";
import { Divider } from "@/components/ui";

const footerLinks = {
  nav: [
    { href: "/", label: "Home" },
    { href: "/speakers", label: "Speakers" },
    { href: "/register", label: "Register" },
    { href: "/speak", label: "Apply to Speak" },
    { href: "/volunteer", label: "Apply to Volunteer" },
    { href: "/iwillbethere", label: "I'll Be There 🎉" },
  ],
  resources: [
    { href: "#agenda", label: "Agenda" },
    { href: "#venue", label: "Venue" },
    { href: "#sponsors", label: "Sponsors" },
    { href: "#contact", label: "Contact" },
  ],
};

const socialIcons = [
  { Icon: MessageCircle, href: "https://chat.whatsapp.com/DY67dx8NWxu6xs6dVRNc2G?mode=gi_t", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--void)]">
      <Divider className="opacity-60" />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + tagline */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-xl font-extrabold text-[var(--text-1)]"
            >
              <img src="/aws.png" alt="Logo" className="h-8 w-8 object-contain rounded-full bg-black p-1" />
              <span className="sm:hidden">AWS SBG</span>
              <span className="hidden sm:block">AWS Student Builder Groups</span>
            </Link>
            <p className="mt-2 text-sm text-[var(--text-2)] max-w-xs">
              Student Community Day — Powered by AWS Student Builder Groups
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-2)]">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--electric-light)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-2)]">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--electric-light)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-2)]">
              Contact
            </h4>
            <a
              href="mailto:awsstudentcommunitydaycmr@gmail.com"
              className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--electric-light)]"
            >
              awsstudentcommunitydaycmr@gmail.com
            </a>
            <div className="mt-4 flex gap-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[var(--text-2)] transition-colors hover:text-[var(--electric-light)]"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="text-sm text-[var(--text-3)] text-center sm:text-left">
            © {new Date().getFullYear()} AWS Student Builder Groups. All rights reserved.
          </p>
          <div className="flex items-center gap-4 justify-center sm:justify-end">
            <p className="text-sm text-[var(--text-3)] text-center sm:text-right">
              Built with ❤️ by the Student Builder Groups
            </p>
            <Link
              href="/login"
              className="text-[14px] text-[var(--text-3)] opacity-10 hover:opacity-100 transition-opacity cursor-pointer p-1"
              title="Admin Access"
            >
              •
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
