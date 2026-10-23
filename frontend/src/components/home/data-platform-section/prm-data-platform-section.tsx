// path: components/prm-data-platform-section.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Database, Globe, RefreshCw, Brain, Sparkles } from "lucide-react";
import PrmDataPlatformCard from "./prm-data-platform-card";
import Prm3dDeckVisual from "./prm-3d-deck-visual";

export default function PrmDataPlatformSection() {
  const t = useTranslations("home.dataPlatform");
  const [activeIndex, setActiveIndex] = useState(0);

  const cardsData = [
    {
      id: 1,
      title: t("cards.card1Title"),
      desc: t("cards.card1Desc"),
      icon: Database
    },
    {
      id: 2,
      title: t("cards.card2Title"),
      desc: t("cards.card2Desc"),
      icon: Globe
    },
    {
      id: 3,
      title: t("cards.card3Title"),
      desc: t("cards.card3Desc"),
      icon: RefreshCw
    },
    {
      id: 4,
      title: t("cards.card4Title"),
      desc: t("cards.card4Desc"),
      icon: Brain
    }
  ];

  return (
    <section className="relative mx-auto max-w-[1440px] overflow-hidden px-6 py-24 sm:py-32 lg:px-12">
      <div className="pointer-events-none absolute -right-20 top-0 h-[600px] w-[600px] rounded-full bg-[var(--prm-secondary-color)]/5 blur-[160px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[600px] w-[600px] rounded-full bg-[var(--prm-accent-color)]/5 blur-[160px]" />

      <div className="relative z-10 mx-auto mb-20 flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/30 px-5 py-2 text-xs font-black tracking-widest text-[var(--prm-accent-color)] backdrop-blur-xl shadow-xl sm:text-sm"
        >
          <Sparkles className="h-4 w-4 fill-current animate-pulse" />
          <span className="uppercase">{t("badge")}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="mb-6 text-3xl font-black leading-[1.15] text-[var(--prm-primary-color)] sm:text-5xl lg:text-6xl"
        >
          {t("title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-2xl text-sm font-bold leading-relaxed text-[var(--prm-text-dark)] opacity-70 sm:text-lg"
        >
          {t("description")}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-5">
          {cardsData.map((card, idx) => (
            <PrmDataPlatformCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.desc}
              icon={card.icon}
              index={idx}
              isActive={idx === activeIndex}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>

        <div className="order-1 flex min-h-[400px] items-center justify-center overflow-visible lg:order-2 lg:col-span-7 sm:min-h-[500px]">
          <Prm3dDeckVisual
            cards={cardsData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
}
