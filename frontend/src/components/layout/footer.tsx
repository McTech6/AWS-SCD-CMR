import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";
import { Divider } from "@/components/ui";

const footerLinks = {
  nav: [
    { href: "/", label: "Home" },
    { href: "/speakers", label: "Speakers" },
    { href: "/register", label: "Register" },
    { href: "/speak", label: "Apply to Speak" },
    { href: "/volunteer", label: "Apply to Volunteer" },
  ],
  resources: [
    { href: "#agenda", label: "Agenda" },
    { href: "#sponsors", label: "Sponsors" },
    { href: "#contact", label: "Contact" },
  ],
};

const socialIcons = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Github, href: "#", label: "GitHub" },
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
              <img src="/images (1).png" alt="Logo" className="h-8 w-8 object-contain rounded-full bg-white p-0.5" />
              AWS Cloud Club
            </Link>
            <p className="mt-2 text-sm text-[var(--text-2)]">
              Student Community Day — Powered by AWS Cloud Club
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
              href="mailto:cloudclub@example.com"
              className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--electric-light)]"
            >
              cloudclub@example.com
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
          <p className="text-sm text-[var(--text-3)]">
            © {new Date().getFullYear()} AWS Cloud Club. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-[var(--text-3)]">
              Built with ❤️ by the Cloud Club
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
