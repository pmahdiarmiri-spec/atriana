"use client";

import { ReactNode, useEffect, useState } from "react";
import { PrmAdvertisementList } from "../prm-advertisement-list/prm-advertisement-list";
import { PrmAdvertisementDetail } from "../prm-advertisement-detail/prm-advertisement-detail";
import { PrmAdvertisementForm } from "../prm-advertisement-form/prm-advertisement-form";
import {
    PrmAdvertisementItem,
    PrmAdvertisementPayload,
    prmCreateAdvertisement,
    prmGetAdvertisementsMeta,
    prmGetMyAdvertisements,
} from "@/lib/prm-advertisements/prm-advertisements-api";
import "@/styles/dashboard/prm-advertisements.css";
import "@/styles/dashboard/prm-advertisements-gallery.css";

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
    const [prmSelectedAdId, setPrmSelectedAdId] = useState<number | null>(null);
    const [prmLoadError, setPrmLoadError] = useState<string>("");

    const prmFetchData = async () => {
        setPrmIsLoading(true);
        setPrmLoadError("");

        try {
            const [adsData, metaData] = await Promise.all([
                prmGetMyAdvertisements(token),
                prmGetAdvertisementsMeta(token),
            ]);

            setPrmAds(adsData);
            setPrmHasCompany(metaData.has_company);
            setPrmCompanyName(metaData.company?.name_fa || metaData.company?.name_en || null);
        } catch {
            setPrmLoadError("دریافت آگهی‌ها با مشکل مواجه شد. دوباره تلاش کنید.");
        } finally {
            setPrmIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            void prmFetchData();
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

    const prmSelectedAd = prmAds.find((ad) => ad.id === prmSelectedAdId) ?? null;

    return (
        <div className="prm-ads-container">
            <div className="prm-ads-header">
                <div className="prm-ads-header-info">
                    <h2>آگهی‌های بازرگانی</h2>
                    <p>مدیریت و ثبت آگهی‌های عرضه و تقاضای کالا و خدمات با قابلیت اتصال به پروفایل شرکتی</p>
                </div>
                <div className="prm-ads-actions">
                    {!prmShowForm && !prmSelectedAd ? (
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
                            onClick={() => {
                                setPrmShowForm(false);
                                setPrmSelectedAdId(null);
                            }}
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
            ) : prmSelectedAd ? (
                <PrmAdvertisementDetail
                    key={prmSelectedAd.id}
                    advertisement={prmSelectedAd}
                    onBack={() => setPrmSelectedAdId(null)}
                />
            ) : prmLoadError ? (
                <div className="prm-ads-empty" role="alert">
                    <p>{prmLoadError}</p>
                    <button type="button" className="prm-btn-secondary" onClick={() => void prmFetchData()}>
                        تلاش دوباره
                    </button>
                </div>
            ) : (
                <PrmAdvertisementList
                    advertisements={prmAds}
                    isLoading={prmIsLoading}
                    onCreateClick={() => setPrmShowForm(true)}
                    onDetailsClick={(ad) => setPrmSelectedAdId(ad.id)}
                />
            )}
        </div>
    );
}
