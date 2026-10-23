import { PrmAuthSession } from "@/types/prm-auth";

const prmAuthStorageKey = "prm-atriana-auth-session";

export function prmSaveAuthSession(session: PrmAuthSession): void {
if (typeof window === "undefined") {
return;
}

sessionStorage.setItem(prmAuthStorageKey, JSON.stringify(session));
}

export function prmGetAuthSession(): PrmAuthSession | null {
if (typeof window === "undefined") {
return null;
}

const rawSession = sessionStorage.getItem(prmAuthStorageKey);

if (!rawSession) {
return null;
}

try {
return JSON.parse(rawSession) as PrmAuthSession;
} catch {
sessionStorage.removeItem(prmAuthStorageKey);
return null;
}
}

export function prmClearAuthSession(): void {
if (typeof window === "undefined") {
return;
}

sessionStorage.removeItem(prmAuthStorageKey);
}
