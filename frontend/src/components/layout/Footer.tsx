"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="w-full bg-[var(--prm-primary-color)] text-[var(--prm-white)] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-wider text-[var(--prm-secondary-color)]">
                {t("brand")}
              </span>
              <span className="text-xs text-slate-400 mt-1 font-semibold">
                {t("footer_slogan")}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light mt-2">
              {t("footer_desc")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base text-[var(--prm-secondary-color)] border-b border-white/10 pb-2">
              {t("footer.quick_links")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.about")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.pricing")}
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.rules")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.faq")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base text-[var(--prm-secondary-color)] border-b border-white/10 pb-2">
              {t("footer.services_title")}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
              <li>
                <Link href="/services/hs-code" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("footer.hs_code")}
                </Link>
              </li>
              <li>
                <Link href="/services/ahp" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("footer.ahp")}
                </Link>
              </li>
              <li>
                <Link href="/ads" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.ads")}
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("menu.companies")}
                </Link>
              </li>
              <li>
                <Link href="/services/reports" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  {t("footer.reports")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base text-[var(--prm-secondary-color)] border-b border-white/10 pb-2">
              {t("footer.contact_info")}
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--prm-secondary-color)] flex-shrink-0" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--prm-secondary-color)] flex-shrink-0" />
                <a href="mailto:support@atrianagroup.com" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  support@atrianagroup.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--prm-secondary-color)] flex-shrink-0" />
                <a href="mailto:info@atrianagroup.com" className="hover:text-[var(--prm-secondary-color)] transition-colors">
                  info@atrianagroup.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-400 text-center md:text-right">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-[var(--prm-secondary-color)] transition-colors">
              {t("footer.privacy")}
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-[var(--prm-secondary-color)] transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
