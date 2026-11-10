"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { PrmPublicAdvertisement } from "@/lib/prm-advertisements/prm-advertisements-public-api";
import PrmAdGallery from "./prm-ad-gallery";
import PrmAdInfoGrid from "./prm-ad-info-grid";
import { prmGetAuthSession } from "@/lib/prm-auth/prm-auth-storage";
import { prmInitiateConversation } from "@/lib/prm-chat/prm-chat-api";

interface PrmAdDetailViewProps {
  advertisement: PrmPublicAdvertisement;
}

const prmFaNumber = (value: number | string): string => {
  const num = typeof value === "number" ? value : Number(value);
  return isNaN(num) ? String(value) : num.toLocaleString("fa-IR");
};

export default function PrmAdDetailView({
  advertisement,
}: PrmAdDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "fa";
  const [showPhone, setShowPhone] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const isOffer = advertisement.type === "offer";

  const handleStartChat = async () => {
    const session = prmGetAuthSession();
    const destinationPath = `/${locale}/dashboard?menu=messages&adId=${advertisement.id}`;

    if (!session?.token) {
      const loginUrl = `/${locale}/auth?redirect=${encodeURIComponent(destinationPath)}`;
      router.push(loginUrl);
      return;
    }

    try {
      setIsStartingChat(true);
      const conversation = await prmInitiateConversation(session.token, advertisement.id);
      router.push(`/${locale}/dashboard?menu=messages&convId=${conversation.id}`);
    } catch {
      router.push(destinationPath);
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="prm-ad-detail-view min-h-screen bg-[var(--prm-bg-light)] pb-16">
      <div className="prm-ad-detail-header relative border-b border-white/20 bg-[var(--prm-primary-color)] px-4 py-8 backdrop-blur-3xl shadow-[0_20px_50px_-15px_rgba(15,23,42,0.8)] md:px-8">
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(245,158,11,0.6), transparent)",
          }}
        />
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href={`/${locale}/ads`}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-xs font-extrabold text-[var(--prm-white)] backdrop-blur-xl transition-all hover:bg-white/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            بازگشت به فهرست آگهی‌ها
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-xl border border-white/20 px-3 py-1.5 text-xs font-black text-[var(--prm-white)] backdrop-blur-md ${
                isOffer ? "bg-emerald-600/80" : "bg-rose-600/80"
              }`}
            >
              {isOffer ? "فرصت عرضه" : "فرصت تقاضا"}
            </span>
            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md">
              کد آگهی: {prmFaNumber(advertisement.id)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PrmAdGallery
              primaryImage={advertisement.image_url}
              images={advertisement.images}
              title={advertisement.title}
            />

            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/70 p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_45px_-15px_rgba(15,23,42,0.1)]">
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)",
                }}
              />
              <h1 className="text-xl md:text-2xl font-black leading-snug text-[var(--prm-text-dark)]">
                {advertisement.title}
              </h1>

              {advertisement.title_en && (
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {advertisement.title_en}
                </p>
              )}

              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="text-sm font-black text-[var(--prm-text-dark)] mb-3">
                  توضیحات و مشخصات تکمیلی
                </h3>
                <p className="whitespace-pre-line text-sm leading-8 text-[var(--prm-text-light)]">
                  {advertisement.description || "توضیحاتی ثبت نشده است."}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-base font-black text-[var(--prm-text-dark)] mb-4">
                شناسنامه فنی و تجاری
              </h3>
              <PrmAdInfoGrid advertisement={advertisement} />
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/75 p-6 backdrop-blur-2xl shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,158,11,0.9), transparent)",
                }}
              />

              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--prm-primary-color)] text-[var(--prm-white)] font-black text-lg">
                  {advertisement.company_name?.charAt(0) || "آ"}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs text-[var(--prm-text-light)]">
                    شرکت / آگهی‌دهنده
                  </p>
                  <p className="text-sm font-black text-[var(--prm-text-dark)] truncate">
                    {advertisement.company_name || "شخص حقیقی"}
                  </p>
                </div>
              </div>

              {advertisement.has_verified_badge && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 14-3-3 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z" />
                  </svg>
                  هویت تجاری توسط آتریانا تایید شده است
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  id="prm-btn-start-chat"
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="prm-btn-primary group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-[var(--prm-secondary-color)] to-amber-500 py-3.5 text-sm font-black text-[var(--prm-primary-color)] shadow-[0_15px_30px_-10px_rgba(245,158,11,0.65)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                    }}
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {isStartingChat ? "در حال اتصال..." : "ارسال پیام به آگهی‌دهنده"}
                </button>

                {advertisement.phone ? (
                  showPhone ? (
                    <a
                      href={`tel:${advertisement.phone}`}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-[var(--prm-primary-color)] transition-all hover:border-[var(--prm-secondary-color)]"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {advertisement.phone}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPhone(true)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-[var(--prm-text-dark)] transition-all hover:border-slate-300"
                    >
                      نمایش شماره تماس
                    </button>
                  )
                ) : null}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-white/70 bg-white/60 p-5 backdrop-blur-xl text-xs text-[var(--prm-text-light)] leading-6">
              <div className="flex items-center gap-2 font-bold text-[var(--prm-text-dark)] mb-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-amber-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                راهنمای معامله امن آتریانا
              </div>
              پیش از هرگونه تبادل مالی، از اعتبار مدارک طرف مقابل اطمینان حاصل
              کنید و از قراردادهای رسمی تجاری استفاده نمایید.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
