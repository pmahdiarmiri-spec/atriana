import React from 'react';
import { PrmAdminCompaniesContainer } from '@/components/prm-admin/companies/prm-admin-companies-container';

interface PrmAdminCompaniesPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function PrmAdminCompaniesPage({ params }: PrmAdminCompaniesPageProps) {
    const { locale } = await params;

    return <PrmAdminCompaniesContainer locale={locale} />;
}
