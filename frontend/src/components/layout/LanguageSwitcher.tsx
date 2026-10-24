"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const targetLocale = locale === "fa" ? "en" : "fa";
  const displayLabel = locale === "fa" ? "EN" : "فا";

  const toggleLanguage = () => {
    router.replace(pathname, { locale: targetLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Toggle Language"
      className="group relative flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-white/35 bg-white/10 backdrop-blur-2xl shadow-[0_2px_8px_rgba(15,23,42,0.03),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:bg-white/20 active:scale-95 transition-all duration-300"
    >
      <Globe className="w-3.5 h-3.5 text-[var(--prm-text-light)] group-hover:text-[var(--prm-primary-color)] transition-colors duration-300" />
      <span className="text-[11px] font-bold text-[var(--prm-text-dark)] group-hover:text-[var(--prm-accent-color)] tracking-wide transition-colors duration-300">
        {displayLabel}
      </span>
    </button>
  );
}
