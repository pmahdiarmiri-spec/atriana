"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { prmGetApiErrorCode } from "@/lib/prm-auth/prm-auth-utils";

interface PrmIdentifierFormProps {
    onSubmit: (identifier: string) => Promise<void>;
}

export function PrmIdentifierForm({
    onSubmit,
}: PrmIdentifierFormProps): React.ReactNode {
    const t = useTranslations("auth");
    const [prmIdentifier, setPrmIdentifier] = useState("");
    const [prmError, setPrmError] = useState("");
    const [prmLoading, setPrmLoading] = useState(false);

    async function prmHandleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const prmTrimmedIdentifier = prmIdentifier.trim();

        if (!prmTrimmedIdentifier) {
            setPrmError(t("identifierRequired"));
            return;
        }

        setPrmError("");
        setPrmLoading(true);

        try {
            await onSubmit(prmTrimmedIdentifier);
        } catch (error) {
            const errorCode = prmGetApiErrorCode(error);
            setPrmError(t(`errors.${errorCode}` as Parameters<typeof t>[0]));
        } finally {
            setPrmLoading(false);
        }
    }

    return (
        <div className="prm-auth-content">
            <div className="prm-auth-heading">
                <span className="prm-auth-eyebrow">
                    {t("identifierEyebrow")}
                </span>
                <h1>{t("identifierTitle")}</h1>
                <p>{t("identifierDescription")}</p>
            </div>

            <form className="prm-auth-form" onSubmit={prmHandleSubmit}>
                <label className="prm-auth-label" htmlFor="prm-identifier">
                    {t("identifier")}
                </label>

                <input
                    id="prm-identifier"
                    className="prm-auth-input"
                    type="text"
                    value={prmIdentifier}
                    onChange={(event) => setPrmIdentifier(event.target.value)}
                    placeholder={t("identifierPlaceholder")}
                    autoComplete="username"
                    inputMode="email"
                    dir="ltr"
                    disabled={prmLoading}
                />

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
                    <span>
                        {prmLoading ? t("checkingIdentifier") : t("continue")}
                    </span>
                    <span aria-hidden="true">←</span>
                </button>
            </form>

            <p className="prm-auth-disclaimer">{t("identifierDisclaimer")}</p>
        </div>
    );
}
