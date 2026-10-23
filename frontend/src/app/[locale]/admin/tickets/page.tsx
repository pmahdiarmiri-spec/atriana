import React from 'react';
import { PrmAdminTicketManager } from '@/components/prm-admin/tickets/prm-admin-ticket-manager';

interface AdminTicketsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function AdminTicketsPage({ params }: AdminTicketsPageProps) {
    const { locale } = await params;

    return (
        <PrmAdminTicketManager
            locale={locale}
            isSuperAdminView={false}
        />
    );
}
