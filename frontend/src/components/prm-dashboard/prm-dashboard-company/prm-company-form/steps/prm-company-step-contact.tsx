"use client";

import { ReactNode, ChangeEvent, useState, useEffect, useTransition } from "react";
import { PrmCompanyFormData, PrmCountry, PrmProvince, PrmCity } from "@/types/prm-company";
import { prmGetCountries, prmGetProvinces, prmGetCities } from "@/lib/prm-companies/prm-companies-api";

interface PrmCompanyStepContactProps {
  formData: PrmCompanyFormData;
  errors: Record<string, string[]>;
  readOnly: boolean;
  onChange: (field: keyof PrmCompanyFormData, value: any) => void;
}

export function PrmCompanyStepContact({
  formData,
  errors,
  readOnly,
  onChange,
}: PrmCompanyStepContactProps): ReactNode {
  const [, startTransition] = useTransition();

  const [countries, setCountries] = useState<PrmCountry[]>([]);
  const [provinces, setProvinces] = useState<PrmProvince[]>([]);
  const [cities, setCities] = useState<PrmCity[]>([]);

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);

  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingCountries(true);

    prmGetCountries()
      .then((res) => {
        if (!isMounted) return;
        setCountries(res.countries || []);

        const currentCountry = res.countries.find(
          (c) => c.name_fa === (formData.country || "ایران") || c.name_en === formData.country
        );

        if (currentCountry) {
          setSelectedCountryId(currentCountry.id);
          if (!formData.country) {
            onChange("country", currentCountry.name_fa);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingCountries(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCountryId) {
      setProvinces([]);
      setSelectedProvinceId(null);
      return;
    }

    let isMounted = true;
    setLoadingProvinces(true);

    prmGetProvinces(selectedCountryId)
      .then((res) => {
        if (!isMounted) return;
        const list = res.provinces || [];
        setProvinces(list);

        if (formData.province) {
          const matchedProvince = list.find(
            (p) => p.name_fa === formData.province || p.name_en === formData.province
          );
          if (matchedProvince) {
            setSelectedProvinceId(matchedProvince.id);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingProvinces(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountryId]);

  useEffect(() => {
    if (!selectedProvinceId) {
      setCities([]);
      return;
    }

    let isMounted = true;
    setLoadingCities(true);

    prmGetCities(selectedProvinceId)
      .then((res) => {
        if (!isMounted) return;
        setCities(res.cities || []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingCities(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProvinceId]);

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const countryObj = countries.find((c) => c.name_fa === countryName);

    startTransition(() => {
      onChange("country", countryName);
      onChange("province", "");
      onChange("city", "");
      setSelectedCountryId(countryObj ? countryObj.id : null);
      setSelectedProvinceId(null);
      setCities([]);
    });
  };

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const provName = e.target.value;
    const provObj = provinces.find((p) => p.name_fa === provName);

    startTransition(() => {
      onChange("province", provName);
      onChange("city", "");
      setSelectedProvinceId(provObj ? provObj.id : null);
    });
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    onChange("city", cityName);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name as keyof PrmCompanyFormData, value);
  };

  return (
    <div className="prm-company-form-grid">
      <span className="prm-section-title">اطلاعات ارتباطی و آدرس کارخانه / دفتر مرکزی</span>

      <div className="prm-form-field">
        <label>تلفن ثابت دفتر</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="02188000000"
        />
      </div>

      <div className="prm-form-field">
        <label>شماره تماس مستقیم / موبایل هماهنگی</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="09120000000"
        />
      </div>

      <div className={`prm-form-field ${errors.email ? "prm-form-field-error" : ""}`}>
        <label>ایمیل سازمانی رسمی</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="info@company.com"
        />
        {errors.email && <span className="prm-field-error-msg">{errors.email[0]}</span>}
      </div>

      <div className={`prm-form-field ${errors.website ? "prm-form-field-error" : ""}`}>
        <label>آدرس وب‌سایت</label>
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="https://company.com"
        />
        {errors.website && <span className="prm-field-error-msg">{errors.website[0]}</span>}
      </div>

      <div className="prm-form-field">
        <label>شماره نمابر (فکس)</label>
        <input
          type="text"
          name="fax"
          value={formData.fax || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="02188000001"
        />
      </div>

      <div className={`prm-form-field ${errors.country ? "prm-form-field-error" : ""}`}>
        <label>کشور محل استقرار</label>
        <div className="prm-liquid-select-wrapper">
          <select
            name="country"
            value={formData.country || ""}
            onChange={handleCountryChange}
            disabled={readOnly || loadingCountries}
            className="prm-form-input prm-liquid-select"
          >
            <option value="">
              {loadingCountries ? "در حال دریافت کشورها..." : "انتخاب کشور"}
            </option>
            {countries.map((c) => (
              <option key={`country-${c.id}`} value={c.name_fa}>
                {c.name_fa}
              </option>
            ))}
          </select>
        </div>
        {errors.country && <span className="prm-field-error-msg">{errors.country[0]}</span>}
      </div>

      <div className={`prm-form-field ${errors.province ? "prm-form-field-error" : ""}`}>
        <label>استان</label>
        <div className="prm-liquid-select-wrapper">
          <select
            name="province"
            value={formData.province || ""}
            onChange={handleProvinceChange}
            disabled={readOnly || loadingProvinces || !selectedCountryId}
            className="prm-form-input prm-liquid-select"
          >
            <option value="">
              {loadingProvinces
                ? "در حال بارگذاری استان‌ها..."
                : !selectedCountryId
                ? "ابتدا کشور را انتخاب کنید"
                : "انتخاب استان"}
            </option>
            {provinces.map((p) => (
              <option key={`province-${p.id}`} value={p.name_fa}>
                {p.name_fa}
              </option>
            ))}
          </select>
        </div>
        {errors.province && <span className="prm-field-error-msg">{errors.province[0]}</span>}
      </div>

      <div className={`prm-form-field ${errors.city ? "prm-form-field-error" : ""}`}>
        <label>شهر</label>
        <div className="prm-liquid-select-wrapper">
          <select
            name="city"
            value={formData.city || ""}
            onChange={handleCityChange}
            disabled={readOnly || loadingCities || !selectedProvinceId}
            className="prm-form-input prm-liquid-select"
          >
            <option value="">
              {loadingCities
                ? "در حال بارگذاری شهرها..."
                : !selectedProvinceId
                ? "ابتدا استان را انتخاب کنید"
                : "انتخاب شهر"}
            </option>
            {cities.map((ct) => (
              <option key={`city-${ct.id}`} value={ct.name_fa}>
                {ct.name_fa}
              </option>
            ))}
          </select>
        </div>
        {errors.city && <span className="prm-field-error-msg">{errors.city[0]}</span>}
      </div>

      <div className="prm-form-field">
        <label>کد پستی ده رقمی</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="8514900000"
        />
      </div>

      <div className="prm-form-field prm-company-form-full">
        <label>نشانی کامل پستی</label>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="خیابان، پلاک، طبقه، واحد..."
        />
      </div>

      <span className="prm-section-title">شبکه‌های اجتماعی و پیام‌رسان‌ها</span>

      <div className="prm-form-field">
        <label>لینکدین (LinkedIn)</label>
        <input
          type="text"
          name="social_linkedin"
          value={formData.social_linkedin || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="linkedin.com/company/..."
        />
      </div>

      <div className="prm-form-field">
        <label>اینستاگرام (Instagram)</label>
        <input
          type="text"
          name="social_instagram"
          value={formData.social_instagram || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="instagram.com/..."
        />
      </div>

      <div className="prm-form-field">
        <label>تلگرام (Telegram)</label>
        <input
          type="text"
          name="social_telegram"
          value={formData.social_telegram || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="t.me/..."
        />
      </div>

      <div className="prm-form-field">
        <label>واتس‌اپ تجاری (WhatsApp)</label>
        <input
          type="text"
          name="social_whatsapp"
          value={formData.social_whatsapp || ""}
          onChange={handleInputChange}
          disabled={readOnly}
          className="prm-form-input"
          placeholder="wa.me/..."
        />
      </div>
    </div>
  );
}
