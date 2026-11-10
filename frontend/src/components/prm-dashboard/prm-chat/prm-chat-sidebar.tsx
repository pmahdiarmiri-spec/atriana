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
    return (
        <aside className="prm-chat-sidebar-card">
            <div className="border-b border-slate-100/80 p-5">
                <h2 className="text-base font-black text-[var(--prm-text-dark)]">پیام‌های تجاری</h2>
                <p className="mt-1 text-xs text-[var(--prm-text-light)]">مذاکرات اختصاصی خریداران و فروشندگان</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                    conversations.map((conv) => {
                        const isSelected = conv.id === selectedId;
                        return (
                            <div
                                key={conv.id}
                                onClick={() => onSelect(conv.id)}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                                    isSelected
                                        ? "bg-[var(--prm-primary-color)] text-white shadow-lg shadow-slate-900/10"
                                        : "bg-white/60 hover:bg-white/90 text-slate-700 border border-white/60"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className={`truncate text-xs font-black ${isSelected ? "text-white" : "text-[var(--prm-text-dark)]"}`}>
                                        {conv.other_user?.name || "کاربر ناشناس"}
                                    </h4>
                                    {conv.unread_count > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--prm-secondary-color)] text-[10px] font-black text-slate-950">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>

                                {conv.advertisement && (
                                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] opacity-75">
                                        <span className="font-bold text-[var(--prm-secondary-color)]">آگهی:</span>
                                        <span className="truncate">{conv.advertisement.title}</span>
                                    </div>
                                )}

                                <p className={`mt-2 truncate text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                    {conv.last_message?.body || "پیامی وجود ندارد"}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
