"use client";

import React, { useEffect } from "react";
import type { PrmChatAttachment } from "@/lib/prm-chat/prm-chat-api";

interface PrmChatMediaViewerProps {
    attachment: PrmChatAttachment;
    url: string;
    onClose: () => void;
}

export function PrmChatMediaViewer({
    attachment,
    url,
    onClose,
}: PrmChatMediaViewerProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={attachment.name}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--prm-primary-color)]/90 p-4 backdrop-blur-xl"
            onClick={onClose}
        >
            <div
                className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/30 bg-[var(--prm-bg-light)] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
                    <span className="truncate text-sm font-bold text-[var(--prm-text-dark)]">
                        {attachment.name}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[var(--prm-primary-color)] px-4 py-2 text-xs font-bold text-white"
                    >
                        بستن
                    </button>
                </div>
                <div className="flex min-h-0 flex-1 items-center justify-center p-3">
                    {attachment.kind === "image" ? (
                        <img
                            src={url}
                            alt={attachment.name}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <iframe
                            src={url}
                            title={attachment.name}
                            className="h-full w-full rounded-xl bg-white"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
