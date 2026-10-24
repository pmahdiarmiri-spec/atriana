'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    KeyRound,
    RefreshCw,
    Copy,
    Check,
    ShieldAlert,
    ExternalLink,
    Clock,
    Flame,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    X,
} from 'lucide-react';
import {
    prmGetAuditLogs,
    prmGetGateSlug,
    prmRegenerateGateSlug,
} from '@/lib/prm-admin/prm-admin-api';
import { PrmAuditLog } from '@/types/prm-admin';
import PrmGateAccessLogsTable from '@/components/prm-admin/settings/PrmGateAccessLogsTable';

const GATE_RELATED_ACTIONS = new Set([
    'admin_authenticated_2fa_verified',
    'admin_otp_challenge_issued',
    'admin_login_failed_credentials',
    'admin_login_failed_invalid_gate',
    'admin_login_failed_unauthorized_role',
    'admin_otp_verification_failed',
    'admin_gate_slug_regenerated',
    'admin_gate_login_success',
    'admin_gate_step1_otp_sent',
    'admin_gate_login_failed',
    'admin_gate_otp_failed',
    'admin_gate_inactive_blocked',
    'admin_gate_otp_rate_limited',
    'regenerate_admin_gate_slug',
]);

const isGateAuditItem = (item: PrmAuditLog): boolean => {
    if (GATE_RELATED_ACTIONS.has(item.action)) {
        return true;
    }
    const act = item.action.toLowerCase();
    return act.includes('gate') || act.includes('login') || act.includes('otp') || act.includes('2fa');
};

export default function AdminSettingsPage() {
    const routeParams = useParams();
    const locale = typeof routeParams?.locale === 'string' ? routeParams.locale : 'fa';
    const isRtl = locale === 'fa';

    const [gateSlug, setGateSlug] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<string>('');
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [ttlMinutes, setTtlMinutes] = useState<number>(10);
    const [isOneTime, setIsOneTime] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [isCopiedSlug, setIsCopiedSlug] = useState<boolean>(false);
    const [isCopiedUrl, setIsCopiedUrl] = useState<boolean>(false);
    const [originUrl, setOriginUrl] = useState<string>('');
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [gateLogs, setGateLogs] = useState<PrmAuditLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);

    const applyGatePayload = useCallback(
        (payload: {
            slug?: string;
            gate_slug?: string;
            new_gate_slug?: string;
            expires_at?: string;
            remaining_seconds?: number;
            ttl_minutes?: number;
            is_one_time?: boolean;
        }) => {
            const resolvedSlug = payload.new_gate_slug || payload.gate_slug || payload.slug || '';
            setGateSlug(resolvedSlug);
            setExpiresAt(payload.expires_at || '');
            setRemainingSeconds(typeof payload.remaining_seconds === 'number' ? payload.remaining_seconds : 600);
            setTtlMinutes(payload.ttl_minutes || 10);
            setIsOneTime(payload.is_one_time ?? true);
        },
        [],
    );

    const fetchGateAccessLogs = useCallback(async () => {
        setIsLoadingLogs(true);
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('prm_admin_token') : null;

        if (!token) {
            setIsLoadingLogs(false);
            return;
        }

        try {
            const response = await prmGetAuditLogs(token, 1);
            const rawData = response?.data;
            const rawItems: PrmAuditLog[] = Array.isArray(rawData?.data)
                ? rawData.data
                : Array.isArray(rawData)
                  ? rawData
                  : [];
            const filtered = rawItems.filter(isGateAuditItem);
            setGateLogs(filtered);
        } catch {
            setGateLogs([]);
        } finally {
            setIsLoadingLogs(false);
        }
    }, []);

    const fetchCurrentGateSlug = useCallback(async () => {
        setIsLoading(true);
        setFeedbackMessage(null);

        const token = typeof window !== 'undefined' ? window.localStorage.getItem('prm_admin_token') : null;

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await prmGetGateSlug(token);
            applyGatePayload(response);
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: isRtl ? 'خطا در دریافت وضعیت کلید گیت امنیتی' : 'Failed to load gate security status',
            });
        } finally {
            setIsLoading(false);
        }
    }, [applyGatePayload, isRtl]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
        }
        fetchCurrentGateSlug();
        fetchGateAccessLogs();
    }, [fetchCurrentGateSlug, fetchGateAccessLogs]);

    useEffect(() => {
        if (remainingSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [remainingSeconds]);

    const isExpired = !isLoading && remainingSeconds <= 0;
    const isExpiringSoon = !isLoading && remainingSeconds > 0 && remainingSeconds <= 120;
    const fullGateUrl = gateSlug && !isExpired ? `${originUrl}/${locale}/prm-gate/${gateSlug}` : '';

    const formatCountdown = (totalSec: number): string => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const totalTtlSeconds = ttlMinutes * 60;
    const progressPercent = Math.min(100, Math.max(0, (remainingSeconds / totalTtlSeconds) * 100));

    const handleCopyUrl = async () => {
        if (!fullGateUrl || isExpired) {
            return;
        }

        try {
            await navigator.clipboard.writeText(fullGateUrl);
            setIsCopiedUrl(true);
            window.setTimeout(() => setIsCopiedUrl(false), 2500);
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: isRtl ? 'امکان کپی آدرس در کلیپ‌بورد وجود ندارد.' : 'Could not copy gate URL to clipboard.',
            });
        }
    };

    const handleCopySlugOnly = async () => {
        if (!gateSlug || isExpired) {
            return;
        }

        try {
            await navigator.clipboard.writeText(gateSlug);
            setIsCopiedSlug(true);
            window.setTimeout(() => setIsCopiedSlug(false), 2500);
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: isRtl ? 'امکان کپی کلید گیت وجود ندارد.' : 'Could not copy gate slug.',
            });
        }
    };

    const executeRegenerateSlug = async () => {
        setShowConfirmModal(false);
        setIsRegenerating(true);
        setFeedbackMessage(null);

        const token = typeof window !== 'undefined' ? window.localStorage.getItem('prm_admin_token') : null;

        if (!token) {
            setIsRegenerating(false);
            return;
        }

        try {
            const response = await prmRegenerateGateSlug(token);
            applyGatePayload(response);
            await fetchGateAccessLogs();
            setFeedbackMessage({
                type: 'success',
                text: isRtl
                    ? 'کلید گیت یک‌بار مصرف جدید با اعتبار ۱۰ دقیقه تولید شد. می‌توانید لینک را برای ورود ادمین ارسال کنید.'
                    : 'New 10-minute one-time gate slug generated and previous slug destroyed.',
            });
        } catch {
            setFeedbackMessage({
                type: 'error',
                text: isRtl ? 'خطا در بازتولید کلید گیت امنیتی رخ داد.' : 'Failed to regenerate security gate slug.',
            });
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleSyncAll = () => {
        fetchCurrentGateSlug();
        fetchGateAccessLogs();
    };

    return (
        <div id="prm-admin-settings-container" className="prm-settings-wrapper space-y-6 max-w-5xl" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 id="prm-settings-title" className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
                        <span>{isRtl ? 'تنظیمات گیت امنیتی یک‌بار مصرف' : 'One-Time Security Gate Settings'}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                            {isRtl ? 'یک‌بار مصرف + ۱۰ دقیقه' : 'Single-Use + 10m TTL'}
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        {isRtl
                            ? 'هر کلید گیت صرفاً برای یک بار ورود موفق معتبر است. برای ورود هر ادمین جدید، یک کلید جدید تولید کنید.'
                            : 'Each gate slug is valid for a single successful login. Generate a new slug for each administrator entry.'}
                    </p>
                </div>

                <button
                    id="prm-refresh-gate-status-btn"
                    type="button"
                    onClick={handleSyncAll}
                    disabled={isLoading || isRegenerating}
                    className="prm-btn-secondary h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all text-xs font-medium flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
                    <span>{isRtl ? 'همگام‌سازی وضعیت و لاگ‌ها' : 'Sync Status & Logs'}</span>
                </button>
            </div>

            {feedbackMessage && (
                <div
                    id="prm-settings-feedback-banner"
                    className={`prm-feedback-alert p-4 rounded-2xl border backdrop-blur-xl text-xs font-medium flex items-center justify-between gap-3 transition-all ${
                        feedbackMessage.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 shadow-[0_8px_30px_rgba(16,185,129,0.12)]'
                            : 'bg-red-500/10 border-red-500/25 text-red-300 shadow-[0_8px_30px_rgba(239,68,68,0.12)]'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        {feedbackMessage.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{feedbackMessage.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFeedbackMessage(null)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div
                id="prm-gate-liquid-card"
                className="prm-card relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
                <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/30 text-amber-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-100">
                                    {isRtl ? 'کلید داینامیک گیت ورود مدیران' : 'Active Admin Entry Gate Slug'}
                                </h3>

                                {isLoading ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-400 border border-white/10">
                                        {isRtl ? 'در حال بارگذاری...' : 'Loading...'}
                                    </span>
                                ) : isExpired ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                                        {isRtl ? 'منقضی یا مصرف شده' : 'Expired or Consumed'}
                                    </span>
                                ) : isExpiringSoon ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        {isRtl ? 'در آستانه انقضا' : 'Expiring Soon'}
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        {isRtl ? 'فعال (آماده ورود ۱ نفر)' : 'Active (Ready for 1 Login)'}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                {isRtl
                                    ? 'به محض اینکه یک نفر با این لینک وارد شود و کد پیامک را بزند، این لینک خودبه‌خود می‌سوزد و برای نفر بعدی باید دکمه ساخت کلید جدید را بزنید.'
                                    : 'Once one admin logs in with SMS OTP, this slug burns automatically. Generate a new slug for the next person.'}
                            </p>
                        </div>
                    </div>

                    <button
                        id="prm-trigger-regenerate-btn"
                        type="button"
                        onClick={() => (isExpired ? executeRegenerateSlug() : setShowConfirmModal(true))}
                        disabled={isRegenerating || isLoading}
                        className="prm-btn-primary h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/35 text-amber-300 hover:from-amber-500/30 hover:to-orange-600/30 transition-all text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        <span>
                            {isExpired
                                ? isRtl
                                    ? 'ساخت کلید گیت جدید'
                                    : 'Generate New Gate'
                                : isRtl
                                  ? 'ساخت گیت جدید برای نفر بعدی'
                                  : 'Generate New Gate Slug'}
                        </span>
                    </button>
                </div>

                {showConfirmModal && (
                    <div
                        id="prm-regenerate-confirm-box"
                        className="relative z-10 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-red-300">
                                    {isRtl
                                        ? 'آیا می‌خواهید کلید فعلی را بسوزانید و کلید جدید بسازید؟'
                                        : 'Burn current gate and generate a fresh 10-minute slug?'}
                                </h4>
                                <p className="text-[11px] text-red-200/80 mt-0.5">
                                    {isRtl
                                        ? 'اگر شخصی هنوز در حال استفاده از لینک قبلی است، دسترسی لینک قبلی قطع شده و لینک جدید ۱۰ دقیقه‌ای صادر می‌شود.'
                                        : 'Current entry link will immediately return 404 and a fresh 10-minute one-time slug will be issued.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="h-9 px-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-xs font-medium transition-all"
                            >
                                {isRtl ? 'انصراف' : 'Cancel'}
                            </button>
                            <button
                                id="prm-confirm-regenerate-submit-btn"
                                type="button"
                                onClick={executeRegenerateSlug}
                                className="h-9 px-4 rounded-xl bg-red-500/25 border border-red-500/40 text-red-200 hover:bg-red-500/35 text-xs font-bold transition-all"
                            >
                                {isRtl ? 'بله، کلید جدید بساز' : 'Yes, Generate New'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Clock className={`w-4 h-4 ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`} />
                            <div>
                                <div className="text-[10px] text-slate-400">
                                    {isRtl ? 'مهلت باقی‌مانده گیت فعلی' : 'Remaining TTL'}
                                </div>
                                <div className="text-sm font-mono font-bold text-slate-100 mt-0.5">
                                    {isLoading ? '--:--' : formatCountdown(remainingSeconds)}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 font-mono">
                            {ttlMinutes}m Max
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <div>
                                <div className="text-[10px] text-slate-400">
                                    {isRtl ? 'ظرفیت مصرف کلید' : 'Consumption Capacity'}
                                </div>
                                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                                    {isOneTime
                                        ? isRtl
                                            ? 'تک‌نفره (یک‌بار مصرف)'
                                            : 'Single Admin (One-Time)'
                                        : isRtl
                                          ? 'چندبار مصرف'
                                          : 'Multi-Use'}
                                </div>
                            </div>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] text-slate-400">
                                {isRtl ? 'شناسه خالص گیت (Slug)' : 'Raw Gate Slug'}
                            </div>
                            <div className="text-xs font-mono text-slate-200 mt-0.5 truncate max-w-[150px]">
                                {isLoading ? '...' : isExpired ? (isRtl ? 'منقضی شده' : 'Expired') : gateSlug}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopySlugOnly}
                            disabled={!gateSlug || isExpired || isLoading}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all disabled:opacity-40"
                            title={isRtl ? 'کپی فقط شناسه اسلاگ' : 'Copy raw slug only'}
                        >
                            {isCopiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>

                <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{isRtl ? 'نوار زمان بقای گیت (۱۰ دقیقه)' : 'Gate Lifetime Progress (10m)'}</span>
                        {expiresAt && !isExpired && (
                            <span className="font-mono text-[10px] text-slate-400">
                                {isRtl ? 'ساعت انقضا: ' : 'Expires: '}
                                {new Date(expiresAt).toLocaleTimeString(isRtl ? 'fa-IR' : 'en-US')}
                            </span>
                        )}
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden p-0.5 border border-white/10">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                isExpired
                                    ? 'bg-red-500'
                                    : isExpiringSoon
                                      ? 'bg-gradient-to-r from-amber-500 to-red-500'
                                      : 'bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="relative z-10 space-y-2">
                    <label htmlFor="prm-full-gate-url-input" className="block text-xs font-medium text-slate-300">
                        {isRtl ? 'لینک کامل ورود به گیت (جهت ارسال به ادمین):' : 'Full Direct Admin Gate Entry URL:'}
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                            id="prm-full-gate-url-input"
                            type="text"
                            dir="ltr"
                            readOnly
                            value={
                                isLoading
                                    ? isRtl
                                        ? 'در حال دریافت آدرس امن گیت...'
                                        : 'Fetching secure gate URL...'
                                    : isExpired
                                      ? isRtl
                                          ? 'این گیت مصرف یا منقضی شده است. روی دکمه «ساخت کلید گیت جدید» کلیک کنید.'
                                          : 'This gate has expired or been consumed. Click Generate New Gate.'
                                      : fullGateUrl
                            }
                            className={`flex-1 h-11 px-4 rounded-xl bg-black/30 border text-xs font-mono select-all focus:outline-none transition-all ${
                                isExpired ? 'border-red-500/30 text-red-300/80' : 'border-white/15 text-amber-100'
                            }`}
                        />

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                id="prm-copy-gate-url-btn"
                                type="button"
                                onClick={handleCopyUrl}
                                disabled={!fullGateUrl || isExpired || isLoading}
                                className="flex-1 sm:flex-initial h-11 px-4 rounded-xl bg-amber-500/20 border border-amber-500/35 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-40"
                            >
                                {isCopiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                <span>
                                    {isCopiedUrl
                                        ? isRtl
                                            ? 'لینک کپی شد'
                                            : 'URL Copied'
                                        : isRtl
                                          ? 'کپی لینک ورود'
                                          : 'Copy Gate Link'}
                                </span>
                            </button>

                            {fullGateUrl && !isExpired && (
                                <a
                                    id="prm-open-gate-external-link"
                                    href={fullGateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-slate-200 hover:bg-white/[0.12] transition-all flex items-center justify-center"
                                    title={isRtl ? 'باز کردن در تب جدید' : 'Open Gate in New Tab'}
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                        <div className="font-bold mb-1 text-amber-200">
                            {isRtl ? 'راهنمای مدیریت ورود ادمین‌ها' : 'Admin Gate Management Guide'}
                        </div>
                        <p className="text-[11px] text-amber-200/80 leading-5">
                            {isRtl
                                ? 'از آنجا که گیت‌ها یک‌بار مصرف هستند، هر زمان ادمینی قصد ورود به سیستم را داشت، یک کلید جدید بسازید و لینک را برای او بفرستید. به محض ورود او، در جدول پایین همین صفحه، نام، آدرس IP، مرورگر و زمان دقیق ورودش ثبت شده و گیت به صورت خودکار بسته می‌شود.'
                                : 'Since gate slugs are single-use, generate a fresh link whenever an admin needs to log in. Once they verify their SMS OTP, their login details appear in the table below and the gate closes automatically.'}
                        </p>
                    </div>
                </div>
            </div>

            <PrmGateAccessLogsTable
                logs={gateLogs}
                isLoading={isLoadingLogs}
                locale={locale}
                onRefresh={fetchGateAccessLogs}
            />
        </div>
    );
}
