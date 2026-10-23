"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import {
    prmGetApiErrorCode,
    prmMaskIdentifier,
} from "@/lib/prm-auth/prm-auth-utils";

interface PrmLoginMethodFormProps {
    identifier: string;
    onPasswordLogin: (password: string) => Promise<void>;
    onOtpLogin: () => void;
    onForgotPassword: () => void;
    onBack: () => void;
}

export function PrmLoginMethodForm({
    identifier,
    onPasswordLogin,
    onOtpLogin,
    onForgotPassword,
    onBack,
}: PrmLoginMethodFormProps): React.ReactNode {
    const t = useTranslations("auth");
    const [prmPassword, setPrmPassword] = useState("");
    const [prmError, setPrmError] = useState("");
    const [prmLoading, setPrmLoading] = useState(false);
    const [prmShowPassword, setPrmShowPassword] = useState(false);

    async function prmHandlePasswordLogin(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (!prmPassword) {
            setPrmError(t("passwordRequired"));
            return;
        }

        setPrmError("");
        setPrmLoading(true);

        try {
            await onPasswordLogin(prmPassword);
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
                {t("changeIdentifier")}
            </button>

            <div className="prm-auth-heading">
                <span className="prm-auth-eyebrow">{t("passwordEyebrow")}</span>
                <h1>{t("passwordTitle")}</h1>
                <p>
                    {t("passwordDescription", {
                        identifier: prmMaskIdentifier(identifier),
                    })}
                </p>
            </div>

            <form className="prm-auth-form" onSubmit={prmHandlePasswordLogin}>
                <label className="prm-auth-label" htmlFor="prm-password">
                    {t("password")}
                </label>

                <div className="prm-auth-password-field">
                    <input
                        id="prm-password"
                        className="prm-auth-input"
                        type={prmShowPassword ? "text" : "password"}
                        value={prmPassword}
                        onChange={(event) => setPrmPassword(event.target.value)}
                        autoComplete="current-password"
                        disabled={prmLoading}
                    />
                    <button
                        className="prm-auth-password-toggle"
                        type="button"
                        onClick={() => setPrmShowPassword((value) => !value)}
                        disabled={prmLoading}
                    >
                        {prmShowPassword ? t("passwordHide") : t("passwordShow")}
                    </button>
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
                    {prmLoading ? t("loggingIn") : t("loginWithPassword")}
                </button>
            </form>

            <div className="prm-auth-alternative-actions">
                <button
                    type="button"
                    onClick={onOtpLogin}
                    disabled={prmLoading}
                >
                    {t("loginWithOtp")}
                </button>
                <button
                    type="button"
                    onClick={onForgotPassword}
                    disabled={prmLoading}
                >
                    {t("forgotPassword")}
                </button>
            </div>
        </div>
    );
}
