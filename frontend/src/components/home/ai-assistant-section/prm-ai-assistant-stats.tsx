import React from "react";

interface PrmAiAssistantStatsProps {
  accuracyValue: string;
  accuracyLabel: string;
  supportValue: string;
  supportLabel: string;
}

export function PrmAiAssistantStats({
  accuracyValue,
  accuracyLabel,
  supportValue,
  supportLabel
}: PrmAiAssistantStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-sm">
      <div className="flex flex-col space-y-1">
        <span className="text-2xl md:text-3xl font-extrabold text-[var(--prm-white)] bg-clip-text">
          {accuracyValue}
        </span>
        <span className="text-xs md:text-sm text-[var(--prm-text-light)]">
          {accuracyLabel}
        </span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-2xl md:text-3xl font-extrabold text-[var(--prm-white)] bg-clip-text">
          {supportValue}
        </span>
        <span className="text-xs md:text-sm text-[var(--prm-text-light)]">
          {supportLabel}
        </span>
      </div>
    </div>
  );
}
