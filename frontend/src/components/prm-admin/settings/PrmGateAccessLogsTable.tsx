'use client';

import React from 'react';
import {
    ShieldCheck,
    ShieldX,
    KeyRound,
    Smartphone,
    Monitor,
    Globe,
    Clock,
    UserCheck,
    RefreshCw,
    Activity,
} from 'lucide-react';
import { PrmAuditLog } from '@/types/prm-admin';

interface PrmGateAccessLogsTableProps {
    logs: PrmAuditLog[];
    isLoading: boolean;
    locale: string;
    onRefresh: () => void;
}

export default function PrmGateAccessLogsTable({
    logs,
    isLoading,
    locale,
    onRefresh,
}: PrmGateAccessLogsTableProps) {
    const isRtl = locale === 'fa';

    const renderActionBadge = (action: string) => {
        switch (action) {
            case 'admin_authenticated_2fa_verified':
            case 'admin_gate_login_success':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRtl ? 'ورود موفق ۲ مرحله‌ای (گیت مصرف شد)' : '2FA Login Success (Gate Consumed)'}</span>
                    </span>
                );
            case 'admin_otp_challenge_issued':
            case 'admin_gate_step1_otp_sent':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                        <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                        <span>{isRtl ? 'تایید رمز و ارسال پیامک OTP' : 'Credentials OK & OTP Sent'}</span>
                    </span>
                );
            case 'admin_gate_slug_regenerated':
            case 'regenerate_admin_gate_slug':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isRtl ? 'تولید کلید گیت جدید' : 'New Gate Slug Generated'}</span>
                    </span>
                );
            case 'admin_login_failed_credentials':
            case 'admin_login_failed_invalid_gate':
            case 'admin_login_failed_unauthorized_role':
            case 'admin_otp_verification_failed':
            case 'admin_gate_login_failed':
            case 'admin_gate_otp_failed':
            case 'admin_gate_inactive_blocked':
            case 'admin_gate_otp_rate_limited':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                        <ShieldX className="w-3.5 h-3.5 text-red-400" />
                        <span>
                            {action.includes('otp')
                                ? isRtl
                                    ? 'خطای کد پیامکی (OTP)'
                                    : 'OTP Verification Failed'
                                : action.includes('credentials')
                                  ? isRtl
                                      ? 'خطای نام کاربری یا رمز عبور'
                                      : 'Invalid Credentials'
                                  : isRtl
                                    ? 'تلاش ناموفق ورود به گیت'
                                    : 'Failed Gate Attempt'}
                        </span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10">
                        <Activity className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{action}</span>
                    </span>
                );
        }
    };

    const extractTelemetry = (payload: PrmAuditLog['payload']) => {
        if (!payload) {
            return {
                gateSlug: '-',
                browser: '-',
                os: '-',
                deviceType: '',
                identifier: '-',
                mobileMasked: '',
                reason: '',
            };
        }

        const rawPayload = payload as Record<string, unknown>;
        const telemetry = (payload.telemetry || {}) as Record<string, unknown>;

        const rawSlugOrHash =
            (rawPayload.consumed_gate_slug as string) ||
            (rawPayload.gate_slug as string) ||
            (rawPayload.consumed_gate_slug_hash as string) ||
            (rawPayload.gate_slug_hash as string) ||
            (rawPayload.new_slug_preview as string) ||
            (telemetry.request_path as string) ||
            '-';

        return {
            gateSlug: rawSlugOrHash.length > 16 ? `${rawSlugOrHash.slice(0, 14)}...` : rawSlugOrHash,
            browser: (telemetry.browser as string) || '-',
            os: (telemetry.os_platform as string) || (telemetry.os as string) || '-',
            deviceType: (telemetry.device_type as string) || '',
            identifier: (rawPayload.identifier as string) || (rawPayload.email as string) || '-',
            mobileMasked: (rawPayload.mobile_masked as string) || '',
            reason: (rawPayload.reason as string) || '',
        };
    };

    return (
        <div
            id="prm-gate-access-logs-card"
            className="prm-card relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 space-y-5 shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100">
                            {isRtl
                                ? 'مانیتورینگ زنده ورودها و مصرف‌کنندگان گیت امنیتی'
                                : 'Live Gate Access & Consumption Telemetry'}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {isRtl
                                ? 'مشاهده دقیق مدیرانی که وارد شده‌اند، کلیدهای مصرف‌شده، آدرس IP، مرورگر و تلاش‌های ناموفق'
                                : 'Track exact administrators who logged in, consumed gate slugs, IP addresses, and failed attempts'}
                        </p>
                    </div>
                </div>

                <button
                    id="prm-refresh-gate-logs-btn"
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="h-9 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all text-xs font-medium flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
                    <span>{isRtl ? 'بروزرسانی لیست ورودها' : 'Refresh Logs'}</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table id="prm-gate-logs-table" className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                            <th className="py-3 px-3 text-start font-semibold">
                                {isRtl ? 'ادمین / کاربر' : 'Admin / Actor'}
                            </th>
                            <th className="py-3 px-3 text-start font-semibold">
                                {isRtl ? 'وضعیت رویداد گیت' : 'Gate Event Status'}
                            </th>
                            <th className="py-3 px-3 text-start font-semibold">
                                {isRtl ? 'کلید / هش گیت' : 'Gate Slug / Hash'}
                            </th>
                            <th className="py-3 px-3 text-start font-semibold">
                                {isRtl ? 'آدرس IP و سیستم' : 'IP & Device Telemetry'}
                            </th>
                            <th className="py-3 px-3 text-end font-semibold">
                                {isRtl ? 'زمان ثبت' : 'Timestamp'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                    {isRtl ? 'در حال دریافت گزارش ورودهای گیت...' : 'Loading gate access telemetry...'}
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                    {isRtl
                                        ? 'هنوز هیچ رویدادی برای گیت ثبت نشده است.'
                                        : 'No gate access events recorded yet.'}
                                </td>
                            </tr>
                        ) : (
                            logs.map((logItem) => {
                                const info = extractTelemetry(logItem.payload);
                                const actor = logItem.user;

                                return (
                                    <tr
                                        key={logItem.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="py-3.5 px-3">
                                            {actor ? (
                                                <div>
                                                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                                                        <span>{actor.name}</span>
                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 font-mono">
                                                            {actor.role}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                        {info.identifier !== '-' ? info.identifier : actor.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="font-semibold text-slate-200">
                                                        {logItem.user_id
                                                            ? `${isRtl ? 'ادمین شناسه' : 'Admin ID'} #${logItem.user_id}`
                                                            : isRtl
                                                              ? 'کاربر ناشناس'
                                                              : 'Unverified Actor'}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                        {info.identifier}
                                                    </div>
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-3">
                                            <div>{renderActionBadge(logItem.action)}</div>
                                            {info.mobileMasked && (
                                                <div className="text-[10px] text-sky-300/80 font-mono mt-1">
                                                    SMS: {info.mobileMasked}
                                                </div>
                                            )}
                                            {info.reason && (
                                                <div className="text-[10px] text-red-400/80 font-mono mt-1">
                                                    Reason: {info.reason}
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-3">
                                            <span className="px-2 py-1 rounded-lg bg-black/30 border border-white/10 text-amber-200/90 font-mono text-[11px]">
                                                {info.gateSlug}
                                            </span>
                                        </td>

                                        <td className="py-3.5 px-3">
                                            <div className="flex items-center gap-1.5 text-slate-200 font-mono text-[11px]">
                                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{logItem.ip_address || '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                                <Monitor className="w-3 h-3 text-slate-500" />
                                                <span>
                                                    {info.os} / {info.browser}
                                                    {info.deviceType ? ` (${info.deviceType})` : ''}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-3 text-end">
                                            <div className="inline-flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span>
                                                    {new Date(logItem.created_at).toLocaleString(
                                                        isRtl ? 'fa-IR' : 'en-US',
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
