"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { prmGetApiErrorCode } from "@/lib/prm-auth/prm-auth-utils";

interface PrmResetPasswordFormProps {
    onSubmit: (password: string, passwordConfirmation: string) => Promise<void>;
    onBack: () => void;
}

export function PrmResetPasswordForm({
    onSubmit,
    onBack,
}: PrmResetPasswordFormProps): React.ReactNode {
    const t = useTranslations("auth");
    const [prmPassword, setPrmPassword] = useState("");
    const [prmPasswordConfirmation, setPrmPasswordConfirmation] = useState("");
    const [prmError, setPrmError] = useState("");
    const [prmLoading, setPrmLoading] = useState(false);

    async function prmHandleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

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
            await onSubmit(prmPassword, prmPasswordConfirmation);
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
                <span className="prm-auth-eyebrow">
                    {t("securityEyebrow")}
                </span>
                <h1>{t("newPasswordTitle")}</h1>
                <p>{t("newPasswordDescription")}</p>
            </div>

            <form className="prm-auth-form" onSubmit={prmHandleSubmit}>
                <div>
                    <label
                        className="prm-auth-label"
                        htmlFor="prm-new-password"
                    >
                        {t("newPassword")}
                    </label>
                    <input
                        id="prm-new-password"
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
                        htmlFor="prm-new-password-confirmation"
                    >
                        {t("newPasswordConfirmation")}
                    </label>
                    <input
                        id="prm-new-password-confirmation"
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
                    {prmLoading ? t("resettingPassword") : t("saveNewPassword")}
                </button>
            </form>
        </div>
    );
}
