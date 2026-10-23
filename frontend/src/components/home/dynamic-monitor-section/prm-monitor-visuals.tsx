"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { BarChart3, Globe, LineChart, Table2, ShieldAlert } from "lucide-react";

interface PrmMonitorVisualsProps {
  scrollProgress: MotionValue<number>;
}

export default function PrmMonitorVisuals({ scrollProgress }: PrmMonitorVisualsProps) {
  const yStage1 = useTransform(scrollProgress, [0, 0.15, 0.22], [0, 0, -150]);
  const opacityStage1 = useTransform(scrollProgress, [0, 0.15, 0.22], [1, 1, 0]);

  const yStage2 = useTransform(scrollProgress, [0.15, 0.22, 0.4, 0.47], [150, 0, 0, -150]);
  const opacityStage2 = useTransform(scrollProgress, [0.15, 0.22, 0.4, 0.47], [0, 1, 1, 0]);

  const yStage3 = useTransform(scrollProgress, [0.4, 0.47, 0.65, 0.72], [150, 0, 0, -150]);
  const opacityStage3 = useTransform(scrollProgress, [0.4, 0.47, 0.65, 0.72], [0, 1, 1, 0]);

  const yStage4 = useTransform(scrollProgress, [0.65, 0.72, 0.88, 0.93], [150, 0, 0, -150]);
  const opacityStage4 = useTransform(scrollProgress, [0.65, 0.72, 0.88, 0.93], [0, 1, 1, 0]);

  const yStage5 = useTransform(scrollProgress, [0.88, 0.93, 1], [150, 0, 0]);
  const opacityStage5 = useTransform(scrollProgress, [0.88, 0.93, 1], [0, 1, 1]);

  const pointerEvents1 = useTransform(scrollProgress, [0, 0.22], ["auto" as const, "none" as const]);
  const pointerEvents2 = useTransform(scrollProgress, [0.15, 0.22, 0.47], ["none" as const, "auto" as const, "none" as const]);
  const pointerEvents3 = useTransform(scrollProgress, [0.4, 0.47, 0.72], ["none" as const, "auto" as const, "none" as const]);
  const pointerEvents4 = useTransform(scrollProgress, [0.65, 0.72, 0.93], ["none" as const, "auto" as const, "none" as const]);
  const pointerEvents5 = useTransform(scrollProgress, [0.88, 0.93], ["none" as const, "auto" as const]);

  return (
    <div className="relative w-full h-full prm-glass-base overflow-hidden rounded-[24px]">
      <div className="absolute inset-0 prm-glass-gloss pointer-events-none" />

      <motion.div
        style={{ y: yStage1, opacity: opacityStage1, pointerEvents: pointerEvents1 }}
        className="absolute inset-0 p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--prm-secondary-color)] font-bold">KPI MONITOR</span>
          <BarChart3 className="text-[var(--prm-secondary-color)] w-6 h-6" />
        </div>
        <div className="grid grid-cols-3 gap-4 items-end h-[60%]">
          <div className="h-[40%] bg-[var(--prm-accent-color)] rounded-t-lg relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">40%</span>
          </div>
          <div className="h-[85%] bg-[var(--prm-secondary-color)] rounded-t-lg relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">85%</span>
          </div>
          <div className="h-[60%] bg-[var(--prm-primary-color)] rounded-t-lg relative">
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">60%</span>
          </div>
        </div>
        <div className="h-[20%] prm-glass-sub-card rounded-xl flex items-center justify-between px-4">
          <span className="text-xs text-[var(--prm-text-light)]">Total Value</span>
          <span className="text-sm font-bold text-[var(--prm-primary-color)]">$4.2M</span>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yStage2, opacity: opacityStage2, pointerEvents: pointerEvents2 }}
        className="absolute inset-0 p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--prm-accent-color)] font-bold">PROVINCIAL HEATMAP</span>
          <ShieldAlert className="text-[var(--prm-accent-color)] w-6 h-6" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-[8px] border-[var(--prm-primary-color)] border-t-[var(--prm-secondary-color)] border-r-[var(--prm-accent-color)] animate-spin-slow flex items-center justify-center">
            <div className="text-center">
              <span className="block text-2xl font-bold">31</span>
              <span className="text-[10px] text-[var(--prm-text-light)]">Provinces</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yStage3, opacity: opacityStage3, pointerEvents: pointerEvents3 }}
        className="absolute inset-0 p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--prm-primary-color)] font-bold">RADAR MAP</span>
          <Globe className="text-[var(--prm-primary-color)] w-6 h-6" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-[var(--prm-text-light)] flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-double border-[var(--prm-accent-color)] flex items-center justify-center" />
            <div className="absolute top-4 left-4 w-4 h-4 bg-[var(--prm-secondary-color)] rounded-full animate-ping" />
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-[var(--prm-accent-color)] rounded-full" />
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yStage4, opacity: opacityStage4, pointerEvents: pointerEvents4 }}
        className="absolute inset-0 p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--prm-secondary-color)] font-bold">TREND CHART</span>
          <LineChart className="text-[var(--prm-secondary-color)] w-6 h-6" />
        </div>
        <div className="flex-1 flex items-end pb-8">
          <svg className="w-full h-32" viewBox="0 0 100 50">
            <path
              d="M0,40 Q15,10 30,30 T60,10 T90,20"
              fill="none"
              stroke="var(--prm-accent-color)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M0,45 Q20,30 40,35 T70,15 T100,5"
              fill="none"
              stroke="var(--prm-primary-color)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yStage5, opacity: opacityStage5, pointerEvents: pointerEvents5 }}
        className="absolute inset-0 p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-[var(--prm-accent-color)] font-bold">RAW DATA TABLES</span>
          <Table2 className="text-[var(--prm-accent-color)] w-6 h-6" />
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--prm-text-light)] opacity-40 text-xs">
            <span>Year</span>
            <span>Origin</span>
            <span>Amount</span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--prm-text-light)] opacity-70 text-xs">
            <span>1402</span>
            <span>Tehran</span>
            <span className="font-bold">$125K</span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--prm-text-light)] opacity-70 text-xs">
            <span>1401</span>
            <span>Isfahan</span>
            <span className="font-bold">$98K</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
