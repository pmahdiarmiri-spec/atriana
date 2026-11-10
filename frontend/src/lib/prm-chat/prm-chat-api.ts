import { api } from "@/lib/api";

export interface PrmChatMessage {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string;
    read_at: string | null;
    created_at: string;
    sender_name: string;
}

export interface PrmChatConversation {
    id: number;
    advertisement_id: number | null;
    advertisement: {
        id: number;
        title: string;
        slug: string;
        price: string | null;
        currency: string | null;
        image_url: string | null;
    } | null;
    other_user: {
        id: number;
        name: string;
        company_name: string | null;
    } | null;
    last_message: PrmChatMessage | null;
    unread_count: number;
    last_message_at: string | null;
    created_at: string;
}

export async function prmGetConversations(token: string): Promise<PrmChatConversation[]> {
    const response = await api.get("/v1/chat/conversations", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export async function prmGetConversationDetails(
    token: string,
    id: number,
): Promise<{ conversation: PrmChatConversation; messages: PrmChatMessage[] }> {
    const response = await api.get(`/v1/chat/conversations/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function prmInitiateConversation(
    token: string,
    advertisementId: number,
    message?: string,
): Promise<PrmChatConversation> {
    const response = await api.post(
        "/v1/chat/conversations/initiate",
        {
            advertisement_id: advertisementId,
            message: message,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response.data.data;
}

export async function prmSendMessage(
    token: string,
    conversationId: number,
    body: string,
): Promise<PrmChatMessage> {
    const response = await api.post(
        `/v1/chat/conversations/${conversationId}/messages`,
        { body },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response.data.data;
}

export async function prmMarkConversationAsRead(
    token: string,
    conversationId: number,
): Promise<void> {
    await api.post(
        `/v1/chat/conversations/${conversationId}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}
