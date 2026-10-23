"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  Bot,
  Brain,
  CalendarDays,
  CheckSquare,
  Crown,
  Database,
  DollarSign,
  FileSpreadsheet,
  History,
  LockKeyhole,
  MessageCircle,
  Minus,
  PackageSearch,
  Plus,
  Settings,
  ShieldCheck,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

type PrmFaqTag = {
  textKey: string;
  filterKey: string;
  iconKey: string;
};

type PrmFaqItemProps = {
  questionKey: string;
  iconKey: string;
  tags: PrmFaqTag[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
};

type PrmFaqTagIconProps = {
  icon: string;
};

type PrmFaqMainIconProps = {
  icon: string;
};

const PrmFaqTagIcon = ({ icon }: PrmFaqTagIconProps) => {
  if (icon === "AHP") {
    return <CheckSquare className="h-3 w-3 text-current" />;
  }

  if (icon === "Data") {
    return <Database className="h-3 w-3 text-current" />;
  }

  if (icon === "AI") {
    return <Zap className="h-3 w-3 text-current" />;
  }

  if (icon === "Plan") {
    return <DollarSign className="h-3 w-3 text-current" />;
  }

  return <Settings className="h-3 w-3 text-current" />;
};

const PrmFaqMainIcon = ({ icon }: PrmFaqMainIconProps) => {
  if (icon === "strategy") {
    return <Target className="h-4 w-4" />;
  }

  if (icon === "package") {
    return <PackageSearch className="h-4 w-4" />;
  }

  if (icon === "calendar") {
    return <CalendarDays className="h-4 w-4" />;
  }

  if (icon === "chart") {
    return <BarChart2 className="h-4 w-4" />;
  }

  if (icon === "file") {
    return <FileSpreadsheet className="h-4 w-4" />;
  }

  if (icon === "shield") {
    return <ShieldCheck className="h-4 w-4" />;
  }

  if (icon === "brain") {
    return <Brain className="h-4 w-4" />;
  }

  if (icon === "message") {
    return <MessageCircle className="h-4 w-4" />;
  }

  if (icon === "database") {
    return <Database className="h-4 w-4" />;
  }

  if (icon === "crown") {
    return <Crown className="h-4 w-4" />;
  }

  if (icon === "lock") {
    return <LockKeyhole className="h-4 w-4" />;
  }

  if (icon === "history") {
    return <History className="h-4 w-4" />;
  }

  if (icon === "timer") {
    return <Timer className="h-4 w-4" />;
  }

  if (icon === "trend") {
    return <TrendingUp className="h-4 w-4" />;
  }

  return <Bot className="h-4 w-4" />;
};

export default function PrmFaqItem({
  questionKey,
  iconKey,
  tags,
  currentFilter,
  onFilterChange,
}: PrmFaqItemProps) {
  const t = useTranslations("home.faq");
  const [isOpen, setIsOpen] = useState(false);

  const shouldDisplay =
    currentFilter === "all" ||
    tags.some((tag) => tag.filterKey === currentFilter);

  if (!shouldDisplay) {
    return null;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="prm-glass-sub-card h-fit w-full self-start overflow-hidden rounded-2xl p-3.5 shadow-md transition-shadow duration-300 hover:ring-1 hover:ring-[var(--prm-secondary-color)]/30"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="flex w-full items-center gap-3 py-1 text-right"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--prm-primary-color)] text-white shadow-[0_5px_12px_rgba(15,23,42,0.28)]">
          <PrmFaqMainIcon icon={iconKey} />
        </span>

        <h4 className="flex-1 text-sm font-bold leading-relaxed text-[var(--prm-primary-color)]">
          {t(`${questionKey}_title`)}
        </h4>

        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--prm-secondary-color)]/10 text-[var(--prm-secondary-color)]">
          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.span
                key="minus"
                initial={{ opacity: 0, rotate: -45, scale: 0.75 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.75 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex"
              >
                <Minus className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ opacity: 0, rotate: 45, scale: 0.75 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.75 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex"
              >
                <Plus className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.36,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.24,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-[var(--prm-primary-color)]/10 pt-3">
              <p className="mb-3 text-xs leading-relaxed text-[var(--prm-text-dark)]">
                {t(`${questionKey}_answer`)}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, index) => (
                  <button
                    key={`${tag.textKey}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onFilterChange(tag.filterKey);
                    }}
                    className={`inline-flex items-center gap-1 rounded-full border border-[var(--prm-secondary-color)]/50 px-2.5 py-0.5 text-[10px] font-semibold transition-colors duration-200 ${
                      tag.filterKey === currentFilter
                        ? "bg-[var(--prm-secondary-color)] text-white shadow-sm"
                        : "bg-[var(--prm-secondary-color)]/5 text-[var(--prm-text-dark)] hover:bg-[var(--prm-secondary-color)]/15"
                    }`}
                  >
                    <PrmFaqTagIcon icon={tag.iconKey} />
                    {t(tag.textKey)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}