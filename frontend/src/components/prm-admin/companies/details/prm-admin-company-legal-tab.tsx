'use client';

import React from 'react';
import { PrmCompanyAdminDetails } from '@/types/prm-companies/prm-company-admin';
import { ShieldCheck, Check, X } from 'lucide-react';

interface PrmAdminCompanyLegalTabProps {
    locale: string;
    company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyLegalTab: React.FC<PrmAdminCompanyLegalTabProps> = ({
    locale,
    company,
}) => {
    const badges = [
        { label: locale === 'fa' ? 'دانش‌بنیان' : 'Knowledge Based', active: company.is_knowledge_based },
        { label: locale === 'fa' ? 'خلاق' : 'Creative', active: company.is_creative },
        { label: locale === 'fa' ? 'استارتاپ' : 'Startup', active: company.is_startup },
        { label: locale === 'fa' ? 'صادرکننده' : 'Exporter', active: company.is_exporter },
        { label: locale === 'fa' ? 'دارای ایزو' : 'Has ISO', active: company.has_iso },
        { label: locale === 'fa' ? 'EMC' : 'EMC', active: company.is_emc },
    ];

    return (
        <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'شناسه ملی' : 'National ID'}</span>
                    <span className="text-white font-mono font-bold text-sm tracking-wider">{company.national_id || '-'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'شماره ثبت' : 'Reg Number'}</span>
                    <span className="text-white font-mono font-bold text-sm tracking-wider">{company.registration_number || '-'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'کد اقتصادی' : 'Economic Code'}</span>
                    <span className="text-white font-mono font-bold text-sm tracking-wider">{company.economic_code || '-'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'ساختار حقوقی' : 'Legal Structure'}</span>
                    <span className="text-slate-200">{company.legal_structure || '-'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'نوع مالکیت' : 'Ownership Type'}</span>
                    <span className="text-slate-200">{company.ownership_type || '-'}</span>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>{locale === 'fa' ? 'صلاحیت‌ها و مجوزهای ویژه' : 'Special Qualifications & Badges'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {badges.map((badge, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] ${
                                badge.active
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                    : 'bg-white/[0.01] border-white/5 text-slate-500'
                            }`}
                        >
                            <span>{badge.label}</span>
                            {badge.active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                    ))}
                </div>
            </div>

            {company.certifications && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'گواهینامه‌ها و استانداردها' : 'Certifications'}</span>
                    <p className="text-slate-200 leading-relaxed">{company.certifications}</p>
                </div>
            )}
        </div>
    );
};

export default PrmAdminCompanyLegalTab;
