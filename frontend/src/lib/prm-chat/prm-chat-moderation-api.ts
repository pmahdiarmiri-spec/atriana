import { api } from "@/lib/api";

export type PrmChatReportReason =
    | "spam"
    | "harassment"
    | "fraud"
    | "prohibited_content"
    | "other";

export type PrmChatModerationStatus =
    | "active"
    | "suspended"
    | "blocked"
    | "closed";

export interface PrmChatModeration {
    status: PrmChatModerationStatus;
    can_send: boolean;
    suspended_until: string | null;
}

export async function prmGetChatModeration(
    token: string,
    conversationId: number,
): Promise<PrmChatModeration> {
    const response = await api.get(
        `/v1/chat/conversations/${conversationId}/moderation`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return response.data.data;
}

export async function prmReportChat(
    token: string,
    conversationId: number,
    reason: PrmChatReportReason,
    details: string,
    messageId?: number,
): Promise<void> {
    await api.post(
        `/v1/chat/conversations/${conversationId}/reports`,
        {
            reason,
            details: details.trim() || undefined,
            message_id: messageId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}
