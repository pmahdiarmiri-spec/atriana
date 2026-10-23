"use client";

import {ArrowLeft, ArrowRight} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import type {CSSProperties} from "react";
import {useEffect, useState} from "react";

type PrmTypingTextProps = {
  phrases: string[];
};

const prmTypingSpeed = 65;
const prmDeletingSpeed = 35;
const prmPauseDuration = 1500;
const prmNextPhraseDelay = 250;

function PrmTypingText({phrases}: PrmTypingTextProps) {
  const [prmPhraseIndex, setPrmPhraseIndex] = useState(0);
  const [prmDisplayedText, setPrmDisplayedText] = useState("");
  const [prmDeleting, setPrmDeleting] = useState(false);

  const prmCurrentPhrase = phrases[prmPhraseIndex] ?? "";

  useEffect(() => {
    if (phrases.length === 0) {
      return;
    }

    if (!prmDeleting && prmDisplayedText === prmCurrentPhrase) {
      const prmPauseTimer = window.setTimeout(() => {
        setPrmDeleting(true);
      }, prmPauseDuration);

      return () => window.clearTimeout(prmPauseTimer);
    }

    if (prmDeleting && prmDisplayedText.length === 0) {
      const prmNextTimer = window.setTimeout(() => {
        setPrmDeleting(false);
        setPrmPhraseIndex((prmCurrentIndex) => {
          return (prmCurrentIndex + 1) % phrases.length;
        });
      }, prmNextPhraseDelay);

      return () => window.clearTimeout(prmNextTimer);
    }

    const prmTypingTimer = window.setTimeout(() => {
      if (prmDeleting) {
        setPrmDisplayedText((prmCurrentText) => {
          return prmCurrentText.slice(0, -1);
        });

        return;
      }

      setPrmDisplayedText(
        prmCurrentPhrase.slice(0, prmDisplayedText.length + 1)
      );
    }, prmDeleting ? prmDeletingSpeed : prmTypingSpeed);

    return () => window.clearTimeout(prmTypingTimer);
  }, [
    phrases.length,
    prmCurrentPhrase,
    prmDeleting,
    prmDisplayedText
  ]);

  return (
    <p
      className="prm-hero-typing-text relative text-sm font-semibold text-[var(--prm-text-light)] sm:text-base lg:text-lg"
      aria-live="polite"
    >
      <span>{prmDisplayedText}</span>

      <span className="prm-typing-cursor ms-1 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-[var(--prm-secondary-color)]" />
    </p>
  );
}

export default function PrmHeroText() {
  const prmLocale = useLocale();
  const prmTranslations = useTranslations("home.hero");
  const prmRawPhrases = prmTranslations.raw("phrases");
  const prmPhrases = Array.isArray(prmRawPhrases)
    ? (prmRawPhrases as string[])
    : [];
  const prmIsPersian = prmLocale === "fa";
  const PrmArrowIcon = prmIsPersian ? ArrowLeft : ArrowRight;

  return (
    <div className="prm-hero-text text-center lg:text-start">
      <h1 className="prm-hero-title font-black leading-none tracking-[-0.045em]">
        <span className="prm-hero-brand block text-[clamp(2.8rem,7vw,5.6rem)] text-[var(--prm-secondary-color)] lg:text-[clamp(4rem,5.7vw,6.4rem)]">
          {prmTranslations("brand")}
        </span>

        <span className="prm-hero-heading mt-2 block whitespace-nowrap text-[clamp(1.18rem,4.7vw,2rem)] font-extrabold leading-tight tracking-[-0.035em] text-[var(--prm-primary-color)] sm:text-[clamp(1.55rem,3.5vw,2.5rem)] lg:text-[clamp(1.65rem,2.6vw,2.75rem)]">
          {prmTranslations("titleLineOne")}{" "}
          {prmTranslations("titleLineTwo")}
        </span>
      </h1>

      <div className="prm-hero-typing mt-4 flex min-h-7 items-center justify-center lg:mt-5 lg:justify-start">
        <PrmTypingText key={prmLocale} phrases={prmPhrases} />
      </div>

      <div className="prm-hero-actions mt-4 flex justify-center lg:mt-5 lg:justify-start">
        <button
          type="button"
          className="prm-hero-primary-button group relative isolate inline-flex min-h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/80 bg-[linear-gradient(135deg,#f59e0b_0%,#ea580c_100%)] px-6 text-sm font-bold text-white shadow-[0_16px_38px_rgba(234,88,12,0.28),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(124,45,18,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(234,88,12,0.38),inset_0_1px_0_rgba(255,255,255,0.65)] active:translate-y-0 sm:min-h-12 sm:px-7"
        >
          <span className="prm-hero-button-reflection absolute inset-x-4 top-0 h-px bg-white/90" />

          <span className="prm-hero-button-content relative z-10">
            {prmTranslations("cta")}
          </span>

          <PrmArrowIcon
            className="prm-hero-button-icon relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-[var(--prm-arrow-direction)]"
            strokeWidth={2.2}
            style={
              {
                "--prm-arrow-direction": prmIsPersian
                  ? "-0.25rem"
                  : "0.25rem"
              } as CSSProperties
            }
          />
        </button>
      </div>
    </div>
  );
}
