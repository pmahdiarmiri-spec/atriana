"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, Sparkles, PhoneCall, Newspaper, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

interface PrmMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrmMobileDrawer({ isOpen, onClose }: PrmMobileDrawerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "fa";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300"
      />
      <div className={`absolute top-0 bottom-0 ${isRtl ? "right-0" : "left-0"} w-[290px] prm-liquid-glass flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/40">
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[var(--prm-primary-color)]">
                {t("brand")}
              </span>
              <span className="text-[10px] text-[var(--prm-text-light)] font-medium">
                {t("slogan")}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[var(--prm-text-dark)] hover:bg-slate-900/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/blog"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-[var(--prm-text-dark)] hover:bg-white/60 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4 text-[var(--prm-secondary-color)]" />
                <span>{t("menu.blog")}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-[var(--prm-text-dark)] hover:bg-white/60 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[var(--prm-accent-color)]" />
                <span>{t("menu.contact")}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-white/40 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--prm-text-light)] px-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--prm-secondary-color)]" />
            <span>تجارت یکپارچه بین‌الملل آتریانا</span>
          </div>
        </div>
      </div>
    </div>
  );
}
