"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export const Toaster = () => {
    return (
        <HotToaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: "var(--panel)",
                    color: "var(--text-1)",
                    border: "1px border var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "14px",
                    padding: "12px 16px",
                },
                success: {
                    iconTheme: {
                        primary: "var(--success)",
                        secondary: "var(--panel)",
                    },
                    style: {
                        border: "1px solid var(--success)",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "var(--error)",
                        secondary: "var(--panel)",
                    },
                    style: {
                        border: "1px solid var(--error)",
                    },
                },
            }}
        />
    );
};
