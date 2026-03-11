"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    Settings,
    Play,
    Clock,
    Search,
    Filter,
    Download,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Eye,
    Mail,
    Zap,
    Sparkles,
    Cloud,
    FileText
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Button,
    Input,
    Avatar,
    Divider,
    ProgressBar,
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription
} from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock Data
const CERT_LIST = [
    { id: "crt-1", name: "Alice Chen", email: "alice@example.com", status: "Sent", date: "2024-05-24" },
    { id: "crt-2", name: "Bob Smith", email: "bob@example.com", status: "Generated", date: "2024-05-24" },
    { id: "crt-3", name: "Charlie Davis", email: "charlie@example.com", status: "Not Generated", date: "2024-05-24" },
    { id: "crt-4", name: "Diana Prince", email: "diana@example.com", status: "Failed", date: "2024-05-24" },
];

export default function CertificatesAdminPage() {
    const [progress, setProgress] = React.useState(0);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    const startGeneration = () => {
        setIsGenerating(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    return 100;
                }
                return p + Math.random() * 10;
            });
        }, 500);
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Certificates</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Managing attendee recognition assets</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-[var(--border)] text-xs font-bold gap-2">
                            <Settings size={14} /> Templates
                        </Button>
                        <Button variant="primary" size="sm" className="shadow-glow text-xs font-bold gap-2" onClick={startGeneration} disabled={isGenerating}>
                            {isGenerating ? "Processing..." : <><Play size={14} /> Generate All</>}
                        </Button>
                    </div>
                </div>

                {/* Batch Status */}
                {isGenerating && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-[var(--electric)]/30 bg-[var(--electric)]/5 shadow-glow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[var(--electric)] flex items-center justify-center text-white animate-pulse">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[var(--text-1)]">Batch Job Running...</h4>
                                            <p className="text-xs text-[var(--text-3)]">Generating unique vectors and PDF blobs</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-display font-black text-[var(--electric-light)]">{Math.round(progress)}%</span>
                                </div>
                                <ProgressBar value={progress} className="h-2 bg-white/5" indicatorClassName="bg-[var(--electric)] transition-all duration-300" />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-3)] font-bold">Total Generated</span>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-3xl font-display font-black text-[var(--text-1)]">184</span>
                            <CheckCircle2 size={24} className="text-[var(--success)] opacity-50" />
                        </div>
                    </Card>
                    <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-3)] font-bold">Emailed Successfully</span>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-3xl font-display font-black text-[var(--text-1)]">152</span>
                            <Mail size={24} className="text-[var(--electric)] opacity-50" />
                        </div>
                    </Card>
                    <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-3)] font-bold">Failed / Pending</span>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-3xl font-display font-black text-[var(--text-1)]">32</span>
                            <XCircle size={24} className="text-[var(--error)] opacity-50" />
                        </div>
                    </Card>
                </div>

                {/* Main List */}
                <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={16} />
                            <Input className="pl-10 h-10 text-xs border-[var(--border)] bg-[var(--void)]/50" placeholder="Filter by attendee name..." />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest font-bold"><Download size={12} className="mr-2" /> Download All (.ZIP)</Button>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)] border-b border-[var(--border)]/50">
                                    <th className="px-6 py-4">Attendee</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Generated Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]/30">
                                {CERT_LIST.map((crt, i) => (
                                    <tr key={crt.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={crt.name} className="h-9 w-9 border border-white/5" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[var(--text-1)]">{crt.name}</span>
                                                    <span className="text-[10px] text-[var(--text-3)] font-mono">{crt.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[9px] uppercase tracking-widest font-mono font-bold h-5 px-2",
                                                    crt.status === 'Sent' ? "text-[var(--success)] border-[var(--success)]/20 bg-[var(--success)]/5" :
                                                        crt.status === 'Generated' ? "text-[var(--electric-light)] border-[var(--electric-light)]/20 bg-[var(--electric-light)]/5" :
                                                            crt.status === 'Failed' ? "text-[var(--error)] border-[var(--error)]/20 bg-[var(--error)]/5" :
                                                                "text-[var(--text-3)] border-[var(--border)] bg-transparent"
                                                )}
                                            >
                                                {crt.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-[var(--text-3)] font-mono">
                                            {crt.date}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setIsPreviewOpen(true)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors" title="Preview">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors" title="Resend Email">
                                                    <Mail size={16} />
                                                </button>
                                                <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[var(--text-3)] hover:text-[var(--error)] transition-colors" title="Download PDF">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Certificate Preview Modal */}
            <Modal open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <ModalContent className="max-w-4xl p-0 bg-transparent border-none overflow-hidden h-[90vh]">
                    <div className="relative h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                        {/* Toolbar */}
                        <div className="bg-[#1e293b] p-4 flex items-center justify-between border-b border-white/10 z-20">
                            <div className="flex items-center gap-2">
                                <div className="bg-[var(--electric)] h-8 w-8 rounded flex items-center justify-center text-white"><FileText size={16} /></div>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white">AWS_CERT_00124.pdf</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="h-8 text-white/50 hover:text-white uppercase tracking-widest text-[9px] font-bold">Print</Button>
                                <Button variant="primary" size="sm" className="h-8 shadow-glow uppercase tracking-widest text-[9px] font-bold">Download PDF</Button>
                                <XCircle size={20} className="text-white/30 cursor-pointer hover:text-white" onClick={() => setIsPreviewOpen(false)} />
                            </div>
                        </div>

                        {/* Certificate content mockup */}
                        <div className="flex-1 overflow-y-auto p-12 flex items-center justify-center bg-slate-100">
                            <div className="w-full max-w-[842px] aspect-[1.414/1] bg-white shadow-2xl relative p-16 border-[12px] border-slate-900 overflow-hidden group">
                                {/* Decorative Corner */}
                                <div className="absolute -top-12 -left-12 h-64 w-64 bg-slate-900 transform rotate-45" />
                                <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-slate-900 transform rotate-45" />

                                {/* Brand */}
                                <div className="flex flex-col items-center mb-12">
                                    <div className="h-20 w-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4">
                                        <Cloud size={40} strokeWidth={2.5} />
                                    </div>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">AWS Student Community Day</h5>
                                </div>

                                <div className="text-center relative z-10">
                                    <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tight mb-8">Certificate of Completion</h1>
                                    <p className="text-lg text-slate-500 mb-12">This is to certify that</p>
                                    <h2 className="text-5xl font-display font-bold text-[var(--electric)] italic mb-12 underline decoration-slate-900/5 decoration-4">Alice Chen</h2>
                                    <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                                        Has successfully participated in the AWS Student Community Day 2026, gaining practical experience in cloud architecture, devops, and serverless technologies.
                                    </p>
                                </div>

                                <div className="mt-20 pt-12 border-t border-slate-200 flex justify-between items-end">
                                    <div className="text-left">
                                        <div className="h-px w-40 bg-slate-900 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Julian Wood</p>
                                        <p className="text-[8px] uppercase tracking-widest text-slate-400">Sr. Advocate @ AWS</p>
                                    </div>
                                    <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center">
                                        {/* QR Mockup */}
                                        <div className="w-16 h-16 bg-slate-900 opacity-20" />
                                    </div>
                                    <div className="text-right">
                                        <div className="h-px w-40 bg-slate-900 mb-2 ml-auto" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Dr. Sarah Cloud</p>
                                        <p className="text-[8px] uppercase tracking-widest text-slate-400">Cloud Club Lead</p>
                                    </div>
                                </div>

                                <div className="absolute top-10 left-10 text-[var(--electric)] opacity-10">
                                    <Sparkles size={120} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

        </AdminLayout>
    );
}
