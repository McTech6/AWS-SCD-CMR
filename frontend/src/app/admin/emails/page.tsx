"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Send,
    Clock,
    Users,
    Mic2,
    Eye,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Layout,
    ChevronRight,
    Sparkles,
    ArrowRight,
    Info,
    Cloud,
    RefreshCw
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
    Textarea,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { 
    sendBroadcastEmail, 
    getEmailLogs, 
    apiCall 
} from "@/lib/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export default function EmailsAdminPage() {
    const [subject, setSubject] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [target, setTarget] = React.useState("ATTENDEES");
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [isSending, setIsSending] = React.useState(false);
    const [logs, setLogs] = React.useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = React.useState(true);
    const [stats, setStats] = React.useState({ attendees: 0, speakers: 0 });

    const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const res = await getEmailLogs();
            if (res.success) setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Get stats for dynamic count display
            const res = await apiCall('/event/dashboard');
            if (res.success) {
                const attendeeStat = res.data.stats.find((s: any) => s.label === "Total Registered");
                const speakerStat = res.data.stats.find((s: any) => s.label === "Approved Speakers");
                setStats({
                    attendees: attendeeStat?.value || 0,
                    speakers: speakerStat?.value || 0
                });
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    React.useEffect(() => {
        fetchLogs();
        fetchStats();
    }, []);

    const handleSend = async () => {
        if (!subject || !message) {
            toast.error("Subject and Message are required");
            return;
        }

        setIsSending(true);
        try {
            const res = await sendBroadcastEmail({
                subject,
                template: 'broadcast',
                target: target as any,
                bodyVars: {
                    content: message
                }
            });

            if (res.success) {
                toast.success(`Broadcasting to ${res.data.recipientCount} recipients...`);
                setSubject("");
                setMessage("");
                setIsPreviewOpen(false);
                fetchLogs();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to launch campaign");
        } finally {
            setIsSending(false);
        }
    };

    const getTargetCount = () => {
        if (target === 'BOTH') return stats.attendees + stats.speakers;
        if (target === 'SPEAKERS') return stats.speakers;
        return stats.attendees;
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Email Campaigns</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Managing direct communications</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={fetchLogs} className="border-[var(--border)] text-xs font-bold gap-2">
                            <RefreshCw size={14} className={isLoadingLogs ? "animate-spin" : ""} /> Refresh Logs
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                    {/* Compose Panel */}
                    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="text-[var(--electric)]" size={20} />
                                Compose Campaign
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Target Audience</label>
                                <Select onValueChange={setTarget} defaultValue={target}>
                                    <SelectTrigger className="bg-[var(--void)]/50 border-[var(--border)] text-sm">
                                        <SelectValue placeholder="Select target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BOTH">All Participants (Attendees + Approved Speakers)</SelectItem>
                                        <SelectItem value="ATTENDEES">Registrants Only</SelectItem>
                                        <SelectItem value="SPEAKERS">Approved Speakers Only</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2 p-3 mt-2 rounded-lg bg-[var(--electric)]/5 border border-[var(--electric)]/10 text-[10px] text-[var(--electric-light)]">
                                    <Info size={12} /> This will target approximately <b>{getTargetCount()} recipients.</b>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Subject Line</label>
                                <Input
                                    className="bg-[var(--void)]/50 border-[var(--border)] h-11 text-sm font-medium"
                                    placeholder="e.g. Breaking: New Speaker Announced!"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Message Content</label>
                                <Textarea
                                    className="bg-[var(--void)]/50 border-[var(--border)] min-h-[160px] text-sm leading-relaxed"
                                    placeholder="Write your email content here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button variant="outline" className="flex-1 h-12 text-xs font-bold uppercase tracking-widest gap-2 bg-transparent" onClick={() => setIsPreviewOpen(true)}>
                                    <Eye size={16} /> Preview Mockup
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Feed */}
                    <div className="space-y-6">
                        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold">Campaign Logs</CardTitle>
                                <Button variant="ghost" size="sm" className="text-[var(--text-3)]"><Filter size={14} /></Button>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--surface)] text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-3)] border-b border-[var(--border)]/50">
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Subject</th>
                                            <th className="px-6 py-4">Target</th>
                                            <th className="px-6 py-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]/30">
                                        {isLoadingLogs ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-xs text-[var(--text-3)] uppercase font-mono tracking-widest">
                                                    Syncing logs...
                                                </td>
                                            </tr>
                                        ) : logs.length > 0 ? logs.map((msg) => (
                                            <tr key={msg.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    {msg.status === 'SENT' ? (
                                                        <CheckCircle2 size={16} className="text-[var(--success)]" />
                                                    ) : msg.status === 'PARTIAL' ? (
                                                        <Info size={16} className="text-[var(--ember)]" />
                                                    ) : (
                                                        <XCircle size={16} className="text-[var(--error)]" />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text-1)] line-clamp-1">{msg.subject}</span>
                                                        <span className="text-[10px] font-mono text-[var(--text-3)]">
                                                            {msg.successCount}/{msg.recipientCount} Successful
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="text-[9px] border-[var(--border)] h-5 lowercase">{msg.target}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right text-[10px] font-mono text-[var(--text-3)] whitespace-nowrap">
                                                    {format(new Date(msg.createdAt), 'MMM dd, HH:mm')}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-xs text-[var(--text-3)] uppercase font-mono tracking-widest">
                                                    No campaigns launched yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Pro Tip */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--electric)]/20 to-transparent border border-[var(--electric)]/20 shadow-glow">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--electric)] flex items-center justify-center text-white">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--text-1)] mb-1">Direct Delivery</h4>
                                    <p className="text-xs text-[var(--text-2)] leading-relaxed">
                                        Campaigns are sent sequentially through the event SMTP relay. Large broadcasts may take a few minutes to complete all handshakes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Preview Modal */}
            <Modal open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <ModalContent className="max-w-2xl bg-[#f4f7f9] text-[#1e293b] p-0 border-none overflow-hidden rounded-2xl">
                    <div className="bg-[var(--void)] p-4 flex items-center justify-between border-b border-white/10">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">Telecommunication Preview</span>
                        <button onClick={() => setIsPreviewOpen(false)}><XCircle size={18} className="text-white/30" /></button>
                    </div>

                    {/* Email Shell */}
                    <div className="p-10 overflow-y-auto max-h-[70vh]">
                        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="bg-gradient-to-r from-[#FF9900] to-[#FF6B00] p-8 text-center">
                                <div className="h-12 w-12 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center text-[#FF9900] shadow-lg">
                                    <Cloud size={24} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">AWS Community Day Cameroon</span>
                            </div>
                            <div className="p-8 space-y-6">
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                    {subject || "Subject Placeholder"}
                                </h2>
                                <div className="space-y-4">
                                    <p className="text-slate-600 text-sm font-bold">Hello Attendee,</p>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {message || "No content provided yet. Start typing to see your message here."}
                                    </p>
                                </div>
                                <div className="h-12 w-full bg-[#FF9900] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    Explore Event Portal <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                                <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Powered by AWS Cloud Clubs</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-slate-500 hover:bg-slate-100 uppercase tracking-widest text-[10px] font-bold">Abort</Button>
                        <Button variant="primary" onClick={handleSend} disabled={isSending} className="min-w-[160px] uppercase tracking-widest text-[10px] font-black h-12 shadow-glow bg-[#FF9900] hover:bg-[#FF6B00]">
                            {isSending ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={14} className="animate-spin" /> Transmitting
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send size={14} /> Confirm Launch
                                </span>
                            )}
                        </Button>
                    </div>
                </ModalContent>
            </Modal>
        </AdminLayout>
    );
}
