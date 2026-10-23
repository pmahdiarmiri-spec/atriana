"use client";

import React, { useEffect, useState } from "react";
import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface PrmMonitorContentProps {
  activeIndex: MotionValue<number>;
}

export default function PrmMonitorContent({ activeIndex }: PrmMonitorContentProps) {
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    return activeIndex.on("change", (latest) => {
      const rounded = Math.round(latest);
      if (rounded !== current && rounded >= 0 && rounded <= 4) {
        setCurrent(rounded);
      }
    });
  }, [activeIndex, current]);

  const rawSteps = t.raw("dynamicMonitor.steps") as Array<{ eyebrow: string; title: string; description: string }>;
  const step = rawSteps?.[current] || { eyebrow: "", title: "", description: "" };

  return (
    <div className="relative w-full px-4 md:px-12 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex flex-col gap-4 text-right"
        >
          <span className="text-sm font-extrabold text-[var(--prm-accent-color)] tracking-wider">
            {step.eyebrow}
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-[var(--prm-primary-color)]">
            {step.title}
          </h3>
          <p className="text-base leading-relaxed text-[var(--prm-text-light)] font-normal">
            {step.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
