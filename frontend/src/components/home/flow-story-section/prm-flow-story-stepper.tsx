"use client";

import { motion } from "framer-motion";
import { ArrowUpLeft, Crosshair } from "lucide-react";

type PrmFlowStoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

type PrmFlowStoryStepperProps = {
  badge: string;
  title: string;
  description: string;
  steps: PrmFlowStoryStep[];
  activeStage: number;
  progress: number;
  onSelect: (index: number) => void;
};

export default function PrmFlowStoryStepper({
  badge,
  title,
  description,
  steps,
  activeStage,
  progress,
  onSelect
}: PrmFlowStoryStepperProps) {
  return (
    <div className="prm-flow-story-stepper relative w-full max-w-md mx-auto lg:mr-auto lg:ml-0">
      <div className="prm-liquid-glass prm-interactive-border relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b132b]/60 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-[var(--prm-secondary-color)]/[0.02]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            <Crosshair className="h-3.5 w-3.5 text-[var(--prm-secondary-color)]" />
            <span>{badge}</span>
          </div>

          <h2 className="mt-4 text-xl font-black leading-tight text-white sm:text-2xl">
            {title}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-white/50">
            {description}
          </p>

          <div className="mt-6 grid grid-cols-[14px_1fr] gap-4">
            <div className="relative mx-auto h-full w-[1.5px] rounded-full bg-white/5">
              <motion.div
                className="absolute right-0 top-0 w-full rounded-full bg-gradient-to-b from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                style={{ height: `${Math.max(progress * 100, 2)}%` }}
              />
            </div>

            <div className="space-y-2.5">
              {steps.map((prmStep, prmIndex) => {
                const prmIsActive = activeStage === prmIndex;
                const prmIsPassed = activeStage > prmIndex;

                return (
                  <button
                    key={prmStep.id}
                    type="button"
                    onClick={() => onSelect(prmIndex)}
                    className={`w-full rounded-2xl border p-3.5 text-right transition-all duration-300 ${
                      prmIsActive
                        ? "border-[var(--prm-secondary-color)]/30 bg-white/10 shadow-lg"
                        : prmIsPassed
                          ? "border-white/10 bg-white/5 opacity-80"
                          : "border-white/5 bg-transparent opacity-40 hover:opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-black ${prmIsActive ? "text-[var(--prm-secondary-color)]" : "text-white"}`}>
                        {String(prmIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 text-xs font-bold text-white">
                        {prmStep.title}
                      </div>
                      <ArrowUpLeft size={14} className={prmIsActive ? "text-[var(--prm-secondary-color)]" : "text-white/20"} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
