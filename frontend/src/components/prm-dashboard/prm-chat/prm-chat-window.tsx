"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
    PrmChatAttachmentKind,
    PrmChatConversation,
    PrmChatMessage,
} from "@/lib/prm-chat/prm-chat-api";
import { prmSendMessage } from "@/lib/prm-chat/prm-chat-api";
import { PrmChatAttachment } from "./prm-chat-attachment";
import { PrmChatRecorder } from "./prm-chat-recorder";

interface PrmChatWindowProps {
    token: string;
    conversation: PrmChatConversation | null;
    messages: PrmChatMessage[];
    currentUserId: number;
    onMessageSent: (message: PrmChatMessage) => void;
}

export function PrmChatWindow({
    token,
    conversation,
    messages,
    currentUserId,
    onMessageSent,
}: PrmChatWindowProps) {
    const [body, setBody] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState<PrmChatAttachmentKind | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0];

        if (!selected) {
            return;
        }

        const extension = selected.name.split(".").pop()?.toLowerCase();
        let selectedKind: PrmChatAttachmentKind | null = null;

        if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension ?? "")) {
            selectedKind = "image";
        } else if (extension === "pdf") {
            selectedKind = "pdf";
        } else if (["mp4", "webm"].includes(extension ?? "")) {
            selectedKind = "video";
        }

        const limit = selectedKind === "image"
            ? 10 * 1024 * 1024
            : selectedKind === "pdf"
              ? 20 * 1024 * 1024
              : 50 * 1024 * 1024;

        if (!selectedKind || selected.size > limit) {
            setError("نوع یا حجم فایل مجاز نیست.");
            event.target.value = "";
            return;
        }

        setFile(selected);
        setKind(selectedKind);
        setError(null);
        event.target.value = "";
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!conversation || (!body.trim() && !file) || isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const message = await prmSendMessage(
                token,
                conversation.id,
                body.trim(),
                file ?? undefined,
                kind ?? undefined,
            );

            onMessageSent(message);
            setBody("");
            setFile(null);
            setKind(null);
        } catch {
            setError("ارسال پیام انجام نشد. نوع و حجم فایل یا اتصال را بررسی کنید.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!conversation) {
        return (
            <main className="prm-chat-window-card flex items-center justify-center p-8 text-center text-sm text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <span>برای شروع یک گفتگو را انتخاب کنید</span>
                </div>
            </main>
        );
    }

    return (
        <main className="prm-chat-window-card">
            <header className="flex items-center justify-between border-b border-slate-100/80 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--prm-primary-color)] text-xs font-black text-white">
                        {conversation.other_user?.name?.charAt(0) || "آ"}
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[var(--prm-text-dark)]">
                            {conversation.other_user?.name}
                        </h3>
                        {conversation.other_user?.company_name && (
                            <p className="text-[11px] text-[var(--prm-text-light)]">
                                {conversation.other_user.company_name}
                            </p>
                        )}
                    </div>
                </div>

                {conversation.advertisement && (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/60 px-4 py-2 text-xs">
                        <span className="font-bold text-[var(--prm-secondary-color)]">مربوط به:</span>
                        <span className="font-extrabold text-[var(--prm-text-dark)]">
                            {conversation.advertisement.title}
                        </span>
                    </div>
                )}
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.map((message) => {
                    const isMine = message.sender_id === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-4 text-xs leading-relaxed ${
                                    isMine
                                        ? "prm-chat-bubble-mine"
                                        : "prm-chat-bubble-theirs"
                                }`}
                            >
                                {message.body && (
                                    <p className="whitespace-pre-wrap">{message.body}</p>
                                )}
                                {message.attachment && (
                                    <PrmChatAttachment
                                        token={token}
                                        attachment={message.attachment}
                                    />
                                )}
                                <span className="mt-2 block text-left text-[9px] text-slate-400">
                                    {new Date(message.created_at).toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-100/80 bg-white/40 p-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp4,.webm"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {file && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white/75 px-3 py-2 text-xs">
                        <span className="truncate text-[var(--prm-text-dark)]">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setFile(null);
                                setKind(null);
                            }}
                            className="shrink-0 font-bold text-[var(--prm-accent-color)]"
                        >
                            انصراف از پیوست
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                        className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[var(--prm-text-dark)] disabled:opacity-50"
                    >
                        پیوست
                    </button>

                    <PrmChatRecorder
                        disabled={isSubmitting}
                        onRecorded={(recordedFile) => {
                            setFile(recordedFile);
                            setKind("voice");
                            setError(null);
                        }}
                        onError={setError}
                    />

                    <input
                        type="text"
                        value={body}
                        maxLength={5000}
                        onChange={(event) => setBody(event.target.value)}
                        placeholder="پیام خود را بنویسید..."
                        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-[var(--prm-secondary-color)] focus:outline-none"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting || (!body.trim() && !file)}
                        className="shrink-0 rounded-xl bg-[var(--prm-secondary-color)] px-4 py-3 text-xs font-black text-slate-950 disabled:opacity-50"
                    >
                        ارسال
                    </button>
                </div>

                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </form>
        </main>
    );
}
