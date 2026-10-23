"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { PrmUser } from "@/types/prm-auth";

interface PrmDashboardHeaderProps {
  user: PrmUser | null;
}

export function PrmDashboardHeader({ user }: PrmDashboardHeaderProps) {
  const t = useTranslations("dashboard");
  
  const prmValidLastName = user?.last_name && user.last_name !== user.mobile ? user.last_name : "";
  const prmFullName = [user?.first_name, prmValidLastName].filter(Boolean).join(" ").trim();
  const prmDisplayName = prmFullName || user?.first_name || user?.mobile || user?.email || "کاربر آتریانا";

  return (
    <header className="prm-dashboard-top-header">
      <div className="prm-header-welcome">
        <h1>{t("header.greeting", { name: prmDisplayName })}</h1>
        <p>{t("header.welcome")}</p>
      </div>
      <div className="prm-header-date">
        <span>{t("status.betaVersion")}</span>
      </div>
    </header>
  );
}
