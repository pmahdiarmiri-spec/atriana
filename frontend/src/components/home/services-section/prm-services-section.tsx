"use client";

import React, { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import PrmServiceCard from "./prm-service-card";

export default function PrmServicesSection() {
  const t = useTranslations("home.services");
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  const servicesData = [
    {
      id: "01",
      title: t("s1Title"),
      desc: t("s1Desc"),
      features: t("s1Feats").split(",")
    },
    {
      id: "02",
      title: t("s2Title"),
      desc: t("s2Desc"),
      features: t("s2Feats").split(",")
    },
    {
      id: "03",
      title: t("s3Title"),
      desc: t("s3Desc"),
      features: t("s3Feats").split(",")
    },
    {
      id: "04",
      title: t("s4Title"),
      desc: t("s4Desc"),
      features: t("s4Feats").split(",")
    },
    {
      id: "05",
      title: t("s5Title"),
      desc: t("s5Desc"),
      features: t("s5Feats").split(",")
    },
    {
      id: "06",
      title: t("s6Title"),
      desc: t("s6Desc"),
      features: t("s6Feats").split(",")
    },
    {
      id: "07",
      title: t("s7Title"),
      desc: t("s7Desc"),
      features: t("s7Feats").split(",")
    },
    {
      id: "08",
      title: t("s8Title"),
      desc: t("s8Desc"),
      features: t("s8Feats").split(",")
    }
  ];

  return (
    <section
      ref={container}
      className="relative z-10 mt-24 bg-[var(--prm-bg-light)] px-6 pb-[10vh] pt-12"
    >
      <div className="sticky top-24 mb-12 flex flex-col items-center bg-[var(--prm-bg-light)]/90 pb-6 pt-2 text-center backdrop-blur-md">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[var(--prm-accent-color)]"
        >
          {t("badge")}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black text-[var(--prm-primary-color)] sm:text-6xl"
        >
          {t("mainTitle")}
        </motion.h2>
      </div>

      <div className="flex flex-col gap-[8vh]">
        {servicesData.map((service, index) => {
          const targetScale = 1 - (servicesData.length - index) * 0.04;

          return (
            <PrmServiceCard
              key={service.id}
              id={service.id}
              index={index}
              title={service.title}
              description={service.desc}
              subFeatures={service.features}
              totalCards={servicesData.length}
              progress={scrollYProgress}
              range={[index * (1 / servicesData.length), 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
