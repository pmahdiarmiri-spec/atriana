import React from "react";
import { Sparkles } from "lucide-react";

interface PrmAiAssistantBadgeProps {
  text: string;
}

export function PrmAiAssistantBadge({ text }: PrmAiAssistantBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      <Sparkles className="w-4 h-4 text-[var(--prm-secondary-color)] animate-pulse" />
      <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
        {text}
      </span>
    </div>
  );
}
