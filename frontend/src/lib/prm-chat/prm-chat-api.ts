import { api } from "@/lib/api";

export type PrmChatAttachmentKind = "image" | "pdf" | "video" | "voice";

export interface PrmChatAttachment {
    id: number;
    kind: PrmChatAttachmentKind;
    name: string;
    mime: string;
    size: number;
}

export interface PrmChatMessage {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string | null;
    attachment: PrmChatAttachment | null;
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

export async function prmGetConversations(
    token: string,
): Promise<PrmChatConversation[]> {
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
): Promise<{
    conversation: PrmChatConversation;
    messages: PrmChatMessage[];
}> {
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
            message,
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
    file?: File,
    kind?: PrmChatAttachmentKind,
): Promise<PrmChatMessage> {
    const endpoint = `/v1/chat/conversations/${conversationId}/messages`;

    if (file) {
        if (!kind) {
            throw new Error("نوع پیوست مشخص نیست.");
        }

        const formData = new FormData();

        if (body.trim()) {
            formData.append("body", body.trim());
        }

        formData.append("kind", kind);
        formData.append("file", file);

        const response = await api.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined,
            },
        });

        return response.data.data;
    }

    const response = await api.post(
        endpoint,
        {
            body: body.trim(),
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return response.data.data;
}

export async function prmGetAttachmentBlob(
    token: string,
    attachmentId: number,
): Promise<Blob> {
    const response = await api.get(`/v1/chat/attachments/${attachmentId}`, {
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
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
