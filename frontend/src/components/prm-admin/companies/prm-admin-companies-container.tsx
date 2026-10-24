'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, RefreshCw, Building2 } from 'lucide-react';
import { PrmCompanyAdminDetails, PrmCompanyStatusType } from '@/types/prm-companies/prm-company-admin';
import { prmAdminGetCompanies, prmAdminReviewCompany, prmAdminGetCompany } from '@/lib/prm-admin/prm-admin-api';
import { PrmAdminCompaniesTable } from './prm-admin-companies-table';
import { PrmAdminCompanyReviewModal } from './prm-admin-company-review-modal';

interface PrmAdminCompaniesContainerProps {
    locale: string;
}

export const PrmAdminCompaniesContainer: React.FC<PrmAdminCompaniesContainerProps> = ({ locale }) => {
    const [companies, setCompanies] = useState<PrmCompanyAdminDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [page, setPage] = useState(1);
    const [activeCompany, setActiveCompany] = useState<PrmCompanyAdminDetails | null>(null);

    const loadCompanies = useCallback(async () => {
        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        try {
            setLoading(true);
            const res = await prmAdminGetCompanies(token, {
                search: searchTerm,
                status: selectedStatus,
                page,
            });
            setCompanies(res.data.data);
        } catch {
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedStatus, page]);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

    const handleOpenReview = async (item: PrmCompanyAdminDetails) => {
        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        try {
            const res = await prmAdminGetCompany(token, item.id);
            setActiveCompany(res.company);
        } catch {
            setActiveCompany(item);
        }
    };

    const handleReviewSubmit = async (
        companyId: number,
        status: PrmCompanyStatusType,
        adminMessage: string
    ) => {
        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        await prmAdminReviewCompany(token, companyId, {
            status,
            admin_message: adminMessage,
        });

        await loadCompanies();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-2xl backdrop-saturate-150">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white">
                            {locale === 'fa' ? 'مدیریت و تایید شرکت‌ها' : 'Companies Management'}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {locale === 'fa'
                                ? 'پایش، احراز هویت حقوقی و تغییر وضعیت شرکت‌های عضو سامانه'
                                : 'Monitor, authenticate and review registered company entities'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => loadCompanies()}
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                        title={locale === 'fa' ? 'بروزرسانی لیست' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 absolute top-3.5 start-3.5 text-slate-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={
                            locale === 'fa'
                                ? 'جستجو بر اساس نام شرکت، شناسه ملی، شماره ثبت، کد اقتصادی...'
                                : 'Search by name, national ID, reg number, economic code...'
                        }
                        className="w-full bg-slate-900/40 border border-white/10 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 backdrop-blur-md"
                    />
                </div>

                <div className="relative">
                    <Filter className="w-4 h-4 absolute top-3.5 start-3.5 text-slate-500" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-slate-900/40 border border-white/10 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 backdrop-blur-md appearance-none"
                    >
                        <option value="" className="bg-slate-900">{locale === 'fa' ? 'تمام وضعیت‌ها' : 'All Statuses'}</option>
                        <option value="pending" className="bg-slate-900">{locale === 'fa' ? 'در انتظار تایید' : 'Pending'}</option>
                        <option value="approved" className="bg-slate-900">{locale === 'fa' ? 'تایید شده' : 'Approved'}</option>
                        <option value="needs_edit" className="bg-slate-900">{locale === 'fa' ? 'نیازمند اصلاح' : 'Needs Edit'}</option>
                        <option value="rejected" className="bg-slate-900">{locale === 'fa' ? 'رد شده' : 'Rejected'}</option>
                    </select>
                </div>
            </div>

            <PrmAdminCompaniesTable
                locale={locale}
                companies={companies}
                onSelectReview={handleOpenReview}
            />

            {activeCompany && (
                <PrmAdminCompanyReviewModal
                    locale={locale}
                    company={activeCompany}
                    isOpen={!!activeCompany}
                    onClose={() => setActiveCompany(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
};

export default PrmAdminCompaniesContainer;
