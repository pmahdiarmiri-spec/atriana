import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { ElementType } from "react";

type PrmFlowStoryContentProps = {
  icon: ElementType;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  index: number;
  total: number;
};

export default function PrmFlowStoryContent({
  icon: Icon,
  eyebrow,
  title,
  description,
  points,
  index,
  total
}: PrmFlowStoryContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="prm-flow-story-content relative w-full"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_1px_rgba(0,0,0,0.3)] backdrop-blur-3xl sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_30%)]" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--prm-secondary-color)]/10 blur-[60px]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--prm-secondary-color)]/20 text-[var(--prm-secondary-color)] shadow-[inset_0_0_12px_rgba(245,158,11,0.3)]">
              <Icon size={24} />
            </div>
            <span className="text-xs font-bold tracking-widest text-white/40 uppercase">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--prm-secondary-color)]">
              {eyebrow}
            </span>
            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3">
            {points.map((point, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <CheckCircle2 size={16} className="text-[var(--prm-secondary-color)] opacity-70" />
                <span className="text-xs font-medium text-white/80">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
