import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import PrmConditionalLayout from "@/components/layout/PrmConditionalLayout";
import { prmVazirmatn, prmInter } from "@/app/fonts";
import "@/app/globals.css";

export function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== "fa" && locale !== "en") {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${prmVazirmatn.variable} ${prmInter.variable}`}
    >
      <body className="bg-[var(--prm-bg-light)] text-[var(--prm-text-dark)] min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PrmConditionalLayout>{children}</PrmConditionalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
