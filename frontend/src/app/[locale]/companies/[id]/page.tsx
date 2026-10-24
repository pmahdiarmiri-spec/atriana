import React from "react";
import PrmCompanyDetailShell from "@/components/companies/detail/prm-company-detail-shell";

export default async function PrmCompanyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  return <PrmCompanyDetailShell companyId={id} locale={locale} />;
}
