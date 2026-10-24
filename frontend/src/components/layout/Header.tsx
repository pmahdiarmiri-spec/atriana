"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import PrmBottomBar from "../navigation/PrmBottomBar";
import PrmMobileDrawer from "../navigation/PrmMobileDrawer";

export default function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const desktopLinks = [
    { label: t("menu.home"), href: "/" },
    { label: t("menu.strategy"), href: "/strategy" },
    { label: t("menu.ads"), href: "/ads" },
    { label: t("menu.companies"), href: "/companies" },
    { label: t("menu.blog"), href: "/blog" },
    { label: t("menu.contact"), href: "/contact" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 py-2.5 sm:px-6 sm:py-3.5">
        <div className="max-w-7xl mx-auto prm-liquid-glass rounded-2xl px-3.5 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Toggle navigation drawer"
              className="lg:hidden p-2 rounded-xl text-[var(--prm-primary-color)] hover:bg-white/40 active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex flex-col items-start leading-tight">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[var(--prm-primary-color)]">
                {t("brand")}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--prm-text-light)] font-medium">
                {t("slogan")}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mr-4">
              {desktopLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900/5 text-[var(--prm-accent-color)]"
                        : "text-[var(--prm-text-dark)] hover:text-[var(--prm-primary-color)] hover:bg-white/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            <Link
              href="/auth"
              className="flex items-center gap-1.5 bg-[var(--prm-primary-color)] hover:bg-[var(--prm-accent-color)] text-white text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.15)] transition-all duration-300 transform active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("auth.login_register")}</span>
            </Link>
          </div>
        </div>
      </header>

      <PrmMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <PrmBottomBar />
    </>
  );
}
