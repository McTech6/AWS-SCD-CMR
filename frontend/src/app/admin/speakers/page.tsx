"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Mic2,
    Search,
    CheckCircle2,
    XCircle,
    Trash2,
    ExternalLink,
    MoreVertical,
    ChevronRight,
    Clock,
    LayoutGrid,
    Filter,
    X,
    Linkedin,
    Twitter,
    Github,
    MessageSquare
} from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    Textarea,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Button,
    Input,
    Avatar,
    Divider,
    DeleteModal
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { SpeakerForm } from "@/components/forms/speaker-form";

// Mock Data Seed
const INITIAL_SPEAKERS = [
    { id: "spk-1", name: "Julian Wood", email: "julian@aws.com", track: "Serverless", topic: "Event-Driven Power", status: "Approved", date: "2024-05-10", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
    { id: "spk-2", name: "Marcia Villalba", email: "marcia@aws.com", track: "Architecture", topic: "Scaling Patterns", status: "Approved", date: "2024-05-11", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    { id: "spk-3", name: "Daryl Robinson", email: "daryl@aws.com", track: "Security", topic: "IAM Best Practices", status: "Pending", date: "2024-05-12", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: "spk-4", name: "Sheenam Narang", email: "sheenam@aws.com", track: "AI & ML", topic: "GenAI Production", status: "Pending", date: "2024-05-13", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
    { id: "spk-5", name: "Julian Rivera", email: "julian@cloudclub.com", track: "DevOps", topic: "GitOps Journey", status: "Rejected", date: "2024-05-14", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
];

import { applySpeaker, getAllSpeakers, approveSpeaker, rejectSpeaker, deleteSpeaker } from "@/lib/api";
import toast from "react-hot-toast";

export default function SpeakersAdminPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [speakers, setSpeakers] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isGuideOpen, setIsGuideOpen] = React.useState(false);
    const [actioningSpeaker, setActioningSpeaker] = React.useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [speakerToDelete, setSpeakerToDelete] = React.useState<{ id: string, name: string } | null>(null);

    React.useEffect(() => {
        loadSpeakers();
    }, []);

    const loadSpeakers = async () => {
        try {
            setLoading(true);
            const response = await getAllSpeakers();
            if (response.success) {
                const formatted = response.data.map((s: any) => ({
                    id: s.id,
                    name: s.user.name,
                    email: s.user.email,
                    track: s.track || 'N/A',
                    topic: s.talkTitle,
                    status: s.status === 'APPROVED' ? 'Approved' : s.status === 'REJECTED' ? 'Rejected' : 'Pending',
                    date: new Date(s.submittedAt).toISOString().split('T')[0],
                    image: s.photoUrl || s.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.user.name)}`
                }));
                setSpeakers(formatted);
            }
        } catch (error) {
            toast.error('Failed to load speakers');
        } finally {
            setLoading(false);
        }
    };

    const [confirmAction, setConfirmAction] = React.useState<{ type: 'APPROVE' | 'REJECT', id: string, name: string } | null>(null);
    const [rejectionNote, setRejectionNote] = React.useState("");

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const { type, id } = confirmAction;

        try {
            setIsSubmitting(true);
            if (type === 'APPROVE') {
                const response = await approveSpeaker(id);
                if (response.success) {
                    toast.success('Speaker approved and notified via email');
                    await loadSpeakers();
                }
            } else {
                if (!rejectionNote.trim()) {
                    toast.error("Please provide a reason for rejection");
                    return;
                }
                const response = await rejectSpeaker(id, rejectionNote);
                if (response.success) {
                    toast.success('Speaker rejected and notified via email');
                    await loadSpeakers();
                }
            }
            setConfirmAction(null);
            setRejectionNote("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${type.toLowerCase()} speaker`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApproveClick = (spk: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmAction({ type: 'APPROVE', id: spk.id, name: spk.name });
    };

    const handleRejectClick = (spk: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmAction({ type: 'REJECT', id: spk.id, name: spk.name });
    };

    const handleDeleteClick = (spk: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setSpeakerToDelete({ id: spk.id, name: spk.name });
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteSpeaker = async () => {
        if (!speakerToDelete) return;
        try {
            setIsSubmitting(true);
            const response = await deleteSpeaker(speakerToDelete.id);
            if (response.success) {
                toast.success('Speaker deleted successfully');
                await loadSpeakers();
            }
            setIsDeleteModalOpen(false);
            setSpeakerToDelete(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete speaker');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSpeakers = speakers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.topic.toLowerCase().includes(search.toLowerCase()) ||
        s.track.toLowerCase().includes(search.toLowerCase())
    );

    const handleManualAdd = async (data: any, profilePhoto: string | null) => {
        setIsSubmitting(true);
        try {
            const trackMap: Record<string, string> = {
                "Serverless": "CLOUD_FUNDAMENTALS",
                "DevOps": "DEVOPS",
                "AI & ML": "AI_ML",
                "Security": "SECURITY",
                "Architecture": "CLOUD_FUNDAMENTALS"
            };

            const experienceMap: Record<string, string> = {
                "0-1": "ZERO_TO_ONE",
                "1-3": "ONE_TO_THREE",
                "3-5": "THREE_TO_FIVE",
                "5+": "FIVE_PLUS"
            };

            const response = await applySpeaker({
                name: data.fullName,
                email: data.email,
                topic: data.topic,
                talkTitle: data.topic,
                talkAbstract: data.talkAbstract,
                bio: data.bio,
                role: data.role,
                linkedinUrl: data.linkedin || "https://linkedin.com",
                twitterHandle: data.twitter,
                githubUrl: data.github,
                track: trackMap[data.track] || "CLOUD_FUNDAMENTALS",
                experienceLevel: experienceMap[data.experience] || "ZERO_TO_ONE",
                photoBase64: profilePhoto
            });

            if (response.success && response.data?.id) {
                await approveSpeaker(response.data.id);
                toast.success("Speaker added and auto-approved!");
                await loadSpeakers();
                setIsAddModalOpen(false);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add speaker manually');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Speaker Submissions</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Managing {speakers.length} community proposals</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex border-[var(--border)] text-xs font-bold gap-2"
                            onClick={() => setIsGuideOpen(true)}
                        >
                            <Mic2 size={14} /> Review Guide
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="shadow-glow text-xs font-bold gap-2"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Manual Add
                        </Button>
                    </div>
                </div>

                {/* Table View */}
                <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={16} />
                            <Input
                                className="pl-10 h-10 text-xs border-[var(--border)] bg-[var(--void)]/50"
                                placeholder="Filter by name, topic, or track..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-xs gap-1.5"><Filter size={12} /> Filter</Button>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)] border-b border-[var(--border)]/50">
                                    <th className="px-6 py-4">Speaker</th>
                                    <th className="px-6 py-4">Topic / Presentation</th>
                                    <th className="px-6 py-4">Track</th>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]/30">
                                {filteredSpeakers.map((spk, i) => (
                                    <motion.tr
                                        key={spk.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-white/5 cursor-pointer transition-colors"
                                        onClick={() => router.push(`/admin/speakers/${spk.id}`)}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={spk.name} src={spk.image} className="h-9 w-9 border border-white/5" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[var(--text-1)]">{spk.name}</span>
                                                    <span className="text-[10px] text-[var(--text-3)] font-mono">{spk.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 max-w-[240px]">
                                            <span className="text-sm font-medium text-[var(--text-2)] line-clamp-1">{spk.topic}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className="text-[10px] border-[var(--border)] font-medium h-6">{spk.track}</Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-[var(--text-3)] flex items-center gap-1.5 font-mono">
                                                <Clock size={12} /> {spk.date}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(spk.status)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                {spk.status === 'Pending' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-3 text-xs border-[var(--success)] text-[var(--success)] hover:bg-[var(--success)]/10"
                                                            onClick={(e) => handleApproveClick(spk, e)}
                                                            disabled={isSubmitting}
                                                        >
                                                            <CheckCircle2 size={12} className="mr-1" /> Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 px-3 text-xs border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)]/10"
                                                            onClick={(e) => handleRejectClick(spk, e)}
                                                            disabled={isSubmitting}
                                                        >
                                                            <XCircle size={12} className="mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {spk.status !== 'Pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-[var(--text-3)] hover:text-[var(--error)] transition-colors"
                                                        onClick={(e) => handleDeleteClick(spk, e)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                                <ChevronRight size={18} className="text-[var(--text-3)] group-hover:text-[var(--electric)] transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Manual Add Speaker Modal */}
            <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalContent className="max-w-2xl bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <ModalTitle className="text-2xl font-display font-black text-[var(--text-1)]">Manual Speaker Onboarding</ModalTitle>
                        <ModalDescription className="text-[var(--text-3)] font-mono text-[10px] uppercase tracking-widest">
                            Directly add an invited speaker to the agenda
                        </ModalDescription>
                    </ModalHeader>

                    <div className="mt-8 p-1">
                        <SpeakerForm onSubmit={handleManualAdd} isSubmitting={isSubmitting} />
                    </div>
                </ModalContent>
            </Modal>

            {/* Review Guide Modal */}
            <Modal open={isGuideOpen} onOpenChange={setIsGuideOpen}>
                <ModalContent className="max-w-3xl bg-[var(--surface)] border-[var(--border)] shadow-glow overflow-y-auto max-h-[90vh]">
                    <ModalHeader>
                        <ModalTitle className="text-3xl font-display font-black text-[var(--text-1)]">Submission Review Criterion</ModalTitle>
                        <ModalDescription className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em]">
                            Global standards for AWS Student Community Day 2026
                        </ModalDescription>
                    </ModalHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="space-y-4">
                            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--void)] border border-[var(--border)]/20 shadow-sm">
                                <h4 className="flex items-center gap-2 font-display font-bold text-[var(--electric-light)] mb-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[10px]">01</span>
                                    Technical Depth
                                </h4>
                                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                                    Evaluating the technical complexity and accuracy. Look for clear architectural diagrams, code examples, and deep-dives into AWS services.
                                </p>
                            </div>

                            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--void)] border border-[var(--border)]/20 shadow-sm">
                                <h4 className="flex items-center gap-2 font-display font-bold text-[var(--ember)] mb-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ember)]/20 text-[10px]">02</span>
                                    Student Relevance
                                </h4>
                                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                                    Is the topic approachable for students? Does it provide actionable insights that a developer can use in their projects?
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--void)] border border-[var(--border)]/20 shadow-sm">
                                <h4 className="flex items-center gap-2 font-display font-bold text-[var(--success)] mb-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)]/20 text-[10px]">03</span>
                                    Speaker Persona
                                </h4>
                                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                                    Review the speaker's bio, LinkedIn, and previous experience. We look for passion, expertise, and a community-first mindset.
                                </p>
                            </div>

                            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--void)] border border-[var(--border)]/20 shadow-sm">
                                <h4 className="flex items-center gap-2 font-display font-bold text-[var(--electric)] mb-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--electric)]/20 text-[10px]">04</span>
                                    Track Alignment
                                </h4>
                                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                                    Ensure the session fits perfectly within the selected track (Serverless, AI/ML, Security, etc.) to maintain agenda balance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--electric)]/10 to-[var(--void)] border border-[var(--electric)]/20">
                        <h4 className="font-display font-bold text-[var(--text-1)] mb-3 flex items-center gap-2">
                            <Mic2 size={18} className="text-[var(--electric)]" /> Evaluation Rubric
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--text-2)] font-mono">
                            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--electric)]" /> Score 5: Revolutionary, Deep-Technical, High Polish</li>
                            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" /> Score 4: Solid Contribution, Clear Outcomes</li>
                            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ember)]" /> Score 3: Good Foundation, Needs Refinement</li>
                            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--error)]" /> Score 1-2: Poor Depth, Out-of-Scope</li>
                        </ul>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button variant="primary" onClick={() => setIsGuideOpen(false)} className="px-8 h-12 shadow-glow font-bold">
                            I Understand
                        </Button>
                    </div>
                </ModalContent>
            </Modal>
            {/* Confirmation Modal */}
            <Modal open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <ModalContent className="max-w-md bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
                            {confirmAction?.type === 'APPROVE' ? <CheckCircle2 className="text-[var(--success)]" /> : <XCircle className="text-[var(--error)]" />}
                        </div>
                        <ModalTitle className="text-xl font-black">
                            {confirmAction?.type === 'APPROVE' ? "Authorize Speaker" : "Decline Proposal"}
                        </ModalTitle>
                        <ModalDescription className="text-xs uppercase tracking-widest font-mono text-[var(--text-3)] mt-2">
                            {confirmAction?.name}
                        </ModalDescription>
                    </ModalHeader>

                    <div className="mt-6 space-y-6">
                        {confirmAction?.type === 'REJECT' && (
                            <div className="space-y-4">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Rejection Reason (Sent to speaker)</label>
                                <Textarea 
                                    className="bg-[var(--void)]/50 border-[var(--border)] min-h-[100px] text-sm"
                                    placeholder="e.g. Topic overlap with keynote session..."
                                    value={rejectionNote}
                                    onChange={(e) => setRejectionNote(e.target.value)}
                                />
                            </div>
                        )}

                        <p className="text-sm text-[var(--text-2)] leading-relaxed">
                            {confirmAction?.type === 'APPROVE' 
                                ? "Are you sure you want to approve this speaker? They will receive an automated onboarding email with event details."
                                : "A professional rejection email with your feedback will be sent to the speaker."}
                        </p>

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
                                {isSubmitting ? "Transmitting..." : confirmAction?.type === 'APPROVE' ? "Activate Speaker" : "Confirm Rejection"}
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteSpeaker}
                title="Remove Speaker"
                description={`This will permanently remove ${speakerToDelete?.name} from the event program. This action cannot be undone.`}
                loading={isSubmitting}
            />
        </AdminLayout>
    );
}
