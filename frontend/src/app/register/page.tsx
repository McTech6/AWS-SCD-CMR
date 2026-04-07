"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import * as z from "zod";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Divider,
  Spinner,
  CalendarButton,
} from "@/components/ui";
import { PageWrapper, Navbar, Footer } from "@/components/layout";
import {
  ChevronRight,
  CheckCircle2,
  Cloud,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { registerAttendee, lookupAttendeeByEmail } from "@/lib/api";
import { log } from "console";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  institution: z.string().min(2, "Institution name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  tShirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;

/**
 * T-Shirt Segmented Control
 */
const TShirtSelector = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-[var(--text-2)]">
        Select your T-Shirt size (Optional)
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xs sm:text-sm font-bold transition-all duration-200",
              value === size
                ? "border-[var(--electric)] bg-[var(--electric)]/10 text-[var(--electric)] shadow-glow"
                : "text-[var(--text-2)] hover:border-[var(--text-3)]",
              error && !value && "border-[var(--error)]"
            )}
          >
            {size}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
};

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationId, setRegistrationId] = React.useState("");
  const [selectedTShirt, setSelectedTShirt] = React.useState<string | null>(null);

  // New lookup flow state
  const [isLookupMode, setIsLookupMode] = React.useState(false);
  const [lookupEmail, setLookupEmail] = React.useState("");
  const [isLookingUp, setIsLookingUp] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      institution: "",
      phone: ""
    }
  });

  const router = useRouter();
  const selectedSize = watch("tShirtSize") || "";

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);

    try {
      const response = await registerAttendee({
        name: data.fullName,
        email: data.email,
        university: data.institution,
        phone: data.phone,
        tshirtSize: data.tShirtSize || "M",
      });

      if (response.success) {
        localStorage.setItem("attendeeId", response.data.attendee.id);
        if (data.tShirtSize) {
          localStorage.setItem("tshirtSize", data.tShirtSize);
          setSelectedTShirt(data.tShirtSize);
        }

        toast.success("Registration successful! Welcome to the event!");
        setIsSubmitting(false);
        setIsSuccess(true);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#5B6EF5", "#FF6B35", "#FFFFFF"],
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail) return toast.error("Please enter your email");

    setIsLookingUp(true);
    try {
      const response = await lookupAttendeeByEmail(lookupEmail);
      if (response.success) {
        // Payment flow disconnected for now
        /*
        if (response.data.hasPaid) {
          toast.success("You have already completed your payment.");
          return;
        }
        localStorage.setItem("attendeeId", response.data.id);
        localStorage.setItem("tshirtSize", response.data.tshirtSize);
        toast.success(`Found registration for ${response.data.name}! Redirecting to payment...`);
        router.push("/payment");
        */
        toast.success(`Found registration for ${response.data.name}! We look forward to seeing you at the event.`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration not found");
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex min-h-screen items-stretch bg-[var(--void)] pt-24">
        {/* Split layout (50/50) */}
        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
          {/* Left Panel: Event Visuals */}
          <div className="relative hidden flex-col justify-center overflow-hidden bg-[var(--surface)] p-12 lg:flex">
            <div className="absolute inset-0 z-0 opacity-20 contrast-125 saturate-50 mix-blend-screen">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
                className="h-full w-full object-cover"
                alt="Event background"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--void)] via-[var(--surface)]/80 to-[var(--electric)]/20" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto" />

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="my-auto"
              >
                <Badge
                  variant="outline"
                  className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] underline decoration-[var(--electric)]/20 underline-offset-4"
                >
                  The Cloud Summit
                </Badge>
                <h1 className="font-display text-5xl font-extrabold text-[var(--text-1)] leading-tight">
                  Secure Your <br />
                  <span className="bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)] bg-clip-text text-transparent italic underline decoration-[var(--ember)]/30 decoration-wavy underline-offset-8">
                    Seat in History.
                  </span>
                </h1>

                <div className="mt-12 flex flex-col gap-6 text-[var(--text-2)]">
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[var(--electric)] transition-transform group-hover:scale-110">
                      <Calendar size={18} />
                    </div>
                    <span className="text-lg">May 23, 2026</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[var(--electric)] transition-transform group-hover:scale-110">
                      <MapPin size={18} />
                    </div>
                    <span className="text-lg">Douala, Cameroon</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[var(--electric)] transition-transform group-hover:scale-110">
                      <Clock size={18} />
                    </div>
                    <span className="text-lg">09:00 AM — 05:00 PM</span>
                  </div>
                </div>

                <div className="mt-16 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--panel)]/50 p-6 backdrop-blur-md shadow-elevated">
                  <p className="italic text-[var(--text-2)] leading-relaxed">
                    "The last summit redefined how I think about infrastructure.
                    If you're a student building literally anything, you have to
                    be here."
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full border border-[var(--electric)] overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
                        alt="Student"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-[var(--text-1)]">
                        Alex Rivera
                      </span>
                      <span className="block text-xs text-[var(--text-3)] text-mono">
                        Cloud Engineer @ AWS Cloud Club
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-auto pt-12">
                <Divider className="opacity-10 mb-6" />
                <p className="text-xs text-[var(--text-3)] font-mono tracking-widest uppercase">
                  Powered by AWS for Students
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-[var(--void)]">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <header className="mb-10 text-center lg:text-left">
                      <h2 className="font-display text-3xl font-extrabold text-[var(--text-1)] lg:text-4xl">
                        {isLookupMode ? "Find Registration." : "Register."}
                      </h2>
                      <p className="mt-2 text-[var(--text-2)]">
                        {isLookupMode 
                          ? "Enter the email you used to register to continue to payment." 
                          : "Welcome back, builder. Secure your spot below."}
                      </p>
                    </header>

                    {isLookupMode ? (
                      <form onSubmit={handleLookup} className="space-y-6">
                        <Input
                          label="Registered Email Address"
                          type="email"
                          placeholder="jane@university.edu"
                          value={lookupEmail}
                          onChange={(e) => setLookupEmail(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          size="lg"
                          className="group w-full h-14 font-display text-lg shadow-glow mt-8"
                          disabled={isLookingUp}
                          type="submit"
                        >
                          {isLookingUp ? (
                            <div className="flex items-center gap-2">
                              <Spinner className="h-5 w-5 border-2 text-white/50 border-t-white" />
                              Searching...
                            </div>
                          ) : (
                            <>
                              Find Registration
                              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                        <p className="mt-6 text-center text-sm font-mono text-[var(--text-2)]">
                          New here?{" "}
                          <button
                            type="button"
                            onClick={() => setIsLookupMode(false)}
                            className="text-[var(--electric-light)] hover:underline"
                          >
                            Create a new registration
                          </button>
                        </p>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <Input
                          label="Full Name"
                          placeholder="Jane Doe"
                          {...register("fullName")}
                          error={errors.fullName?.message}
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="jane@university.edu"
                          {...register("email")}
                          error={errors.email?.message}
                        />
                        <Input
                          label="University / Institution"
                          placeholder="MIT / Harvard / Stanford"
                          {...register("institution")}
                          error={errors.institution?.message}
                        />
                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register("phone")}
                          error={errors.phone?.message}
                        />

                        <TShirtSelector
                          value={selectedSize || ""}
                          onChange={(size) =>
                            setValue("tShirtSize", size as any, {
                              shouldValidate: true,
                            })
                          }
                          error={errors.tShirtSize?.message}
                        />

                        <Button
                          variant="ember"
                          size="lg"
                          className="group w-full h-14 font-display text-lg shadow-glow mt-8"
                          disabled={isSubmitting}
                          type="submit"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <Spinner className="h-5 w-5 border-2 text-white/50 border-t-white" />
                              Processing...
                            </div>
                          ) : (
                            <>
                              Complete Registration
                              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>

                        {/* Payment flow disconnected for now */}
                        {/* 
                        <p className="mt-6 text-center text-sm font-mono text-[var(--text-2)]">
                          Already registered?{" "}
                          <button
                            type="button"
                            onClick={() => setIsLookupMode(true)}
                            className="text-[var(--electric-light)] hover:underline"
                          >
                            Pay for your T-Shirt
                          </button>
                        </p>
                        */}

                        <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-[var(--text-3)] font-mono">
                          By registering, you agree to our Code of Conduct &
                          Privacy Policy
                        </p>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <div className="relative mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 12,
                        }}
                        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)] shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                      >
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0, 0.1],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 z-0 h-24 w-24 rounded-full bg-[var(--success)]"
                      />
                    </div>

                    <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)]">
                      You're In!
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-[var(--text-2)]">
                      We've sent a confirmation email with your digital pass.
                      Get ready to architect the future.
                    </p>

                    <div className="mt-12 flex w-full flex-col sm:flex-row gap-4">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="h-14 w-full flex-1"
                        asChild
                      >
                        <Link href="/">Back to Home</Link>
                      </Button>
                      <CalendarButton
                        variant="ember"
                        className="flex-1 shadow-glow"
                      />
                    </div>

                    <div className="mt-6 w-full">
                       <Button 
                          variant="primary" 
                          asChild 
                          className="h-16 w-full shadow-glow gap-3 font-black uppercase text-xs tracking-widest bg-[#25D366] hover:bg-[#20bd5c] border-none text-white transition-all transform hover:scale-[1.02] active:scale-95"
                       >
                          <a href="https://chat.whatsapp.com/DY67dx8NWxu6xs6dVRNc2G?mode=gi_t" target="_blank" rel="noopener noreferrer">
                             <MessageCircle size={20} fill="currentColor" />
                             Join Community WhatsApp
                          </a>
                       </Button>
                    </div>

                    <div className="mt-12 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel)] p-4 w-full">
                      <span className="block text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-3)] mb-2">
                        Registration ID
                      </span>
                      {/* Premium T-Shirt Offer */}
                      {/* Payment flow disconnected for now */}
                      {/* 
                      {selectedTShirt && (
                        ...
                      )}
                      */}
                      <span className="font-mono text-[var(--electric-light)] tracking-tight">
                        {registrationId || "AWS-SCD-CMR-2026-XXXX"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
