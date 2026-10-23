import React from "react";
import PrmContactForm from "./prm-contact-form";
import PrmContactInfo from "./prm-contact-info";

export default function PrmContactMain() {
  return (
    <section className="prm-contact-main-section py-24 px-4 bg-gradient-to-b from-transparent to-[var(--prm-white)]/30">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-[var(--prm-secondary-color)]/10 text-[var(--prm-secondary-color)] text-xs font-bold rounded-full border border-[var(--prm-secondary-color)]/20">همکاری و مشاوره</span>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--prm-primary-color)]">آماده‌ایم تا تجارت شما را متحول کنیم</h2>
          <p className="text-[var(--prm-text-light)] max-w-2xl mx-auto text-lg leading-relaxed">برای دریافت مشاوره رایگان، درخواست دمو، یا هرگونه همکاری، اطلاعات خود را تکمیل و ارسال کنید.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <PrmContactForm />
          </div>
          <div className="lg:col-span-5">
            <PrmContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
