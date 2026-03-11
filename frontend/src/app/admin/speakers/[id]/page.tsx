"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    CheckCircle2,
    XCircle,
    Mic2,
    Calendar,
    Mail,
    Linkedin,
    Twitter,
    Github,
    ExternalLink,
    Clock,
    ShieldCheck,
    MessageSquare,
    Zap,
    Download,
    Award,
    FileText,
    Share2
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Avatar,
    Divider,
    Badge,
    Switch
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { getSpeakerById, approveSpeaker, rejectSpeaker } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SpeakerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [status, setStatus] = React.useState<"Pending" | "Approved" | "Rejected">("Pending");

    const speakerId = params.id as string;
    const [speaker, setSpeaker] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [reviewNote, setReviewNote] = React.useState("");

    React.useEffect(() => {
        const fetchSpeaker = async () => {
            try {
                const res = await getSpeakerById(speakerId);
                if (res.success && res.data) {
                    setSpeaker({
                        ...res.data,
                        name: res.data.user?.name || "Unknown",
                        email: res.data.user?.email || "Unknown",
                        image: res.data.photoUrl || res.data.user?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                        abstract: res.data.talkAbstract || res.data.topic || "No abstract provided.",
                        role: res.data.role || "Speaker"
                    });
                    setStatus(res.data.status === 'APPROVED' ? 'Approved' : res.data.status === 'REJECTED' ? 'Rejected' : 'Pending');
                    setReviewNote(res.data.reviewNote || "");
                }
            } catch (err) {
                toast.error("Failed to load speaker");
            } finally {
                setLoading(false);
            }
        };
        fetchSpeaker();
    }, [speakerId]);

    const handleAction = async (type: "Approved" | "Rejected") => {
        setIsProcessing(true);
        try {
            if (type === "Approved") {
                await approveSpeaker(speakerId);
                toast.success("Speaker approved and notified!");
            } else {
                if (!reviewNote) {
                    toast.error("Review note is required for rejection");
                    setIsProcessing(false);
                    return;
                }
                await rejectSpeaker(speakerId, reviewNote);
                toast.success("Speaker rejected and notified");
            }
            setStatus(type);
        } catch (error) {
            toast.error(`Failed to ${type.toLowerCase()} speaker`);
        } finally {
            setIsProcessing(false);
            setTimeout(() => {
                router.push("/admin/speakers");
            }, 1000);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-[var(--text-3)] font-mono animate-pulse">Loading Speaker...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!speaker) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-[var(--error)] font-mono">Speaker not found</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                {/* Top Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--electric)] transition-all group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Proposal Review</h2>
                            <h1 className="text-2xl font-display font-black text-[var(--text-1)]">Evaluation: {speaker.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="border-[var(--border)] gap-2 h-10 px-4">
                            <Download size={16} /> Export Specs
                        </Button>
                        <Button variant="outline" size="sm" className="border-[var(--border)] gap-2 h-10 px-4">
                            <Share2 size={16} /> Share Review
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Speaker Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-[var(--electric)]/20 to-transparent border-b border-[var(--border)]/10" />
                            <CardContent className="p-8 -mt-12">
                                <div className="flex flex-col items-center text-center">
                                    <Avatar name={speaker.name} src={speaker.image} className="h-24 w-24 border-4 border-[var(--void)] shadow-glow mb-4" />
                                    <h3 className="text-2xl font-display font-bold text-[var(--text-1)]">{speaker.name}</h3>
                                    <p className="text-sm text-[var(--text-3)] mt-1">{speaker.email}</p>
                                    <p className="text-xs text-[var(--text-2)] mt-2 font-medium">
                                        {speaker.role} @ <span className="text-[var(--text-1)]">AWS Community</span>
                                    </p>

                                    <div className="flex items-center gap-2 mt-4">
                                        <Badge variant="outline" className="bg-[var(--electric)]/5 border-[var(--electric)]/20 text-[var(--electric-light)] uppercase tracking-wider text-[10px]">
                                            {speaker.track}
                                        </Badge>
                                    </div>

                                    <div className="mt-8 w-full space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5">
                                            <div className="flex items-center gap-2 text-[var(--text-3)]">
                                                <Mic2 size={14} />
                                                <span className="text-xs font-medium">Submissions</span>
                                            </div>
                                            <span className="text-xs font-bold text-[var(--text-1)]">{speaker.submissions}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5">
                                            <div className="flex items-center gap-2 text-[var(--text-3)]">
                                                <Award size={14} />
                                                <span className="text-xs font-medium">Speaker Rating</span>
                                            </div>
                                            <span className="text-xs font-bold text-[var(--text-1)]">{speaker.rating}/5.0</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5">
                                            <div className="flex items-center gap-2 text-[var(--text-3)]">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium">Submitted On</span>
                                            </div>
                                            <span className="text-xs font-bold text-[var(--text-1)]">{new Date(speaker.submittedAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4">
                                        <a href={speaker.linkedin} target="_blank" className="h-10 w-10 rounded-full bg-white/5 border border-[var(--border)]/10 flex items-center justify-center hover:bg-[var(--electric)]/10 hover:border-[var(--electric)]/30 transition-all text-white">
                                            <Linkedin size={18} />
                                        </a>
                                        <a href={speaker.twitter} target="_blank" className="h-10 w-10 rounded-full bg-white/5 border border-[var(--border)]/10 flex items-center justify-center hover:bg-[var(--electric)]/10 hover:border-[var(--electric)]/30 transition-all text-white">
                                            <Twitter size={18} />
                                        </a>
                                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-[var(--border)]/10 flex items-center justify-center hover:bg-[var(--electric)]/10 hover:border-[var(--electric)]/30 transition-all text-white">
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Biography */}
                        <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--electric)] mb-4">Biography</h4>
                            <p className="text-sm text-[var(--text-2)] leading-relaxed italic border-l-2 border-[var(--electric)]/30 pl-4 py-1">
                                "{speaker.bio}"
                            </p>
                        </Card>
                    </div>

                    {/* Right Column: Session & Review */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Session Detail */}
                        <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                            <CardHeader className="p-8 border-b border-[var(--border)]/10 bg-white/5">
                                <div className="flex items-center gap-3 text-[var(--electric)] mb-2">
                                    <FileText size={18} />
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Technical Proposal</span>
                                </div>
                                <CardTitle className="text-3xl font-display font-black text-[var(--text-1)] leading-tight">
                                    {speaker.topic}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">— Abstract</h4>
                                    <p className="text-base text-[var(--text-2)] leading-relaxed bg-[var(--void)]/20 p-6 rounded-xl border border-[var(--border)]/10 border-dashed">
                                        {speaker.abstract}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">— Technical Level</h4>
                                        <div className="flex gap-2">
                                            {['Level 100', 'Level 200', 'Level 300', 'Level 400'].map(level => (
                                                <Badge
                                                    key={level}
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] h-6 border-[var(--border)]",
                                                        level === 'Level 300' ? "bg-[var(--electric)] text-white border-transparent" : "opacity-40"
                                                    )}
                                                >
                                                    {level}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">— Prerequisites</h4>
                                        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-3)]">
                                            <span className="px-2 py-1 bg-white/5 rounded border border-white/5">AWS Basics</span>
                                            <span className="px-2 py-1 bg-white/5 rounded border border-white/5">JavaScript</span>
                                            <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Serverless Concepts</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Command Center */}
                        <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-glow">
                            <CardHeader className="border-b border-[var(--border)]/10 bg-[var(--electric)]/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap size={20} className="text-[var(--electric)]" />
                                        <CardTitle className="text-xl font-bold">Decision Sequence</CardTitle>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "uppercase tracking-widest font-black",
                                            status === 'Pending' ? "text-[var(--ember)] border-[var(--ember)]" :
                                                status === 'Approved' ? "text-[var(--success)] border-[var(--success)] shadow-[0_0_10px_var(--success)]" :
                                                    "text-[var(--error)] border-[var(--error)]"
                                        )}
                                    >
                                        {status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">Internal Review Note</h4>
                                        <textarea
                                            className="w-full mt-3 bg-[var(--void)]/50 border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--text-2)] h-32 focus:border-[var(--electric)] transition-colors outline-none resize-none"
                                            placeholder="Enter evaluation notes here (required for rejection)..."
                                            value={reviewNote}
                                            onChange={(e) => setReviewNote(e.target.value)}
                                            disabled={status !== 'Pending'}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-14 flex-1 border-[var(--error)]/20 text-[var(--error)] hover:bg-[var(--error)]/5 font-bold uppercase tracking-widest gap-2"
                                            onClick={() => handleAction('Rejected')}
                                            disabled={isProcessing || status !== 'Pending'}
                                        >
                                            {isProcessing ? "Processing..." : "Reject Submission"}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className={cn(
                                                "h-14 flex-[2] text-xs font-black uppercase tracking-[0.2em] shadow-glow gap-3",
                                                status === 'Approved' ? "bg-[var(--success)] border-none" : ""
                                            )}
                                            onClick={() => handleAction('Approved')}
                                            disabled={isProcessing || status !== 'Pending'}
                                        >
                                            {isProcessing ? (
                                                <><Clock className="animate-spin" /> Finalizing...</>
                                            ) : status === 'Approved' ? (
                                                <><CheckCircle2 /> Approved & Notified</>
                                            ) : (
                                                <><ShieldCheck /> Approve Session</>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-3)] text-center font-mono">
                                        * Approving this submission will automatically trigger an email to the speaker.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
