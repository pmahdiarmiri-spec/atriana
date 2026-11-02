"use client";

import { ReactNode } from "react";
import { PrmAdvertisementItem } from "@/lib/prm-advertisements/prm-advertisements-api";
import { PrmAdvertisementStatus } from "../prm-advertisement-status/prm-advertisement-status";

interface PrmAdvertisementListProps {
    advertisements: PrmAdvertisementItem[];
    isLoading: boolean;
    onCreateClick: () => void;
    onDetailsClick: (advertisement: PrmAdvertisementItem) => void;
}

export function PrmAdvertisementList({
    advertisements,
    isLoading,
    onCreateClick,
    onDetailsClick,
}: PrmAdvertisementListProps): ReactNode {
    if (isLoading) {
        return (
            <div className="prm-ads-empty">
                <p>در حال بارگذاری آگهی‌ها...</p>
            </div>
        );
    }

    if (advertisements.length === 0) {
        return (
            <div className="prm-ads-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                </svg>
                <p>تاکنون آگهی ثبت نکرده‌اید. با دکمه زیر اولین آگهی خود را ثبت نمایید.</p>
                <button type="button" className="prm-btn-primary" onClick={onCreateClick}>
                    ثبت اولین آگهی
                </button>
            </div>
        );
    }

    return (
        <div className="prm-ads-list-grid">
            {advertisements.map((ad) => (
                <article key={ad.id} className="prm-ad-card prm-ad-card-gallery">
                    <div className="prm-ad-card-cover">
                        {ad.image_url ? (
                            <img src={ad.image_url} alt={`تصویر اصلی ${ad.title}`} loading="lazy" />
                        ) : (
                            <span className="prm-ad-card-placeholder">بدون تصویر</span>
                        )}
                        <PrmAdvertisementStatus status={ad.status} />
                    </div>
                    <div className="prm-ad-card-body">
                        <div className="prm-ad-card-head">
                            <h3>{ad.title}</h3>
                        </div>
                        <p className="prm-ad-desc">{ad.description}</p>
                        <div className="prm-ad-meta-row">
                            <span className="prm-ad-pill">{ad.nature === "goods" ? "کالا" : "خدمات"}</span>
                            <span className="prm-ad-pill">{ad.category}</span>
                            {ad.price_type === "fixed" && ad.price !== null ? (
                                <span className="prm-ad-pill">
                                    {Number(ad.price).toLocaleString("fa-IR")} {ad.currency === "toman" ? "تومان" : ad.currency}
                                </span>
                            ) : (
                                <span className="prm-ad-pill">
                                    {ad.price_type === "call" ? "استعلام تلفنی" : "توافقی"}
                                </span>
                            )}
                            {ad.use_company_profile && (
                                <span className="prm-ad-pill">پروفایل شرکتی</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="prm-btn-secondary prm-ad-details-button"
                            onClick={() => onDetailsClick(ad)}
                            aria-label={`مشاهده جزئیات آگهی ${ad.title}`}
                        >
                            مشاهده جزئیات
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}
