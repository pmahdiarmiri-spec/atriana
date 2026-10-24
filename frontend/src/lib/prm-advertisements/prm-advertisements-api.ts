import { api } from '@/lib/api';

export type PrmAdNature = 'goods' | 'services';
export type PrmAdType = 'offer' | 'demand';
export type PrmAdOrigin = 'domestic' | 'export' | 'import';
export type PrmAdPriceType = 'fixed' | 'agreement' | 'call';

export interface PrmAdvertisementItem {
    id: number;
    user_id: number;
    company_id: number | null;
    use_company_profile: boolean;
    locale: string;
    type: PrmAdType;
    origin: PrmAdOrigin;
    nature: PrmAdNature;
    category: string;
    sub_category: string | null;
    title: string;
    title_en: string | null;
    slug: string;
    province: string | null;
    city: string | null;
    address: string | null;
    description: string;
    description_en: string | null;
    price_type: PrmAdPriceType;
    price: string | null;
    currency: string;
    moq: string | null;
    moq_unit: string | null;
    delivery_time: string | null;
    delivery_type: string | null;
    payment_terms: string | null;
    quality_grade: string | null;
    video_link: string | null;
    company_name: string | null;
    business_type: string | null;
    activity_type: string | null;
    experience: string | null;
    licenses: string | null;
    phone: string | null;
    show_phone: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    admin_note: string | null;
    payment_status: string;
    request_verified_badge: boolean;
    has_verified_badge: boolean;
    is_laddered: boolean;
    request_ladder: boolean;
    views: number;
    hr_full_name: string | null;
    hr_national_code: string | null;
    hr_email: string | null;
    hr_job_title: string | null;
    hr_gender: string | null;
    hr_count: number | null;
    hr_age_range: string | null;
    hr_salary: string | null;
    hr_work_area: string | null;
    hr_work_hours: string | null;
    hr_education: string | null;
    hr_study_field: string | null;
    hr_skills_desc: string | null;
    applicant_full_name: string | null;
    applicant_national_code: string | null;
    applicant_birth_date: string | null;
    applicant_education: string | null;
    applicant_study_field: string | null;
    applicant_marital_status: string | null;
    applicant_military_service: string | null;
    applicant_employment_type: string | null;
    applicant_preferred_companies: string | null;
    applicant_postal_address: string | null;
    applicant_mobile: string | null;
    applicant_phone: string | null;
    applicant_email: string | null;
    applicant_skills_experience: string | null;
    applicant_resume_path: string | null;
    applicant_terms_accepted: boolean;
    created_at: string;
    updated_at: string;
}

export interface PrmAdvertisementPayload {
    locale?: string;
    type: PrmAdType;
    origin: PrmAdOrigin;
    nature: PrmAdNature;
    category: string;
    sub_category?: string;
    title: string;
    title_en?: string;
    province?: string;
    city?: string;
    address?: string;
    description: string;
    description_en?: string;
    price_type: PrmAdPriceType;
    price?: number | null;
    currency?: string;
    moq?: number | null;
    moq_unit?: string;
    delivery_time?: string;
    delivery_type?: string;
    payment_terms?: string;
    quality_grade?: string;
    video_link?: string;
    company_name?: string;
    business_type?: string;
    activity_type?: string;
    experience?: string;
    licenses?: string;
    phone?: string;
    show_phone?: boolean;
    use_company_profile?: boolean;
    request_verified_badge?: boolean;
    request_ladder?: boolean;
    hr_full_name?: string;
    hr_national_code?: string;
    hr_email?: string;
    hr_job_title?: string;
    hr_gender?: string;
    hr_count?: number;
    hr_age_range?: string;
    hr_salary?: string;
    hr_work_area?: string;
    hr_work_hours?: string;
    hr_education?: string;
    hr_study_field?: string;
    hr_skills_desc?: string;
    applicant_full_name?: string;
    applicant_national_code?: string;
    applicant_birth_date?: string;
    applicant_education?: string;
    applicant_study_field?: string;
    applicant_marital_status?: string;
    applicant_military_service?: string;
    applicant_employment_type?: string;
    applicant_preferred_companies?: string;
    applicant_postal_address?: string;
    applicant_mobile?: string;
    applicant_phone?: string;
    applicant_email?: string;
    applicant_skills_experience?: string;
    applicant_terms_accepted?: boolean;
}

export interface PrmAdvertisementMetaResponse {
    status: string;
    has_company: boolean;
    company: {
        id: number;
        name_fa: string;
        name_en: string | null;
        phone: string | null;
        province: string | null;
        city: string | null;
        address: string | null;
        status: string;
    } | null;
    categories: {
        goods_fa: string[];
        goods_en: string[];
        services_fa: string[];
        services_en: string[];
    };
}

export async function prmGetAdvertisementsMeta(token: string): Promise<PrmAdvertisementMetaResponse> {
    const response = await api.get('/v1/advertisements/meta', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function prmGetMyAdvertisements(token: string): Promise<PrmAdvertisementItem[]> {
    const response = await api.get('/v1/advertisements/my', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export async function prmCreateAdvertisement(token: string, payload: PrmAdvertisementPayload): Promise<PrmAdvertisementItem> {
    const response = await api.post('/v1/advertisements/my', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.advertisement;
}
