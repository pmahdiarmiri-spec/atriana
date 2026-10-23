import React from 'react';
import { PrmAdminTicketManager } from '@/components/prm-admin/tickets/prm-admin-ticket-manager';

interface SuperAdminTicketsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function SuperAdminTicketsPage({ params }: SuperAdminTicketsPageProps) {
    const { locale } = await params;

    return (
        <PrmAdminTicketManager
            locale={locale}
            isSuperAdminView={true}
        />
    );
}
