'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PrmAdminSidebar } from '../sidebar/prm-admin-sidebar';
import { PrmAdminHeader } from '../header/prm-admin-header';
import { PrmRole } from '@/types/prm-admin';

interface PrmAdminLayoutProps {
    children: React.ReactNode;
    locale: string;
}

interface StoredAdminUser {
    role?: unknown;
}

const isPrmRole = (role: unknown): role is PrmRole => {
    return role === 'super_admin' || role === 'admin';
};

export const PrmAdminLayout: React.FC<PrmAdminLayoutProps> = ({
    children,
    locale,
}) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userRole, setUserRole] = useState<PrmRole | null>(null);

    useEffect(() => {
        const token = window.localStorage.getItem('prm_admin_token');
        const storedUser = window.localStorage.getItem('prm_admin_user');

        if (!token || !storedUser) {
            router.replace(`/${locale}`);
            return;
        }

        try {
            const parsedUser: unknown = JSON.parse(storedUser);

            if (
                typeof parsedUser !== 'object' ||
                parsedUser === null ||
                !('role' in parsedUser)
            ) {
                throw new Error('Invalid admin user data');
            }

            const role = (parsedUser as StoredAdminUser).role;

            if (!isPrmRole(role)) {
                window.localStorage.removeItem('prm_admin_token');
                window.localStorage.removeItem('prm_admin_user');
                router.replace(`/${locale}`);
                return;
            }

            setUserRole(role);
            setIsAuthorized(true);
        } catch {
            window.localStorage.removeItem('prm_admin_token');
            window.localStorage.removeItem('prm_admin_user');
            router.replace(`/${locale}`);
        }
    }, [locale, router]);

    if (!isAuthorized || !userRole) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div
                    className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"
                    role="status"
                    aria-label={locale === 'fa' ? 'در حال بارگذاری' : 'Loading'}
                />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex"
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
        >
            <PrmAdminSidebar
                locale={locale}
                userRole={userRole}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <PrmAdminHeader
                    locale={locale}
                    userRole={userRole}
                />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PrmAdminLayout;
