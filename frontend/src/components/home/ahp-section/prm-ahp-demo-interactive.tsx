"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Building2, Package, Target, Trophy, Play, RotateCcw, Check, Scale, BarChart3, CheckCircle } from "lucide-react";

export default function PrmAhpDemoInteractive() {
  const t = useTranslations("home.ahp.demo");
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedWeight, setSelectedWeight] = useState<number>(3);

  const criteria = [
    { id: 1, label: t("c1"), icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 2, label: t("c2"), icon: Building2, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 3, label: t("c3"), icon: Package, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 4, label: t("c4"), icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" }
  ];

  const strategies = [
    { name: t("s1"), score: "54.2%", bar: "w-[54.2%]", highlight: true },
    { name: t("s2"), score: "28.5%", bar: "w-[28.5%]", highlight: false },
    { name: t("s3"), score: "17.3%", bar: "w-[17.3%]", highlight: false }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (step === 1) {
        timer = setTimeout(() => setStep(2), 2000);
      } else if (step === 2) {
        timer = setTimeout(() => setStep(2.5), 1800);
      } else if (step === 2.5) {
        timer = setTimeout(() => {
          setStep(3);
          setIsPlaying(false);
        }, 1200);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleStartDemo = () => {
    setStep(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="w-full mt-8 prm-liquid-glass-dark rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Scale className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              {t("title")}
            </h4>
            <p className="text-xs text-slate-400">{t("subtitle")}</p>
          </div>
        </div>

        {step === 0 ? (
          <button
            onClick={handleStartDemo}
            className="prm-interactive-border flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t("runBtn")}</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-medium text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("resetBtn")}</span>
          </button>
        )}
      </div>

      <div className="min-h-[230px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-300 font-medium max-w-md mx-auto mb-4">
                {t("step0Desc")}
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-4"
            >
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <span>{t("step1Title")}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{t("step1Sub")}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {criteria.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-200">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">{t("step1Label")}</span>
                <div className="flex gap-1">
                  {[1, 3, 5, 7, 9].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedWeight(val)}
                      className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                        selectedWeight === val ? "bg-amber-500 text-slate-950 scale-110" : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-4 text-center py-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-2">
                <Check className="w-3.5 h-3.5" />
                <span>{t("step2Badge")}</span>
              </div>
              <p className="text-xs text-slate-300">{t("step2Desc")}</p>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                />
              </div>
            </motion.div>
          )}

          {step === 2.5 && (
            <motion.div
              key="step2.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-6 gap-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30"
              >
                <CheckCircle className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-black text-emerald-400"
              >
                {t("step25Text")}
              </motion.p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Trophy className="w-4 h-4" />
                  {t("step3Title")}
                </span>
                <span className="text-slate-400">{t("step3Sub")}</span>
              </div>

              <div className="space-y-2">
                {strategies.map((strat, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      strat.highlight
                        ? "bg-amber-500/15 border-amber-500/40"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className={strat.highlight ? "text-amber-300" : "text-slate-300"}>
                        {strat.name}
                      </span>
                      <span className={strat.highlight ? "text-amber-400" : "text-slate-400"}>
                        {strat.score}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${strat.highlight ? "bg-amber-400" : "bg-slate-500"}`} style={{ width: strat.score }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
