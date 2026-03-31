"use client";

import * as React from "react";
import { Settings, Wrench, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Toggle, Card, CardHeader, CardTitle, CardContent, Divider, Button, Spinner } from "@/components/ui";
import { getEventConfig, updateEventConfig } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SettingsAdminPage() {
    const [config, setConfig] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await getEventConfig();
                if (response.success) {
                    setConfig(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch config:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const updateConfigSetting = async (updatedFields: any, label: string) => {
        // Optimistic update
        const previousConfig = { ...config };
        setConfig((prev: any) => ({ ...prev, ...updatedFields }));

        try {
            const response = await updateEventConfig(updatedFields);
            if (response.success) {
                toast.success(`${label} updated`);
                setConfig(response.data);
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error(`Failed to update ${label}:`, error);
            toast.error(`Error: Could not update ${label}`);
            // Revert on failure
            setConfig(previousConfig);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-[400px] items-center justify-center">
                    <Spinner size="lg" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <header>
                    <h2 className="font-display text-4xl font-extrabold text-[var(--text-1)] tracking-tight">System Settings</h2>
                    <p className="text-[var(--text-3)] font-mono text-xs uppercase tracking-[0.2em] mt-2">Manage API keys and global flags</p>
                </header>

                <Card className="border-[var(--border)] bg-[var(--surface)]">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">General Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Registration Closed</h4>
                                <p className="text-xs text-[var(--text-3)]">When active, people can no longer register</p>
                            </div>
                            <Toggle 
                                checked={config ? !config.registrationOpen : false} 
                                onCheckedChange={(checked) => updateConfigSetting({ registrationOpen: !checked }, "Registration Status")}
                            />
                        </div>
                        <Divider className="opacity-10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Speaker Applications Closed</h4>
                                <p className="text-xs text-[var(--text-3)]">Enable or disable new speaker submissions</p>
                            </div>
                            <Toggle 
                                checked={config ? !config.speakerAppsOpen : false} 
                                onCheckedChange={(checked) => updateConfigSetting({ speakerAppsOpen: !checked }, "Speaker Applications")}
                            />
                        </div>
                        <Divider className="opacity-10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Volunteer Applications Closed</h4>
                                <p className="text-xs text-[var(--text-3)]">Enable or disable new volunteer submissions</p>
                            </div>
                            <Toggle 
                                checked={config ? !config.volunteerAppsOpen : false} 
                                onCheckedChange={(checked) => updateConfigSetting({ volunteerAppsOpen: !checked }, "Volunteer Applications")}
                            />
                        </div>
                        <Divider className="opacity-10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Certificate Generation</h4>
                                <p className="text-xs text-[var(--text-3)]">Allow attendees to download certificates</p>
                            </div>
                            <Toggle checked={true} disabled />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
