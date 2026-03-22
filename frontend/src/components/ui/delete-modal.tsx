"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading?: boolean;
    itemCount?: number;
}

export function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Record",
    description = "This action cannot be undone. All data will be permanently removed.",
    loading = false,
    itemCount = 1
}: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[var(--void)]/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-elevated"
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--error)]/50 to-transparent" />

                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20 shadow-sm shadow-[var(--error)]/5">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold text-[var(--text-1)]">
                                        {itemCount > 1 ? `Delete ${itemCount} Records` : title}
                                    </h3>
                                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--error)]/80 mt-1">
                                        Critical Action Required
                                    </p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="ml-auto h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[var(--text-3)] transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <p className="text-[var(--text-2)] leading-relaxed mb-8">
                                {description}
                                {itemCount > 1 && (
                                    <span className="block mt-2 font-bold text-[var(--text-1)]">
                                        You are about to delete {itemCount} selected items.
                                    </span>
                                )}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-12 border-[var(--border)] font-bold text-xs uppercase tracking-widest hover:bg-white/5"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="danger" 
                                    className="flex-1 h-12 shadow-glow text-white font-bold text-xs uppercase tracking-widest bg-[var(--error)] hover:bg-[var(--error)]/90 border-0"
                                    onClick={onConfirm}
                                    loading={loading}
                                >
                                    Delete Forever
                                </Button>
                            </div>
                        </div>

                        {/* Footer Decoration */}
                        <div className="h-4 bg-[var(--void)]/50 border-t border-[var(--border)] flex items-center justify-center">
                             <div className="h-1 w-12 rounded-full bg-[var(--border)]" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
