import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

type PrmFlowStoryStep = {
  id: string;
  title: string;
};

type PrmFlowStoryStepperProps = {
  steps?: PrmFlowStoryStep[];
  activeStage: number;
  progress: number;
  onSelect: (index: number) => void;
};

export default function PrmFlowStoryStepper({
  steps = [],
  activeStage,
  progress,
  onSelect
}: PrmFlowStoryStepperProps) {
  return (
    <div className="prm-flow-story-stepper relative flex flex-col gap-4">
      <div className="relative flex flex-col gap-2 rounded-[2rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl">
        <div className="absolute right-4 top-0 h-full w-[2px] bg-white/5">
          <motion.div
            className="absolute top-0 w-full bg-[var(--prm-secondary-color)] shadow-[0_0_15px_var(--prm-secondary-color)]"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = activeStage === index;
          return (
            <button
              key={step.id}
              onClick={() => onSelect(index)}
              className={`relative flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-500 ${
                isActive 
                ? "bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" 
                : "opacity-40 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-black ${isActive ? "text-[var(--prm-secondary-color)]" : "text-white"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-bold text-white">{step.title}</span>
              </div>
              <ChevronLeft size={16} className={`${isActive ? "text-[var(--prm-secondary-color)]" : "text-white/20"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
