'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PrmAdminGateCard } from '@/components/prm-admin/prm-admin-gate-card/prm-admin-gate-card';
import { PrmAdminGateForm } from '@/components/prm-admin/prm-admin-gate-form/prm-admin-gate-form';
import { PrmAdminGateOtpForm } from '@/components/prm-admin/prm-admin-gate-otp-form/prm-admin-gate-otp-form';
import {
    prmAdminGateLogin,
    prmAdminGateVerifyOtp,
    PrmAdminApiError,
} from '@/lib/prm-admin/prm-admin-api';

export default function PrmAdminGateEntryPage() {
    const params = useParams();
    const router = useRouter();
    const gateSlug = typeof params.gate_slug === 'string' ? params.gate_slug : '';
    const locale = typeof params.locale === 'string' ? params.locale : 'fa';

    const [prmStep, setPrmStep] = useState<'credentials' | 'otp'>('credentials');
    const [prmSavedIdentifier, setPrmSavedIdentifier] = useState('');
    const [prmSavedPassword, setPrmSavedPassword] = useState('');
    const [prmChallengeToken, setPrmChallengeToken] = useState('');
    const [prmMaskedMobile, setPrmMaskedMobile] = useState('');
    const [prmOtpExpiresIn, setPrmOtpExpiresIn] = useState(120);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const prmResolveErrorMessage = (error: unknown): string => {
        if (error instanceof PrmAdminApiError) {
            if (error.prmCode === 'prm_admin_gate_not_found' || error.prmStatusCode === 404) {
                return locale === 'fa'
                    ? 'کلید گیت نامعتبر، یک‌بار مصرف استفاده شده یا منقضی شده است (مهلت ۱۰ دقیقه).'
                    : 'Gate slug is invalid, already consumed, or expired (10-minute TTL).';
            }
            if (error.prmCode === 'prm_admin_invalid_credentials') {
                return locale === 'fa'
                    ? 'شناسه یا رمز عبور اشتباه است.'
                    : 'Invalid login credentials.';
            }
            if (error.prmCode === 'prm_admin_invalid_otp_code') {
                return locale === 'fa'
                    ? 'کد تایید یک‌بار مصرف وارد شده اشتباه است.'
                    : 'Invalid one-time verification code.';
            }
            if (error.prmCode === 'prm_admin_otp_expired_or_invalid') {
                return locale === 'fa'
                    ? 'کد تایید منقضی شده یا نشست امنیتی نامعتبر است. مجدداً تلاش کنید.'
                    : 'Verification code expired or invalid session. Please try again.';
            }
            if (error.prmCode === 'prm_admin_security_context_mismatch') {
                return locale === 'fa'
                    ? 'عدم تطابق اثر انگشت امنیتی (IP یا مرورگر). دسترسی مسدود شد.'
                    : 'Security context mismatch detected. Access denied.';
            }
            if (error.prmCode === 'prm_admin_account_disabled' || error.prmStatusCode === 403) {
                return locale === 'fa'
                    ? 'حساب کاربری ادمین غیرفعال شده است.'
                    : 'Admin account has been disabled.';
            }
            if (
                error.prmCode === 'prm_admin_login_rate_limited' ||
                error.prmCode === 'prm_admin_otp_rate_limited' ||
                error.prmStatusCode === 429
            ) {
                return locale === 'fa'
                    ? 'تعداد تلاش‌ها بیش از حد مجاز است. لطفاً چند دقیقه دیگر تلاش کنید.'
                    : 'Too many attempts. Please try again later.';
            }
            if (error.prmCode === 'prm_admin_otp_dispatch_failed') {
                return locale === 'fa'
                    ? 'خطا در ارسال پیامک کد امنیتی. لطفاً وضعیت درگاه پیامک را بررسی کنید.'
                    : 'Failed to dispatch SMS verification code.';
            }
        }

        return locale === 'fa'
            ? 'خطا در برقراری ارتباط امن با هسته مرکزی آتریانا.'
            : 'Secure communication error with ATRIANA core.';
    };

    const handleLoginSubmit = async (identifier: string, password: string): Promise<void> => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await prmAdminGateLogin(gateSlug, identifier, password);

            setPrmSavedIdentifier(identifier);
            setPrmSavedPassword(password);
            setPrmChallengeToken(response.challenge_token);
            setPrmMaskedMobile(response.masked_mobile);
            setPrmOtpExpiresIn(response.expires_in);
            setPrmStep('otp');
        } catch (error) {
            setErrorMessage(prmResolveErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtpSubmit = async (otpCode: string): Promise<void> => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await prmAdminGateVerifyOtp(gateSlug, prmChallengeToken, otpCode);

            window.localStorage.setItem('prm_admin_token', response.token);
            window.localStorage.setItem('prm_admin_user', JSON.stringify(response.admin));

            router.replace(`/${locale}/admin/dashboard`);
        } catch (error) {
            setErrorMessage(prmResolveErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async (): Promise<void> => {
        if (!prmSavedIdentifier || !prmSavedPassword) {
            setPrmStep('credentials');
            return;
        }
        await handleLoginSubmit(prmSavedIdentifier, prmSavedPassword);
    };

    const handleBackToCredentials = (): void => {
        setErrorMessage(null);
        setPrmChallengeToken('');
        setPrmStep('credentials');
    };

    return (
        <PrmAdminGateCard>
            {prmStep === 'credentials' ? (
                <PrmAdminGateForm
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    onSubmit={handleLoginSubmit}
                />
            ) : (
                <PrmAdminGateOtpForm
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    maskedMobile={prmMaskedMobile}
                    initialExpiresIn={prmOtpExpiresIn}
                    onVerifyOtp={handleVerifyOtpSubmit}
                    onResendOtp={handleResendOtp}
                    onBackToCredentials={handleBackToCredentials}
                />
            )}
        </PrmAdminGateCard>
    );
}
