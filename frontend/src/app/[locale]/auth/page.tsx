"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { PrmAuthShell } from "@/components/prm-auth/prm-auth-shell/prm-auth-shell";
import { PrmIdentifierForm } from "@/components/prm-auth/prm-identifier-form/prm-identifier-form";
import { PrmLoginMethodForm } from "@/components/prm-auth/prm-login-method-form/prm-login-method-form";
import { PrmOtpVerificationForm } from "@/components/prm-auth/prm-otp-verification-form/prm-otp-verification-form";
import { PrmRegisterForm } from "@/components/prm-auth/prm-register-form/prm-register-form";
import { PrmResetPasswordForm } from "@/components/prm-auth/prm-reset-password-form/prm-reset-password-form";
import {
    prmIdentifyAuth,
    prmLoginWithOtp,
    prmLoginWithPassword,
    prmRegisterUser,
    prmRequestPasswordResetCode,
    prmResetPassword,
    prmSendVerificationCode,
    prmVerifyCode,
} from "@/lib/prm-auth/prm-auth-api";
import { prmSaveAuthSession } from "@/lib/prm-auth/prm-auth-storage";
import {
    PrmAuthChannel,
    PrmAuthStep,
    PrmTradeRole,
    PrmVerificationPurpose,
} from "@/types/prm-auth";

export default function PrmAuthLocalePage(): React.ReactNode {
    const prmRouter = useRouter();
    const [prmStep, setPrmStep] = useState<PrmAuthStep>("identifier");
    const [prmIdentifier, setPrmIdentifier] = useState("");
    const [prmChannel, setPrmChannel] = useState<PrmAuthChannel>("email");
    const [prmPurpose, setPrmPurpose] =
        useState<PrmVerificationPurpose>("registration");
    const [prmVerificationToken, setPrmVerificationToken] = useState("");
    const prmIsProcessingRef = useRef(false);

    function prmStoreAndRedirect(payload: {
        token: string;
        tokenType: string;
        user: Parameters<typeof prmSaveAuthSession>[0]["user"];
    }): void {
        prmSaveAuthSession({
            token: payload.token,
            tokenType: payload.tokenType,
            user: payload.user,
        });

        prmRouter.replace("/dashboard");
    }

    async function prmHandleIdentifier(identifier: string): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmIdentifyAuth(identifier);

            setPrmIdentifier(prmResponse.identifier);
            setPrmVerificationToken("");

            if (prmResponse.channel) {
                setPrmChannel(prmResponse.channel);
            }

            if (prmResponse.next_step === "password") {
                setPrmPurpose("login");
                setPrmStep("login-method");

                return;
            }

            setPrmPurpose("registration");
            setPrmStep("otp");
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleOtpVerification(code: string): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmVerifyCode(
                prmIdentifier,
                code,
                prmPurpose,
            );

            setPrmVerificationToken(prmResponse.verification_token);

            if (prmResponse.channel) {
                setPrmChannel(prmResponse.channel);
            }

            if (prmPurpose === "registration") {
                setPrmStep("register");

                return;
            }

            if (prmPurpose === "password_reset") {
                setPrmStep("reset-password");

                return;
            }

            const prmLoginResponse = await prmLoginWithOtp(
                prmIdentifier,
                prmResponse.verification_token,
            );

            prmStoreAndRedirect({
                token: prmLoginResponse.token,
                tokenType: prmLoginResponse.token_type,
                user: prmLoginResponse.user,
            });
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleResendOtp(): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            if (prmPurpose === "password_reset") {
                const prmResponse = await prmRequestPasswordResetCode(
                    prmIdentifier,
                );

                setPrmIdentifier(prmResponse.identifier);
                setPrmChannel(prmResponse.channel);
                setPrmVerificationToken("");

                return;
            }

            const prmResponse = await prmSendVerificationCode(
                prmIdentifier,
                prmPurpose,
            );

            setPrmIdentifier(prmResponse.identifier);
            setPrmChannel(prmResponse.channel);
            setPrmVerificationToken("");
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandlePasswordLogin(password: string): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmLoginWithPassword(
                prmIdentifier,
                password,
            );

            prmStoreAndRedirect({
                token: prmResponse.token,
                tokenType: prmResponse.token_type,
                user: prmResponse.user,
            });
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleOtpLogin(): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmSendVerificationCode(
                prmIdentifier,
                "login",
            );

            setPrmIdentifier(prmResponse.identifier);
            setPrmChannel(prmResponse.channel);
            setPrmPurpose("login");
            setPrmVerificationToken("");
            setPrmStep("otp");
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleForgotPassword(): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmRequestPasswordResetCode(prmIdentifier);

            setPrmIdentifier(prmResponse.identifier);
            setPrmChannel(prmResponse.channel);
            setPrmPurpose("password_reset");
            setPrmVerificationToken("");
            setPrmStep("otp");
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleRegistration(payload: {
        firstName: string;
        lastName: string;
        tradeRole: PrmTradeRole;
        countryId: number;
        provinceId?: number | null;
        cityId?: number | null;
        customLocation?: string | null;
        password: string;
        passwordConfirmation: string;
    }): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            const prmResponse = await prmRegisterUser({
                identifier: prmIdentifier,
                channel: prmChannel,
                verificationToken: prmVerificationToken,
                firstName: payload.firstName,
                lastName: payload.lastName,
                tradeRole: payload.tradeRole,
                countryId: payload.countryId,
                provinceId: payload.provinceId,
                cityId: payload.cityId,
                customLocation: payload.customLocation,
                password: payload.password,
                passwordConfirmation: payload.passwordConfirmation,
            });

            prmStoreAndRedirect({
                token: prmResponse.token,
                tokenType: prmResponse.token_type,
                user: prmResponse.user,
            });
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    async function prmHandleResetPassword(
        password: string,
        passwordConfirmation: string,
    ): Promise<void> {
        if (prmIsProcessingRef.current) {
            return;
        }

        prmIsProcessingRef.current = true;

        try {
            await prmResetPassword(
                prmIdentifier,
                prmVerificationToken,
                password,
                passwordConfirmation,
            );

            setPrmPurpose("login");
            setPrmVerificationToken("");
            setPrmStep("login-method");
        } finally {
            prmIsProcessingRef.current = false;
        }
    }

    function prmReturnToIdentifier(): void {
        setPrmStep("identifier");
        setPrmIdentifier("");
        setPrmVerificationToken("");
        setPrmPurpose("registration");
        setPrmChannel("email");
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--prm-bg-light)]">
            <PrmAuthShell>
                {prmStep === "identifier" ? (
                    <PrmIdentifierForm onSubmit={prmHandleIdentifier} />
                ) : null}

                {prmStep === "login-method" ? (
                    <PrmLoginMethodForm
                        identifier={prmIdentifier}
                        onPasswordLogin={prmHandlePasswordLogin}
                        onOtpLogin={prmHandleOtpLogin}
                        onForgotPassword={prmHandleForgotPassword}
                        onBack={prmReturnToIdentifier}
                    />
                ) : null}

                {prmStep === "otp" ? (
                    <PrmOtpVerificationForm
                        identifier={prmIdentifier}
                        purpose={prmPurpose}
                        onVerify={prmHandleOtpVerification}
                        onResend={prmHandleResendOtp}
                        onBack={() => {
                            if (
                                prmPurpose === "registration" ||
                                prmPurpose === "password_reset"
                            ) {
                                prmReturnToIdentifier();

                                return;
                            }

                            setPrmStep("login-method");
                        }}
                    />
                ) : null}

                {prmStep === "register" ? (
                    <PrmRegisterForm
                        identifier={prmIdentifier}
                        onSubmit={prmHandleRegistration}
                        onBack={() => setPrmStep("otp")}
                    />
                ) : null}

                {prmStep === "reset-password" ? (
                    <PrmResetPasswordForm
                        onSubmit={prmHandleResetPassword}
                        onBack={() => setPrmStep("otp")}
                    />
                ) : null}
            </PrmAuthShell>
        </div>
    );
}
