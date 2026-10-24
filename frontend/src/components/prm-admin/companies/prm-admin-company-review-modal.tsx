'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Building2, FileText, Image as ImageIcon } from 'lucide-react';
import { PrmCompanyAdminDetails, PrmCompanyStatusType } from '@/types/prm-companies/prm-company-admin';
import { PrmAdminCompanyGeneralTab } from './details/prm-admin-company-general-tab';
import { PrmAdminCompanyLegalTab } from './details/prm-admin-company-legal-tab';
import { PrmAdminCompanyMediaTab } from './details/prm-admin-company-media-tab';

interface PrmAdminCompanyReviewModalProps {
    locale: string;
    company: PrmCompanyAdminDetails;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (companyId: number, status: PrmCompanyStatusType, adminMessage: string) => Promise<void>;
}

export const PrmAdminCompanyReviewModal: React.FC<PrmAdminCompanyReviewModalProps> = ({
    locale,
    company,
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'legal' | 'media' | 'decision'>('general');
    const [selectedStatus, setSelectedStatus] = useState<PrmCompanyStatusType>(company.status);
    const [adminMessage, setAdminMessage] = useState(company.admin_message ?? '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await onSubmit(company.id, selectedStatus, adminMessage);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <div
                id="prm-company-review-modal"
                className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 text-slate-100 overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">
                                {locale === 'fa' ? 'پرونده جامع اطلاعات شرکت' : 'Company Dossier & Audit'}
                            </h2>
                            <p className="text-xs text-slate-400">{company.name_fa} {company.name_en ? `(${company.name_en})` : ''}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 shrink-0 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                            activeTab === 'general'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        <span>{locale === 'fa' ? 'اطلاعات عمومی و تماس' : 'General & Contact'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('legal')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                            activeTab === 'legal'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>{locale === 'fa' ? 'مشخصات ثبتی و حقوقی' : 'Registration & Legal'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                            activeTab === 'media'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>{locale === 'fa' ? 'مدارک، تصاویر و اسناد' : 'Documents & Media'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('decision')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                            activeTab === 'decision'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{locale === 'fa' ? 'تصمیم‌گیری و ابلاغ ادمین' : 'Admin Decision'}</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'general' && <PrmAdminCompanyGeneralTab locale={locale} company={company} />}
                    {activeTab === 'legal' && <PrmAdminCompanyLegalTab locale={locale} company={company} />}
                    {activeTab === 'media' && <PrmAdminCompanyMediaTab locale={locale} company={company} />}
                    {activeTab === 'decision' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">
                                    {locale === 'fa' ? 'تعیین وضعیت نهایی' : 'Set Final Status'}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus('approved')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                                            selectedStatus === 'approved'
                                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{locale === 'fa' ? 'تایید' : 'Approve'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus('needs_edit')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                                            selectedStatus === 'needs_edit'
                                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>{locale === 'fa' ? 'نیاز به اصلاح' : 'Needs Edit'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedStatus('rejected')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                                            selectedStatus === 'rejected'
                                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>{locale === 'fa' ? 'رد شرکت' : 'Reject'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-300">
                                    {locale === 'fa' ? 'پیام ادمین به شرکت (نمایش داده خواهد شد)' : 'Admin Message (Visible to Company)'}
                                </label>
                                <textarea
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 backdrop-blur-md"
                                    placeholder={locale === 'fa' ? 'متن ابلاغیه، دلایل رد یا نواقص پرونده جهت نمایش به کاربر...' : 'Feedback message, defects or rejection reasons...'}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    {locale === 'fa' ? 'انصراف' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? locale === 'fa' ? 'در حال ثبت...' : 'Submitting...'
                                        : locale === 'fa' ? 'ثبت و ابلاغ وضعیت' : 'Commit & Notify'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrmAdminCompanyReviewModal;
