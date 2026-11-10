const prmApiBaseUrl =
    process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://api.atriana.test/api";

export interface PrmAdminChatReport {
    id: number;
    conversation_id: number;
    advertisement_id: number | null;
    reporter_id: number;
    reporter_name: string | null;
    reported_user_id: number;
    reported_user_name: string | null;
    message_id: number | null;
    message_body: string | null;
    reason: string;
    details: string | null;
    status: string;
    resolution_note: string | null;
    created_at: string;
}

export interface PrmAdminChatAction {
    id: number;
    action: string;
    previous_status: string;
    new_status: string;
    reason: string;
    admin_id: number;
    suspended_until: string | null;
    created_at: string;
}

export interface PrmAdminChatState {
    conversation_id: number;
    status: string;
    can_send: boolean;
    suspended_until: string | null;
    actions: PrmAdminChatAction[];
}

async function prmModerationRequest<T>(
    path: string,
    token: string,
    method = "GET",
    body?: object,
): Promise<T> {
    const response = await fetch(`${prmApiBaseUrl}${path}`, {
        method,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.message ?? `خطای سرور: ${response.status}`);
    }

    return result as T;
}

export async function prmAdminChatReports(
    token: string,
    status: string,
    page: number,
): Promise<{
    data: PrmAdminChatReport[];
    meta: { current_page: number; last_page: number; total: number };
}> {
    const params = new URLSearchParams({ status, page: String(page) });

    return prmModerationRequest(
        `/v1/admin/chat-moderation/reports?${params}`,
        token,
    );
}

export async function prmAdminUpdateChatReport(
    token: string,
    id: number,
    status: string,
    resolutionNote?: string,
): Promise<void> {
    await prmModerationRequest(
        `/v1/admin/chat-moderation/reports/${id}`,
        token,
        "PATCH",
        { status, resolution_note: resolutionNote },
    );
}

export async function prmAdminChatState(
    token: string,
    conversationId: number,
): Promise<PrmAdminChatState> {
    const response = await prmModerationRequest<{ data: PrmAdminChatState }>(
        `/v1/admin/chat-moderation/conversations/${conversationId}`,
        token,
    );

    return response.data;
}

export async function prmAdminApplyChatAction(
    token: string,
    conversationId: number,
    action: string,
    reason: string,
    suspendedUntil?: string,
): Promise<void> {
    await prmModerationRequest(
        `/v1/admin/chat-moderation/conversations/${conversationId}/actions`,
        token,
        "POST",
        {
            action,
            reason,
            ...(suspendedUntil ? { suspended_until: suspendedUntil } : {}),
        },
    );
}
