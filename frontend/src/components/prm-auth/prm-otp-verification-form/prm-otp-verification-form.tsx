"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PrmOtpInput } from "@/components/prm-auth/prm-otp-input/prm-otp-input";
import {
    prmFormatRemainingSeconds,
    prmGetApiErrorCode,
    prmMaskIdentifier,
} from "@/lib/prm-auth/prm-auth-utils";
import { PrmVerificationPurpose } from "@/types/prm-auth";

interface PrmOtpVerificationFormProps {
    identifier: string;
    purpose: PrmVerificationPurpose;
    onVerify: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
    onBack: () => void;
}

export function PrmOtpVerificationForm({
    identifier,
    purpose,
    onVerify,
    onResend,
    onBack,
}: PrmOtpVerificationFormProps): React.ReactNode {
    const t = useTranslations("auth");
    const [prmCode, setPrmCode] = useState("");
    const [prmError, setPrmError] = useState("");
    const [prmLoading, setPrmLoading] = useState(false);
    const [prmResending, setPrmResending] = useState(false);
    const [prmRemainingSeconds, setPrmRemainingSeconds] = useState(120);

    useEffect(() => {
        if (prmRemainingSeconds <= 0) {
            return;
        }

        const prmTimer = window.setInterval(() => {
            setPrmRemainingSeconds((currentValue) =>
                Math.max(currentValue - 1, 0),
            );
        }, 1000);

        return () => window.clearInterval(prmTimer);
    }, [prmRemainingSeconds]);

    async function prmHandleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (prmCode.length !== 6) {
            setPrmError(t("otpRequired"));
            return;
        }

        setPrmError("");
        setPrmLoading(true);

        try {
            await onVerify(prmCode);
        } catch (error) {
            const errorCode = prmGetApiErrorCode(error);
            setPrmError(t(`errors.${errorCode}` as Parameters<typeof t>[0]));
        } finally {
            setPrmLoading(false);
        }
    }

    async function prmHandleResend(): Promise<void> {
        if (prmRemainingSeconds > 0 || prmResending) {
            return;
        }

        setPrmError("");
        setPrmResending(true);

        try {
            await onResend();
            setPrmCode("");
            setPrmRemainingSeconds(120);
        } catch (error) {
            const errorCode = prmGetApiErrorCode(error);
            setPrmError(t(`errors.${errorCode}` as Parameters<typeof t>[0]));
        } finally {
            setPrmResending(false);
        }
    }

    const prmTitle =
        purpose === "password_reset"
            ? t("otpResetTitle")
            : t("otpTitle");

    return (
        <div className="prm-auth-content">
            <button
                className="prm-auth-back-button"
                type="button"
                onClick={onBack}
                disabled={prmLoading || prmResending}
            >
                <span aria-hidden="true">→</span>
                {t("back")}
            </button>

            <div className="prm-auth-heading">
                <span className="prm-auth-eyebrow">{t("otpEyebrow")}</span>
                <h1>{prmTitle}</h1>
                <p>
                    {t("otpDescription", {
                        identifier: prmMaskIdentifier(identifier),
                    })}
                </p>
            </div>

            <form className="prm-auth-form" onSubmit={prmHandleSubmit}>
                <PrmOtpInput
                    value={prmCode}
                    onChange={setPrmCode}
                    disabled={prmLoading || prmResending}
                />

                {prmError ? (
                    <p className="prm-auth-error" role="alert">
                        {prmError}
                    </p>
                ) : null}

                <button
                    className="prm-auth-button prm-auth-button-primary"
                    type="submit"
                    disabled={prmLoading || prmResending || prmCode.length !== 6}
                >
                    {prmLoading ? t("verifyingCode") : t("verifyCode")}
                </button>
            </form>

            <div className="prm-auth-resend">
                {prmRemainingSeconds > 0 ? (
                    <span>
                        {t("resendAvailableIn", {
                            time: prmFormatRemainingSeconds(prmRemainingSeconds),
                        })}
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={prmHandleResend}
                        disabled={prmResending || prmLoading}
                    >
                        {prmResending ? t("sendingCode") : t("resendCode")}
                    </button>
                )}
            </div>
        </div>
    );
}
