"use client";

import { ReactNode } from "react";
import { PrmAdvertisementItem } from "@/lib/prm-advertisements/prm-advertisements-api";

interface PrmAdvertisementListProps {
    advertisements: PrmAdvertisementItem[];
    isLoading: boolean;
    onCreateClick: () => void;
}

export function PrmAdvertisementList({
    advertisements,
    isLoading,
    onCreateClick,
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

    const prmGetStatusBadge = (status: PrmAdvertisementItem["status"]) => {
        switch (status) {
            case "approved":
                return <span className="prm-ad-badge prm-ad-badge-approved">تایید شده</span>;
            case "rejected":
                return <span className="prm-ad-badge prm-ad-badge-rejected">رد شده</span>;
            case "expired":
                return <span className="prm-ad-badge prm-ad-badge-expired">منقضی</span>;
            default:
                return <span className="prm-ad-badge prm-ad-badge-pending">در انتظار بررسی</span>;
        }
    };

    return (
        <div className="prm-ads-list-grid">
            {advertisements.map((ad) => (
                <div key={ad.id} className="prm-ad-card">
                    <div className="prm-ad-card-head">
                        <h3>{ad.title}</h3>
                        {prmGetStatusBadge(ad.status)}
                    </div>
                    <p className="prm-ad-desc">{ad.description}</p>
                    <div className="prm-ad-meta-row">
                        <span className="prm-ad-pill">{ad.nature === "goods" ? "کالا" : "خدمات"}</span>
                        <span className="prm-ad-pill">{ad.category}</span>
                        {ad.price ? (
                            <span className="prm-ad-pill">
                                {Number(ad.price).toLocaleString("fa-IR")} {ad.currency === "toman" ? "تومان" : ad.currency}
                            </span>
                        ) : (
                            <span className="prm-ad-pill">توافقی</span>
                        )}
                        {ad.use_company_profile && (
                            <span className="prm-ad-pill">پروفایل شرکتی</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
