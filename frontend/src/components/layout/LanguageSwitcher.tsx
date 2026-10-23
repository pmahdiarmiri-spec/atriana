"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const locales = [
  { code: "fa", label: "FA" },
  { code: "en", label: "EN" }
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (nextLocale: "fa" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-xl">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => handleChange(item.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
            locale === item.code
              ? "bg-[var(--prm-secondary-color)] text-white shadow-md"
              : "text-[var(--prm-text-dark)] hover:bg-white/40"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
