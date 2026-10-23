"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { prmConfirmEmailVerification, prmRequestEmailVerification } from "@/lib/prm-settings/prm-settings-api";
import { PrmUser } from "@/types/prm-auth";

interface PrmSettingsEmailProps {
    user: PrmUser;
    token: string;
    onUserUpdated: (user: PrmUser) => void;
}

export function PrmSettingsEmail({
    user,
    token,
    onUserUpdated,
}: PrmSettingsEmailProps): React.ReactNode {
    const t = useTranslations("settings.email");
    const [email, setEmail] = useState(user.email || "");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"input" | "verify">("input");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleRequestCode(e: FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            await prmRequestEmailVerification(token, email);
            setStep("verify");
            setMsg({ type: "success", text: t("otpSent") });
        } catch {
            setMsg({ type: "error", text: t("errorSend") });
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirmCode(e: FormEvent): Promise<void> {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const res = await prmConfirmEmailVerification(token, email, code);
            onUserUpdated(res.user);
            setStep("input");
            setCode("");
            setMsg({ type: "success", text: t("success") });
        } catch {
            setMsg({ type: "error", text: t("errorVerify") });
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

            <div style={{ marginBottom: "1.5rem" }}>
                <span className="prm-settings-label">{t("statusLabel")}</span>
                {user.email_verified_at ? (
                    <span className="prm-plan-badge prm-plan-badge-active">{t("verified")}</span>
                ) : (
                    <span className="prm-plan-badge prm-plan-badge-expired">{t("unverified")}</span>
                )}
            </div>

            {step === "input" ? (
                <form onSubmit={handleRequestCode}>
                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("newEmail")}</label>
                        <input
                            type="email"
                            className="prm-settings-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@atriana.com"
                            required
                        />
                    </div>
                    <div className="prm-settings-actions">
                        <button type="submit" className="prm-btn-submit" disabled={loading}>
                            {loading ? t("sending") : t("sendOtp")}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleConfirmCode}>
                    <div className="prm-settings-field">
                        <label className="prm-settings-label">{t("enterOtp", { email })}</label>
                        <input
                            type="text"
                            maxLength={6}
                            className="prm-settings-input"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123456"
                            required
                        />
                    </div>
                    <div className="prm-settings-actions">
                        <button
                            type="button"
                            className="prm-settings-tab-btn"
                            onClick={() => setStep("input")}
                        >
                            {t("changeTarget")}
                        </button>
                        <button type="submit" className="prm-btn-submit" disabled={loading}>
                            {loading ? t("confirming") : t("confirm")}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
