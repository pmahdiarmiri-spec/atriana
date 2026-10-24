'use client';

import React from 'react';
import { PrmCompanyAdminDetails } from '@/types/prm-companies/prm-company-admin';
import { Mail, Phone, Globe, MapPin, Building, Calendar, Layers } from 'lucide-react';

interface PrmAdminCompanyGeneralTabProps {
    locale: string;
    company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyGeneralTab: React.FC<PrmAdminCompanyGeneralTabProps> = ({
    locale,
    company,
}) => {
    return (
        <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'نام فارسی' : 'Name (FA)'}</span>
                    <span className="text-white font-semibold">{company.name_fa || '-'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'نام انگلیسی' : 'Name (EN)'}</span>
                    <span className="text-white font-semibold">{company.name_en || '-'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'ایمیل شرکت' : 'Email'}</span>
                        <span className="text-slate-200 truncate block">{company.email || '-'}</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'تلفن ثابت / فکس' : 'Phone / Fax'}</span>
                        <span className="text-slate-200 truncate block">{company.phone || '-'} {company.fax ? `/ ${company.fax}` : ''}</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'وبسایت' : 'Website'}</span>
                        <span className="text-slate-200 truncate block">{company.website || '-'}</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'صنعت' : 'Industry'}</span>
                        <span className="text-slate-200 truncate block">{company.industry?.name_fa || '-'}</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'سال تاسیس' : 'Established'}</span>
                        <span className="text-slate-200 truncate block">{company.established_year || '-'}</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fa' ? 'تعداد پرسنل' : 'Employees'}</span>
                        <span className="text-slate-200 truncate block">{company.employee_count || '-'}</span>
                    </div>
                </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{locale === 'fa' ? 'نشانی و موقعیت جغرافیایی' : 'Address & Location'}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                    {company.country || ''} {company.province ? `- ${company.province}` : ''} {company.city ? `- ${company.city}` : ''} {company.address ? `- ${company.address}` : ''}
                </p>
                {company.postal_code && (
                    <span className="text-[11px] text-slate-400 block pt-1">
                        {locale === 'fa' ? 'کد پستی:' : 'Postal Code:'} {company.postal_code}
                    </span>
                )}
            </div>

            {company.description && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] text-slate-400 block">{locale === 'fa' ? 'شرح فعالیت و معرفی' : 'Description'}</span>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-line">{company.description}</p>
                </div>
            )}
        </div>
    );
};

export default PrmAdminCompanyGeneralTab;
