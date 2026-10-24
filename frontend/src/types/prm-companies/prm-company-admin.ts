import { PrmPaginatedResponse } from "@/types/prm-admin";

export type PrmCompanyStatusType =
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "needs_edit";

export interface PrmCompanyIndustry {
    id: number;
    name_fa: string;
    name_en?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

export interface PrmCompanyAdminDetails {
    id: number;
    views_count: number;
    user_id: number;
    status: PrmCompanyStatusType;
    admin_message?: string | null;
    name_fa: string;
    name_en?: string | null;
    slogan?: string | null;
    description?: string | null;
    email?: string | null;
    mobile?: string | null;
    country?: string | null;
    phone?: string | null;
    fax?: string | null;
    website?: string | null;
    province?: string | null;
    city?: string | null;
    address?: string | null;
    postal_code?: string | null;
    registration_number?: string | null;
    national_id?: string | null;
    economic_code?: string | null;
    established_year?: number | null;
    legal_structure?: string | null;
    ownership_type?: string | null;
    activity_type?: string | null;
    is_knowledge_based: boolean;
    is_creative: boolean;
    is_startup: boolean;
    is_exporter: boolean;
    has_iso: boolean;
    is_emc: boolean;
    employee_count?: string | null;
    annual_revenue?: string | null;
    industry?: PrmCompanyIndustry | null;
    industry_id?: number | null;
    main_products?: string | null;
    service_id?: number | null;
    product_category_id?: number | null;
    production_capacity?: string | null;
    business_model?: string | null;
    certifications?: string | null;
    major_clients?: string | null;
    activity_scope?: string | null;
    social_linkedin?: string | null;
    social_instagram?: string | null;
    social_telegram?: string | null;
    social_whatsapp?: string | null;
    social_twitter?: string | null;
    social_facebook?: string | null;
    social_youtube?: string | null;
    social_aparat?: string | null;
    logo_path?: string | null;
    cover_path?: string | null;
    catalog_path?: string | null;
    resume_path?: string | null;
    gallery_paths?: string[] | null;
    cert_paths?: string[] | null;
    gallery_images?: string[];
    cert_images?: string[];
    catalog_file?: string | null;
    resume_file?: string | null;
    logo_url?: string | null;
    cover_url?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    submitted_at?: string | null;
    approved_at?: string | null;
    rejected_at?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
        mobile?: string;
    } | null;
}

export type PrmAdminCompanyPagination = PrmPaginatedResponse<PrmCompanyAdminDetails>;
