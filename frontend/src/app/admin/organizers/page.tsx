"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Input,
    Badge,
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    Textarea,
    Avatar,
    Divider,
    DeleteModal
} from "@/components/ui";
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    ExternalLink,
    Image as ImageIcon,
    Shield,
    UserCircle,
    AlertCircle,
    CheckCircle2,
    Linkedin,
    Twitter,
    Github,
    Globe,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    getOrganizers, 
    createOrganizer, 
    updateOrganizer, 
    deleteOrganizer 
} from "@/lib/api";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const organizerFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role is required"),
    club: z.string().optional(),
    bio: z.string().optional(),
    imageUrl: z.string().url("Valid image URL required").or(z.literal("")),
    linkedinUrl: z.string().url("Valid URL required").or(z.literal("")),
    twitterUrl: z.string().url("Valid URL required").or(z.literal("")),
    githubUrl: z.string().url("Valid URL required").or(z.literal("")),
    visible: z.boolean(),
    sortOrder: z.number()
});

type OrganizerFormValues = z.infer<typeof organizerFormSchema>;

export default function OrganizersAdminPage() {
    const [organizers, setOrganizers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [editingOrganizer, setEditingOrganizer] = React.useState<any>(null);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<OrganizerFormValues>({
        resolver: zodResolver(organizerFormSchema),
        defaultValues: {
            name: "",
            role: "Cloud Club Captain",
            club: "",
            bio: "",
            imageUrl: "",
            linkedinUrl: "",
            twitterUrl: "",
            githubUrl: "",
            visible: true,
            sortOrder: 0
        }
    });

    const fetchOrganizers = async () => {
        setIsLoading(true);
        try {
            const response = await getOrganizers(true); // all=true
            if (response.success) {
                setOrganizers(response.data);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch leadership team");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrganizers();
    }, []);

    React.useEffect(() => {
        if (isAddModalOpen) {
            if (editingOrganizer) {
                reset({
                    name: editingOrganizer.name,
                    role: editingOrganizer.role || "Cloud Club Captain",
                    club: editingOrganizer.club || "",
                    bio: editingOrganizer.bio || "",
                    imageUrl: editingOrganizer.imageUrl || "",
                    linkedinUrl: editingOrganizer.linkedinUrl || "",
                    twitterUrl: editingOrganizer.twitterUrl || "",
                    githubUrl: editingOrganizer.githubUrl || "",
                    visible: editingOrganizer.visible ?? true,
                    sortOrder: editingOrganizer.sortOrder || 0
                });
            } else {
                reset({
                    name: "",
                    role: "Cloud Club Captain",
                    club: "",
                    bio: "",
                    imageUrl: "",
                    linkedinUrl: "",
                    twitterUrl: "",
                    githubUrl: "",
                    visible: true,
                    sortOrder: 0
                });
            }
        }
    }, [isAddModalOpen, editingOrganizer, reset]);

    const onSubmit = async (data: OrganizerFormValues) => {
        try {
            if (editingOrganizer) {
                await updateOrganizer(editingOrganizer.id, data);
                toast.success("Profile Updated");
            } else {
                await createOrganizer(data);
                toast.success("Captain Onboarded");
            }
            fetchOrganizers();
            setIsAddModalOpen(false);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteOrganizer(deleteId);
            toast.success("Profile Purged");
            fetchOrganizers();
            setDeleteId(null);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (isLoading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--electric)]" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">Syncing Leadership Data...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Leadership Hub</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Cloud Club Captains & Organizers</p>
                    </div>

                    <Button variant="primary" size="sm" className="shadow-glow text-xs font-bold gap-2" onClick={() => { setEditingOrganizer(null); setIsAddModalOpen(true); }}>
                        <Plus size={14} /> New Captain
                    </Button>
                </div>

                <Divider className="opacity-10" />

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {organizers.length > 0 ? organizers.map((organizer) => (
                            <motion.div
                                key={organizer.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--electric)]/30 hover:shadow-glow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="h-20 w-20 rounded-[var(--radius-lg)] border-2 border-[var(--electric)]/20 overflow-hidden bg-[var(--void)]">
                                        {organizer.imageUrl ? (
                                            <img src={organizer.imageUrl} alt={organizer.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-[var(--text-3)]">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-[var(--electric)]/20 text-[var(--electric-light)] bg-[var(--electric)]/5">
                                            Order {organizer.sortOrder}
                                        </Badge>
                                        {!organizer.visible && <Badge variant="outline" className="text-[var(--text-3)] border-dashed border-[var(--border)]">Hidden</Badge>}
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-[var(--text-1)]">{organizer.name}</h4>
                                        <p className="text-xs text-[var(--electric-light)] font-mono font-black uppercase tracking-widest mt-1">{organizer.role}</p>
                                        <p className="text-xs text-[var(--text-3)] font-medium bg-white/5 py-1 px-2 rounded mt-2 inline-block italic">
                                            {organizer.club || "Global AWS Community"}
                                        </p>
                                    </div>

                                    {organizer.bio && (
                                        <p className="text-xs text-[var(--text-2)] line-clamp-2 leading-relaxed opacity-60">
                                            {organizer.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3">
                                        {organizer.linkedinUrl && (
                                            <a href={organizer.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-3)] hover:text-[#0077b5] transition-colors">
                                                <Linkedin size={14} />
                                            </a>
                                        )}
                                        {organizer.twitterUrl && (
                                            <a href={organizer.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-3)] hover:text-[#1da1f2] transition-colors">
                                                <Twitter size={14} />
                                            </a>
                                        )}
                                        {organizer.githubUrl && (
                                            <a href={organizer.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-3)] hover:text-[#333] transition-colors">
                                                <Github size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold uppercase tracking-wider" onClick={() => { setEditingOrganizer(organizer); setIsAddModalOpen(true); }}>
                                        <Edit2 size={12} className="mr-2" /> Adjust
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-[var(--text-3)] hover:text-[var(--error)] transition-colors" onClick={() => setDeleteId(organizer.id)}>
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-[var(--text-3)] space-y-4">
                                <AlertCircle size={32} className="opacity-10" />
                                <p className="font-mono text-xs uppercase tracking-widest">No leadership records found</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalContent className="max-w-xl bg-[var(--surface)] border-[var(--border)] shadow-glow overflow-y-auto max-h-[90vh]">
                    <ModalHeader>
                        <ModalTitle className="text-2xl font-black text-[var(--text-1)]">
                            {editingOrganizer ? "Modify Profile" : "Initialize Captain"}
                        </ModalTitle>
                        <ModalDescription className="text-xs uppercase tracking-widest font-mono text-[var(--text-3)]">
                            Configure leadership profile for public display
                        </ModalDescription>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Full Name</label>
                                <Input {...register("name")} placeholder="e.g. Ama John" error={errors.name?.message} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Role Title</label>
                                <Input {...register("role")} placeholder="e.g. Cloud Club Captain" error={errors.role?.message} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Cloud Club / Institution</label>
                            <Input {...register("club")} placeholder="e.g. AWS Cloud Club University of Cape Coast" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Short Bio</label>
                            <Textarea {...register("bio")} placeholder="Describe the captain's impact..." className="min-h-[100px] bg-[var(--void)] border-[var(--border)]" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Profile Photo URL</label>
                            <div className="relative">
                                <Input {...register("imageUrl")} placeholder="https://..." error={errors.imageUrl?.message} className="pl-10" />
                                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">LinkedIn</label>
                                <Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." error={errors.linkedinUrl?.message} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Twitter/X</label>
                                <Input {...register("twitterUrl")} placeholder="https://twitter.com/..." error={errors.twitterUrl?.message} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">GitHub</label>
                                <Input {...register("githubUrl")} placeholder="https://github.com/..." error={errors.githubUrl?.message} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-3)] ml-1">Display Order</label>
                                <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-[var(--border)] h-[44px]">
                                <span className="text-[10px] font-bold uppercase text-[var(--text-3)]">Visible</span>
                                <input type="checkbox" {...register("visible")} className="h-4 w-4 rounded border-[var(--border)] bg-[var(--void)] text-[var(--electric)]" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Abort</Button>
                            <Button type="submit" variant="primary" className="shadow-glow px-8 h-12 font-black uppercase tracking-widest text-[10px]" disabled={isSubmitting}>
                                {isSubmitting ? "Transmitting..." : "Confirm Signal"}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Purge Profile?"
                description="This will permanently remove the organizer's profile from the leadership program. This action cannot be undone."
            />
        </AdminLayout>
    );
}
