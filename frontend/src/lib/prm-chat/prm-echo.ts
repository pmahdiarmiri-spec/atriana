import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

export function prmInitEcho(token: string): Echo | null {
    if (typeof window === "undefined") {
        return null;
    }

    window.Pusher = Pusher;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.atriana.test/api";
    const host = process.env.NEXT_PUBLIC_REVERB_HOST || "api.atriana.test";
    const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080);
    const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http";
    const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY || "atriana-key";

    return new Echo({
        broadcaster: "reverb",
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === "https",
        enabledTransports: ["ws", "wss"],
        authEndpoint: `${apiUrl}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });
}
