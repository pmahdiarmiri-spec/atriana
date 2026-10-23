import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PrmAiAssistantBadge } from "./prm-ai-assistant-badge";
import { PrmAiAssistantStats } from "./prm-ai-assistant-stats";

interface PrmAiAssistantContentProps {
  badge: string;
  titlePrefix: string;
  brand: string;
  description: string;
  cta: string;
  accuracyValue: string;
  accuracyLabel: string;
  supportValue: string;
  supportLabel: string;
  locale: string;
}

export function PrmAiAssistantContent({
  badge,
  titlePrefix,
  brand,
  description,
  cta,
  accuracyValue,
  accuracyLabel,
  supportValue,
  supportLabel,
  locale
}: PrmAiAssistantContentProps) {
  const isRtl = locale === "fa";

  return (
    <div className="flex flex-col space-y-6 md:space-y-8 text-right">
      <div className="flex justify-start">
        <PrmAiAssistantBadge text={badge} />
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--prm-white)] leading-tight">
        {titlePrefix}{" "}
        <span className="text-[var(--prm-secondary-color)]">{brand}</span>
      </h2>

      <p className="text-base md:text-lg text-[var(--prm-text-light)] leading-relaxed max-w-xl">
        {description}
      </p>

      <div className="pt-2">
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl text-[var(--prm-white)] bg-gradient-to-r from-[var(--prm-accent-color)] to-[var(--prm-secondary-color)] hover:opacity-90 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(234,88,12,0.4)]"
        >
          <span className="mx-2">{cta}</span>
          {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </Link>
      </div>

      <div className="border-t border-slate-800/80 pt-8 mt-4">
        <PrmAiAssistantStats
          accuracyValue={accuracyValue}
          accuracyLabel={accuracyLabel}
          supportValue={supportValue}
          supportLabel={supportLabel}
        />
      </div>
    </div>
  );
}
