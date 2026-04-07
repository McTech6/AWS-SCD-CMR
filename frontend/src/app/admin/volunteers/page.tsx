"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Heart,
    Search,
    CheckCircle2,
    XCircle,
    Filter,
    Clock,
    User
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    Textarea,
    Card,
    CardHeader,
    Button,
    Input,
    Avatar,
    Badge,
    Spinner
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { getAllVolunteers, approveVolunteer, rejectVolunteer } from "@/lib/api";
import toast from "react-hot-toast";

export default function VolunteersAdminPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [volunteers, setVolunteers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadVolunteers();
    }, []);

    const loadVolunteers = async () => {
        try {
            setLoading(true);
            const response = await getAllVolunteers();
            if (response.success) {
                const formatted = response.data.map((v: any) => ({
                    id: v.id,
                    name: v.user.name,
                    email: v.user.email,
                    university: v.university,
                    cloudClub: v.cloudClub || 'None',
                    skills: v.skills,
                    status: v.status === 'APPROVED' ? 'Approved' : v.status === 'REJECTED' ? 'Rejected' : 'Pending',
                    date: new Date(v.submittedAt).toISOString().split('T')[0],
                    image: v.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.user.name)}`
                }));
                setVolunteers(formatted);
            }
        } catch (error) {
            toast.error('Failed to load volunteers');
        } finally {
            setLoading(false);
        }
    };

    const [confirmAction, setConfirmAction] = React.useState<{ type: 'APPROVE' | 'REJECT', id: string, name: string } | null>(null);
    const [rejectionNote, setRejectionNote] = React.useState("");
    const [whatsappLink, setWhatsappLink] = React.useState("");

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const { type, id } = confirmAction;

        try {
            setIsSubmitting(true);
            if (type === 'APPROVE') {
                if (!whatsappLink.trim()) {
                    toast.error("Please provide the WhatsApp group link");
                    return;
                }
                const response = await approveVolunteer(id, whatsappLink);
                if (response.success) {
                    toast.success('Volunteer approved and notified via email');
                    await loadVolunteers();
                }
            } else {
                if (!rejectionNote.trim()) {
                    toast.error("Please provide a reason for rejection");
                    return;
                }
                const response = await rejectVolunteer(id, rejectionNote);
                if (response.success) {
                    toast.success('Volunteer rejected and notified via email');
                    await loadVolunteers();
                }
            }
            setConfirmAction(null);
            setRejectionNote("");
            setWhatsappLink("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${type.toLowerCase()} volunteer`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApproveClick = (v: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmAction({ type: 'APPROVE', id: v.id, name: v.name });
    };

    const handleRejectClick = (v: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmAction({ type: 'REJECT', id: v.id, name: v.name });
    };

    const filteredVolunteers = volunteers.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.university.toLowerCase().includes(search.toLowerCase()) ||
        v.cloudClub.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved': return <Badge variant="outline" className="text-[var(--success)] bg-[var(--success)]/5 border-[var(--success)]/20 px-2 h-5 font-bold uppercase tracking-widest text-[9px] font-mono">Approved</Badge>;
            case 'Pending': return <Badge variant="outline" className="text-[var(--ember)] bg-[var(--ember)]/5 border-[var(--ember)]/20 px-2 h-5 font-bold uppercase tracking-widest text-[9px] font-mono">Pending</Badge>;
            case 'Rejected': return <Badge variant="outline" className="text-[var(--error)] bg-[var(--error)]/5 border-[var(--error)]/20 px-2 h-5 font-bold uppercase tracking-widest text-[9px] font-mono">Rejected</Badge>;
            default: return null;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Volunteer Submissions</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Managing {volunteers.length} volunteer applications</p>
                    </div>
                </div>

                {/* Table View */}
                <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={16} />
                            <Input
                                className="pl-10 h-10 text-xs border-[var(--border)] bg-[var(--void)]/50"
                                placeholder="Filter by name, university, or club..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex h-32 items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[var(--surface)] text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)] border-b border-[var(--border)]/50">
                                        <th className="px-6 py-4">Volunteer</th>
                                        <th className="px-6 py-4">University / Club</th>
                                        <th className="px-6 py-4">Top Skills</th>
                                        <th className="px-6 py-4">Submitted</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Review</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]/30">
                                    {filteredVolunteers.map((v, i) => (
                                        <motion.tr
                                            key={v.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={v.name} src={v.image} className="h-9 w-9 border border-white/5" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text-1)]">{v.name}</span>
                                                        <span className="text-[10px] text-[var(--text-3)] font-mono">{v.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-[var(--text-2)]">{v.university}</span>
                                                    <span className="text-[10px] text-[var(--text-3)] font-mono">{v.cloudClub}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className="text-[10px] border-[var(--border)] h-6 py-1 whitespace-nowrap">
                                                    {v.skills}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-[var(--text-3)] flex items-center gap-1.5 font-mono">
                                                    <Clock size={12} /> {v.date}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStatusBadge(v.status)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {v.status === 'Pending' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-3 text-xs border-[var(--success)] text-[var(--success)] hover:bg-[var(--success)]/10"
                                                                onClick={(e) => handleApproveClick(v, e)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <CheckCircle2 size={12} className="mr-1" /> Approve
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-3 text-xs border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)]/10"
                                                                onClick={(e) => handleRejectClick(v, e)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <XCircle size={12} className="mr-1" /> Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>

            {/* Confirmation Modal */}
            <Modal open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <ModalContent className="max-w-md bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
                            {confirmAction?.type === 'APPROVE' ? <CheckCircle2 className="text-[var(--success)]" /> : <XCircle className="text-[var(--error)]" />}
                        </div>
                        <ModalTitle className="text-xl font-black">
                            {confirmAction?.type === 'APPROVE' ? "Approve Volunteer" : "Reject Application"}
                        </ModalTitle>
                        <ModalDescription className="text-xs uppercase tracking-widest font-mono text-[var(--text-3)] mt-2">
                            {confirmAction?.name}
                        </ModalDescription>
                    </ModalHeader>

                    <div className="mt-6 space-y-6">
                        {confirmAction?.type === 'APPROVE' && (
                            <div className="space-y-4">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">WhatsApp Group Link</label>
                                <Input 
                                    className="bg-[var(--void)]/50 border-[var(--border)] text-sm h-10"
                                    placeholder="https://chat.whatsapp.com/..."
                                    value={whatsappLink}
                                    onChange={(e) => setWhatsappLink(e.target.value)}
                                />
                                <p className="text-xs text-[var(--text-2)]">This link will be sent in their acceptance email.</p>
                            </div>
                        )}
                        {confirmAction?.type === 'REJECT' && (
                            <div className="space-y-4">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Rejection Reason (Internal/Sent to volunteer)</label>
                                <Textarea 
                                    className="bg-[var(--void)]/50 border-[var(--border)] min-h-[100px] text-sm"
                                    placeholder="e.g. Need more experience, position filled..."
                                    value={rejectionNote}
                                    onChange={(e) => setRejectionNote(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setConfirmAction(null)}>Abort</Button>
                            <Button 
                                variant={confirmAction?.type === 'APPROVE' ? 'primary' : 'outline'} 
                                className={cn(
                                    "px-6 h-10 font-black uppercase tracking-widest text-[10px]",
                                    confirmAction?.type === 'REJECT' && "border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)]/10"
                                )}
                                onClick={handleConfirmAction}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : confirmAction?.type === 'APPROVE' ? "Approve" : "Reject"}
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

        </AdminLayout>
    );
}
