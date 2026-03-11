"use client";

import * as React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    Cloud,
    Lock,
    Mail,
    ArrowRight,
    ShieldCheck,
    Eye,
    EyeOff,
    AlertCircle
} from "lucide-react";
import {
    Button,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Spinner
} from "@/components/ui";
import { PageWrapper } from "@/components/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid admin email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const router = useRouter();
    const { login, loading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginData) => {
        const success = await login(data.email, data.password);
        if (success) {
            // Add a small delay before redirect to show the success toast
            await new Promise((resolve) => setTimeout(resolve, 500));
            router.push("/admin");
        }
    };

    return (
        <PageWrapper className="min-h-screen bg-[var(--void)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-[var(--electric)]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-[var(--ember)]/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <header className="mb-10 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--electric)] text-white shadow-glow mb-6">
                        <Cloud size={32} />
                    </div>
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-[var(--electric-light)] underline decoration-[var(--electric)]/20 underline-offset-4">Internal Access Only</Badge>
                    <h1 className="font-display text-4xl font-extrabold text-[var(--text-1)]">Admin Portal</h1>
                    <p className="mt-4 text-[var(--text-3)] text-sm max-w-xs mx-auto">Authorized access restricted to event leads and AWS staff.</p>
                </header>

                <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[var(--electric)] to-[var(--electric-light)]" />
                    <CardContent className="p-8 space-y-6">

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2 relative">
                                <Input
                                    label="Admin Email"
                                    placeholder="admin@aws.com"
                                    className="pl-10 h-12 bg-[var(--void)]/50 border-[var(--border)] focus:border-[var(--electric)]/50"
                                    {...register("email")}
                                    error={errors.email?.message}
                                />
                                <Mail className="absolute left-3 top-10 text-[var(--text-3)]" size={18} />
                            </div>

                            <div className="space-y-2 relative">
                                <Input
                                    label="Secret Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-12 h-12 bg-[var(--void)]/50 border-[var(--border)] focus:border-[var(--electric)]/50"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <Lock className="absolute left-3 top-10 text-[var(--text-3)]" size={18} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-10 h-6 w-6 flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full h-14 font-display font-bold uppercase tracking-widest text-xs shadow-glow mt-4"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <>
                                        Authenticate Access <ShieldCheck className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <footer className="mt-8 text-center">
                    <Link href="/" className="text-[var(--text-3)] text-xs hover:text-[var(--electric)] transition-colors inline-flex items-center gap-2 font-mono uppercase tracking-widest">
                        Back to Public <ArrowRight size={14} />
                    </Link>
                </footer>
            </motion.div>
        </PageWrapper>
    );
}
