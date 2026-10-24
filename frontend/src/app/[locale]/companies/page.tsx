import React from "react";
import PrmCompaniesDirectoryShell from "@/components/companies/directory/prm-companies-directory-shell";

export default async function PrmCompaniesDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <PrmCompaniesDirectoryShell locale={locale} />;
}
