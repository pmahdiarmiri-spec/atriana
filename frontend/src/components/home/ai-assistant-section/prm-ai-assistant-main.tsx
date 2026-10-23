import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PrmAiAssistantContent } from "./prm-ai-assistant-content";
import { PrmAiAssistantTerminal } from "./prm-ai-assistant-terminal";

export default function PrmAiAssistantMain() {
  const t = useTranslations("home.ai");
  const locale = useLocale();

  const terminalMessages = {
    liveBadge: t("terminal.liveBadge"),
    userQueryTitle: t("terminal.userQueryTitle"),
    userQuery: t("terminal.userQuery"),
    aiResponseTitle: t("terminal.aiResponseTitle"),
    aiResponseIntro: t("terminal.aiResponseIntro"),
    section1: {
      title: t("terminal.section1.title"),
      item1: t("terminal.section1.item1")
    },
    section2: {
      title: t("terminal.section2.title"),
      item1: t("terminal.section2.item1"),
      item2: t("terminal.section2.item2"),
      item3: t("terminal.section2.item3")
    },
    section3: {
      title: t("terminal.section3.title"),
      item1: t("terminal.section3.item1"),
      item2: t("terminal.section3.item2"),
      item3: t("terminal.section3.item3")
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[var(--prm-primary-color)] py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(234,88,12,0.14),transparent_28%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="order-2 lg:order-1">
          <PrmAiAssistantTerminal messages={terminalMessages} />
        </div>
        <div className="order-1 lg:order-2">
          <PrmAiAssistantContent
            badge={t("badge")}
            titlePrefix={t("titlePrefix")}
            brand={t("brand")}
            description={t("description")}
            cta={t("cta")}
            accuracyValue={t("stats.accuracy.value")}
            accuracyLabel={t("stats.accuracy.label")}
            supportValue={t("stats.support.value")}
            supportLabel={t("stats.support.label")}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
