import { PrmAuthApiError } from "@/lib/prm-auth/prm-auth-api";

export function prmMaskIdentifier(identifier: string): string {
    if (identifier.includes("@")) {
        const [prmLocalPart, prmDomain] = identifier.split("@");
        const prmVisibleLocalPart = prmLocalPart.slice(0, 2);
        const prmMaskedLocalPart = "*".repeat(
            Math.max(prmLocalPart.length - 2, 3),
        );

        return `${prmVisibleLocalPart}${prmMaskedLocalPart}@${prmDomain}`;
    }

    if (identifier.length < 7) {
        return identifier;
    }

    return `${identifier.slice(0, 4)}${"*".repeat(
        Math.max(identifier.length - 7, 3),
    )}${identifier.slice(-3)}`;
}

export function prmFormatRemainingSeconds(seconds: number): string {
    const prmMinutes = Math.floor(seconds / 60);
    const prmSeconds = seconds % 60;

    return `${String(prmMinutes).padStart(2, "0")}:${String(
        prmSeconds,
    ).padStart(2, "0")}`;
}

export function prmGetApiErrorCode(error: unknown): string {
    if (error instanceof PrmAuthApiError) {
        return error.prmCode;
    }

    return "prm_auth_request_failed";
}
