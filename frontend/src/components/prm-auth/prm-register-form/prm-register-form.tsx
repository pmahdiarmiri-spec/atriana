"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
    prmGetCities,
    prmGetCountries,
    prmGetProvinces,
} from "@/lib/prm-auth/prm-auth-api";
import {
    prmGetApiErrorCode,
    prmMaskIdentifier,
} from "@/lib/prm-auth/prm-auth-utils";
import { PrmCity, PrmCountry, PrmProvince, PrmTradeRole } from "@/types/prm-auth";

interface PrmRegisterFormProps {
    identifier: string;
    onSubmit: (payload: {
        firstName: string;
        lastName: string;
        tradeRole: PrmTradeRole;
        countryId: number;
        provinceId?: number | null;
        cityId?: number | null;
        customLocation?: string | null;
        password: string;
        passwordConfirmation: string;
    }) => Promise<void>;
    onBack: () => void;
}

export function PrmRegisterForm({
    identifier,
    onSubmit,
    onBack,
}: PrmRegisterFormProps): React.ReactNode {
    const t = useTranslations("auth");
    const locale = useLocale();

    const [prmFirstName, setPrmFirstName] = useState("");
    const [prmLastName, setPrmLastName] = useState("");
    const [prmTradeRole, setPrmTradeRole] = useState<PrmTradeRole>("both");
    
    const [countries, setCountries] = useState<PrmCountry[]>([]);
    const [provinces, setProvinces] = useState<PrmProvince[]>([]);
    const [cities, setCities] = useState<PrmCity[]>([]);
    
    const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [customLocation, setCustomLocation] = useState("");

    const [prmPassword, setPrmPassword] = useState("");
    const [prmPasswordConfirmation, setPrmPasswordConfirmation] = useState("");
    const [prmError, setPrmError] = useState("");
    const [prmLoading, setPrmLoading] = useState(false);

    const isPersianLocale = locale === "fa";

    useEffect(() => {
        let isMounted = true;
        prmGetCountries()
            .then((res) => {
                if (!isMounted) return;
                setCountries(res.countries);
                const iran = res.countries.find(
                    (c) =>
                        c.name_en.toLowerCase() === "iran" ||
                        c.name_fa.includes("ایران"),
                );
                if (iran) {
                    setSelectedCountryId(iran.id);
                } else if (res.countries.length > 0) {
                    setSelectedCountryId(res.countries[0].id);
                }
            })
            .catch(() => {});
        return () => {
            isMounted = false;
        };
    }, []);

    const selectedCountry = countries.find((c) => c.id === selectedCountryId);
    const isIranSelected =
        selectedCountry &&
        (selectedCountry.name_en.toLowerCase() === "iran" ||
            selectedCountry.name_fa.includes("ایران"));

    useEffect(() => {
        if (!selectedCountryId || !isIranSelected) {
            setProvinces([]);
            setSelectedProvinceId(null);
            return;
        }

        let isMounted = true;
        prmGetProvinces(selectedCountryId)
            .then((res) => {
                if (!isMounted) return;
                setProvinces(res.provinces);
                setSelectedProvinceId(null);
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, [selectedCountryId, isIranSelected]);

    useEffect(() => {
        if (!selectedProvinceId) {
            setCities([]);
            setSelectedCityId(null);
            return;
        }

        let isMounted = true;
        prmGetCities(selectedProvinceId)
            .then((res) => {
                if (!isMounted) return;
                setCities(res.cities);
                setSelectedCityId(null);
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, [selectedProvinceId]);

    async function prmHandleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedCountryId) {
            setPrmError(t("countryRequired"));
            return;
        }

        if (isIranSelected && (!selectedProvinceId || !selectedCityId)) {
            setPrmError(t("provinceAndCityRequired"));
            return;
        }

        if (prmPassword.length < 8) {
            setPrmError(t("passwordMinLength"));
            return;
        }

        if (prmPassword !== prmPasswordConfirmation) {
            setPrmError(t("passwordMismatch"));
            return;
        }

        setPrmError("");
        setPrmLoading(true);

        try {
            await onSubmit({
                firstName: prmFirstName,
                lastName: prmLastName,
                tradeRole: prmTradeRole,
                countryId: selectedCountryId,
                provinceId: isIranSelected ? selectedProvinceId : null,
                cityId: isIranSelected ? selectedCityId : null,
                customLocation: !isIranSelected ? customLocation : null,
                password: prmPassword,
                passwordConfirmation: prmPasswordConfirmation,
            });
        } catch (error) {
            const errorCode = prmGetApiErrorCode(error);
            setPrmError(t(`errors.${errorCode}` as Parameters<typeof t>[0]));
        } finally {
            setPrmLoading(false);
        }
    }

    return (
        <div className="prm-auth-content">
            <button
                className="prm-auth-back-button"
                type="button"
                onClick={onBack}
                disabled={prmLoading}
            >
                <span aria-hidden="true">→</span>
                {t("back")}
            </button>

            <div className="prm-auth-heading">
                <span className="prm-auth-eyebrow">{t("profileEyebrow")}</span>
                <h1>{t("profileTitle")}</h1>
                <p>
                    {t("profileDescription", {
                        identifier: prmMaskIdentifier(identifier),
                    })}
                </p>
            </div>

            <form className="prm-auth-form" onSubmit={prmHandleSubmit}>
                <div className="prm-auth-input-grid">
                    <div>
                        <label
                            className="prm-auth-label"
                            htmlFor="prm-first-name"
                        >
                            {t("firstName")}
                        </label>
                        <input
                            id="prm-first-name"
                            className="prm-auth-input"
                            type="text"
                            value={prmFirstName}
                            onChange={(event) =>
                                setPrmFirstName(event.target.value)
                            }
                            autoComplete="given-name"
                            required
                            disabled={prmLoading}
                        />
                    </div>

                    <div>
                        <label
                            className="prm-auth-label"
                            htmlFor="prm-last-name"
                        >
                            {t("lastName")}
                        </label>
                        <input
                            id="prm-last-name"
                            className="prm-auth-input"
                            type="text"
                            value={prmLastName}
                            onChange={(event) =>
                                setPrmLastName(event.target.value)
                            }
                            autoComplete="family-name"
                            required
                            disabled={prmLoading}
                        />
                    </div>
                </div>

                <div>
                    <label className="prm-auth-label" htmlFor="prm-country">
                        {t("country")}
                    </label>
                    <select
                        id="prm-country"
                        className="prm-auth-input"
                        value={selectedCountryId ?? ""}
                        onChange={(e) =>
                            setSelectedCountryId(Number(e.target.value))
                        }
                        required
                        disabled={prmLoading}
                    >
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {isPersianLocale
                                    ? country.name_fa
                                    : country.name_en}
                            </option>
                        ))}
                    </select>
                </div>

                {isIranSelected ? (
                    <div className="prm-auth-input-grid">
                        <div>
                            <label
                                className="prm-auth-label"
                                htmlFor="prm-province"
                            >
                                {t("province")}
                            </label>
                            <select
                                id="prm-province"
                                className="prm-auth-input"
                                value={selectedProvinceId ?? ""}
                                onChange={(e) =>
                                    setSelectedProvinceId(
                                        Number(e.target.value),
                                    )
                                }
                                required
                                disabled={prmLoading}
                            >
                                <option value="" disabled>
                                    {t("selectProvince")}
                                </option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.id}
                                        value={province.id}
                                    >
                                        {isPersianLocale
                                            ? province.name_fa
                                            : province.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                className="prm-auth-label"
                                htmlFor="prm-city"
                            >
                                {t("city")}
                            </label>
                            <select
                                id="prm-city"
                                className="prm-auth-input"
                                value={selectedCityId ?? ""}
                                onChange={(e) =>
                                    setSelectedCityId(Number(e.target.value))
                                }
                                required
                                disabled={prmLoading || !selectedProvinceId}
                            >
                                <option value="" disabled>
                                    {t("selectCity")}
                                </option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {isPersianLocale
                                            ? city.name_fa
                                            : city.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label
                            className="prm-auth-label"
                            htmlFor="prm-custom-location"
                        >
                            {t("customLocation")}
                        </label>
                        <input
                            id="prm-custom-location"
                            className="prm-auth-input"
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            placeholder={t("customLocationPlaceholder")}
                            disabled={prmLoading}
                        />
                    </div>
                )}

                <fieldset className="prm-auth-role-fieldset">
                    <legend className="prm-auth-label">
                        {t("tradeRoleQuestion")}
                    </legend>

                    <div className="prm-auth-role-options">
                        <label
                            className={`prm-auth-role-option ${
                                prmTradeRole === "exporter"
                                    ? "prm-auth-role-option-active"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="prm-trade-role"
                                value="exporter"
                                checked={prmTradeRole === "exporter"}
                                onChange={() => setPrmTradeRole("exporter")}
                                disabled={prmLoading}
                            />
                            {t("exporter")}
                        </label>

                        <label
                            className={`prm-auth-role-option ${
                                prmTradeRole === "importer"
                                    ? "prm-auth-role-option-active"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="prm-trade-role"
                                value="importer"
                                checked={prmTradeRole === "importer"}
                                onChange={() => setPrmTradeRole("importer")}
                                disabled={prmLoading}
                            />
                            {t("importer")}
                        </label>

                        <label
                            className={`prm-auth-role-option ${
                                prmTradeRole === "both"
                                    ? "prm-auth-role-option-active"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="prm-trade-role"
                                value="both"
                                checked={prmTradeRole === "both"}
                                onChange={() => setPrmTradeRole("both")}
                                disabled={prmLoading}
                            />
                            {t("both")}
                        </label>
                    </div>
                </fieldset>

                <div>
                    <label
                        className="prm-auth-label"
                        htmlFor="prm-register-password"
                    >
                        {t("password")}
                    </label>
                    <input
                        id="prm-register-password"
                        className="prm-auth-input"
                        type="password"
                        value={prmPassword}
                        onChange={(event) => setPrmPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        disabled={prmLoading}
                    />
                </div>

                <div>
                    <label
                        className="prm-auth-label"
                        htmlFor="prm-register-password-confirmation"
                    >
                        {t("passwordConfirmation")}
                    </label>
                    <input
                        id="prm-register-password-confirmation"
                        className="prm-auth-input"
                        type="password"
                        value={prmPasswordConfirmation}
                        onChange={(event) =>
                            setPrmPasswordConfirmation(event.target.value)
                        }
                        autoComplete="new-password"
                        minLength={8}
                        required
                        disabled={prmLoading}
                    />
                </div>

                {prmError ? (
                    <p className="prm-auth-error" role="alert">
                        {prmError}
                    </p>
                ) : null}

                <button
                    className="prm-auth-button prm-auth-button-primary"
                    type="submit"
                    disabled={prmLoading}
                >
                    {prmLoading ? t("registering") : t("createAccount")}
                </button>
            </form>
        </div>
    );
}
