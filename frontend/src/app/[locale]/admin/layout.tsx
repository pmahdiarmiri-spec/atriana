import React from 'react';
import { PrmAdminLayout } from '@/components/prm-admin/dashboard/layout/prm-admin-layout';

interface AdminRootLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
}

export default async function AdminRootLayout({
    children,
    params,
}: AdminRootLayoutProps) {
    const { locale } = await params;

    return (
        <PrmAdminLayout locale={locale}>
            {children}
        </PrmAdminLayout>
    );
}
