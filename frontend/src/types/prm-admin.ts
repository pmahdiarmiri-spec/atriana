import { PrmTradeRole, PrmUser } from "@/types/prm-auth";

export type PrmRole = "super_admin" | "admin" | "user";

export interface PrmAdminUser extends PrmUser {
    role: PrmRole;
    permissions: string[] | null;
    is_active: boolean;
    last_login_at: string | null;
    last_login_ip: string | null;
}

export interface PrmAdminOtpChallengeResponse {
    status: "success";
    code: "prm_admin_otp_required";
    requires_otp: true;
    challenge_token: string;
    masked_mobile: string;
    expires_in: number;
}

export interface PrmAdminAuthResponse {
    status: "success";
    code: string;
    admin: PrmAdminUser;
    token: string;
    token_type: "Bearer";
    redirect_to?: string;
}

export interface PrmGateSlugMetadataResponse {
    status: "success";
    code: string;
    gate_slug?: string;
    new_gate_slug?: string;
    expires_at: string;
    remaining_seconds: number;
    ttl_minutes: number;
    is_one_time: boolean;
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

export interface PrmAuditTelemetry {
    ip_address?: string;
    forwarded_ips?: string[];
    cf_connecting_ip?: string | null;
    x_real_ip?: string | null;
    user_agent_raw?: string;
    os_platform?: string;
    browser?: string;
    device_type?: string;
    sec_ch_ua?: string | null;
    sec_ch_ua_platform?: string | null;
    sec_ch_ua_mobile?: string | null;
    accept_language?: string | null;
    authenticated_at_iso?: string;
    authenticated_at_unix?: number;
    timezone?: string;
}

export interface PrmAuditLog {
    id: number;
    user_id: number | null;
    action: string;
    target_type: string | null;
    target_id: number | null;
    payload: {
        identifier?: string;
        mobile_masked?: string;
        role?: PrmRole;
        gate_slug_consumed?: boolean;
        previous_login_at?: string | null;
        previous_login_ip?: string | null;
        telemetry?: PrmAuditTelemetry;
        [key: string]: unknown;
    } | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        mobile?: string;
        role: PrmRole;
        last_login_at?: string | null;
        last_login_ip?: string | null;
    };
}
