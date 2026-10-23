'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PrmAdminGateCard } from '@/components/prm-admin/prm-admin-gate-card/prm-admin-gate-card';
import { PrmAdminGateForm } from '@/components/prm-admin/prm-admin-gate-form/prm-admin-gate-form';
import { prmAdminGateLogin, PrmAdminApiError } from '@/lib/prm-admin/prm-admin-api';

export default function PrmAdminGateEntryPage() {
    const params = useParams();
    const router = useRouter();
    const gateSlug = typeof params.gate_slug === 'string' ? params.gate_slug : '';
    const locale = typeof params.locale === 'string' ? params.locale : 'fa';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLoginSubmit = async (identifier: string, password: string): Promise<void> => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await prmAdminGateLogin(gateSlug, identifier, password);

            window.localStorage.setItem('prm_admin_token', response.token);
            window.localStorage.setItem('prm_admin_user', JSON.stringify(response.admin));

            router.replace(`/${locale}/admin/dashboard`);
        } catch (error) {
            if (error instanceof PrmAdminApiError) {
                if (error.prmCode === 'prm_admin_gate_not_found' || error.prmStatusCode === 404) {
                    setErrorMessage(
                        locale === 'fa'
                            ? 'کلید گیت نامعتبر یا منقضی شده است.'
                            : 'Invalid or expired gate slug.',
                    );
                } else if (error.prmCode === 'prm_admin_invalid_credentials' || error.prmStatusCode === 401) {
                    setErrorMessage(
                        locale === 'fa'
                            ? 'شناسه یا رمز عبور اشتباه است.'
                            : 'Invalid login credentials.',
                    );
                } else if (error.prmCode === 'prm_admin_account_disabled' || error.prmStatusCode === 403) {
                    setErrorMessage(
                        locale === 'fa'
                            ? 'حساب کاربری شما غیرفعال شده است.'
                            : 'Admin account has been disabled.',
                    );
                } else if (error.prmCode === 'prm_admin_login_rate_limited' || error.prmStatusCode === 429) {
                    setErrorMessage(
                        locale === 'fa'
                            ? 'تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفا بعدا تلاش کنید.'
                            : 'Too many attempts. Please try again later.',
                    );
                } else {
                    setErrorMessage(
                        locale === 'fa'
                            ? 'خطا در برقراری ارتباط با هسته مرکزی رخ داد.'
                            : 'Authentication failed. Internal server error.',
                    );
                }
            } else {
                setErrorMessage(
                    locale === 'fa'
                        ? 'خطای ناشناخته در ارتباط با سرور رخ داده است.'
                        : 'An unknown communication error occurred.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PrmAdminGateCard>
            <PrmAdminGateForm
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
                onSubmit={handleLoginSubmit}
            />
        </PrmAdminGateCard>
    );
}
