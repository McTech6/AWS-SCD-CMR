"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout";
import { Badge, Divider } from "@/components/ui";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What's the difference between a Student Community Day and a standard Community Day?",
    answer: "Unlike standard Community Days which target industry veterans and enterprises, a Student Community Day is custom-built for students and early-career developers. We focus on academic-to-industry pathways, hands-on learning labs for beginners, and mentorship specifically designed to help students land their first roles in the cloud ecosystem."
  },
  {
    question: "Is this event completely free?",
    answer: "Absolutely! The event is 100% free for students. This includes access to all sessions, workshops, networking zones, and even some AWS swag. However, seats are limited, so you must register in advance."
  },
  {
    question: "Do I need to be an AWS expert to attend?",
    answer: "Not at all. Whether you're a absolute beginner who just heard about 'the cloud' or a student who has already built some apps, there's a track for you. We have sessions ranging from introductory overviews to technical deep-dives."
  },
  {
    question: "Will I receive a certificate?",
    answer: "Yes! Every registered attendee who completes the event sessions will receive a digital certificate of attendance, verifiable through the AWS Student Community portal."
  },
  {
    question: "What should I bring to the event?",
    answer: "Bring your laptop (and charger) if you plan on participating in workshops. Also, bring your curiosity, your registration ID (on your phone), and a passion for learning. We'll handle the rest!"
  }
];

const FAQItem = ({ question, answer, isOpen, onClick, index }: any) => {
  return (
    <div className="border-b border-[var(--border)] last:border-0 overflow-hidden">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-[var(--electric)] group"
      >
        <h3 className="pr-8 font-display text-lg font-bold text-[var(--text-1)] group-hover:text-[var(--electric)] sm:text-xl">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm"
        >
          <ChevronDown size={20} className={cn("text-[var(--text-3)]", isOpen && "text-[var(--electric)]")} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-8 pr-12 text-[var(--text-2)] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <Section id="faq" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--electric)]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] px-4 py-1">Support Center</Badge>
          <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] sm:text-5xl lg:text-7xl tracking-tighter">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)]">Questions</span>?
          </h2>
          <p className="mt-6 text-[var(--text-2)] text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about the GENESIS Student Community Day.
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]/30 p-2 sm:p-8 backdrop-blur-md shadow-card">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              {...faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>

      </div>
      
      <Divider className="mt-20 opacity-10" />
    </Section>
  );
};
