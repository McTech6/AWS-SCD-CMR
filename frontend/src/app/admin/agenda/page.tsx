"use client";

import * as React from "react";
import { motion } from "framer-motion";
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
    Textarea,
    DeleteModal
} from "@/components/ui";
import {
    Clock,
    Mic2,
    Plus,
    Trash2,
    Edit2,
    Save,
    Loader2
} from "lucide-react";
import { getAgendaItems, createAgendaItem, updateAgendaItem, deleteAgendaItem } from "@/lib/api";
import toast from "react-hot-toast";

type AgendaItem = {
    id: string;
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    track?: string;
    speakerId?: string;
    sortOrder?: number;
};

export default function AgendaAdminPage() {
    const [agenda, setAgenda] = React.useState<AgendaItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<AgendaItem | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<AgendaItem | null>(null);

    const fetchAgenda = async () => {
        try {
            const response = await getAgendaItems();
            if (response.success) {
                setAgenda(response.data);
            }
        } catch (err) {
            toast.error("Failed to load agenda");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAgenda();
    }, []);

    const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const startTime = formData.get("startTime") as string;
        const endTime = formData.get("endTime") as string;
        const description = formData.get("description") as string;
        
        const data: any = {
            title: formData.get("title") as string,
            track: formData.get("track") as string,
            sortOrder: parseInt(formData.get("sortOrder") as string) || 0
        };
        
        if (description) data.description = description;
        if (startTime) data.startTime = new Date(startTime).toISOString();
        if (endTime) data.endTime = new Date(endTime).toISOString();

        try {
            if (editingItem) {
                await updateAgendaItem(editingItem.id, data);
                toast.success("Session updated successfully");
            } else {
                await createAgendaItem(data);
                toast.success("Session created successfully");
            }
            setIsAddModalOpen(false);
            setEditingItem(null);
            fetchAgenda();
        } catch (err) {
            toast.error(editingItem ? "Failed to update session" : "Failed to create session");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (item: AgendaItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            setIsSubmitting(true);
            await deleteAgendaItem(itemToDelete.id);
            toast.success("Session deleted successfully");
            fetchAgenda();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            toast.error("Failed to delete session");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "TBD";
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Agenda Management</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Design the flow of the event</p>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        className="shadow-glow text-xs font-bold gap-2"
                        onClick={() => {
                            setEditingItem(null);
                            setIsAddModalOpen(true);
                        }}
                    >
                        <Plus size={14} /> Add Session
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-24 rounded-lg bg-[var(--surface)] animate-pulse" />
                                ))}
                            </div>
                        ) : agenda.length === 0 ? (
                            <Card className="p-12 text-center">
                                <Clock size={48} className="mx-auto mb-4 text-[var(--text-3)]" />
                                <h3 className="font-display text-xl font-bold text-[var(--text-1)] mb-2">No sessions yet</h3>
                                <p className="text-[var(--text-3)] text-sm">Click "Add Session" to create your first agenda item</p>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {agenda.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        className="group relative flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm hover:border-[var(--electric)]/30 transition-colors"
                                    >
                                        <div className="flex flex-col flex-1 gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-[10px] text-[var(--electric-light)] uppercase tracking-wider">
                                                    {formatTime(item.startTime)}
                                                </span>
                                                {item.track && (
                                                    <Badge variant="outline" className="text-[9px] h-5 uppercase tracking-widest">
                                                        {item.track.replace(/_/g, ' ')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-bold text-[var(--text-1)]">{item.title}</h4>
                                            {item.description && (
                                                <span className="text-xs text-[var(--text-3)] line-clamp-1">{item.description}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[var(--text-3)] hover:text-[var(--electric)]"
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setIsAddModalOpen(true);
                                                }}
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-[var(--text-3)] hover:text-[var(--error)]"
                                                onClick={() => handleDeleteClick(item)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="border-[var(--electric)]/20 bg-gradient-to-br from-[var(--electric)]/5 to-transparent">
                            <CardHeader>
                                <CardTitle className="text-lg">Event Schedule Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--text-3)]">Total Sessions</span>
                                    <span className="font-bold text-[var(--text-1)]">{agenda.length}</span>
                                </div>
                                <div className="pt-4 border-t border-[var(--border)]">
                                    <p className="text-[10px] uppercase font-mono text-[var(--text-3)] leading-relaxed">
                                        Manage your event schedule. All changes are reflected on the landing page immediately.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <ModalContent className="max-w-xl bg-[var(--surface)] border-[var(--border)] shadow-glow">
                    <ModalHeader>
                        <ModalTitle className="text-2xl font-display font-black text-[var(--text-1)]">
                            {editingItem ? "Edit Session" : "Add New Session"}
                        </ModalTitle>
                        <ModalDescription className="text-[var(--text-3)] font-mono text-[10px] uppercase tracking-widest">
                            {editingItem ? "Update the details for this agenda item" : "Create a new entry for the event schedule"}
                        </ModalDescription>
                    </ModalHeader>

                    <form onSubmit={handleAddOrUpdate} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">Session Title</label>
                            <Input name="title" defaultValue={editingItem?.title} placeholder="Enter the session title..." required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">Description</label>
                            <Textarea name="description" defaultValue={editingItem?.description} placeholder="Brief description..." rows={3} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">Start Time</label>
                                <Input 
                                    name="startTime" 
                                    type="datetime-local" 
                                    defaultValue={editingItem?.startTime ? new Date(editingItem.startTime).toISOString().slice(0, 16) : ''} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">End Time</label>
                                <Input 
                                    name="endTime" 
                                    type="datetime-local" 
                                    defaultValue={editingItem?.endTime ? new Date(editingItem.endTime).toISOString().slice(0, 16) : ''} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">Track</label>
                                <Select name="track" defaultValue={editingItem?.track || "MAIN_STAGE"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select track" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MAIN_STAGE">Main Stage</SelectItem>
                                        <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                        <SelectItem value="PANEL">Panel</SelectItem>
                                        <SelectItem value="NETWORKING">Networking</SelectItem>
                                        <SelectItem value="OPENING">Opening</SelectItem>
                                        <SelectItem value="CLOSING">Closing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-3)]">Sort Order</label>
                                <Input name="sortOrder" type="number" defaultValue={editingItem?.sortOrder || 0} placeholder="0" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-xs font-bold"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="shadow-glow px-8 h-12 font-black uppercase tracking-widest text-[10px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={14} className="mr-2 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save size={14} className="mr-2" /> {editingItem ? "Update Session" : "Create Session"}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </ModalContent>
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Session?"
                description={`This will permanently remove "${itemToDelete?.title}" from the agenda. This action cannot be undone.`}
                loading={isSubmitting}
            />
        </AdminLayout>
    );
}
