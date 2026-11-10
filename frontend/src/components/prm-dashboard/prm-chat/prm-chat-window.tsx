"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PrmChatConversation, PrmChatMessage } from "@/lib/prm-chat/prm-chat-api";
import { prmSendMessage } from "@/lib/prm-chat/prm-chat-api";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!conversation || !body.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            const sent = await prmSendMessage(token, conversation.id, body.trim());
            onMessageSent(sent);
            setBody("");
        } catch {
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
                        <h3 className="text-sm font-black text-[var(--prm-text-dark)]">{conversation.other_user?.name}</h3>
                        {conversation.other_user?.company_name && (
                            <p className="text-[11px] text-[var(--prm-text-light)]">{conversation.other_user.company_name}</p>
                        )}
                    </div>
                </div>

                {conversation.advertisement && (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/60 px-4 py-2 text-xs">
                        <span className="font-bold text-[var(--prm-secondary-color)]">مربوط به:</span>
                        <span className="font-extrabold text-[var(--prm-text-dark)]">{conversation.advertisement.title}</span>
                    </div>
                )}
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] p-4 text-xs leading-relaxed ${isMine ? "prm-chat-bubble-mine" : "prm-chat-bubble-theirs"}`}>
                                <p className="whitespace-pre-wrap">{msg.body}</p>
                                <span className={`mt-2 block text-left text-[9px] ${isMine ? "text-slate-400" : "text-slate-400"}`}>
                                    {new Date(msg.created_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-100/80 p-4 bg-white/40">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="پیام خود را بنویسید..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 pr-5 pl-14 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-[var(--prm-secondary-color)] focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !body.trim()}
                        className="absolute left-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--prm-secondary-color)] text-slate-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </form>
        </main>
    );
}
