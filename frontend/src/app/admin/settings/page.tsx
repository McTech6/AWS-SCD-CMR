"use client";

import * as React from "react";
import { Settings, Wrench } from "lucide-react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Toggle, Card, CardHeader, CardTitle, CardContent, Divider, Button } from "@/components/ui";

export default function SettingsAdminPage() {
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
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Registration Status</h4>
                                <p className="text-xs text-[var(--text-3)]">Enable or disable new user signups</p>
                            </div>
                            <Toggle checked={true} />
                        </div>
                        <Divider className="opacity-10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Live Check-in Mode</h4>
                                <p className="text-xs text-[var(--text-3)]">Toggle real-time check-in processing</p>
                            </div>
                            <Toggle checked={false} />
                        </div>
                        <Divider className="opacity-10" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--text-1)]">Certificate Generation</h4>
                                <p className="text-xs text-[var(--text-3)]">Allow attendees to download certificates</p>
                            </div>
                            <Toggle checked={true} />
                        </div>

                        <div className="pt-6">
                            <Button variant="primary" size="sm" className="shadow-glow uppercase tracking-widest text-[10px] font-bold">Save Global Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
