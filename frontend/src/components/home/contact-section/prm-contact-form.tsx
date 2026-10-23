"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PrmContactForm() {
  const t = useTranslations("home.contact");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 2500);
  };

  return (
    <div className="prm-liquid-glass-container p-8 min-h-[600px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.form 
            key="prm-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-[var(--prm-primary-color)] border-b-2 border-[var(--prm-secondary-color)] pb-2 w-fit">ارسال پیام</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--prm-text-dark)]">نام و نام خانوادگی*</label>
                <input type="text" defaultValue="مهدیار میری" className="prm-glass-sub-card p-3 rounded-xl focus:ring-2 focus:ring-[var(--prm-secondary-color)] outline-none text-sm" placeholder="مثلاً: علی احمدی" required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--prm-text-dark)]">ایمیل*</label>
                <input type="email" defaultValue="limk9161@gmail.com" className="prm-glass-sub-card p-3 rounded-xl focus:ring-2 focus:ring-[var(--prm-secondary-color)] outline-none text-sm" placeholder="example@domain.com" required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--prm-text-dark)]">شماره موبایل (اختیاری)</label>
                <input type="text" className="prm-glass-sub-card p-3 rounded-xl focus:ring-2 focus:ring-[var(--prm-secondary-color)] outline-none text-sm" placeholder="مثلاً: 0912xxxxxxx" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--prm-text-dark)]">موضوع پیام*</label>
                <select className="prm-glass-sub-card p-3 rounded-xl outline-none text-sm cursor-pointer" required>
                  <option value="">لطفا یک موضوع انتخاب کنید</option>
                  <option value="consultation">همکاری و مشاوره</option>
                  <option value="demo">درخواست دمو</option>
                  <option value="support">پشتیبانی فنی</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--prm-text-dark)]">متن پیام*</label>
                <textarea defaultValue="یبلاطیبلاطیبل" className="prm-glass-sub-card p-3 rounded-xl focus:ring-2 focus:ring-[var(--prm-secondary-color)] outline-none text-sm min-h-[120px]" placeholder="لطفا پیام خود را با جزئیات بنویسید..." required />
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-[var(--prm-secondary-color)] to-[var(--prm-accent-color)] text-[var(--prm-white)] py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--prm-secondary-color)]/20">
              ارسال پیام
            </button>
          </motion.form>
        ) : status === 'loading' ? (
          <motion.div 
            key="prm-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <Loader2 className="w-12 h-12 text-[var(--prm-secondary-color)] animate-spin" />
            <p className="font-medium text-[var(--prm-text-dark)]">در حال ارسال اطلاعات...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="prm-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-[var(--prm-primary-color)]">ارسال شد!</h4>
              <p className="text-[var(--prm-text-light)] leading-relaxed">
                پیام شما با موفقیت دریافت گردید.<br />
                کارشناسان ما به زودی با شما تماس خواهند گرفت.
              </p>
            </div>
            <button onClick={() => setStatus('idle')} className="text-sm font-semibold text-[var(--prm-secondary-color)] hover:underline">
              ارسال پیام مجدد
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
