"use client";

import React, { useState } from "react";
import type { PrmPublicAdvertisement } from "@/lib/prm-advertisements/prm-advertisements-public-api";

interface PrmAdChatModalProps {
  advertisement: PrmPublicAdvertisement;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrmAdChatModal({
  advertisement,
  isOpen,
  onClose,
}: PrmAdChatModalProps) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
      onClose();
    }, 1800);
  };

  return (
    <div
      id="prm-chat-modal-overlay"
      className="prm-chat-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[var(--prm-primary-color)]/60 p-4 backdrop-blur-md"
    >
      <div
        id="prm-chat-modal-window"
        className="prm-chat-modal-window relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-6 backdrop-blur-2xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.4)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245,158,11,0.8), rgba(234,88,12,0.8), transparent)",
          }}
        />

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-[var(--prm-secondary-color)] text-[var(--prm-primary-color)] shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <div>
              <h4 className="text-sm font-extrabold text-[var(--prm-text-dark)]">
                گفتگو با آگهی‌دهنده
              </h4>
              <p className="text-xs text-[var(--prm-text-light)] truncate max-w-[260px]">
                {advertisement.company_name || advertisement.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-base font-extrabold text-[var(--prm-text-dark)]">
              پیام شما ارسال شد
            </p>
            <p className="mt-1 text-xs text-[var(--prm-text-light)]">
              پاسخ آگهی‌دهنده از طریق اعلان و پیام‌های سیستم به شما اطلاع داده
              می‌شود.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-xs font-bold text-[var(--prm-text-dark)]">
                متن پیام
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="سلام، در مورد شرایط تامین و قیمت سوال داشتم..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/70 p-3.5 text-sm text-[var(--prm-text-dark)] placeholder:text-slate-400 outline-none backdrop-blur-md transition-shadow focus:border-[var(--prm-secondary-color)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.2)]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl px-5 text-xs font-bold text-[var(--prm-text-light)] hover:bg-slate-100 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="prm-btn-primary flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-[var(--prm-secondary-color)] px-6 text-xs font-extrabold text-[var(--prm-primary-color)] shadow-[0_10px_25px_-8px_rgba(245,158,11,0.6)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ارسال پیام
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
