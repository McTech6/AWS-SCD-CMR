"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Input, 
  Button, 
  Badge,
  ProgressBar
} from "@/components/ui";
import { 
  Building2, 
  Mail, 
  User, 
  Globe, 
  ImageIcon, 
  ShieldCheck, 
  ArrowRight,
  Send,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { applySponsor } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

const applySchema = z.object({
  name: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact person name is required"),
  contactEmail: z.string().email("Invalid contact email"),
  website: z.string().url("Please enter a valid URL (https://...)"),
  logoUrl: z.string().url("Please enter a valid image URL for your logo"),
});

type ApplyFormValues = z.infer<typeof applySchema>;

export default function SponsorshipApplyPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema)
  });

  const onSubmit = async (data: ApplyFormValues) => {
    try {
      await applySponsor(data);
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--void)] flex items-center justify-center p-6 pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--electric)]/5 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--ember)]/5 blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-[var(--success)]/10 flex items-center justify-center border border-[var(--success)]/30">
              <CheckCircle2 size={48} className="text-[var(--success)]" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-black text-[var(--text-1)] tracking-tight">Application Received!</h1>
          <p className="text-[var(--text-2)] leading-relaxed">
            Thank you for your interest in partnering with AWS Student Community Day. 
            Our regional team will review your application and reach out via email within 2-3 business days.
          </p>
          <div className="pt-8">
            <Button variant="primary" asChild className="w-full h-14 rounded-full font-black uppercase tracking-widest text-xs shadow-glow">
              <Link href="/">Back to Landing</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--void)] p-6 pb-20 overflow-hidden relative">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--electric)]/5 blur-[120px] -z-10 animate-pulse" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-6xl mx-auto pt-16 lg:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
        
        {/* Content Side */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Badge variant="outline" className="mb-6 uppercase tracking-[0.3em] text-[var(--electric-light)] px-4 py-1.5 border-[var(--electric)]/20 bg-[var(--electric)]/10">Partner with Us</Badge>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-[var(--text-1)] tracking-tight leading-[1.1]">
              Amplify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--electric)] to-[var(--ember)]">Impact.</span>
            </h1>
            <p className="mt-8 text-xl text-[var(--text-2)] leading-relaxed font-medium">
              Join the largest gathering of cloud pioneers in the region. Directly empower 
              the next generation of developers and gain unparalleled visibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 rounded-[var(--radius-xl)] bg-white/5 border border-[var(--border)] group hover:border-[var(--electric)]/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[var(--electric)]/10 flex items-center justify-center text-[var(--electric-light)] mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-[var(--text-1)]">Global Recognition</h3>
              <p className="text-sm text-[var(--text-3)]">Showcase your brand alongside global cloud leaders.</p>
            </div>
            <div className="space-y-3 p-6 rounded-[var(--radius-xl)] bg-white/5 border border-[var(--border)] group hover:border-[var(--ember)]/30 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[var(--ember)]/10 flex items-center justify-center text-[var(--ember)] mb-4">
                <ArrowRight size={20} />
              </div>
              <h3 className="font-bold text-[var(--text-1)]">Talent Pipeline</h3>
              <p className="text-sm text-[var(--text-3)]">Direct access to top-tier student developers and innovators.</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-2xl shadow-elevated overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[var(--electric)] to-[var(--ember)]" />
            <CardHeader className="p-8 lg:p-12 pb-4">
              <CardTitle className="text-3xl font-black text-[var(--text-1)]">Application Phase</CardTitle>
              <p className="text-[var(--text-3)] font-mono text-[10px] uppercase tracking-widest mt-2">Initialize partnership sequence</p>
            </CardHeader>
            <CardContent className="p-8 lg:p-12 pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] ml-1">Organization Name</label>
                    <div className="relative">
                      <Input 
                        {...register("name")}
                        error={errors.name?.message}
                        placeholder="e.g. Amazon Web Services" 
                        className="pl-12 h-14 border-[var(--border)] bg-[var(--void)]/50 focus:bg-[var(--void)]"
                      />
                      <Building2 size={18} className="absolute left-4 top-4 text-[var(--text-3)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] ml-1">Contact Person</label>
                      <div className="relative">
                        <Input 
                          {...register("contactName")}
                          error={errors.contactName?.message}
                          placeholder="John Doe" 
                          className="pl-12 h-14 border-[var(--border)] bg-[var(--void)]/50 focus:bg-[var(--void)]"
                        />
                        <User size={18} className="absolute left-4 top-4 text-[var(--text-3)]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] ml-1">Contact Email</label>
                      <div className="relative">
                        <Input 
                          {...register("contactEmail")}
                          error={errors.contactEmail?.message}
                          placeholder="j.doe@company.com" 
                          className="pl-12 h-14 border-[var(--border)] bg-[var(--void)]/50 focus:bg-[var(--void)]"
                        />
                        <Mail size={18} className="absolute left-4 top-4 text-[var(--text-3)]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] ml-1">Website URL</label>
                    <div className="relative">
                      <Input 
                        {...register("website")}
                        error={errors.website?.message}
                        placeholder="https://www.company.com" 
                        className="pl-12 h-14 border-[var(--border)] bg-[var(--void)]/50 focus:bg-[var(--void)]"
                      />
                      <Globe size={18} className="absolute left-4 top-4 text-[var(--text-3)]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] ml-1">Company Logo URL (SVG High-res)</label>
                    <div className="relative">
                      <Input 
                        {...register("logoUrl")}
                        error={errors.logoUrl?.message}
                        placeholder="https://..." 
                        className="pl-12 h-14 border-[var(--border)] bg-[var(--void)]/50 focus:bg-[var(--void)]"
                      />
                      <ImageIcon size={18} className="absolute left-4 top-4 text-[var(--text-3)]" />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full h-16 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-glow gap-3 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmitting Data...</span>
                    ) : (
                      <>
                        Request Partnership
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-[var(--text-3)] mt-6 font-mono leading-relaxed">
                    By submitting, you agree to being contacted by our partnership team regarding the AWS Student Community Day sponsorship opportunities.
                  </p>
                </div>

              </form>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
