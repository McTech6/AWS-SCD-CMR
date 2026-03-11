"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
    Users,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Gift,
    QrCode,
    Mail,
    Trash2,
    ExternalLink,
    ChevronDown
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
    Checkbox,
    Switch
} from "@/components/ui";
import { cn } from "@/lib/utils";

import { getAttendeesForUI, exportAttendees, checkInAttendee, deleteAttendee } from "@/lib/api";
import toast from "react-hot-toast";

const SWAG_ITEMS = [
    { id: 'tshirt', label: 'T-Shirt', icon: '👕' },
    { id: 'stickers', label: 'Stickers', icon: '✨' },
    { id: 'notebook', label: 'Notebook', icon: '📓' },
    { id: 'badge', label: 'Badge', icon: '🏷️' },
    { id: 'pen', label: 'Pen', icon: '🖊️' },
    { id: 'wristband', label: 'Wristband', icon: '🎗️' },
];

export default function AttendeesPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [attendees, setAttendees] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [total, setTotal] = React.useState(0);
    const [actioningCount, setActioningCount] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const itemsPerPage = 8;

    const loadAttendees = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAttendeesForUI(page, itemsPerPage, search);
            if (response.success) {
                setAttendees(response.data);
                setTotal(response.meta.total);
            }
        } catch (error) {
            toast.error("Failed to load attendees");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    React.useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => {
            loadAttendees();
        }, 300);
        return () => clearTimeout(timeout);
    }, [loadAttendees]);

    const totalPages = Math.ceil(total / itemsPerPage) || 1;
    const paginatedAttendees = attendees;

    const exportToCSV = async () => {
        try {
            const response = await exportAttendees();
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `attendees_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            toast.error("Failed to export attendees");
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedAttendees.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedAttendees.map(a => a.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkCheckIn = async () => {
        if (!selectedIds.length) return;
        try {
            setActioningCount(selectedIds.length);
            for (const id of selectedIds) {
                await checkInAttendee(id);
            }
            toast.success(`Successfully checked in ${selectedIds.length} attendees`);
            setSelectedIds([]);
            loadAttendees();
        } catch (error) {
            toast.error("Failed to check in some attendees");
        } finally {
            setActioningCount(0);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} attendees?`)) return;

        try {
            setActioningCount(selectedIds.length);
            for (const id of selectedIds) {
                await deleteAttendee(id);
            }
            toast.success(`Successfully deleted ${selectedIds.length} attendees`);
            setSelectedIds([]);
            loadAttendees();
        } catch (error) {
            toast.error("Failed to delete some attendees");
        } finally {
            setActioningCount(0);
        }
    };

    const handleSingleCheckInToggle = async (id: string, currentChecked: boolean) => {
        try {
            await checkInAttendee(id);
            toast.success(currentChecked ? "Checked out successfully" : "Checked in successfully");
            loadAttendees();
        } catch (error) {
            toast.error("Failed to toggle check-in");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">Attendees</h2>
                        <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Managing {total} registered builders</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-[var(--border)] text-xs font-bold gap-2" onClick={exportToCSV}>
                            <Download size={14} /> Export CSV
                        </Button>
                        <Button variant="primary" size="sm" className="shadow-glow text-xs font-bold gap-2">
                            <QrCode size={14} /> Scanner Mode
                        </Button>
                    </div>
                </div>

                {/* Table Controls */}
                <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={18} />
                                <Input
                                    className="pl-10 h-11 bg-[var(--void)]/50 border-[var(--border)] focus:border-[var(--electric)]/50 transition-all font-medium"
                                    placeholder="Search name, email, or university..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                                <Button variant="outline" size="sm" className="border-[var(--border)] whitespace-nowrap text-xs gap-2">
                                    <Filter size={14} /> Status <ChevronDown size={14} />
                                </Button>
                                <Button variant="outline" size="sm" className="border-[var(--border)] whitespace-nowrap text-xs gap-2">
                                    <Users size={14} /> Group <ChevronDown size={14} />
                                </Button>
                            </div>
                        </div>

                        {/* Bulk Actions Bar */}
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-6 flex items-center justify-between rounded-lg bg-[var(--electric)]/10 border border-[var(--electric)]/20 px-4 py-3">
                                        <span className="text-xs font-bold text-[var(--electric-light)] font-mono">
                                            {selectedIds.length} ITEMS SELECTED
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button size="xs" variant="ghost" onClick={handleBulkCheckIn} disabled={actioningCount > 0} className="text-[var(--text-1)] h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-white/5">
                                                <CheckCircle2 size={12} /> Mark Check-in
                                            </Button>
                                            <Button size="xs" variant="ghost" className="text-[var(--text-1)] h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-white/5">
                                                <Mail size={12} /> Send Email
                                            </Button>
                                            <Divider className="h-4 w-px bg-[var(--electric)]/30 vertical mx-1" />
                                            <Button size="xs" variant="ghost" onClick={handleBulkDelete} disabled={actioningCount > 0} className="text-[var(--error)] h-8 px-3 text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-[var(--error)]/10">
                                                <Trash2 size={12} /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    {/* Table */}
                    <div className="overflow-x-auto border-t border-[var(--border)]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--surface)] text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)] border-b border-[var(--border)]">
                                    <th className="px-6 py-4 w-12">
                                        <Checkbox checked={selectedIds.length === paginatedAttendees.length && paginatedAttendees.length > 0} onCheckedChange={toggleSelectAll} />
                                    </th>
                                    <th className="px-6 py-4">Reg ID</th>
                                    <th className="px-6 py-4">Attendee</th>
                                    <th className="px-6 py-4">University</th>
                                    <th className="px-6 py-4 text-center">Check-in</th>
                                    <th className="px-6 py-4">Swag Items</th>
                                    <th className="px-6 py-4">Certificate</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]/50">
                                {paginatedAttendees.map((attendee, i) => (
                                    <motion.tr
                                        key={attendee.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-white/10 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/admin/attendees/${attendee.id}`)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedIds.includes(attendee.id)}
                                                onCheckedChange={() => toggleSelectOne(attendee.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono font-bold text-[var(--text-3)] bg-[var(--void)]/50 px-2 py-1 rounded border border-[var(--border)]">{attendee.registrationId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={attendee.name} className="h-8 w-8 text-[10px] border border-white/10 shadow-sm" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[var(--text-1)] group-hover:text-[var(--electric-light)] transition-colors">{attendee.name}</span>
                                                    <span className="text-[10px] font-mono text-[var(--text-3)] lowercase">{attendee.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-[var(--text-2)]">{attendee.university}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Switch
                                                checked={attendee.checkedIn}
                                                onCheckedChange={() => handleSingleCheckInToggle(attendee.id, attendee.checkedIn)}
                                                className="data-[state=checked]:bg-[var(--success)]"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {SWAG_ITEMS.map(swag => (
                                                    <div
                                                        key={swag.id}
                                                        className={cn(
                                                            "flex h-7 w-7 items-center justify-center rounded-md border text-base transition-all",
                                                            attendee.swag[swag.id as keyof typeof attendee.swag]
                                                                ? "border-[var(--electric)]/40 bg-[var(--electric)]/10 opacity-100"
                                                                : "border-[var(--border)] bg-transparent opacity-20 grayscale border-dashed"
                                                        )}
                                                        title={swag.label}
                                                    >
                                                        <span className="scale-[0.6]">{swag.icon}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[9px] uppercase tracking-widest h-5 px-1.5 border-0 bg-transparent font-mono font-bold",
                                                    attendee.certificateStatus === 'Sent' ? "text-[var(--success)]" :
                                                        attendee.certificateStatus === 'Failed' ? "text-[var(--error)]" : "text-[var(--text-3)]"
                                                )}
                                            >
                                                {attendee.certificateStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)]">
                        <span className="text-xs font-mono font-bold text-[var(--text-3)] uppercase tracking-widest">
                            Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, total)} of {total} entries
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="xs"
                                className="h-9 w-9 p-0 border-[var(--border)]"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={page === i + 1 ? "primary" : "outline"}
                                    size="xs"
                                    className={cn(
                                        "h-9 w-9 p-0 text-xs font-bold",
                                        page === i + 1 ? "shadow-glow" : "border-[var(--border)]"
                                    )}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="xs"
                                className="h-9 w-9 p-0 border-[var(--border)]"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
