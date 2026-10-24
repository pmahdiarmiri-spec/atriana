"use client";

import { ReactNode, useState, useEffect } from "react";
import {
    PrmAdvertisementPayload,
    PrmAdNature,
    PrmAdType,
    PrmAdOrigin,
    PrmAdPriceType,
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

export function PrmAdvertisementForm({
    hasCompany,
    companyName,
    isSubmitting,
    onCancel,
    onSubmit,
    onGoToCompany,
}: PrmAdvertisementFormProps): ReactNode {
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

    const [prmError, setPrmError] = useState<string>("");

    useEffect(() => {
        if (prmNature === "goods") {
            setPrmCategory(prmGoodsCategoriesFa[0]);
        } else {
            setPrmCategory(prmServicesCategoriesFa[0]);
        }
    }, [prmNature]);

    const prmCategoriesList = prmNature === "goods" ? prmGoodsCategoriesFa : prmServicesCategoriesFa;

    const prmHandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPrmError("");

        if (!prmTitle.trim()) {
            setPrmError("لطفاً عنوان آگهی را وارد کنید.");
            return;
        }

        if (!prmDescription.trim()) {
            setPrmError("لطفاً توضیحات آگهی را وارد کنید.");
            return;
        }

        if (prmUseCompanyProfile && !hasCompany) {
            setPrmError("شما هنوز پروفایل شرکتی ثبت نکرده‌اید. ابتدا شرکت خود را ایجاد کنید یا تیک شرکتی را بردارید.");
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
        };

        try {
            await onSubmit(payload);
        } catch (err: any) {
            const msg = err.response?.data?.message || "خطا در ثبت آگهی رخ داده است.";
            setPrmError(msg);
        }
    };

    return (
        <form className="prm-ads-form-card" onSubmit={prmHandleSubmit}>
            {prmError && <div className="prm-form-error">{prmError}</div>}

            <div className="prm-company-sync-box">
                <label className="prm-checkbox-label">
                    <input
                        type="checkbox"
                        className="prm-checkbox-input"
                        checked={prmUseCompanyProfile}
                        onChange={(e) => setPrmUseCompanyProfile(e.target.checked)}
                    />
                    <span>نمایش این آگهی در پروفایل شرکت من</span>
                </label>
                <p className="prm-company-sync-desc">
                    با فعال بودن این گزینه، اطلاعات شرکت شما برای اعتبارسنجی و نمایش آگهی استفاده می‌شود و این آگهی در صفحه اختصاصی شرکت شما هم برای عموم نمایش داده خواهد شد. اگر مایل نیستید، این تیک را بردارید.
                </p>
                {!hasCompany && (
                    <div className="prm-company-warning-box">
                        <span>هنوز شرکتی برای حساب شما ثبت نشده است.</span>
                        <button type="button" className="prm-btn-secondary" onClick={onGoToCompany}>
                            ثبت اطلاعات شرکت
                        </button>
                    </div>
                )}
            </div>

            <div className="prm-form-grid">
                <div className="prm-form-field">
                    <label>ماهیت آگهی</label>
                    <select
                        className="prm-form-select"
                        value={prmNature}
                        onChange={(e) => setPrmNature(e.target.value as PrmAdNature)}
                    >
                        <option value="goods">کالا و محصولات</option>
                        <option value="services">خدمات بازرگانی و تجاری</option>
                    </select>
                </div>

                <div className="prm-form-field">
                    <label>نوع معامله</label>
                    <select
                        className="prm-form-select"
                        value={prmType}
                        onChange={(e) => setPrmType(e.target.value as PrmAdType)}
                    >
                        <option value="offer">عرضه (فروش / ارائه خدمات)</option>
                        <option value="demand">تقاضا (خرید / دریافت خدمات)</option>
                    </select>
                </div>

                <div className="prm-form-field">
                    <label>حوزه تجاری</label>
                    <select
                        className="prm-form-select"
                        value={prmOrigin}
                        onChange={(e) => setPrmOrigin(e.target.value as PrmAdOrigin)}
                    >
                        <option value="domestic">داخلی</option>
                        <option value="export">صادراتی</option>
                        <option value="import">وارداتی</option>
                    </select>
                </div>

                <div className="prm-form-field">
                    <label>دسته‌بندی اصلی</label>
                    <select
                        className="prm-form-select"
                        value={prmCategory}
                        onChange={(e) => setPrmCategory(e.target.value)}
                    >
                        {prmCategoriesList.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-form-field">
                    <label>زیر دسته (اختیاری)</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: کودهای ارگانیک، حمل دریایی فله"
                        value={prmSubCategory}
                        onChange={(e) => setPrmSubCategory(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>نوع قیمت</label>
                    <select
                        className="prm-form-select"
                        value={prmPriceType}
                        onChange={(e) => setPrmPriceType(e.target.value as PrmAdPriceType)}
                    >
                        <option value="fixed">قیمت مقطوع</option>
                        <option value="agreement">توافقی</option>
                        <option value="call">استعلام تلفنی</option>
                    </select>
                </div>

                <div className="prm-form-field prm-form-group-full">
                    <label>عنوان آگهی (فارسی) *</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="عنوان دقیق کالا یا خدمات خود را وارد نمایید"
                        value={prmTitle}
                        onChange={(e) => setPrmTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="prm-form-field prm-form-group-full">
                    <label>عنوان انگلیسی (اختیاری)</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="English Title"
                        value={prmTitleEn}
                        onChange={(e) => setPrmTitleEn(e.target.value)}
                    />
                </div>

                {prmPriceType === "fixed" && (
                    <>
                        <div className="prm-form-field">
                            <label>مبلغ</label>
                            <input
                                type="number"
                                className="prm-form-input"
                                placeholder="مبلغ بر اساس واحد ارزی"
                                value={prmPrice}
                                onChange={(e) => setPrmPrice(e.target.value)}
                            />
                        </div>
                        <div className="prm-form-field">
                            <label>ارز</label>
                            <select
                                className="prm-form-select"
                                value={prmCurrency}
                                onChange={(e) => setPrmCurrency(e.target.value)}
                            >
                                <option value="toman">تومان</option>
                                <option value="irr">ریال</option>
                                <option value="usd">دلار (USD)</option>
                                <option value="eur">یورو (EUR)</option>
                                <option value="aed">درهم (AED)</option>
                            </select>
                        </div>
                    </>
                )}

                <div className="prm-form-field">
                    <label>حداقل سفارش (MOQ)</label>
                    <input
                        type="number"
                        className="prm-form-input"
                        placeholder="مثال: 100"
                        value={prmMoq}
                        onChange={(e) => setPrmMoq(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>واحد حداقل سفارش</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="تن، کیلوگرم، عدد، پالت..."
                        value={prmMoqUnit}
                        onChange={(e) => setPrmMoqUnit(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>مدت زمان تحویل</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: ۳ الی ۵ روز کاری"
                        value={prmDeliveryTime}
                        onChange={(e) => setPrmDeliveryTime(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>شرایط تحویل / حمل</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: درب کارخانه (EXW) یا FOB"
                        value={prmDeliveryType}
                        onChange={(e) => setPrmDeliveryType(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>شرایط پرداخت</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: نقدی، اعتبار اسنادی (LC)"
                        value={prmPaymentTerms}
                        onChange={(e) => setPrmPaymentTerms(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>درجه کیفی</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="Grade A, صادراتی، درجه یک"
                        value={prmQualityGrade}
                        onChange={(e) => setPrmQualityGrade(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>استان</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: خراسان رضوی"
                        value={prmProvince}
                        onChange={(e) => setPrmProvince(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>شهر</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="مثال: مشهد"
                        value={prmCity}
                        onChange={(e) => setPrmCity(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>شماره تماس برای این آگهی</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="0912..."
                        value={prmPhone}
                        onChange={(e) => setPrmPhone(e.target.value)}
                    />
                </div>

                <div className="prm-form-field">
                    <label>لینک ویدیو معرفی کالا یا خدمت</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="لینک آپارات یا یوتیوب"
                        value={prmVideoLink}
                        onChange={(e) => setPrmVideoLink(e.target.value)}
                    />
                </div>

                <div className="prm-form-field prm-form-group-full">
                    <label>آدرس دقیق (اختیاری)</label>
                    <input
                        type="text"
                        className="prm-form-input"
                        placeholder="خیابان، شهرک صنعتی، پلاک"
                        value={prmAddress}
                        onChange={(e) => setPrmAddress(e.target.value)}
                    />
                </div>

                <div className="prm-form-field prm-form-group-full">
                    <label>توضیحات و مشخصات کامل آگهی (فارسی) *</label>
                    <textarea
                        className="prm-form-textarea"
                        placeholder="توضیحات فنی، آنالیز محصول، شرایط همکاری و..."
                        value={prmDescription}
                        onChange={(e) => setPrmDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="prm-form-field prm-form-group-full">
                    <label>توضیحات آگهی به انگلیسی (اختیاری)</label>
                    <textarea
                        className="prm-form-textarea"
                        placeholder="Detailed English description and specifications"
                        value={prmDescriptionEn}
                        onChange={(e) => setPrmDescriptionEn(e.target.value)}
                    />
                </div>
            </div>

            <div className="prm-form-actions">
                <button
                    type="button"
                    className="prm-btn-secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    انصراف
                </button>
                <button
                    type="submit"
                    className="prm-btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "در حال ثبت آگهی..." : "ثبت و ارسال آگهی"}
                </button>
            </div>
        </form>
    );
}
