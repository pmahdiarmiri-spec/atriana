"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrmConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prmPathname = usePathname() || "";
  const prmIsStandalone =
    prmPathname.includes("/dashboard") ||
    prmPathname.includes("/auth") ||
    prmPathname.includes("/admin");

  if (prmIsStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </>
  );
}
