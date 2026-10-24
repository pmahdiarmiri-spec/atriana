'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, KeyRound, ArrowRight, RotateCcw, Loader2, Clock } from 'lucide-react';

interface PrmAdminGateOtpFormProps {
    isSubmitting: boolean;
    errorMessage: string | null;
    maskedMobile: string;
    initialExpiresIn: number;
    onVerifyOtp: (otpCode: string) => Promise<void>;
    onResendOtp: () => Promise<void>;
    onBackToCredentials: () => void;
}

export const PrmAdminGateOtpForm: React.FC<PrmAdminGateOtpFormProps> = ({
    isSubmitting,
    errorMessage,
    maskedMobile,
    initialExpiresIn,
    onVerifyOtp,
    onResendOtp,
    onBackToCredentials,
}) => {
    const [prmOtpCode, setPrmOtpCode] = useState('');
    const [prmRemainingSeconds, setPrmRemainingSeconds] = useState(initialExpiresIn);

    useEffect(() => {
        setPrmRemainingSeconds(initialExpiresIn);
    }, [initialExpiresIn]);

    useEffect(() => {
        if (prmRemainingSeconds <= 0) {
            return;
        }

        const prmTimer = window.setInterval(() => {
            setPrmRemainingSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => window.clearInterval(prmTimer);
    }, [prmRemainingSeconds]);

    const prmHandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = prmOtpCode.replace(/\D/g, '');
        if (cleaned.length !== 6 || isSubmitting || prmRemainingSeconds <= 0) {
            return;
        }
        await onVerifyOtp(cleaned);
    };

    const prmFormatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <form id="prm-admin-gate-otp-form" onSubmit={prmHandleSubmit} className="prm-otp-form-container space-y-4">
            <div className="prm-otp-banner p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-white">
                            Two-Factor Security Verification
                        </p>
                        <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                            SMS Dispatched to: {maskedMobile}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/10 text-amber-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{prmFormatTime(prmRemainingSeconds)}</span>
                </div>
            </div>

            {errorMessage && (
                <div
                    id="prm-admin-otp-error-box"
                    className="prm-error-alert p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium"
                >
                    {errorMessage}
                </div>
            )}

            <div className="space-y-1.5">
                <label htmlFor="prm-admin-otp-input" className="text-xs font-medium text-slate-300">
                    6-Digit One-Time Security Code
                </label>
                <div className="relative">
                    <input
                        id="prm-admin-otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        autoFocus
                        value={prmOtpCode}
                        onChange={(e) => setPrmOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="prm-glass-input w-full h-12 px-4 pr-10 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/15 text-white text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:border-amber-500/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition-all"
                        placeholder="••••••"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
                </div>
            </div>

            <button
                id="prm-admin-otp-submit-btn"
                type="submit"
                disabled={isSubmitting || prmOtpCode.length !== 6 || prmRemainingSeconds <= 0}
                className="prm-btn-primary w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_10px_25px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all disabled:opacity-50"
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <span>Verify Code & Consume Gate</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onBackToCredentials}
                    className="prm-btn-ghost text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                    Change Credentials
                </button>

                <button
                    type="button"
                    disabled={isSubmitting || prmRemainingSeconds > 0}
                    onClick={onResendOtp}
                    className="prm-btn-resend text-[11px] font-medium text-amber-400 hover:text-amber-300 disabled:text-slate-600 flex items-center gap-1 transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                </button>
            </div>
        </form>
    );
};
