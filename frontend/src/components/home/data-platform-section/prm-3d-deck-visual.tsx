// path: components/prm-3d-deck-visual.tsx
"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CardItem {
  id: number;
  title: string;
  desc: string;
  icon: React.ElementType;
}

interface Prm3dDeckVisualProps {
  cards: CardItem[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

export default function Prm3dDeckVisual({
  cards,
  activeIndex,
  setActiveIndex
}: Prm3dDeckVisualProps) {
  useEffect(() => {
    if (!cards.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [cards.length, setActiveIndex]);

  const getCardState = (index: number) => {
    const total = cards.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) {
      return { x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0, opacity: 1, zIndex: 50 };
    }

    if (diff === 1 || diff === -(total - 1)) {
      return { x: 140, y: 16, scale: 0.88, rotateY: -28, rotateZ: 2, opacity: 0.7, zIndex: 40 };
    }

    if (diff === total - 1 || diff === -1) {
      return { x: -140, y: 16, scale: 0.88, rotateY: 28, rotateZ: -2, opacity: 0.7, zIndex: 40 };
    }

    if (total > 3) {
      if (diff === 2 || diff === -(total - 2)) {
        return { x: 240, y: 34, scale: 0.75, rotateY: -35, rotateZ: 4, opacity: 0.3, zIndex: 30 };
      }
      if (diff === total - 2 || diff === -2) {
        return { x: -240, y: 34, scale: 0.75, rotateY: 35, rotateZ: -4, opacity: 0.3, zIndex: 30 };
      }
    }

    return { x: 0, y: 60, scale: 0.6, rotateY: 0, rotateZ: 0, opacity: 0, zIndex: 10 };
  };

  return (
    <div className="relative mx-auto flex h-[360px] w-full max-w-[620px] items-center justify-center select-none [perspective:2500px] sm:h-[450px]">
      <div className="pointer-events-none absolute inset-x-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[var(--prm-accent-color)]/25 via-[var(--prm-secondary-color)]/20 to-transparent blur-[110px] sm:h-[380px] sm:w-[380px]" />

      <div className="relative h-[300px] w-full overflow-visible sm:h-[350px]">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const state = getCardState(idx);
          const isActive = idx === activeIndex;

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              animate={{
                x: state.x,
                y: state.y,
                scale: state.scale,
                rotateY: state.rotateY,
                rotateZ: state.rotateZ,
                opacity: state.opacity,
              }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                zIndex: state.zIndex,
                transformStyle: "preserve-3d",
                position: "absolute",
                left: "50%",
                top: "50%",
              }}
              whileHover={{
                scale: isActive ? 1.03 : state.scale + 0.03,
                y: state.y - 5
              }}
              className={`prm-liquid-glass prm-interactive-border flex h-[250px] w-[280px] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col justify-between overflow-hidden rounded-[35px] border border-white/40 bg-white/70 p-6 text-start shadow-2xl backdrop-blur-[40px] sm:h-[300px] sm:w-[350px] sm:p-8 ${
                isActive
                  ? "ring-1 ring-[var(--prm-secondary-color)]/50 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.25)]"
                  : "hover:border-white/80"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-black/[0.02]" />
              <div className="absolute -inset-[100%] bg-[grad-radial] from-white/20 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                <div className="rounded-2xl bg-gradient-to-br from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] p-3.5 text-white shadow-[0_8px_16px_-4px_rgba(234,88,12,0.3)]">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/40 border border-white/60 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-[var(--prm-primary-color)] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--prm-accent-color)]" />
                  <span>0{card.id}</span>
                </div>
              </div>

              <div className="relative my-auto pt-4">
                <h3 className="mb-2 text-xl font-black text-[var(--prm-primary-color)] sm:text-2xl">
                  {card.title}
                </h3>
                <p className="line-clamp-3 text-xs font-bold leading-relaxed text-[var(--prm-text-dark)] opacity-70 sm:text-sm">
                  {card.desc}
                </p>
              </div>

              <div className="relative mt-4 w-full overflow-hidden rounded-full bg-black/5 p-[1px]">
                <div className="h-1.5 w-full rounded-full bg-white/30">
                  {isActive && (
                    <motion.div
                      key={card.id}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "linear" }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--prm-secondary-color)] via-[var(--prm-accent-color)] to-[var(--prm-secondary-color)] bg-[length:200%_auto] shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
