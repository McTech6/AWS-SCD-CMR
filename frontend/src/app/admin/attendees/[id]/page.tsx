"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    CheckCircle2,
    Gift,
    ShieldCheck,
    Mail,
    User,
    School,
    Hash,
    Calendar,
    BadgeCheck,
    QrCode,
    Zap,
    Download
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
import { getAttendeeById, checkInAttendee, updateAttendeeSwag } from "@/lib/api";
import toast from "react-hot-toast";

const SWAG_ITEMS = [
    { id: 'tshirt', label: 'Official Event T-Shirt', icon: '👕', description: 'Premium cotton attendee tee' },
    { id: 'stickers', label: 'AWS Sticker Pack', icon: '✨', description: 'Cloud Club & AWS logo set' },
    { id: 'notebook', label: 'The Cloud Notebook', icon: '📓', description: 'Hardcover grid-paper notes' },
    { id: 'badge', label: 'Event Badge', icon: '🏷️', description: 'Physical ID for entry' },
    { id: 'pen', label: 'AWS Swag Pen', icon: '🖊️', description: 'Branded stationery' },
    { id: 'wristband', label: 'NFC Wristband', icon: '🎗️', description: 'Digital authentication' },
];

export default function AttendeeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isCheckedIn, setIsCheckedIn] = React.useState(false);
    const [receivedSwag, setReceivedSwag] = React.useState<Record<string, boolean>>({
        pen: true,
        wristband: true
    });

    const attendeeId = params.id as string;
    const [attendee, setAttendee] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    const loadAttendee = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAttendeeById(attendeeId);
            if (response.success) {
                setAttendee({
                    ...response.data,
                    date: new Date(response.data.registeredAt).toISOString().replace('T', ' ').substring(0, 19)
                });
                setIsCheckedIn(response.data.checkedIn);
                if (response.data.swag) {
                    setReceivedSwag(response.data.swag);
                }
            }
        } catch (error) {
            toast.error("Failed to load attendee");
        } finally {
            setLoading(false);
        }
    }, [attendeeId]);

    React.useEffect(() => {
        loadAttendee();
    }, [loadAttendee]);

    const toggleSwag = async (id: string) => {
        // optimistically update state
        const newSwag = { ...receivedSwag, [id]: !receivedSwag[id] };
        setReceivedSwag(newSwag);
        try {
            await updateAttendeeSwag(attendeeId, newSwag);
            toast.success("Swag updated");
        } catch (error) {
            toast.error("Failed to update swag");
            // revert
            setReceivedSwag(receivedSwag);
        }
    };

    const handleCheckIn = async () => {
        if (isCheckedIn) return;
        setIsCheckedIn(true);
        try {
            await checkInAttendee(attendeeId);
            toast.success("Attendee checked in successfully");
            setTimeout(() => {
                router.push("/admin/attendees");
            }, 800);
        } catch (error) {
            setIsCheckedIn(false);
            toast.error("Failed to check in attendee");
        }
    };

    const handleToggleCheckIn = async (checked: boolean) => {
        setIsCheckedIn(checked);
        try {
            await checkInAttendee(attendeeId);
            toast.success(checked ? "Attendee checked in" : "Attendee checked out");
            setTimeout(() => {
                router.push("/admin/attendees");
            }, 800);
        } catch (error) {
            setIsCheckedIn(!checked);
            toast.error("Failed to update check-in status");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-[var(--text-3)] font-mono animate-pulse">Loading Attendee Data...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!attendee) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center flex-col gap-4">
                    <div className="text-[var(--error)] font-mono">Attendee Not Found</div>
                    <Button variant="outline" onClick={() => router.push("/admin/attendees")}>Back to Directory</Button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 pb-20">
                {/* Top Navigation */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--electric)] transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--text-3)]">Back to Directory</h2>
                        <h1 className="text-2xl font-display font-black text-[var(--text-1)]">Edit Attendee</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-[var(--border)] bg-[var(--surface)] shadow-elevated overflow-hidden border-t-4 border-t-[var(--electric)]">
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <Avatar name={attendee.name} className="h-32 w-32 border-4 border-[var(--void)] shadow-glow" />
                                        {isCheckedIn && (
                                            <div className="absolute -bottom-2 -right-2 bg-[var(--success)] text-white p-1.5 rounded-full border-4 border-[var(--void)] shadow-lg">
                                                <BadgeCheck size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-[var(--text-1)]">{attendee.name}</h3>
                                    <Badge variant="outline" className="mt-2 text-[var(--text-3)] font-mono uppercase tracking-[0.2em] text-[10px] border-[var(--border)]">
                                        {attendee.registrationId}
                                    </Badge>

                                    <div className="mt-8 w-full space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5 text-left group hover:border-[var(--electric)]/20 transition-all">
                                            <div className="h-8 w-8 rounded bg-[var(--electric)]/10 flex items-center justify-center text-[var(--electric)]">
                                                <Mail size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase font-bold text-[var(--text-3)] tracking-widest">Email Address</p>
                                                <p className="text-sm text-[var(--text-2)]">{attendee.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5 text-left hover:border-[var(--electric)]/20 transition-all">
                                            <div className="h-8 w-8 rounded bg-[var(--electric)]/10 flex items-center justify-center text-[var(--electric)]">
                                                <School size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase font-bold text-[var(--text-3)] tracking-widest">Institution</p>
                                                <p className="text-sm text-[var(--text-2)]">{attendee.university}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--void)]/30 border border-[var(--border)]/5 text-left hover:border-[var(--electric)]/20 transition-all">
                                            <div className="h-8 w-8 rounded bg-[var(--electric)]/10 flex items-center justify-center text-[var(--electric)]">
                                                <Calendar size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase font-bold text-[var(--text-3)] tracking-widest">Registration Date</p>
                                                <p className="text-sm text-[var(--text-2)]">{attendee.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <Divider className="opacity-5" />
                            <div className="p-6 bg-white/5 flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-[var(--text-3)] uppercase tracking-widest">Account Status</span>
                                <Badge variant="outline" className="text-[var(--success)] border-[var(--success)]/20 bg-[var(--success)]/10 uppercase font-bold">{attendee.status}</Badge>
                            </div>
                        </Card>

                        {/* Quick Data Card */}
                        <Card className="border-[var(--border)] bg-[var(--surface)] p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-[var(--text-1)]">Ticket QR Code</h4>
                                    <p className="text-xs text-[var(--text-3)]">Identity verification token</p>
                                </div>
                                <QrCode size={24} className="text-[var(--text-3)]" />
                            </div>
                            <div className="mt-4 p-4 bg-white flex items-center justify-center rounded-xl border-4 border-slate-100 shadow-inner">
                                <div className="h-32 w-32 bg-slate-900 rounded opacity-10 flex items-center justify-center text-4xl">
                                    <Hash />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Check-in & Swag */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Check-in Command Center */}
                        <Card className="border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-glow">
                            <CardHeader className="border-b border-[var(--border)]/10 bg-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[var(--electric)] flex items-center justify-center text-white">
                                            <Zap size={20} />
                                        </div>
                                        <CardTitle className="text-xl font-bold">Check-in Sequence</CardTitle>
                                    </div>
                                    {isCheckedIn && (
                                        <Badge className="bg-[var(--success)] text-white shadow-glow">LIVE CHECKED-IN</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">Protocol 01: Swag Distribution</h4>
                                        <Badge variant="outline" className="text-[10px] font-mono border-[var(--border)]">{Object.values(receivedSwag).filter(Boolean).length} / {SWAG_ITEMS.length} Issued</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {SWAG_ITEMS.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleSwag(item.id)}
                                                className={cn(
                                                    "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                                                    receivedSwag[item.id]
                                                        ? "border-[var(--electric)] bg-[var(--electric)]/5 shadow-glow"
                                                        : "border-[var(--border)] bg-[var(--void)]/20 grayscale hover:grayscale-0 hover:border-[var(--electric)]/30"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 shrink-0 flex items-center justify-center text-2xl rounded-lg border",
                                                    receivedSwag[item.id] ? "border-[var(--electric)]/40 bg-white shadow-sm" : "border-[var(--border)] bg-[var(--surface)]"
                                                )}>
                                                    <span className={cn(receivedSwag[item.id] ? "scale-110" : "scale-100", "transition-transform")}>{item.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn("text-sm font-bold", receivedSwag[item.id] ? "text-[var(--text-1)]" : "text-[var(--text-3)]")}>{item.label}</span>
                                                        <div className={cn(
                                                            "h-4 w-4 rounded-full border-2 transition-all",
                                                            receivedSwag[item.id] ? "bg-[var(--electric)] border-[var(--electric)] shadow-[0_0_10px_var(--electric)]" : "border-[var(--border)]"
                                                        )} />
                                                    </div>
                                                    <p className="text-[10px] text-[var(--text-3)] mt-1 line-clamp-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Divider className="opacity-5" />

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--electric)]">Protocol 02: Verification</h4>
                                            <p className="text-sm text-[var(--text-3)] mt-1">Has the builder verified their ID?</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-[var(--success)]" checked={isCheckedIn} onCheckedChange={handleToggleCheckIn} />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            className="h-14 flex-1 border-[var(--border)] text-xs font-bold uppercase tracking-widest gap-2"
                                            onClick={() => router.back()}
                                        >
                                            Decline Entry
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className={cn(
                                                "h-14 flex-[2] text-xs font-black uppercase tracking-[0.2em] shadow-glow gap-3",
                                                isCheckedIn ? "bg-[var(--success)] border-none" : ""
                                            )}
                                            onClick={handleCheckIn}
                                            disabled={isCheckedIn}
                                        >
                                            {isCheckedIn ? (
                                                <><CheckCircle2 /> Sequence Completed</>
                                            ) : (
                                                <><ShieldCheck /> Finalize Check-in</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Card className="border-[var(--border)] bg-[var(--surface)] p-6 shadow-elevated">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Internal Notes</h4>
                                    <button className="text-[var(--electric)] text-[10px] font-bold">EDIT</button>
                                </div>
                                <p className="text-xs text-[var(--text-2)] leading-relaxed bg-[var(--void)]/50 p-4 rounded-lg border border-[var(--border)]">
                                    First year student from TUC. Volunteer applicant for track 2. Needs to be directed to the main hall after check-in.
                                </p>
                            </Card>
                            <Card className="border-[var(--border)] bg-[var(--surface)] p-6 shadow-elevated">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-3)]">Audit Logs</h4>
                                    <button className="text-[var(--electric)] text-[10px] font-bold">VIEW FULL</button>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-start gap-2 text-[10px]">
                                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--electric)] mt-1" />
                                            <div>
                                                <p className="text-[var(--text-1)] font-bold">Registration Confirmation Sent</p>
                                                <p className="text-[var(--text-3)] lowercase">2 mins ago by SYSTEM</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
