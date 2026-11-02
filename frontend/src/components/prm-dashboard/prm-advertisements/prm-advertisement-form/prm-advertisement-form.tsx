"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent, ReactNode } from "react";
import { PrmSearchableSelect } from "@/components/layout/prm-searchable-select";
import {
    PrmAdvertisementPayload,
    PrmAdNature,
    PrmAdOrigin,
    PrmAdPriceType,
    PrmAdType,
} from "@/lib/prm-advertisements/prm-advertisements-api";
import {
    prmGoodsCategoriesFa,
    prmServicesCategoriesFa,
} from "@/lib/prm-advertisements/prm-advertisements-data";

interface PrmAdvertisementFormProps {
    hasCompany: boolean;
    companyName?: string | null;
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: (payload: PrmAdvertisementPayload) => Promise<void>;
    onGoToCompany: () => void;
}

interface PrmChoiceOption {
    value: string;
    label: string;
    description?: string;
}

interface PrmChoiceGroupProps {
    label: string;
    value: string;
    options: PrmChoiceOption[];
    onChange: (value: string) => void;
}

function PrmChoiceGroup({
    label,
    value,
    options,
    onChange,
}: PrmChoiceGroupProps): ReactNode {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3
                style={{
                    color: "#cbd5e1",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    margin: 0,
                }}
            >
                {label}
            </h3>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                    gap: "10px",
                }}
            >
                {options.map((option) => {
                    const selected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            style={{
                                background: selected
                                    ? "rgba(245, 158, 11, 0.08)"
                                    : "rgba(15, 23, 42, 0.4)",
                                border: selected
                                    ? "1px solid rgba(245, 158, 11, 0.5)"
                                    : "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "12px",
                                color: "#ffffff",
                                cursor: "pointer",
                                padding: "0.75rem 1rem",
                                textAlign: "center",
                                transition: "all 0.2s ease",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.15rem",
                                boxSizing: "border-box",
                                boxShadow: selected
                                    ? "0 2px 10px rgba(245, 158, 11, 0.08)"
                                    : "none",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    color: selected ? "#fcd34d" : "#ffffff",
                                }}
                            >
                                {option.label}
                            </span>
                            {option.description && (
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        color: selected ? "#cbd5e1" : "#94a3b8",
                                    }}
                                >
                                    {option.description}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function PrmAdvertisementForm({
    hasCompany,
    companyName,
    isSubmitting,
    onCancel,
    onSubmit,
    onGoToCompany,
}: PrmAdvertisementFormProps): ReactNode {
    const [prmStep, setPrmStep] = useState<number>(0);
    const [prmNature, setPrmNature] = useState<PrmAdNature>("goods");
    const [prmType, setPrmType] = useState<PrmAdType>("offer");
    const [prmOrigin, setPrmOrigin] = useState<PrmAdOrigin>("domestic");
    const [prmPriceType, setPrmPriceType] = useState<PrmAdPriceType>("fixed");

    const [prmCategory, setPrmCategory] = useState<string>(prmGoodsCategoriesFa[0]);
    const [prmSubCategory, setPrmSubCategory] = useState<string>("");
    const [prmTitle, setPrmTitle] = useState<string>("");
    const [prmTitleEn, setPrmTitleEn] = useState<string>("");
    const [prmProvince, setPrmProvince] = useState<string>("");
    const [prmCity, setPrmCity] = useState<string>("");
    const [prmAddress, setPrmAddress] = useState<string>("");
    const [prmDescription, setPrmDescription] = useState<string>("");
    const [prmDescriptionEn, setPrmDescriptionEn] = useState<string>("");
    const [prmPrice, setPrmPrice] = useState<string>("");
    const [prmCurrency, setPrmCurrency] = useState<string>("toman");
    const [prmMoq, setPrmMoq] = useState<string>("");
    const [prmMoqUnit, setPrmMoqUnit] = useState<string>("");
    const [prmDeliveryTime, setPrmDeliveryTime] = useState<string>("");
    const [prmDeliveryType, setPrmDeliveryType] = useState<string>("");
    const [prmPaymentTerms, setPrmPaymentTerms] = useState<string>("");
    const [prmQualityGrade, setPrmQualityGrade] = useState<string>("");
    const [prmVideoLink, setPrmVideoLink] = useState<string>("");
    const [prmPhone, setPrmPhone] = useState<string>("");
    const [prmShowPhone, setPrmShowPhone] = useState<boolean>(true);
    const [prmUseCompanyProfile, setPrmUseCompanyProfile] = useState<boolean>(hasCompany);
    const [prmImages, setPrmImages] = useState<File[]>([]);
    const [prmImagePreviews, setPrmImagePreviews] = useState<string[]>([]);
    const [prmPrimaryImageIndex, setPrmPrimaryImageIndex] = useState<number>(0);
    const [prmError, setPrmError] = useState<string>("");

    useEffect(() => {
        setPrmUseCompanyProfile(hasCompany);
    }, [hasCompany]);

    useEffect(() => {
        setPrmCategory(
            prmNature === "goods"
                ? prmGoodsCategoriesFa[0]
                : prmServicesCategoriesFa[0],
        );
    }, [prmNature]);

    useEffect(() => {
        const previewUrls = prmImages.map((file) => URL.createObjectURL(file));
        setPrmImagePreviews(previewUrls);

        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [prmImages]);

    const prmCategoriesList =
        prmNature === "goods" ? prmGoodsCategoriesFa : prmServicesCategoriesFa;

    const prmStepTitles = [
        "دسته‌بندی",
        "جزئیات",
        "موقعیت",
        "تصاویر",
    ];

    const prmHandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPrmError("");

        if (prmStep < 3) {
            setPrmStep((currentStep) => currentStep + 1);
            return;
        }

        if (!prmTitle.trim()) {
            setPrmError("لطفاً عنوان آگهی را وارد کنید.");
            setPrmStep(1);
            return;
        }

        if (prmDescription.trim().length < 10) {
            setPrmError("توضیحات آگهی باید حداقل ۱۰ نویسه باشد.");
            setPrmStep(1);
            return;
        }

        if (prmUseCompanyProfile && !hasCompany) {
            setPrmError("برای استفاده از پروفایل شرکتی، ابتدا باید شرکت خود را ثبت کنید.");
            return;
        }

        const payload: PrmAdvertisementPayload = {
            nature: prmNature,
            type: prmType,
            origin: prmOrigin,
            price_type: prmPriceType,
            category: prmCategory,
            sub_category: prmSubCategory.trim() || undefined,
            title: prmTitle.trim(),
            title_en: prmTitleEn.trim() || undefined,
            province: prmProvince.trim() || undefined,
            city: prmCity.trim() || undefined,
            address: prmAddress.trim() || undefined,
            description: prmDescription.trim(),
            description_en: prmDescriptionEn.trim() || undefined,
            price: prmPrice ? Number(prmPrice) : null,
            currency: prmCurrency,
            moq: prmMoq ? Number(prmMoq) : null,
            moq_unit: prmMoqUnit.trim() || undefined,
            delivery_time: prmDeliveryTime.trim() || undefined,
            delivery_type: prmDeliveryType.trim() || undefined,
            payment_terms: prmPaymentTerms.trim() || undefined,
            quality_grade: prmQualityGrade.trim() || undefined,
            video_link: prmVideoLink.trim() || undefined,
            phone: prmPhone.trim() || undefined,
            show_phone: prmShowPhone,
            use_company_profile: prmUseCompanyProfile,
            images: prmImages,
            primary_image_index: prmImages.length > 0 ? prmPrimaryImageIndex : undefined,
        };

        try {
            await onSubmit(payload);
        } catch (error: unknown) {
            const apiError = error as {
                response?: {
                    data?: {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                };
            };

            const validationMessage = apiError.response?.data?.errors
                ? Object.values(apiError.response.data.errors).flat()[0]
                : undefined;

            setPrmError(
                validationMessage ||
                    apiError.response?.data?.message ||
                    "خطا در ثبت آگهی رخ داده است.",
            );
        }
    };

    const prmHandleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        event.target.value = "";

        if (selectedFiles.length === 0) {
            return;
        }

        if (prmImages.length + selectedFiles.length > 10) {
            setPrmError("برای هر آگهی حداکثر ۱۰ تصویر می‌توانید انتخاب کنید.");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (selectedFiles.some((file) => !allowedTypes.includes(file.type))) {
            setPrmError("فرمت مجاز تصاویر فقط JPG، PNG و WebP است.");
            return;
        }

        if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
            setPrmError("حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد.");
            return;
        }

        setPrmError("");
        setPrmImages((current) => [...current, ...selectedFiles]);
    };

    const prmHandleRemoveImage = (index: number) => {
        setPrmImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
        setPrmPrimaryImageIndex((current) => {
            if (current === index) {
                return 0;
            }

            return current > index ? current - 1 : current;
        });
    };

    const prmFieldGridStyle: CSSProperties = {
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
    };

    return (
        <form
            className="prm-ads-form-card"
            onSubmit={prmHandleSubmit}
            noValidate
        >
            <div
                className="prm-ads-stepper"
                style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    marginBottom: 20,
                }}
            >
                {prmStepTitles.map((title, index) => {
                    const isActive = index === prmStep;
                    const isComplete = index < prmStep;

                    return (
                        <div
                            key={title}
                            className={`prm-ads-step${isActive ? " prm-ads-step-active" : ""}${isComplete ? " prm-ads-step-complete" : ""}`}
                            style={{
                                borderBottom: isActive || isComplete
                                    ? "3px solid var(--prm-secondary-color, #f59e0b)"
                                    : "3px solid rgba(100, 116, 139, 0.2)",
                                color: isActive
                                    ? "#ffffff"
                                    : "#94a3b8",
                                padding: "0 4px 8px",
                                textAlign: "center",
                            }}
                        >
                            <strong style={{ fontSize: 13 }}>{title}</strong>
                        </div>
                    );
                })}
            </div>

            {prmError && (
                <div className="prm-form-error" role="alert">
                    {prmError}
                </div>
            )}

            {prmStep === 0 && (
                <section className="prm-ads-step-panel" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <PrmChoiceGroup
                        label="1. نوع درخواست"
                        value={prmType}
                        onChange={(value) => setPrmType(value as PrmAdType)}
                        options={[
                            {
                                value: "offer",
                                label: "عرضه",
                                description: "ارائه دهم",
                            },
                            {
                                value: "demand",
                                label: "تقاضا",
                                description: "نیاز دارم",
                            },
                        ]}
                    />

                    <PrmChoiceGroup
                        label="2. مبدأ یا مقصد"
                        value={prmOrigin}
                        onChange={(value) => setPrmOrigin(value as PrmAdOrigin)}
                        options={[
                            {
                                value: "domestic",
                                label: "داخلی",
                                description: "بازار ایران",
                            },
                            {
                                value: "export",
                                label: "صادراتی",
                                description: "خارج از کشور",
                            },
                            {
                                value: "import",
                                label: "وارداتی",
                                description: "بین‌الملل",
                            },
                        ]}
                    />

                    <PrmChoiceGroup
                        label="3. ماهیت آگهی"
                        value={prmNature}
                        onChange={(value) => setPrmNature(value as PrmAdNature)}
                        options={[
                            {
                                value: "goods",
                                label: "کالا و محصولات",
                                description: "محصول فیزیکی",
                            },
                            {
                                value: "services",
                                label: "خدمات بازرگانی و تجاری",
                                description: "ارائه سرویس",
                            },
                        ]}
                    />

                    <div className="prm-form-field" style={{ marginTop: "4px" }}>
                        <label htmlFor="prm-ad-category">دسته‌بندی دقیق *</label>
                        <PrmSearchableSelect
                            id="prm-ad-category"
                            label="دسته‌بندی دقیق"
                            value={prmCategory}
                            onChange={setPrmCategory}
                            options={prmCategoriesList.map((category) => ({
                                value: category,
                                label: category,
                            }))}
                        />
                    </div>
                </section>
            )}

            {prmStep === 1 && (
                <section className="prm-ads-step-panel">
                    <div className="prm-form-grid" style={prmFieldGridStyle}>
                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-title">عنوان آگهی (فارسی) *</label>
                            <input
                                id="prm-ad-title"
                                type="text"
                                className="prm-form-input"
                                placeholder="عنوان دقیق کالا یا خدمات را وارد کنید"
                                value={prmTitle}
                                onChange={(event) => setPrmTitle(event.target.value)}
                                required
                            />
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-title-en">عنوان انگلیسی (اختیاری)</label>
                            <input
                                id="prm-ad-title-en"
                                type="text"
                                className="prm-form-input"
                                placeholder="English Title"
                                value={prmTitleEn}
                                onChange={(event) => setPrmTitleEn(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-price-type">نوع قیمت</label>
                            <PrmSearchableSelect
                                id="prm-ad-price-type"
                                label="نوع قیمت"
                                value={prmPriceType}
                                onChange={(selectedValue) =>
                                    setPrmPriceType(selectedValue as PrmAdPriceType)
                                }
                                options={[
                                    { value: "fixed", label: "قیمت مقطوع" },
                                    { value: "agreement", label: "توافقی" },
                                    { value: "call", label: "استعلام تلفنی" },
                                ]}
                            />
                        </div>

                        {prmPriceType === "fixed" && (
                            <>
                                <div className="prm-form-field">
                                    <label htmlFor="prm-ad-price">مبلغ</label>
                                    <input
                                        id="prm-ad-price"
                                        type="number"
                                        min="0"
                                        className="prm-form-input"
                                        placeholder="مبلغ بر اساس واحد ارزی"
                                        value={prmPrice}
                                        onChange={(event) => setPrmPrice(event.target.value)}
                                    />
                                </div>

                                <div className="prm-form-field">
                                    <label htmlFor="prm-ad-currency">ارز</label>
                                    <PrmSearchableSelect
                                        id="prm-ad-currency"
                                        label="ارز"
                                        value={prmCurrency}
                                        onChange={setPrmCurrency}
                                        options={[
                                            { value: "toman", label: "تومان" },
                                            { value: "irr", label: "ریال" },
                                            { value: "usd", label: "دلار (USD)" },
                                            { value: "eur", label: "یورو (EUR)" },
                                            { value: "aed", label: "درهم (AED)" },
                                        ]}
                                    />
                                </div>
                            </>
                        )}

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-moq">حداقل سفارش (MOQ)</label>
                            <input
                                id="prm-ad-moq"
                                type="number"
                                min="0"
                                className="prm-form-input"
                                placeholder="مثال: 100"
                                value={prmMoq}
                                onChange={(event) => setPrmMoq(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-moq-unit">واحد حداقل سفارش</label>
                            <input
                                id="prm-ad-moq-unit"
                                type="text"
                                className="prm-form-input"
                                placeholder="تن، کیلوگرم، عدد، پالت"
                                value={prmMoqUnit}
                                onChange={(event) => setPrmMoqUnit(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-description">توضیحات و مشخصات کامل آگهی (فارسی) *</label>
                            <textarea
                                id="prm-ad-description"
                                className="prm-form-textarea"
                                placeholder="توضیحات فنی، مشخصات محصول و شرایط همکاری را وارد کنید."
                                value={prmDescription}
                                onChange={(event) => setPrmDescription(event.target.value)}
                                required
                            />
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-description-en">توضیحات آگهی به انگلیسی (اختیاری)</label>
                            <textarea
                                id="prm-ad-description-en"
                                className="prm-form-textarea"
                                placeholder="Detailed English description and specifications"
                                value={prmDescriptionEn}
                                onChange={(event) => setPrmDescriptionEn(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-quality">درجهٔ کیفی</label>
                            <input
                                id="prm-ad-quality"
                                type="text"
                                className="prm-form-input"
                                placeholder="Grade A، صادراتی، درجه یک"
                                value={prmQualityGrade}
                                onChange={(event) => setPrmQualityGrade(event.target.value)}
                            />
                        </div>
                    </div>
                </section>
            )}

            {prmStep === 2 && (
                <section className="prm-ads-step-panel">
                    <div className="prm-form-grid" style={prmFieldGridStyle}>
                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-delivery-time">مدت زمان تحویل</label>
                            <input
                                id="prm-ad-delivery-time"
                                type="text"
                                className="prm-form-input"
                                placeholder="مثال: ۳ الی ۵ روز کاری"
                                value={prmDeliveryTime}
                                onChange={(event) => setPrmDeliveryTime(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-delivery-type">شرایط تحویل / حمل</label>
                            <input
                                id="prm-ad-delivery-type"
                                type="text"
                                className="prm-form-input"
                                placeholder="مثال: درب کارخانه (EXW) یا FOB"
                                value={prmDeliveryType}
                                onChange={(event) => setPrmDeliveryType(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-payment-terms">شرایط پرداخت</label>
                            <input
                                id="prm-ad-payment-terms"
                                type="text"
                                className="prm-form-input"
                                placeholder="مثال: نقدی، اعتبار اسنادی (LC)"
                                value={prmPaymentTerms}
                                onChange={(event) => setPrmPaymentTerms(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-province">استان</label>
                            <input
                                id="prm-ad-province"
                                type="text"
                                className="prm-form-input"
                                placeholder="مثال: خراسان رضوی"
                                value={prmProvince}
                                onChange={(event) => setPrmProvince(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-city">شهر</label>
                            <input
                                id="prm-ad-city"
                                type="text"
                                className="prm-form-input"
                                placeholder="مثال: مشهد"
                                value={prmCity}
                                onChange={(event) => setPrmCity(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field">
                            <label htmlFor="prm-ad-phone">شماره تماس برای این آگهی</label>
                            <input
                                id="prm-ad-phone"
                                type="text"
                                className="prm-form-input"
                                placeholder="0912..."
                                value={prmPhone}
                                onChange={(event) => setPrmPhone(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-address">آدرس دقیق (اختیاری)</label>
                            <input
                                id="prm-ad-address"
                                type="text"
                                className="prm-form-input"
                                placeholder="خیابان، شهرک صنعتی، پلاک"
                                value={prmAddress}
                                onChange={(event) => setPrmAddress(event.target.value)}
                            />
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-video">لینک ویدیو معرفی کالا یا خدمت</label>
                            <input
                                id="prm-ad-video"
                                type="url"
                                className="prm-form-input"
                                placeholder="لینک آپارات یا یوتیوب"
                                value={prmVideoLink}
                                onChange={(event) => setPrmVideoLink(event.target.value)}
                            />
                        </div>
                    </div>
                </section>
            )}

            {prmStep === 3 && (
                <section className="prm-ads-step-panel">
                    <div className="prm-form-grid" style={prmFieldGridStyle}>
                        <div className="prm-form-field prm-form-group-full">
                            <label htmlFor="prm-ad-images">تصاویر آگهی؛ حداکثر ۱۰ تصویر، هرکدام تا ۵ مگابایت</label>
                            <input
                                id="prm-ad-images"
                                type="file"
                                className="prm-form-input"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={prmHandleImageChange}
                            />
                            <p className="prm-ad-upload-hint">
                                می‌توانید چند تصویر انتخاب کنید؛ سپس روی «انتخاب به‌عنوان تصویر اصلی» بزنید.
                            </p>
                            {prmImagePreviews.length > 0 && (
                                <div className="prm-ad-upload-grid">
                                    {prmImagePreviews.map((url, index) => (
                                        <div key={url} className="prm-ad-upload-item">
                                            <img src={url} alt={`پیش‌نمایش تصویر ${index + 1}`} />
                                            <div className="prm-ad-upload-item-actions">
                                                <button
                                                    type="button"
                                                    className="prm-btn-secondary"
                                                    onClick={() => setPrmPrimaryImageIndex(index)}
                                                    aria-pressed={prmPrimaryImageIndex === index}
                                                >
                                                    {prmPrimaryImageIndex === index
                                                        ? "تصویر اصلی"
                                                        : "انتخاب به‌عنوان تصویر اصلی"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="prm-btn-secondary"
                                                    onClick={() => prmHandleRemoveImage(index)}
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <div className="prm-company-sync-box">
                                <label className="prm-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="prm-checkbox-input"
                                        checked={prmUseCompanyProfile}
                                        onChange={(event) =>
                                            setPrmUseCompanyProfile(event.target.checked)
                                        }
                                    />
                                    <span>نمایش این آگهی در پروفایل شرکت من</span>
                                </label>
                                <p className="prm-company-sync-desc">
                                    با فعال بودن این گزینه، اطلاعات شرکت شما برای اعتبارسنجی و نمایش آگهی استفاده می‌شود.
                                    {companyName ? ` شرکت: ${companyName}` : ""}
                                </p>
                                {!hasCompany && (
                                    <div className="prm-company-warning-box">
                                        <span>هنوز شرکتی برای حساب شما ثبت نشده است.</span>
                                        <button
                                            type="button"
                                            className="prm-btn-secondary"
                                            onClick={onGoToCompany}
                                        >
                                            ثبت اطلاعات شرکت
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prm-form-field prm-form-group-full">
                            <label className="prm-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="prm-checkbox-input"
                                    checked={prmShowPhone}
                                    onChange={(event) => setPrmShowPhone(event.target.checked)}
                                />
                                <span>نمایش شماره تماس در آگهی</span>
                            </label>
                        </div>
                    </div>
                </section>
            )}

            <div className="prm-form-actions" style={{ marginTop: 20 }}>
                <button
                    type="button"
                    className="prm-btn-secondary"
                    onClick={prmStep === 0 ? onCancel : () => setPrmStep((step) => step - 1)}
                    disabled={isSubmitting}
                >
                    {prmStep === 0 ? "انصراف" : "مرحلهٔ قبل"}
                </button>

                {prmStep < 3 ? (
                    <button
                        type="submit"
                        className="prm-btn-primary"
                        disabled={isSubmitting}
                    >
                        مرحلهٔ بعد
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="prm-btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "در حال ثبت آگهی..." : "ثبت و ارسال آگهی"}
                    </button>
                )}
            </div>
        </form>
    );
}
