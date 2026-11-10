"use client";

import React from "react";
import type { PrmChatConversation } from "@/lib/prm-chat/prm-chat-api";

interface PrmChatSidebarProps {
    conversations: PrmChatConversation[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    isLoading: boolean;
}

export function PrmChatSidebar({
    conversations,
    selectedId,
    onSelect,
    isLoading,
}: PrmChatSidebarProps) {
    const preview = (conversation: PrmChatConversation): string => {
        const message = conversation.last_message;

        if (!message) {
            return "پیامی وجود ندارد";
        }

        if (message.body) {
            return message.body;
        }

        const map: Record<string, string> = {
            image: "تصویر",
            pdf: "فایل PDF",
            video: "ویدیو",
            voice: "ویس",
        };

        const kind = message.attachment?.kind ?? "";
        return map[kind] ?? "پیوست";
    };

    return (
        <aside className="prm-chat-sidebar-card">
            <div className="border-b border-slate-100/80 p-5">
                <h2 className="text-base font-black text-[var(--prm-text-dark)]">پیام‌های تجاری</h2>
                <p className="mt-1 text-xs text-[var(--prm-text-light)]">مذاکرات اختصاصی خریداران و فروشندگان</p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                        در حال بارگذاری گفتگوها...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-xs text-slate-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        گفتگویی یافت نشد.
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const isSelected = conversation.id === selectedId;

                        return (
                            <div
                                key={conversation.id}
                                onClick={() => onSelect(conversation.id)}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                                    isSelected
                                        ? "bg-[var(--prm-primary-color)] text-white shadow-lg shadow-slate-900/10"
                                        : "border border-white/60 bg-white/60 text-slate-700 hover:bg-white/90"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className={`truncate text-xs font-black ${isSelected ? "text-white" : "text-[var(--prm-text-dark)]"}`}>
                                        {conversation.other_user?.name || "کاربر ناشناس"}
                                    </h4>
                                    {conversation.unread_count > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--prm-secondary-color)] text-[10px] font-black text-slate-950">
                                            {conversation.unread_count}
                                        </span>
                                    )}
                                </div>

                                {conversation.advertisement && (
                                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] opacity-75">
                                        <span className="font-bold text-[var(--prm-secondary-color)]">آگهی:</span>
                                        <span className="truncate">{conversation.advertisement.title}</span>
                                    </div>
                                )}

                                <p className={`mt-2 truncate text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                    {preview(conversation)}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
