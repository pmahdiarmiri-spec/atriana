'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { KeyRound, RefreshCw, Copy, Check, ShieldAlert, ExternalLink } from 'lucide-react';
import { prmGetGateSlug, prmRegenerateGateSlug } from '@/lib/prm-admin/prm-admin-api';

export default function AdminSettingsPage() {
    const routeParams = useParams();
    const locale = typeof routeParams?.locale === 'string' ? routeParams.locale : 'fa';

    const [gateSlug, setGateSlug] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [originUrl, setOriginUrl] = useState<string>('');
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
        }

        const fetchCurrentGateSlug = async () => {
            setIsLoading(true);
            const token = window.localStorage.getItem('prm_admin_token');

            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await prmGetGateSlug(token);
                setGateSlug(response.gate_slug);
            } catch {
                setFeedbackMessage({
                    type: 'error',
                    text: locale === 'fa' ? 'خطا در دریافت کلید گیت' : 'Failed to load gate slug',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentGateSlug();
    }, [locale]);

    const fullGateUrl = gateSlug ? `${originUrl}/${locale}/prm-gate/${gateSlug}` : '';

    const handleCopyUrl = async () => {
        if (!fullGateUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(fullGateUrl);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2500);
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: locale === 'fa' ? 'امکان کپی آدرس وجود ندارد' : 'Could not copy link',
            });
        }
    };

    const handleRegenerateSlug = async () => {
        const confirmed = window.confirm(
            locale === 'fa'
                ? 'هشدار: با بازتولید کلید گیت، تمام آدرس‌های ورودی قبلی فوراً نامعتبر خواهند شد. آیا اطمینان دارید؟'
                : 'Warning: Regenerating the gate slug will immediately invalidate the current access link. Continue?',
        );

        if (!confirmed) {
            return;
        }

        setIsRegenerating(true);
        setFeedbackMessage(null);

        const token = window.localStorage.getItem('prm_admin_token');

        if (!token) {
            setIsRegenerating(false);
            return;
        }

        try {
            const response = await prmRegenerateGateSlug(token);
            setGateSlug(response.new_gate_slug);
            setFeedbackMessage({
                type: 'success',
                text: locale === 'fa' ? 'کلید گیت امنیتی با موفقیت بروزرسانی شد.' : 'Gate slug regenerated successfully.',
            });
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: locale === 'fa' ? 'خطا در بروزرسانی کلید گیت رخ داد.' : 'Failed to regenerate gate slug.',
            });
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
            <div>
                <h2 className="text-xl font-bold text-slate-100">
                    {locale === 'fa' ? 'تنظیمات گیت امنیتی' : 'Gate Security Settings'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    {locale === 'fa'
                        ? 'مدیریت درگاه ورودی داینامیک و تغییر کلیدهای حفاظتی ورود مدیران'
                        : 'Manage dynamic entry gate and cycle access authorization tokens'}
                </p>
            </div>

            {feedbackMessage && (
                <div
                    className={`p-4 rounded-xl border text-xs font-medium ${
                        feedbackMessage.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}
                >
                    {feedbackMessage.text}
                </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-200">
                                {locale === 'fa' ? 'کلید داینامیک گیت ورود' : 'Current Active Gate Slug'}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                {locale === 'fa'
                                    ? 'این شناسه مخفی برای محافظت از روت ورودی ادمین استفاده می‌شود'
                                    : 'Secret identifier safeguarding the administrative entry point'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        disabled={isRegenerating || isLoading}
                        className="h-10 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        <span>{locale === 'fa' ? 'تولید کلید جدید' : 'Regenerate Slug'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        readOnly
                        value={fullGateUrl}
                        className="flex-1 h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs font-mono select-all focus:outline-none"
                    />

                    <button
                        type="button"
                        onClick={handleCopyUrl}
                        disabled={!gateSlug || isLoading}
                        className="h-11 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-2 text-xs font-medium disabled:opacity-50"
                    >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? (locale === 'fa' ? 'کپی شد' : 'Copied') : locale === 'fa' ? 'کپی آدرس' : 'Copy'}</span>
                    </button>

                    {fullGateUrl && (
                        <a
                            href={fullGateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-semibold mb-1">
                            {locale === 'fa' ? 'توصیه امنیتی' : 'Security Notice'}
                        </div>
                        <p className="text-[11px] text-amber-300/80">
                            {locale === 'fa'
                                ? 'آدرس گیت ورودی را تنها در اختیار افراد مجاز قرار دهید. در صورت بروز هرگونه فعالیت مشکوک، با کلیک روی گزینه "تولید کلید جدید"، دسترسی‌های قبلی را بلافاصله مسدود کنید.'
                                : 'Share this entry link exclusively with authorized admins. In case of suspicious activity, regenerate the slug immediately to terminate prior URL validity.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
