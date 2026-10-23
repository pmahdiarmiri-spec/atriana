// path: components/prm-data-platform-card.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

interface PrmDataPlatformCardProps {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function PrmDataPlatformCard({
  id,
  title,
  description,
  icon: Icon,
  index,
  isActive,
  onClick
}: PrmDataPlatformCardProps) {
  const locale = useLocale();

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ x: locale === "fa" ? -5 : 5, scale: 1.01 }}
      className={`prm-interactive-border prm-liquid-glass cursor-pointer relative rounded-[22px] p-5 backdrop-blur-3xl border transition-all duration-500 flex items-center gap-5 ${
        isActive
          ? "border-[var(--prm-accent-color)]/40 bg-white/95 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] z-10"
          : "border-white/60 bg-white/40 opacity-70 hover:opacity-100 hover:bg-white/60"
      }`}
    >
      <div
        className={`shrink-0 w-14 h-14 rounded-[18px] flex items-center justify-center transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-br from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] text-white shadow-lg rotate-3"
            : "bg-slate-100/80 text-[var(--prm-primary-color)]"
        }`}
      >
        <Icon className="w-7 h-7" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-black transition-colors duration-300 ${isActive ? "text-[var(--prm-primary-color)]" : "text-[var(--prm-text-dark)]"}`}>
          {title}
        </h3>
        <p className="text-xs font-bold text-[var(--prm-text-light)] line-clamp-1 mt-0.5">
          {description}
        </p>
      </div>

      <div className={`shrink-0 transition-all duration-300 ${isActive ? "text-[var(--prm-accent-color)] scale-110" : "text-slate-400 opacity-50"}`}>
        {locale === "fa" ? (
          <ChevronLeft className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </div>
      
      {isActive && (
        <motion.div 
          layoutId="prm-active-indicator"
          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[var(--prm-accent-color)] rounded-r-full"
        />
      )}
    </motion.div>
  );
}
