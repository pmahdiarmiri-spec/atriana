export type PrmCompanyStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "needs_edit"
  | "expired";

export type PrmCompanyActivityType =
  | "production"
  | "distribution"
  | "trading";

export interface PrmCountry {
  id: number;
  name_fa: string;
  name_en: string | null;
}

export interface PrmProvince {
  id: number;
  country_id: number;
  name_fa: string;
  name_en: string | null;
}

export interface PrmCity {
  id: number;
  province_id: number;
  name_fa: string;
  name_en: string | null;
}

export interface PrmIndustry {
  id: number;
  name_fa: string;
  name_en: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface PrmCompany {
  id: number;
  views_count: number;
  user_id: number;
  status: PrmCompanyStatus;
  admin_message: string | null;
  name_fa: string;
  name_en: string | null;
  slogan: string | null;
  description: string | null;
  email: string | null;
  mobile: string | null;
  country: string | null;
  phone: string | null;
  fax: string | null;
  website: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  registration_number: string | null;
  national_id: string | null;
  economic_code: string | null;
  established_year: number | null;
  legal_structure: string | null;
  ownership_type: string | null;
  activity_type: PrmCompanyActivityType | null;
  is_knowledge_based: boolean;
  is_creative: boolean;
  is_startup: boolean;
  is_exporter: boolean;
  has_iso: boolean;
  is_emc: boolean;
  employee_count: string | null;
  annual_revenue: string | null;
  industry_id: number | null;
  industry: PrmIndustry | null;
  main_products: string | null;
  service_id: number | null;
  product_category_id: number | null;
  production_capacity: string | null;
  business_model: string | null;
  certifications: string | null;
  major_clients: string | null;
  activity_scope: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_telegram: string | null;
  social_whatsapp: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  social_aparat: string | null;
  logo_path: string | null;
  cover_path: string | null;
  catalog_path: string | null;
  resume_path: string | null;
  gallery_paths: string[] | null;
  cert_paths: string[] | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
  created_at: string | null;
  updated_at: string | null;
  gallery_images: string[];
  cert_images: string[];
  catalog_file: string | null;
  resume_file: string | null;
  logo_url: string | null;
  cover_url: string | null;
}

export type PrmCompanyFormData = Omit<
  PrmCompany,
  | "id"
  | "views_count"
  | "user_id"
  | "status"
  | "admin_message"
  | "industry"
  | "submitted_at"
  | "approved_at"
  | "rejected_at"
  | "expires_at"
  | "is_expired"
  | "created_at"
  | "updated_at"
  | "gallery_images"
  | "cert_images"
  | "catalog_file"
  | "resume_file"
  | "logo_url"
  | "cover_url"
>;

export interface PrmCompanyValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PrmPublicCompanyFilterParams {
  q?: string;
  industry_id?: number | string;
  activity_type?: PrmCompanyActivityType | "";
  province?: string;
  city?: string;
  is_knowledge_based?: boolean;
  is_exporter?: boolean;
  has_iso?: boolean;
  is_startup?: boolean;
  is_creative?: boolean;
  is_emc?: boolean;
  sort?: "newest" | "popular" | "oldest";
  page?: number;
  per_page?: number;
}

export interface PrmPublicCompaniesDirectoryResponse {
  status: string;
  code: string;
  companies: PrmCompany[];
  stats: {
    active_companies: number;
    covered_cities: number;
  };
  filters_meta: {
    cities: string[];
    provinces: string[];
    industries: PrmIndustry[];
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PrmPublicCompanyDetailResponse {
  status: string;
  code: string;
  company: PrmCompany;
}
