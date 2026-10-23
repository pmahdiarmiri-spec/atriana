"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Cpu, ShieldCheck, Sparkles, Network, ArrowRightLeft } from "lucide-react";
import PrmAhpDemoInteractive from "./prm-ahp-demo-interactive";

interface PrmAhpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrmAhpModal({ isOpen, onClose }: PrmAhpModalProps) {
  const t = useTranslations("home.ahp.modal");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const steps = [
    {
      id: "step1",
      icon: ArrowRightLeft,
      title: t("steps.step1.title"),
      desc: t("steps.step1.desc"),
      color: "from-amber-500/20 to-amber-600/10"
    },
    {
      id: "step2",
      icon: Network,
      title: t("steps.step2.title"),
      desc: t("steps.step2.desc"),
      color: "from-orange-500/20 to-orange-600/10"
    },
    {
      id: "step3",
      icon: Cpu,
      title: t("steps.step3.title"),
      desc: t("steps.step3.desc"),
      color: "from-amber-500/20 to-orange-500/10"
    },
    {
      id: "step4",
      icon: ShieldCheck,
      title: t("steps.step4.title"),
      desc: t("steps.step4.desc"),
      color: "from-slate-700/30 to-amber-500/20"
    },
    {
      id: "step5",
      icon: CheckCircle2,
      title: t("steps.step5.title"),
      desc: t("steps.step5.desc"),
      color: "from-orange-600/30 to-amber-500/30"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="prm-liquid-glass relative z-10 w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/60 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/20 bg-white/40 backdrop-blur-2xl">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-[var(--prm-primary-color)] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[var(--prm-accent-color)] animate-pulse" />
                  {t("title")}
                </h3>
                <p className="text-xs md:text-sm text-[var(--prm-text-dark)] mt-1 font-bold opacity-80">
                  {t("subtitle")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="prm-interactive-border p-2.5 rounded-full bg-white/50 hover:bg-white/80 text-[var(--prm-primary-color)] transition-all duration-300 flex items-center justify-center shadow-md"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 prm-custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.4 }}
                      className={`prm-interactive-border p-5 rounded-2xl border border-white/60 bg-gradient-to-br ${step.color} backdrop-blur-2xl flex flex-col justify-between shadow-md hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-white/80 border border-white text-[var(--prm-accent-color)] shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-[var(--prm-primary-color)] mb-1">
                            {step.title}
                          </h4>
                          <p className="text-xs md:text-sm text-[var(--prm-text-dark)] leading-relaxed font-semibold">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <PrmAhpDemoInteractive />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="prm-liquid-glass-dark p-6 rounded-2xl border border-amber-500/30 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent pointer-events-none" />
                <h4 className="text-lg font-black text-amber-400 mb-2">
                  {t("whyTitle")}
                </h4>
                <p className="text-sm md:text-base text-slate-100 font-medium">
                  {t("whyDesc")}
                </p>
                <div className="text-[var(--prm-secondary-color)] font-black text-base md:text-lg underline underline-offset-8 mt-1">
                  {t("whyHighlight")}
                </div>
                <p className="text-sm md:text-base text-slate-100 font-medium mt-1">
                  {t("whyEnd")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
