"use client";

import { ReactNode, useEffect, useState } from "react";
import { PrmAdvertisementList } from "../prm-advertisement-list/prm-advertisement-list";
import { PrmAdvertisementForm } from "../prm-advertisement-form/prm-advertisement-form";
import {
    PrmAdvertisementItem,
    PrmAdvertisementPayload,
    prmCreateAdvertisement,
    prmGetAdvertisementsMeta,
    prmGetMyAdvertisements,
} from "@/lib/prm-advertisements/prm-advertisements-api";
import "@/styles/dashboard/prm-advertisements.css";

interface PrmAdvertisementsViewProps {
    token: string;
    onGoToCompany: () => void;
}

export function PrmAdvertisementsView({
    token,
    onGoToCompany,
}: PrmAdvertisementsViewProps): ReactNode {
    const [prmAds, setPrmAds] = useState<PrmAdvertisementItem[]>([]);
    const [prmIsLoading, setPrmIsLoading] = useState<boolean>(true);
    const [prmShowForm, setPrmShowForm] = useState<boolean>(false);
    const [prmIsSubmitting, setPrmIsSubmitting] = useState<boolean>(false);
    const [prmHasCompany, setPrmHasCompany] = useState<boolean>(false);
    const [prmCompanyName, setPrmCompanyName] = useState<string | null>(null);

    const prmFetchData = async () => {
        setPrmIsLoading(true);
        try {
            const [adsData, metaData] = await Promise.all([
                prmGetMyAdvertisements(token),
                prmGetAdvertisementsMeta(token),
            ]);
            setPrmAds(adsData);
            setPrmHasCompany(metaData.has_company);
            setPrmCompanyName(metaData.company?.name_fa || metaData.company?.name_en || null);
        } catch {
        } finally {
            setPrmIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            prmFetchData();
        }
    }, [token]);

    const prmHandleCreateSubmit = async (payload: PrmAdvertisementPayload) => {
        setPrmIsSubmitting(true);
        try {
            await prmCreateAdvertisement(token, payload);
            setPrmShowForm(false);
            await prmFetchData();
        } finally {
            setPrmIsSubmitting(false);
        }
    };

    return (
        <div className="prm-ads-container">
            <div className="prm-ads-header">
                <div className="prm-ads-header-info">
                    <h2>آگهی‌های بازرگانی</h2>
                    <p>مدیریت و ثبت آگهی‌های عرضه و تقاضای کالا و خدمات با قابلیت اتصال به پروفایل شرکتی</p>
                </div>
                <div className="prm-ads-actions">
                    {!prmShowForm ? (
                        <button
                            type="button"
                            className="prm-btn-primary"
                            onClick={() => setPrmShowForm(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            <span>ثبت آگهی جدید</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="prm-btn-secondary"
                            onClick={() => setPrmShowForm(false)}
                        >
                            <span>مشاهده آگهی‌های من</span>
                        </button>
                    )}
                </div>
            </div>

            {prmShowForm ? (
                <PrmAdvertisementForm
                    hasCompany={prmHasCompany}
                    companyName={prmCompanyName}
                    isSubmitting={prmIsSubmitting}
                    onCancel={() => setPrmShowForm(false)}
                    onSubmit={prmHandleCreateSubmit}
                    onGoToCompany={onGoToCompany}
                />
            ) : (
                <PrmAdvertisementList
                    advertisements={prmAds}
                    isLoading={prmIsLoading}
                    onCreateClick={() => setPrmShowForm(true)}
                />
            )}
        </div>
    );
}
