"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button, Input, Badge, Divider, Spinner } from "@/components/ui";

import { PageWrapper, Navbar, Footer } from "@/components/layout";
import { ChevronRight, CheckCircle2, Sparkles, Phone } from "lucide-react";
import { createPayment } from "@/lib/api";

const paymentSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^237\d+$/, "Use format 237XXXXXXXXX"),
});

type PaymentData = z.infer<typeof paymentSchema>;

const PaymentPage = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [savedTshirtSize, setSavedTshirtSize] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSavedTshirtSize(localStorage.getItem("tshirtSize") || null);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phoneNumber: ""
    }
  });

  const onSubmit = async (data: PaymentData) => {
    setIsSubmitting(true);

    try {
      const attendeeId = localStorage.getItem("attendeeId");

      if (!attendeeId) {
        toast.error("Attendee not found. Please register first.");
        return; // finally still runs
      }

      const response = await createPayment({
        attendeeId,
        amount: 2500,
        phoneNumber: data.phoneNumber,
      });

      if (response.success) {
        toast.success("Payment request sent to your phone!");
        setIsSuccess(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false); // ✅ always resets, even on early return
    }
  };

  return (
    <PageWrapper>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-(--void) pt-24">
        <div className="w-full max-w-md px-6">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                {/* HEADER */}
                <header className="mb-10 text-center">
                  <Badge
                    variant="warning"
                    className="mb-4 uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  >
                    Temporary Maintenance
                  </Badge>

                  <h2 className="font-display text-3xl font-extrabold text-[var(--text-1)]">
                    Payments are Paused
                  </h2>

                  <p className="mt-2 text-[var(--text-2)]">
                    T-shirt reservations are currently being processed manually. 
                    Please check back later or contact the organizers.
                  </p>
                </header>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-6 shadow-elevated opacity-50 pointer-events-none mb-4">
                  <div className="text-center py-4 italic text-[var(--text-3)]">
                    This section is temporarily unavailable.
                  </div>

                  {/* 
                  <div className="mb-6 rounded-lg border border-[var(--electric)]/20 bg-[var(--electric)]/5 p-4 text-center">
                    <span className="block text-xs uppercase tracking-widest text-[var(--text-3)]">
                      Amount to Pay
                    </span>
                    <span className="font-display text-3xl font-extrabold text-(--electric)">
                      2500 XAF
                    </span>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Mobile Money Number"
                      placeholder="237650000000"
                      {...register("phoneNumber")}
                      error={errors.phoneNumber?.message}
                    />

                    <Button
                      variant="ember"
                      size="lg"
                      className="group w-full h-14 font-display text-lg shadow-glow"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="h-5 w-5 border-2 text-white/50 border-t-white" />
                          Sending Payment Request...
                        </div>
                      ) : (
                        <>
                          Pay Now
                          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>

                  <Divider className="my-6 opacity-20" />

                  <p className="text-xs text-center text-(--text-3) font-mono uppercase tracking-widest">
                    You will receive a Mobile Money payment prompt on your phone
                  </p>
                  */}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-(--success)/10 text-(--success) border border-(--success)">
                  <CheckCircle2 size={48} />
                </div>

                <h2 className="font-display text-4xl font-extrabold text-(--text-1)">
                  Payment Sent!
                </h2>

                <p className="mt-4 text-(--text-2)">
                  A Mobile Money payment request has been sent to your phone.
                  Complete it to confirm your T-shirt.
                </p>

                <Button
                  className="mt-8 h-14 w-full"
                  variant="ghost"
                  onClick={() => router.push("/")}
                >
                  Back to Home
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </PageWrapper>
  );
};

export default PaymentPage;
