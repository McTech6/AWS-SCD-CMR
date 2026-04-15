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
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
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
    Award,
    Trophy,
    UserCircle,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Mail,
    User,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    getSponsors, 
    createSponsor, 
    updateSponsor, 
    deleteSponsor as deleteSponsorApi, 
    approveSponsor, 
    rejectSponsor,
    uploadPublicLogo
} from "@/lib/api";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const sponsorFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    tier: z.enum(["GOLD", "SILVER", "BRONZE", "COMMUNITY"]),
    website: z.string().url("Valid URL required").or(z.literal("")),
    logoUrl: z.string().min(1, "Image is required"),
    visible: z.boolean(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

export default function SponsorsAdminPage() {
    const [sponsors, setSponsors] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState<"APPROVED" | "PENDING" | "REJECTED">("APPROVED");
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [editingSponsor, setEditingSponsor] = React.useState<any>(null);
    const [confirmAction, setConfirmAction] = React.useState<{ type: 'APPROVE' | 'REJECT' | 'DELETE', sponsor: any } | null>(null);
    const [selectedTier, setSelectedTier] = React.useState("COMMUNITY");
    const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
    const [logoBase64, setLogoBase64] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<SponsorFormValues>({
        resolver: zodResolver(sponsorFormSchema),
        defaultValues: {
            name: "",
            tier: "COMMUNITY",
            website: "",
            logoUrl: "",
            visible: true,
            status: "APPROVED"
        }
    });

    const fetchSponsors = async () => {
        setIsLoading(true);
        try {
            const response = await getSponsors(true); // all=true
            if (response.success) {
                setSponsors(response.data);
            }
        } catch (err: any) {
            toast.error(err.message || "Telemetry sync failed");
        } finally {
            setIsLoading(false);
        }
    };

    const logoUrlValue = watch("logoUrl");

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500;
                let width = img.width;
                let height = img.height;
                
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/webp', 0.8);
                setLogoBase64(dataUrl);
                setValue("logoUrl", "pending-base64", { shouldValidate: true });
            };
        }
    };

    React.useEffect(() => {
        fetchSponsors();
    }, []);

    React.useEffect(() => {
        if (isAddModalOpen) {
            setLogoBase64(null);
            if (editingSponsor) {
                reset({
                    name: editingSponsor.name,
                    tier: editingSponsor.tier || "COMMUNITY",
                    website: editingSponsor.website || "",
                    logoUrl: editingSponsor.logoUrl,
                    visible: editingSponsor.visible ?? true,
                    status: editingSponsor.status || "APPROVED"
                });
            } else {
                reset({
                    name: "",
                    tier: "COMMUNITY",
                    website: "",
                    logoUrl: "",
                    visible: true,
                    status: "APPROVED"
                });
            }
        }
    }, [isAddModalOpen, editingSponsor, reset]);

    const onSubmit = async (data: SponsorFormValues) => {
        try {
            setIsUploadingLogo(true);
            let finalLogoUrl = data.logoUrl;

            // Send to cloudinary
            if (logoBase64) {
                toast.loading("Transferring visual assets to Network...", { id: "uploading-logo" });
                const response = await uploadPublicLogo(logoBase64);
                if (!response.success || !response.url) {
                    throw new Error("Failed to relay image via Cloudinary. Try Direct URL.");
                }
                finalLogoUrl = response.url;
                toast.dismiss("uploading-logo");
            }

            const payload = { ...data, logoUrl: finalLogoUrl };

            if (editingSponsor) {
                await updateSponsor(editingSponsor.id, payload);
                toast.success("Sponsor updated");
            } else {
                await createSponsor(payload);
                toast.success("Partner verified");
            }
            fetchSponsors();
            setIsAddModalOpen(false);
            setLogoBase64(null);
        } catch (err: any) {
            toast.dismiss("uploading-logo");
            toast.error(err.message);
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const { type, sponsor } = confirmAction;

        try {
            if (type === 'APPROVE') {
                await approveSponsor(sponsor.id, selectedTier);
                toast.success("Partnership Activated");
            } else if (type === 'REJECT') {
                await rejectSponsor(sponsor.id);
                toast.error("Application Dropped");
            } else if (type === 'DELETE') {
                await deleteSponsorApi(sponsor.id);
                toast.success("Record Deleted");
            }
            fetchSponsors();
            setConfirmAction(null);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const filteredSponsors = sponsors.filter(s => s.status === activeTab);

    const getTierBadge = (tier: string) => {
        switch (tier) {
            case 'GOLD': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1.5"><Trophy size={10} /> Gold</Badge>;
            case 'SILVER': return <Badge className="bg-slate-400/10 text-slate-400 border-slate-400/20 gap-1.5"><Shield size={10} /> Silver</Badge>;
            case 'BRONZE': return <Badge className="bg-amber-700/10 text-amber-700 border-amber-700/20 gap-1.5"><Award size={10} /> Bronze</Badge>;
            case 'COMMUNITY': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5"><UserCircle size={10} /> Community</Badge>;
            default: return <Badge variant="outline" className="opacity-50">Pending Tier</Badge>;
        }
    };

    if (isLoading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--electric)]" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">Querying Partner DB...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Partner Nexus</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Sponsorship Lifecycle Management</p>
                    </div>

                    <Button variant="primary" size="sm" className="shadow-glow text-xs font-bold gap-2" onClick={() => { setEditingSponsor(null); setIsAddModalOpen(true); }}>
                        <Plus size={14} /> Direct Entry
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border)] gap-8">
                    {[
                        { id: "APPROVED", label: "Active Partners", icon: CheckCircle2 },
                        { id: "PENDING", label: "Inbox Applications", icon: Mail },
                        { id: "REJECTED", label: "Deactivated", icon: XCircle },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                                activeTab === tab.id ? "text-[var(--electric-light)]" : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                            )}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--electric)]" />}
                            {sponsors.filter(s => s.status === tab.id).length > 0 && (
                                <span className="ml-2 h-5 w-5 rounded-full bg-white/5 flex items-center justify-center text-[8px]">
                                    {sponsors.filter(s => s.status === tab.id).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredSponsors.length > 0 ? filteredSponsors.map((sponsor) => (
                            <motion.div
                                key={sponsor.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--electric)]/30 hover:shadow-glow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-white/5 p-3 overflow-hidden">
                                        <img src={sponsor.logoUrl} alt={sponsor.name} className="h-full w-auto object-contain grayscale invert opacity-40 transition-all group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getTierBadge(sponsor.tier)}
                                        {!sponsor.visible && <Badge variant="outline" className="text-[var(--text-3)] border-dashed border-[var(--border)]">Hidden</Badge>}
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-[var(--text-1)] flex items-center gap-2">
                                            {sponsor.name}
                                            {sponsor.website && (
                                                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-[var(--text-3)] hover:text-[var(--electric-light)] transition-colors">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </h4>
                                        <p className="text-xs text-[var(--text-3)] font-mono truncate">{sponsor.website || "External URL Void"}</p>
                                    </div>

                                    {(sponsor.contactEmail || sponsor.contactName) && (
                                        <div className="p-3 rounded-lg bg-[var(--void)] border border-[var(--border)]/50 space-y-2">
                                            <p className="flex items-center gap-2 text-[10px] text-[var(--text-2)] font-medium">
                                                <User size={10} className="text-[var(--electric)]" /> {sponsor.contactName}
                                            </p>
                                            <p className="flex items-center gap-2 text-[10px] text-[var(--text-3)] font-mono">
                                                <Mail size={10} className="text-[var(--electric)]" /> {sponsor.contactEmail}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {sponsor.status === 'PENDING' ? (
                                        <>
                                            <Button variant="primary" size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest gap-2 bg-[var(--success)]/80 hover:bg-[var(--success)]" onClick={() => setConfirmAction({ type: 'APPROVE', sponsor })}>
                                                <Check size={12} /> Approve
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest gap-2 border-[var(--error)]/30 text-[var(--error)] hover:bg-[var(--error)]/10" onClick={() => setConfirmAction({ type: 'REJECT', sponsor })}>
                                                <XCircle size={12} /> Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold uppercase tracking-wider" onClick={() => { setEditingSponsor(sponsor); setIsAddModalOpen(true); }}>
                                                <Edit2 size={12} className="mr-2" /> Modify
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-[var(--text-3)] hover:text-[var(--error)] transition-colors" onClick={() => setConfirmAction({ type: 'DELETE', sponsor })}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-[var(--text-3)] space-y-4">
                                <AlertCircle size={32} className="opacity-10" />
                                <p className="font-mono text-xs uppercase tracking-widest">No matching partnership signals found</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalContent className="max-w-xl bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <ModalTitle className="text-2xl font-black text-[var(--text-1)]">
                            {editingSponsor ? "Update Profile" : "Initialize Link"}
                        </ModalTitle>
                    </ModalHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <Input label="Organization Name *" {...register("name")} placeholder="Ex: Cloud Tech Inc." error={errors.name?.message} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-2)]">Sponsor Tier *</label>
                                    <Controller
                                        name="tier"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Tier" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GOLD">Gold Partner</SelectItem>
                                                    <SelectItem value="SILVER">Silver Partner</SelectItem>
                                                    <SelectItem value="BRONZE">Bronze Partner</SelectItem>
                                                    <SelectItem value="COMMUNITY">Community Partner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <Input label="Website URL" {...register("website")} placeholder="https://..." error={errors.website?.message} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-2)] uppercase tracking-widest">Logo Upload</label>
                                <div className="flex items-center gap-4">
                                    {(logoBase64 || logoUrlValue) && logoUrlValue !== "pending-base64" && !logoBase64 && (
                                        <div className="h-16 w-16 overflow-hidden rounded bg-white/5 p-2 flex items-center justify-center border border-[var(--border)]">
                                            <img src={logoUrlValue} alt="Logo preview" className="h-full w-full object-contain grayscale invert opacity-80" />
                                        </div>
                                    )}
                                    {logoBase64 && (
                                        <div className="h-16 w-16 overflow-hidden rounded bg-white/5 p-2 flex items-center justify-center border border-[var(--electric)] relative">
                                            <img src={logoBase64} alt="Pending" className="h-full w-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1 border-2 border-dashed border-[var(--border)] rounded-lg p-4 text-center hover:border-[var(--electric)] transition-colors cursor-pointer relative bg-black/20" onClick={() => document.getElementById('logo-upload')?.click()}>
                                        <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-3)] flex flex-col items-center justify-center gap-2 group-hover:text-[var(--electric-light)]">
                                            <ImageIcon size={16} className="text-[var(--electric)]" /> Click to {logoBase64 ? "change" : "upload"} company logo
                                        </span>
                                    </div>
                                </div>
                                {errors.logoUrl && <p className="text-[10px] text-[var(--error)] mt-1">{errors.logoUrl.message}</p>}
                                {!logoBase64 && (
                                     <Input {...register("logoUrl")} placeholder="(Optional) Paste direct Image URL here" className="text-xs font-mono mt-2" />
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-[var(--border)]">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold">Public Visibility</p>
                                    <p className="text-[10px] text-[var(--text-3)] uppercase font-mono">Signal strength on landing page</p>
                                </div>
                                <input type="checkbox" {...register("visible")} className="h-4 w-4 rounded border-[var(--border)] bg-[var(--void)] text-[var(--electric)]" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Abort</Button>
                            <Button type="submit" variant="primary" className="shadow-glow px-8 h-12 font-black uppercase tracking-widest text-[10px]" disabled={isSubmitting}>
                                {isSubmitting ? "Syncing..." : "Confirm Transmission"}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={confirmAction?.type === 'DELETE'}
                onClose={() => setConfirmAction(null)}
                onConfirm={handleConfirmAction}
                itemCount={1}
                title="Purge Partner Record?"
                description={`This will permanently remove ${confirmAction?.sponsor?.name} from the database. This action cannot be undone.`}
            />

            {/* Confirmation Modals for Approve/Reject */}
            <Modal open={!!confirmAction && confirmAction.type !== 'DELETE'} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <ModalContent className="max-w-md bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4">
                            {confirmAction?.type === 'APPROVE' && <CheckCircle2 className="text-[var(--success)]" />}
                            {confirmAction?.type === 'REJECT' && <AlertCircle className="text-[var(--error)]" />}
                        </div>
                        <ModalTitle className="text-xl font-black">
                            {confirmAction?.type === 'APPROVE' && "Authorize Partnership"}
                            {confirmAction?.type === 'REJECT' && "Decline Application"}
                        </ModalTitle>
                        <ModalDescription className="text-xs uppercase tracking-widest font-mono text-[var(--text-3)] mt-2">
                            {confirmAction?.sponsor?.name}
                        </ModalDescription>
                    </ModalHeader>

                    <div className="mt-6 space-y-6">
                        {confirmAction?.type === 'APPROVE' && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase text-[var(--text-3)]">Assign Partnership Tier</p>
                                <Select value={selectedTier} onValueChange={setSelectedTier}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GOLD">Gold Partner</SelectItem>
                                        <SelectItem value="SILVER">Silver Partner</SelectItem>
                                        <SelectItem value="BRONZE">Bronze Partner</SelectItem>
                                        <SelectItem value="COMMUNITY">Community Partner</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-[var(--text-3)] font-mono leading-relaxed mt-4">
                                    Approving will notify the partner via email and activate their visibility on the public landing page.
                                </p>
                            </div>
                        )}

                        {confirmAction?.type === 'REJECT' && (
                            <p className="text-sm text-[var(--text-2)] leading-relaxed">
                                Are you sure you want to decline this partnership? A professional notification email will be sent to the applicant.
                            </p>
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
                            >
                                {confirmAction?.type === 'APPROVE' && "Activate Signal"}
                                {confirmAction?.type === 'REJECT' && "Drop Transmission"}
                            </Button>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </AdminLayout>
    );
}
