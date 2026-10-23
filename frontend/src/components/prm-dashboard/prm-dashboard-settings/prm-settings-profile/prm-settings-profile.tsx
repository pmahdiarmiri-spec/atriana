"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { prmGetCities, prmGetCountries, prmGetProvinces } from "@/lib/prm-auth/prm-auth-api";
import { prmUpdateProfile } from "@/lib/prm-settings/prm-settings-api";
import { PrmCity, PrmCountry, PrmProvince, PrmTradeRole, PrmUser } from "@/types/prm-auth";

interface PrmSettingsProfileProps {
    user: PrmUser;
    token: string;
    onUserUpdated: (user: PrmUser) => void;
}

export function PrmSettingsProfile({
    user,
    token,
    onUserUpdated,
}: PrmSettingsProfileProps): React.ReactNode {
    const t = useTranslations("settings.profile");
    const locale = useLocale();

    const [firstName, setFirstName] = useState(user.first_name || "");
    const [lastName, setLastName] = useState(user.last_name || "");
    const [tradeRole, setTradeRole] = useState<PrmTradeRole>(user.trade_role || "exporter");
    const [countryId, setCountryId] = useState<number>(user.country_id || 1);
    const [provinceId, setProvinceId] = useState<number | null>(user.province_id || null);
    const [cityId, setCityId] = useState<number | null>(user.city_id || null);
    const [customLocation, setCustomLocation] = useState(user.custom_location || "");

    const [countries, setCountries] = useState<PrmCountry[]>([]);
    const [provinces, setProvinces] = useState<PrmProvince[]>([]);
    const [cities, setCities] = useState<PrmCity[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        async function fetchLocations(): Promise<void> {
            try {
                const res = await prmGetCountries();
                setCountries(res.countries);
            } catch {
                setCountries([]);
            }
        }
        void fetchLocations();
    }, []);

    useEffect(() => {
        if (!countryId) return;
        async function fetchProvinces(): Promise<void> {
            try {
                const res = await prmGetProvinces(countryId);
                setProvinces(res.provinces);
            } catch {
                setProvinces([]);
            }
        }
        void fetchProvinces();
    }, [countryId]);

    useEffect(() => {
        if (!provinceId) return;
        async function fetchCities(): Promise<void> {
            try {
                const res = await prmGetCities(provinceId);
                setCities(res.cities);
            } catch {
                setCities([]);
            }
        }
        void fetchCities();
    }, [provinceId]);

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const res = await prmUpdateProfile(token, {
                firstName,
                lastName,
                tradeRole,
                countryId,
                provinceId,
                cityId,
                customLocation,
            });
            onUserUpdated(res.user);
            setMsg({ type: "success", text: t("success") });
        } catch {
            setMsg({ type: "error", text: t("error") });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="prm-settings-card">
            <div className="prm-settings-card-header">
                <h3 className="prm-settings-card-title">{t("cardTitle")}</h3>
                <p className="prm-settings-card-subtitle">{t("cardSubtitle")}</p>
            </div>

            {msg && (
                <div className={`prm-feedback-msg prm-feedback-msg-${msg.type}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="prm-settings-form-grid">
                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("firstName")}</label>
                        <input
                            type="text"
                            className="prm-settings-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("lastName")}</label>
                        <input
                            type="text"
                            className="prm-settings-input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("phone")}</label>
                        <input
                            type="text"
                            className="prm-settings-input"
                            value={user.mobile || t("phoneNotSet")}
                            disabled
                        />
                    </div>

                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("businessRole")}</label>
                        <select
                            className="prm-settings-select"
                            value={tradeRole}
                            onChange={(e) => setTradeRole(e.target.value as PrmTradeRole)}
                        >
                            <option value="exporter">{t("roles.exporter")}</option>
                            <option value="importer">{t("roles.importer")}</option>
                            <option value="both">{t("roles.both")}</option>
                        </select>
                    </div>

                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("country")}</label>
                        <select
                            className="prm-settings-select"
                            value={countryId}
                            onChange={(e) => {
                                setCountryId(Number(e.target.value));
                                setProvinceId(null);
                                setCityId(null);
                            }}
                        >
                            {countries.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {locale === "fa" ? c.name_fa : c.name_en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {provinces.length > 0 && (
                        <div className="prm-settings-field">
                            <label className="prm-settings-label">{t("province")}</label>
                            <select
                                className="prm-settings-select"
                                value={provinceId ?? ""}
                                onChange={(e) => {
                                    setProvinceId(Number(e.target.value));
                                    setCityId(null);
                                }}
                            >
                                <option value="">{t("selectProvince")}</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {locale === "fa" ? p.name_fa : p.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {cities.length > 0 && (
                        <div className="prm-settings-field">
                            <label className="prm-settings-label">{t("city")}</label>
                            <select
                                className="prm-settings-select"
                                value={cityId ?? ""}
                                onChange={(e) => setCityId(Number(e.target.value))}
                            >
                                <option value="">{t("selectCity")}</option>
                                {cities.map((ct) => (
                                    <option key={ct.id} value={ct.id}>
                                        {locale === "fa" ? ct.name_fa : ct.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("customLocation")}</label>
                        <input
                            type="text"
                            className="prm-settings-input"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                        />
                    </div>
                </div>

                <div className="prm-settings-actions">
                    <button type="submit" className="prm-btn-submit" disabled={loading}>
                        {loading ? t("saving") : t("save")}
                    </button>
                </div>
            </form>
        </div>
    );
}
