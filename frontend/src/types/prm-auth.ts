export type PrmAuthChannel = "email" | "sms";

export type PrmVerificationPurpose =
    | "registration"
    | "login"
    | "password_reset";

export type PrmTradeRole = "exporter" | "importer" | "both";

export type PrmAuthStep =
    | "identifier"
    | "login-method"
    | "otp"
    | "register"
    | "reset-password";

export interface PrmCountry {
    id: number;
    name_en: string;
    name_fa: string;
}

export interface PrmProvince {
    id: number;
    country_id: number;
    name_en: string;
    name_fa: string;
}

export interface PrmCity {
    id: number;
    province_id: number;
    name_en: string;
    name_fa: string;
}

export interface PrmUser {
    id: number;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    mobile: string | null;
    trade_role: PrmTradeRole;
    country_id?: number | null;
    province_id?: number | null;
    city_id?: number | null;
    custom_location?: string | null;
    email_verified_at: string | null;
    mobile_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PrmAuthSession {
    token: string;
    tokenType: string;
    user: PrmUser;
}

export interface PrmSendVerificationCodeResponse {
    status: "success";
    identifier: string;
    channel: PrmAuthChannel;
    is_existing_user: boolean;
    expires_in: number;
}

export interface PrmVerifyCodeResponse {
    status: "success";
    identifier: string;
    channel: PrmAuthChannel;
    is_new_user: boolean;
    verification_token: string;
}

export interface PrmAuthenticatedResponse {
    status: "success";
    user: PrmUser;
    token: string;
    token_type: string;
}
