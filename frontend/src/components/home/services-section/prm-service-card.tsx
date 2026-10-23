"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";

interface PrmServiceCardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  subFeatures: string[];
  totalCards: number;
  range: [number, number];
  targetScale: number;
  progress: any;
}

export default function PrmServiceCard({
  id,
  index,
  title,
  description,
  subFeatures,
  range,
  targetScale,
  progress
}: PrmServiceCardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[78vh] items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `${index * 18}px`
        }}
        className="prm-liquid-glass prm-interactive-border relative flex h-[68vh] w-full max-w-[850px] flex-col overflow-hidden rounded-[40px] border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-3xl sm:p-12 lg:flex-row"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--prm-bg-light)]/50 via-transparent to-[var(--prm-accent-color)]/5" />

        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--prm-primary-color)] text-2xl font-black text-white shadow-lg">
              {id}
            </div>

            <h3 className="mb-4 text-3xl font-black text-[var(--prm-primary-color)] sm:text-4xl">
              {title}
            </h3>

            <p className="max-w-md text-sm font-bold leading-relaxed text-[var(--prm-text-dark)] opacity-70 sm:text-base">
              {description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {subFeatures.map((feat, i) => (
              <span
                key={i}
                className="rounded-xl border border-white/60 bg-white/40 px-4 py-2 text-xs font-black text-[var(--prm-accent-color)] shadow-sm backdrop-blur-md"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-1 items-center justify-center lg:mt-0">
          <div className="h-full w-full rounded-3xl bg-gradient-to-br from-slate-200/50 to-slate-300/30 p-1 backdrop-blur-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[22px] border border-white/40 bg-white/20 shadow-inner">
              <span className="select-none rotate-12 text-6xl font-black uppercase tracking-tighter text-[var(--prm-primary-color)]/10">
                ATRIANA
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
