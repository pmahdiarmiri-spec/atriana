"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
    PrmChatAttachmentKind,
    PrmChatConversation,
    PrmChatMessage,
} from "@/lib/prm-chat/prm-chat-api";
import { prmSendMessage } from "@/lib/prm-chat/prm-chat-api";
import {
    PrmChatModeration,
    PrmChatReportReason,
    prmGetChatModeration,
    prmReportChat,
} from "@/lib/prm-chat/prm-chat-moderation-api";
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
    const [moderation, setModeration] = useState<PrmChatModeration | null>(
        null,
    );
    const [reportMessageId, setReportMessageId] = useState<
        number | null | undefined
    >(undefined);
    const [reportReason, setReportReason] =
        useState<PrmChatReportReason>("spam");
    const [reportDetails, setReportDetails] = useState("");
    const [reportError, setReportError] = useState<string | null>(null);
    const [reportSuccess, setReportSuccess] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!conversation) {
            setModeration(null);
            return;
        }

        let active = true;

        const loadModeration = async () => {
            try {
                const result = await prmGetChatModeration(
                    token,
                    conversation.id,
                );

                if (active) {
                    setModeration(result);
                }
            } catch {
                if (active) {
                    setModeration(null);
                }
            }
        };

        void loadModeration();

        const interval = window.setInterval(() => {
            void loadModeration();
        }, 30000);

        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, [conversation?.id, token]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

        const limit =
            selectedKind === "image"
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

        if (
            !conversation ||
            moderation?.can_send === false ||
            (!body.trim() && !file) ||
            isSubmitting
        ) {
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
            setError(
                "ارسال پیام انجام نشد. نوع و حجم فایل یا وضعیت گفتگو را بررسی کنید.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const openConversationReport = () => {
        setReportMessageId(null);
        setReportSuccess(false);
        setReportError(null);
    };

    const openMessageReport = (messageId: number) => {
        setReportMessageId(messageId);
        setReportSuccess(false);
        setReportError(null);
    };

    const closeReport = () => {
        setReportMessageId(undefined);
        setReportError(null);
        setReportDetails("");
    };

    const submitReport = async (event: React.FormEvent) => {
        event.preventDefault();

        if (
            !conversation ||
            reportMessageId === undefined ||
            isReporting ||
            (reportReason === "other" && !reportDetails.trim())
        ) {
            return;
        }

        try {
            setIsReporting(true);
            setReportError(null);

            await prmReportChat(
                token,
                conversation.id,
                reportReason,
                reportDetails,
                reportMessageId ?? undefined,
            );

            setReportSuccess(true);
            setReportMessageId(undefined);
            setReportDetails("");
        } catch {
            setReportError(
                "ثبت گزارش انجام نشد؛ ممکن است این مورد قبلاً گزارش شده باشد.",
            );
        } finally {
            setIsReporting(false);
        }
    };

    if (!conversation) {
        return (
            <main className="prm-chat-window-card flex items-center justify-center p-8 text-center text-sm text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <span>برای شروع یک گفتگو را انتخاب کنید</span>
                </div>
            </main>
        );
    }

    const isSendingDisabled =
        isSubmitting || moderation?.can_send === false;

    return (
        <main className="prm-chat-window-card">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100/80 px-6 py-4">
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

                <div className="flex flex-wrap items-center justify-end gap-2">
                    {conversation.advertisement && (
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/60 px-4 py-2 text-xs">
                            <span className="font-bold text-[var(--prm-secondary-color)]">
                                مربوط به:
                            </span>
                            <span className="max-w-48 truncate font-extrabold text-[var(--prm-text-dark)]">
                                {conversation.advertisement.title}
                            </span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={openConversationReport}
                        className="prm-chat-report-button rounded-xl border border-orange-200 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-50"
                    >
                        گزارش گفتگو
                    </button>
                </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.map((message) => {
                    const isMine = message.sender_id === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${
                                isMine ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] p-4 text-xs leading-relaxed ${
                                    isMine
                                        ? "prm-chat-bubble-mine"
                                        : "prm-chat-bubble-theirs"
                                }`}
                            >
                                {message.body && (
                                    <p className="whitespace-pre-wrap">
                                        {message.body}
                                    </p>
                                )}

                                {message.attachment && (
                                    <PrmChatAttachment
                                        token={token}
                                        attachment={message.attachment}
                                    />
                                )}

                                {!isMine && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openMessageReport(message.id)
                                        }
                                        className="prm-chat-report-message mt-2 block text-[10px] font-bold text-orange-700"
                                    >
                                        گزارش این پیام
                                    </button>
                                )}

                                <span className="mt-2 block text-left text-[9px] text-slate-400">
                                    {new Date(
                                        message.created_at,
                                    ).toLocaleTimeString("fa-IR", {
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

            {moderation?.can_send === false && (
                <div
                    role="status"
                    className="border-t border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-700"
                >
                    {moderation.status === "suspended"
                        ? "ارسال پیام در این گفتگو موقتاً تعلیق شده است."
                        : moderation.status === "blocked"
                          ? "این گفتگو توسط مدیریت مسدود شده است."
                          : moderation.status === "closed"
                            ? "این گفتگو بسته شده است."
                            : "ارسال پیام در این گفتگو غیرفعال شده است."}
                </div>
            )}

            {reportSuccess && (
                <p
                    role="status"
                    className="border-t border-green-100 bg-green-50 px-4 py-3 text-xs font-bold text-green-700"
                >
                    گزارش برای بررسی مدیر ثبت شد.
                </p>
            )}

            {reportMessageId !== undefined && (
                <form
                    onSubmit={submitReport}
                    className="prm-chat-report-form space-y-3 border-t border-orange-100 bg-orange-50/40 p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black text-[var(--prm-text-dark)]">
                            {reportMessageId === null
                                ? "گزارش گفتگو"
                                : `گزارش پیام #${reportMessageId}`}
                        </p>

                        <button
                            type="button"
                            onClick={closeReport}
                            className="text-xs font-bold text-slate-500"
                        >
                            بستن
                        </button>
                    </div>

                    <select
                        value={reportReason}
                        onChange={(event) =>
                            setReportReason(
                                event.target.value as PrmChatReportReason,
                            )
                        }
                        className="w-full rounded-xl border border-orange-100 bg-white p-3 text-xs text-slate-800 outline-none focus:border-orange-400"
                    >
                        <option value="spam">هرزنامه</option>
                        <option value="harassment">آزار و تهدید</option>
                        <option value="fraud">تقلب یا کلاهبرداری</option>
                        <option value="prohibited_content">
                            محتوای غیرمجاز
                        </option>
                        <option value="other">سایر موارد</option>
                    </select>

                    <textarea
                        value={reportDetails}
                        onChange={(event) =>
                            setReportDetails(event.target.value)
                        }
                        maxLength={2000}
                        required={reportReason === "other"}
                        placeholder="توضیح تکمیلی"
                        className="min-h-24 w-full resize-y rounded-xl border border-orange-100 bg-white p-3 text-xs text-slate-800 outline-none focus:border-orange-400"
                    />

                    {reportError && (
                        <p role="alert" className="text-xs font-bold text-red-700">
                            {reportError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            isReporting ||
                            (reportReason === "other" &&
                                !reportDetails.trim())
                        }
                        className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isReporting ? "در حال ثبت..." : "ثبت گزارش"}
                    </button>
                </form>
            )}

            <form
                onSubmit={handleSubmit}
                className="border-t border-slate-100/80 bg-white/40 p-4"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.mp4,.webm"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {file && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white/75 px-3 py-2 text-xs">
                        <span className="truncate text-[var(--prm-text-dark)]">
                            {file.name}
                        </span>

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
                        disabled={isSendingDisabled}
                        className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[var(--prm-text-dark)] disabled:opacity-50"
                    >
                        پیوست
                    </button>

                    <PrmChatRecorder
                        disabled={isSendingDisabled}
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
                        placeholder={
                            moderation?.can_send === false
                                ? "ارسال پیام غیرفعال است"
                                : "پیام خود را بنویسید..."
                        }
                        disabled={moderation?.can_send === false}
                        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-[var(--prm-secondary-color)] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <button
                        type="submit"
                        disabled={
                            isSendingDisabled ||
                            (!body.trim() && !file)
                        }
                        className="shrink-0 rounded-xl bg-[var(--prm-secondary-color)] px-4 py-3 text-xs font-black text-slate-950 disabled:opacity-50"
                    >
                        ارسال
                    </button>
                </div>

                {error && (
                    <p className="mt-2 text-xs text-red-600">{error}</p>
                )}
            </form>
        </main>
    );
}
