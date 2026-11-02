"use client";

import { ReactNode, useState } from "react";
import {
    PrmAdvertisementImage,
    PrmAdvertisementItem,
} from "@/lib/prm-advertisements/prm-advertisements-api";
import {
    PrmAdvertisementStatus,
    prmGetAdvertisementStatusDescription,
} from "../prm-advertisement-status/prm-advertisement-status";

interface PrmAdvertisementDetailProps {
    advertisement: PrmAdvertisementItem;
    onBack: () => void;
}

type PrmDetailField = [string, string | number | null | undefined];

function PrmDetailSection({
    title,
    fields,
}: {
    title: string;
    fields: PrmDetailField[];
}): ReactNode {
    const visibleFields = fields.filter(([, value]) => value !== null && value !== undefined && value !== "");

    if (visibleFields.length === 0) {
        return null;
    }

    return (
        <section className="prm-ad-detail-section">
            <h3>{title}</h3>
            <dl className="prm-ad-detail-fields">
                {visibleFields.map(([label, value]) => (
                    <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

export function PrmAdvertisementDetail({
    advertisement: ad,
    onBack,
}: PrmAdvertisementDetailProps): ReactNode {
    const [prmActiveImage, setPrmActiveImage] = useState<number>(0);

    const images: PrmAdvertisementImage[] = ad.images?.length
        ? [...ad.images].sort((first, second) => Number(second.is_primary) - Number(first.is_primary))
        : ad.image_url
            ? [{
                id: 0,
                path: ad.image_path ?? "",
                url: ad.image_url,
                position: 0,
                is_primary: true,
            }]
            : [];

    const currentImage = images[prmActiveImage] ?? images[0];
    const price = ad.price_type === "fixed" && ad.price !== null
        ? `${Number(ad.price).toLocaleString("fa-IR")} ${ad.currency === "toman" ? "تومان" : ad.currency}`
        : ad.price_type === "call" ? "استعلام تلفنی" : "توافقی";

    return (
        <article className="prm-ad-detail">
            <button type="button" className="prm-btn-secondary" onClick={onBack}>
                بازگشت به آگهی‌های من
            </button>

            <div className="prm-ad-detail-heading">
                <div>
                    <h2>{ad.title}</h2>
                    {ad.title_en && <p dir="ltr">{ad.title_en}</p>}
                </div>
                <PrmAdvertisementStatus status={ad.status} />
            </div>

            <div className={`prm-ad-detail-notice prm-ad-detail-notice-${ad.status}`}>
                <strong>وضعیت آگهی: </strong>
                {prmGetAdvertisementStatusDescription(ad.status)}
                {ad.admin_note && (
                    <p>
                        <strong>توضیح مدیر: </strong>
                        {ad.admin_note}
                    </p>
                )}
            </div>

            <div className="prm-ad-detail-gallery">
                <div className="prm-ad-detail-main-image">
                    {currentImage ? (
                        <img src={currentImage.url} alt={`تصویر ${ad.title}`} />
                    ) : (
                        <span>تصویری برای این آگهی ثبت نشده است.</span>
                    )}
                </div>
                {images.length > 1 && (
                    <div className="prm-ad-detail-thumbnails" aria-label="تصاویر آگهی">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                type="button"
                                className={`prm-ad-detail-thumbnail${index === prmActiveImage ? " prm-ad-detail-thumbnail-active" : ""}`}
                                onClick={() => setPrmActiveImage(index)}
                                aria-label={`نمایش تصویر ${index + 1}${image.is_primary ? "، تصویر اصلی" : ""}`}
                                aria-pressed={index === prmActiveImage}
                            >
                                <img src={image.url} alt="" loading="lazy" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <PrmDetailSection
                title="مشخصات آگهی"
                fields={[
                    ["نوع درخواست", ad.type === "offer" ? "عرضه" : "تقاضا"],
                    ["مبدأ یا مقصد", ad.origin === "domestic" ? "داخلی" : ad.origin === "export" ? "صادراتی" : "وارداتی"],
                    ["ماهیت", ad.nature === "goods" ? "کالا" : "خدمات"],
                    ["دسته‌بندی", ad.category],
                    ["زیردسته", ad.sub_category],
                    ["قیمت", price],
                    ["حداقل سفارش", ad.moq ? `${Number(ad.moq).toLocaleString("fa-IR")} ${ad.moq_unit ?? ""}` : null],
                    ["درجهٔ کیفی", ad.quality_grade],
                    ["تعداد بازدید", ad.views.toLocaleString("fa-IR")],
                    ["تاریخ ثبت", new Date(ad.created_at).toLocaleDateString("fa-IR")],
                ]}
            />

            <section className="prm-ad-detail-section">
                <h3>توضیحات</h3>
                <p className="prm-ad-detail-description">{ad.description}</p>
                {ad.description_en && (
                    <p className="prm-ad-detail-description" dir="ltr">{ad.description_en}</p>
                )}
            </section>

            <PrmDetailSection
                title="تحویل و موقعیت"
                fields={[
                    ["زمان تحویل", ad.delivery_time],
                    ["شرایط تحویل", ad.delivery_type],
                    ["شرایط پرداخت", ad.payment_terms],
                    ["استان", ad.province],
                    ["شهر", ad.city],
                    ["آدرس", ad.address],
                ]}
            />

            <PrmDetailSection
                title="اطلاعات تماس و شرکت"
                fields={[
                    ["نام شرکت", ad.company_name],
                    ["نوع کسب‌وکار", ad.business_type],
                    ["نوع فعالیت", ad.activity_type],
                    ["سابقه فعالیت", ad.experience],
                    ["مجوزها", ad.licenses],
                    ["شماره تماس", ad.phone],
                    ["نمایش عمومی شماره", ad.show_phone ? "فعال" : "غیرفعال"],
                    ["اتصال به پروفایل شرکت", ad.use_company_profile ? "فعال" : "غیرفعال"],
                ]}
            />

            <PrmDetailSection
                title="اطلاعات موقعیت شغلی"
                fields={[
                    ["نام مسئول", ad.hr_full_name],
                    ["کد ملی مسئول", ad.hr_national_code],
                    ["ایمیل مسئول", ad.hr_email],
                    ["عنوان شغلی", ad.hr_job_title],
                    ["جنسیت", ad.hr_gender],
                    ["تعداد نیرو", ad.hr_count],
                    ["بازه سنی", ad.hr_age_range],
                    ["حقوق", ad.hr_salary],
                    ["محدوده کار", ad.hr_work_area],
                    ["ساعت کاری", ad.hr_work_hours],
                    ["تحصیلات", ad.hr_education],
                    ["رشته تحصیلی", ad.hr_study_field],
                    ["مهارت‌ها", ad.hr_skills_desc],
                ]}
            />

            <PrmDetailSection
                title="اطلاعات متقاضی"
                fields={[
                    ["نام متقاضی", ad.applicant_full_name],
                    ["کد ملی متقاضی", ad.applicant_national_code],
                    ["تاریخ تولد", ad.applicant_birth_date],
                    ["تحصیلات", ad.applicant_education],
                    ["رشته تحصیلی", ad.applicant_study_field],
                    ["وضعیت تأهل", ad.applicant_marital_status],
                    ["وضعیت خدمت", ad.applicant_military_service],
                    ["نوع اشتغال", ad.applicant_employment_type],
                    ["شرکت‌های ترجیحی", ad.applicant_preferred_companies],
                    ["آدرس پستی", ad.applicant_postal_address],
                    ["موبایل", ad.applicant_mobile],
                    ["تلفن", ad.applicant_phone],
                    ["ایمیل", ad.applicant_email],
                    ["سوابق و مهارت‌ها", ad.applicant_skills_experience],
                ]}
            />

            {ad.video_link && /^https?:\/\//i.test(ad.video_link) && (
                <a
                    className="prm-btn-secondary prm-ad-detail-video"
                    href={ad.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    مشاهده ویدیو
                </a>
            )}
        </article>
    );
}
