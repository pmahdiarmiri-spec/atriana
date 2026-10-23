import { PrmTradeRole, PrmUser } from "@/types/prm-auth";

export type PrmRole = "super_admin" | "admin" | "user";

export interface PrmAdminUser extends PrmUser {
    role: PrmRole;
    permissions: string[] | null;
    is_active: boolean;
    last_login_at: string | null;
    last_login_ip: string | null;
}

export interface PrmAdminAuthResponse {
    status: "success";
    code: string;
    admin: PrmAdminUser;
    token: string;
    token_type: "Bearer";
}

export interface PrmPaginatedResponse<T> {
    status: "success";
    code: string;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface PrmAuditLog {
    id: number;
    user_id: number;
    action: string;
    target_type: string | null;
    target_id: number | null;
    payload: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: PrmRole;
    };
}
