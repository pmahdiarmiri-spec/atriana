"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import PrmFaqFilters from "./prm-faq-filters";
import PrmFaqItem from "./prm-faq-item";

const FAQ_DATA = [
  {
    key: "q1",
    iconKey: "strategy",
    tags: [
      { textKey: "q1_tag1", filterKey: "ahp", iconKey: "AHP" },
      { textKey: "q1_tag2", filterKey: "features", iconKey: "AHP" },
    ],
  },
  {
    key: "q2",
    iconKey: "package",
    tags: [
      { textKey: "q8_tag2", filterKey: "data_analysis", iconKey: "Data" },
    ],
  },
  {
    key: "q3",
    iconKey: "calendar",
    tags: [
      { textKey: "q3_tag1", filterKey: "data_analysis", iconKey: "Data" },
    ],
  },
  {
    key: "q4",
    iconKey: "chart",
    tags: [
      { textKey: "q4_title", filterKey: "data_analysis", iconKey: "Data" },
    ],
  },
  {
    key: "q5",
    iconKey: "file",
    tags: [
      { textKey: "q5_tag1", filterKey: "features", iconKey: "Features" },
    ],
  },
  {
    key: "q6",
    iconKey: "shield",
    tags: [
      { textKey: "q6_title", filterKey: "features", iconKey: "Features" },
    ],
  },
  {
    key: "q7",
    iconKey: "brain",
    tags: [
      { textKey: "q7_tag1", filterKey: "ai", iconKey: "AI" },
      { textKey: "q7_tag2", filterKey: "ai", iconKey: "AI" },
      { textKey: "q7_tag3", filterKey: "ai", iconKey: "AI" },
    ],
  },
  {
    key: "q8",
    iconKey: "message",
    tags: [
      { textKey: "q8_tag1", filterKey: "ai", iconKey: "AI" },
      { textKey: "q8_tag2", filterKey: "ai", iconKey: "AI" },
      { textKey: "q8_tag3", filterKey: "ai", iconKey: "AI" },
      { textKey: "q8_tag4", filterKey: "ai", iconKey: "AI" },
    ],
  },
  {
    key: "q9",
    iconKey: "database",
    tags: [
      { textKey: "q9_tag1", filterKey: "data_analysis", iconKey: "Data" },
    ],
  },
  {
    key: "q10",
    iconKey: "crown",
    tags: [
      { textKey: "q10_tag1", filterKey: "features", iconKey: "Plan" },
      { textKey: "q10_tag2", filterKey: "features", iconKey: "Plan" },
    ],
  },
  {
    key: "q11",
    iconKey: "lock",
    tags: [
      { textKey: "q11_tag1", filterKey: "features", iconKey: "Features" },
      { textKey: "q11_tag2", filterKey: "features", iconKey: "Features" },
      { textKey: "q11_tag3", filterKey: "features", iconKey: "Features" },
    ],
  },
  {
    key: "q12",
    iconKey: "history",
    tags: [
      { textKey: "q12_tag1", filterKey: "ai", iconKey: "AI" },
    ],
  },
  {
    key: "q13",
    iconKey: "timer",
    tags: [
      { textKey: "q13_tag1", filterKey: "ai", iconKey: "AI" },
      { textKey: "q13_tag2", filterKey: "ai", iconKey: "AI" },
    ],
  },
  {
    key: "q14",
    iconKey: "trend",
    tags: [
      { textKey: "q14_tag1", filterKey: "ai", iconKey: "AI" },
      { textKey: "q14_tag2", filterKey: "ai", iconKey: "AI" },
      { textKey: "q14_tag3", filterKey: "ai", iconKey: "AI" },
      { textKey: "q14_tag4", filterKey: "ai", iconKey: "AI" },
    ],
  },
];

export default function PrmFaqMain() {
  const t = useTranslations("home.faq");
  const [currentFilter, setCurrentFilter] = useState("all");

  return (
    <section className="prm-faq-section bg-[var(--prm-bg-light)] px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-3 text-center">
          <span className="rounded-full border border-[var(--prm-secondary-color)]/20 bg-[var(--prm-secondary-color)]/10 px-3.5 py-1 text-xs font-bold text-[var(--prm-secondary-color)]">
            {t("faq_title")}
          </span>

          <h2 className="mx-auto max-w-2xl text-2xl font-black text-[var(--prm-primary-color)] md:text-3xl">
            {t("faq_subtitle")}
          </h2>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--prm-text-light)]">
            {t("faq_description")}
          </p>
        </div>

        <PrmFaqFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-4 md:grid-cols-2">
          {FAQ_DATA.map((item) => (
            <PrmFaqItem
              key={item.key}
              questionKey={item.key}
              iconKey={item.iconKey}
              tags={item.tags}
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
