'use client';

import React from 'react';
import { PrmCompanyAdminDetails } from '@/types/prm-companies/prm-company-admin';
import { FileText, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface PrmAdminCompanyMediaTabProps {
    locale: string;
    company: PrmCompanyAdminDetails;
}

export const PrmAdminCompanyMediaTab: React.FC<PrmAdminCompanyMediaTabProps> = ({
    locale,
    company,
}) => {
    return (
        <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <span className="text-[11px] text-slate-400 block font-medium">{locale === 'fa' ? 'لوگو شرکت' : 'Logo'}</span>
                    {company.logo_url ? (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center p-2">
                            <img src={company.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : (
                        <span className="text-slate-500">{locale === 'fa' ? 'ثبت نشده' : 'Not uploaded'}</span>
                    )}
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <span className="text-[11px] text-slate-400 block font-medium">{locale === 'fa' ? 'تصویر کاور' : 'Cover'}</span>
                    {company.cover_url ? (
                        <div className="w-full h-24 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                            <img src={company.cover_url} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <span className="text-slate-500">{locale === 'fa' ? 'ثبت نشده' : 'Not uploaded'}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <span>{locale === 'fa' ? 'کاتالوگ رسمی شرکت' : 'Official Catalog'}</span>
                    </div>
                    {company.catalog_file ? (
                        <a
                            href={company.catalog_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] transition-all"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{locale === 'fa' ? 'دانلود' : 'Download'}</span>
                        </a>
                    ) : (
                        <span className="text-slate-500">{locale === 'fa' ? 'ندارد' : 'None'}</span>
                    )}
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <span>{locale === 'fa' ? 'رزومه شرکت' : 'Company Resume'}</span>
                    </div>
                    {company.resume_file ? (
                        <a
                            href={company.resume_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] transition-all"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{locale === 'fa' ? 'دانلود' : 'Download'}</span>
                        </a>
                    ) : (
                        <span className="text-slate-500">{locale === 'fa' ? 'ندارد' : 'None'}</span>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>{locale === 'fa' ? 'مدارک و مجوزهای بارگذاری‌شده' : 'Uploaded Certs & Documents'}</span>
                </div>
                {company.cert_images && company.cert_images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {company.cert_images.map((certUrl, idx) => (
                            <a
                                key={idx}
                                href={certUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center hover:border-amber-500/50 transition-all"
                            >
                                <img src={certUrl} alt={`Cert ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <span className="text-slate-500">{locale === 'fa' ? 'مدرکی بارگذاری نشده است.' : 'No certificates uploaded.'}</span>
                )}
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>{locale === 'fa' ? 'گالری تصاویر محیط و محصولات' : 'Gallery Images'}</span>
                </div>
                {company.gallery_images && company.gallery_images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {company.gallery_images.map((imgUrl, idx) => (
                            <a
                                key={idx}
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center hover:border-amber-500/50 transition-all"
                            >
                                <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <span className="text-slate-500">{locale === 'fa' ? 'تصویری ثبت نشده است.' : 'No gallery images uploaded.'}</span>
                )}
            </div>
        </div>
    );
};

export default PrmAdminCompanyMediaTab;
