"use client";

import {
    ClipboardEvent,
    KeyboardEvent,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { useTranslations } from "next-intl";

interface PrmOtpInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function PrmOtpInput({
    value,
    onChange,
    disabled = false,
}: PrmOtpInputProps): React.ReactNode {
    const t = useTranslations("auth");
    const prmInputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const prmDigits = useMemo(
        () =>
            Array.from({ length: 6 }, (_, index) => {
                return value[index] ?? "";
            }),
        [value],
    );

    useEffect(() => {
        if (!value) {
            prmInputRefs.current[0]?.focus();
        }
    }, [value]);

    function prmUpdateValue(index: number, nextDigit: string): void {
        const prmNextDigits = [...prmDigits];
        prmNextDigits[index] = nextDigit;
        onChange(prmNextDigits.join(""));
    }

    function prmHandleChange(index: number, rawValue: string): void {
        const prmDigit = rawValue.replace(/\D/g, "").slice(-1);

        if (!prmDigit) {
            prmUpdateValue(index, "");
            return;
        }

        prmUpdateValue(index, prmDigit);

        if (index < 5) {
            prmInputRefs.current[index + 1]?.focus();
        }
    }

    function prmHandleKeyDown(
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ): void {
        if (event.key === "Backspace" && !prmDigits[index] && index > 0) {
            prmInputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            prmInputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < 5) {
            event.preventDefault();
            prmInputRefs.current[index + 1]?.focus();
        }
    }

    function prmHandlePaste(event: ClipboardEvent<HTMLInputElement>): void {
        event.preventDefault();

        const prmPastedCode = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!prmPastedCode) {
            return;
        }

        onChange(prmPastedCode);
        prmInputRefs.current[Math.min(prmPastedCode.length, 6) - 1]?.focus();
    }

    return (
        <div className="prm-otp-inputs" dir="ltr">
            {prmDigits.map((prmDigit, prmIndex) => (
                <input
                    key={prmIndex}
                    ref={(element) => {
                        prmInputRefs.current[prmIndex] = element;
                    }}
                    className="prm-otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete={prmIndex === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={prmDigit}
                    onChange={(event) =>
                        prmHandleChange(prmIndex, event.target.value)
                    }
                    onKeyDown={(event) => prmHandleKeyDown(prmIndex, event)}
                    onPaste={prmHandlePaste}
                    disabled={disabled}
                    aria-label={t("otpDigitAriaLabel", {
                        number: prmIndex + 1,
                    })}
                />
            ))}
        </div>
    );
}
