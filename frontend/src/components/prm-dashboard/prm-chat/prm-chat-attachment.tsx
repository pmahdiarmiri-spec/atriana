"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PrmChatAttachment as PrmChatAttachmentData } from "@/lib/prm-chat/prm-chat-api";
import { prmGetAttachmentBlob } from "@/lib/prm-chat/prm-chat-api";
import { PrmChatMediaViewer } from "./prm-chat-media-viewer";

interface PrmChatAttachmentProps {
    token: string;
    attachment: PrmChatAttachmentData;
}

export function PrmChatAttachment({ token, attachment }: PrmChatAttachmentProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const handleOpen = async () => {
        if (url) {
            if (attachment.kind === "image" || attachment.kind === "pdf") {
                setIsOpen(true);
            }

            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const blob = await prmGetAttachmentBlob(token, attachment.id);

            if (!mountedRef.current) {
                return;
            }

            const objectUrl = URL.createObjectURL(blob);
            objectUrlRef.current = objectUrl;
            setUrl(objectUrl);

            if (attachment.kind === "image" || attachment.kind === "pdf") {
                setIsOpen(true);
            }
        } catch {
            if (mountedRef.current) {
                setError("نمایش این فایل ممکن نشد.");
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="mt-3 min-w-0">
            {url && attachment.kind === "image" ? (
                <button type="button" onClick={handleOpen} className="block">
                    <img
                        src={url}
                        alt={attachment.name}
                        className="max-h-56 max-w-full rounded-xl object-contain"
                    />
                </button>
            ) : url && attachment.kind === "video" ? (
                <video src={url} controls playsInline className="max-h-72 w-full rounded-xl" />
            ) : url && attachment.kind === "voice" ? (
                <audio src={url} controls className="max-w-full" />
            ) : (
                <button
                    type="button"
                    onClick={handleOpen}
                    disabled={isLoading}
                    className="max-w-full rounded-xl border border-[var(--prm-secondary-color)]/40 bg-white/10 px-3 py-2 text-right text-xs transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                    <span className="block truncate font-bold">
                        {attachment.kind === "image"
                            ? "نمایش تصویر"
                            : attachment.kind === "pdf"
                              ? "نمایش PDF"
                              : attachment.kind === "video"
                                ? "پخش ویدیو"
                                : "پخش ویس"}
                    </span>
                    <span className="mt-1 block max-w-52 truncate opacity-75">
                        {isLoading ? "در حال بارگذاری..." : attachment.name}
                    </span>
                </button>
            )}

            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            {isOpen && url && (
                <PrmChatMediaViewer
                    attachment={attachment}
                    url={url}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
