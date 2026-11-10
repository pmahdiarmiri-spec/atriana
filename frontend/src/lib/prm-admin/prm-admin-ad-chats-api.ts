import {
    PrmAdminAdChatAdvertisement,
    PrmAdminAdChatConversation,
    PrmAdminAdChatDetails,
    PrmAdminAdChatList,
} from "@/types/prm-admin-ad-chats";

const prmApiBaseUrl =
    process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://api.atriana.test/api";

async function prmAdChatRequest<T>(
    path: string,
    token: string,
    signal?: AbortSignal,
): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${prmApiBaseUrl}${path}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
            signal,
        });
    } catch (error) {
        if (signal?.aborted) {
            throw error;
        }

        throw new Error("ارتباط با سرور برقرار نشد.");
    }

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
            message?: string;
        } | null;

        throw new Error(body?.message ?? `خطای سرور: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export function prmAdminChatAdvertisements(
    token: string,
    page: number,
    search: string,
    signal?: AbortSignal,
): Promise<PrmAdminAdChatList<PrmAdminAdChatAdvertisement>> {
    const params = new URLSearchParams({
        page: String(page),
        search,
    });

    return prmAdChatRequest(
        `/v1/admin/ad-chats/ads?${params.toString()}`,
        token,
        signal,
    );
}

export function prmAdminChatConversations(
    token: string,
    advertisementId: number,
    page: number,
    search: string,
    signal?: AbortSignal,
): Promise<PrmAdminAdChatList<PrmAdminAdChatConversation>> {
    const params = new URLSearchParams({
        page: String(page),
        search,
    });

    return prmAdChatRequest(
        `/v1/admin/ad-chats/ads/${advertisementId}/conversations?${params.toString()}`,
        token,
        signal,
    );
}

export function prmAdminChatDetails(
    token: string,
    conversationId: number,
    page: number,
    signal?: AbortSignal,
): Promise<PrmAdminAdChatDetails> {
    return prmAdChatRequest(
        `/v1/admin/ad-chats/conversations/${conversationId}?page=${page}`,
        token,
        signal,
    );
}

export async function prmAdminDownloadChatAttachment(
    token: string,
    attachmentId: number,
    filename: string,
): Promise<void> {
    let response: Response;

    try {
        response = await fetch(
            `${prmApiBaseUrl}/v1/admin/ad-chats/attachments/${attachmentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            },
        );
    } catch {
        throw new Error("دریافت پیوست ممکن نشد.");
    }

    if (!response.ok) {
        throw new Error(`دریافت پیوست ناموفق بود: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename || `attachment-${attachmentId}`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
