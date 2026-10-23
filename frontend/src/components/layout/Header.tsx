"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Globe, User, Menu } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("common");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto prm-liquid-glass prm-interactive-border rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col items-start gap-0.5">
            <span className="font-extrabold text-xl tracking-wide text-[var(--prm-primary-color)]">
              {t("brand")}
            </span>
            <span className="text-[10px] text-[var(--prm-text-light)] font-medium">
              {t("slogan")}
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.home")}
            </Link>
            <Link href="/strategy" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.strategy")}
            </Link>
            <Link href="/ads" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.ads")}
            </Link>
            <Link href="/companies" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.companies")}
            </Link>
            <Link href="/blog" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.blog")}
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-[var(--prm-text-dark)] hover:text-[var(--prm-accent-color)] transition-colors">
              {t("menu.contact")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--prm-text-light)]" />
            <LanguageSwitcher />
          </div>
          <Link 
            href="/auth" 
            className="flex items-center gap-2 bg-[var(--prm-primary-color)] hover:bg-[var(--prm-accent-color)] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all duration-300 transform active:scale-95"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t("auth.login_register")}</span>
          </Link>
          <button className="lg:hidden p-2 rounded-lg text-[var(--prm-text-dark)] hover:bg-black/5 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
