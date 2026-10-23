"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, Compass, Eye, ArrowUpLeft, ArrowUpRight, Network, Layers, Scale, Calculator } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PrmAhpModal from "./prm-ahp-modal";

export default function PrmAhpSection() {
  const t = useTranslations("home.ahp");
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dynamicCards = [
    {
      id: 1,
      title: t("features.feat1Title"),
      desc: t("features.feat1Desc"),
      icon: Scale,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      id: 2,
      title: t("features.feat2Title"),
      desc: t("features.feat2Desc"),
      icon: Network,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      id: 3,
      title: t("features.feat3Title"),
      desc: t("features.feat3Desc"),
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    }
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="prm-liquid-glass prm-interactive-border relative rounded-3xl p-8 sm:p-12 md:p-16 border border-white/80 backdrop-blur-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 border border-slate-900/20 text-[var(--prm-primary-color)] text-xs sm:text-sm font-black backdrop-blur-xl">
            <Compass className="w-4 h-4 text-[var(--prm-accent-color)] animate-spin-slow" />
            <span>{t("badge")}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--prm-accent-color)] text-white text-xs font-black tracking-widest shadow-lg shadow-orange-500/30 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("new")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--prm-primary-color)] leading-tight mb-6">
              {t("title")}
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[var(--prm-text-dark)] font-semibold leading-relaxed mb-10 opacity-90">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="prm-interactive-border group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--prm-primary-color)] via-slate-800 to-[var(--prm-primary-color)] text-white font-bold text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Eye className="w-5 h-5 text-[var(--prm-secondary-color)] group-hover:rotate-12 transition-transform" />
                <span>{t("previewBtn")}</span>
                {locale === "fa" ? (
                  <ArrowUpLeft className="w-5 h-5 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform text-white/80" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-white/80" />
                )}
              </button>

              <Link
                href="/ahp-calculator"
                className="prm-interactive-border group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] text-white font-black text-base shadow-xl hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t("enterPanelBtn")}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {dynamicCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.03, x: locale === "fa" ? -5 : 5 }}
                  className="prm-interactive-border p-5 rounded-2xl bg-white/50 border border-white/80 backdrop-blur-2xl flex items-center gap-4 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className={`p-3 rounded-xl ${card.bg} ${card.color} border ${card.border} shadow-sm`}>
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[var(--prm-primary-color)] mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-xs text-[var(--prm-text-dark)] font-bold opacity-80">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <PrmAhpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
