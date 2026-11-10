export interface PrmAdminAdChatUser {
    id: number;
    name: string;
    email: string | null;
    mobile: string | null;
    company_name: string | null;
}

export interface PrmAdminAdChatAdvertisement {
    id: number;
    title: string;
    slug: string | null;
    price: number | string | null;
    currency: string | null;
    image_url: string | null;
    owner?: PrmAdminAdChatUser | null;
    conversation_count?: number;
}

export interface PrmAdminAdChatAttachment {
    id: number;
    kind: string;
    name: string;
    mime: string;
    size: number;
}

export interface PrmAdminAdChatMessage {
    id: number;
    sender_id: number;
    sender_name: string;
    body: string | null;
    created_at: string | null;
    read_at: string | null;
    attachment: PrmAdminAdChatAttachment | null;
}

export interface PrmAdminAdChatConversation {
    id: number;
    advertisement_id: number;
    creator: PrmAdminAdChatUser | null;
    recipient: PrmAdminAdChatUser | null;
    message_count: number;
    last_message_at: string | null;
    created_at: string | null;
    last_message: {
        id: number;
        sender_id: number;
        body: string | null;
        created_at: string | null;
        attachment: PrmAdminAdChatAttachment | null;
    } | null;
}

export interface PrmAdminAdChatMeta {
    current_page: number;
    last_page: number;
    total: number;
}

export interface PrmAdminAdChatList<T> {
    status: "success";
    code: string;
    data: T[];
    meta: PrmAdminAdChatMeta;
}

export interface PrmAdminAdChatDetails {
    status: "success";
    code: string;
    advertisement: PrmAdminAdChatAdvertisement | null;
    conversation: PrmAdminAdChatConversation;
    messages: PrmAdminAdChatMessage[];
    meta: PrmAdminAdChatMeta;
}
