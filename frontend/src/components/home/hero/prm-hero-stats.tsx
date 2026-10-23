"use client";

import {CalendarDays, Database, Globe2} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {useTranslations} from "next-intl";

type PrmStatTranslationKey = "records" | "countries" | "update";

type PrmStat = {
  id: string;
  translationKey: PrmStatTranslationKey;
  icon: LucideIcon;
};

const prmStats: PrmStat[] = [
  {
    id: "prm-stat-records",
    translationKey: "records",
    icon: Database
  },
  {
    id: "prm-stat-countries",
    translationKey: "countries",
    icon: Globe2
  },
  {
    id: "prm-stat-update",
    translationKey: "update",
    icon: CalendarDays
  }
];

export default function PrmHeroStats() {
  const prmTranslations = useTranslations("home.hero.stats");

  return (
    <div className="prm-hero-stats mt-4 grid grid-cols-3 gap-2 lg:mt-6 lg:gap-3">
      {prmStats.map((prmStat) => {
        const PrmIcon = prmStat.icon;

        return (
          <article
            key={prmStat.id}
            className="prm-hero-stat-card relative min-w-0 overflow-hidden rounded-[1.1rem] border border-white/90 bg-white/60 px-1.5 py-2 text-center shadow-[0_14px_35px_rgba(15,23,42,0.09),inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/75 sm:rounded-[1.35rem] sm:px-3 sm:py-3"
          >
            <div className="prm-hero-stat-reflection pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <span className="prm-hero-stat-icon mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-[0_8px_20px_rgba(234,88,12,0.28),inset_0_1px_0_rgba(255,255,255,0.55)] sm:mb-2 sm:h-9 sm:w-9">
              <PrmIcon
                className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]"
                strokeWidth={2.2}
              />
            </span>

            <strong className="prm-hero-stat-value block text-base font-black leading-none text-[var(--prm-primary-color)] sm:text-xl lg:text-2xl">
              {prmTranslations(`${prmStat.translationKey}.value`)}
            </strong>

            <span className="prm-hero-stat-label mt-1 block truncate text-[0.58rem] font-medium leading-4 text-[var(--prm-text-light)] sm:text-[0.68rem] lg:text-xs">
              {prmTranslations(`${prmStat.translationKey}.label`)}
            </span>
          </article>
        );
      })}
    </div>
  );
}
