"use client";

import type {ChangeEvent} from "react";
import {useLocale} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";

type SupportedLocale = "fa" | "en";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleLocaleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as SupportedLocale;

    router.replace(pathname, {
      locale: nextLocale
    });
  }

  return (
    <label className="inline-flex items-center gap-3">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {locale === "fa" ? "زبان" : "Language"}
      </span>

      <select
        value={locale}
        onChange={handleLocaleChange}
        aria-label={locale === "fa" ? "انتخاب زبان" : "Select language"}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100"
      >
        <option value="fa">فارسی</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
