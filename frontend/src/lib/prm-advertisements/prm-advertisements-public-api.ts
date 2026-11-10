import { api } from "@/lib/api";

export type PrmPublicAdNature = "goods" | "services";
export type PrmPublicAdType = "offer" | "demand";
export type PrmPublicAdPriceType = "fixed" | "agreement" | "call";

export interface PrmPublicAdImage {
  id: number;
  url: string;
  position: number;
  is_primary: boolean;
}

export interface PrmPublicAdvertisement {
  id: number;
  slug: string;
  type: PrmPublicAdType;
  origin: string;
  nature: PrmPublicAdNature;
  category: string;
  sub_category: string | null;
  title: string;
  title_en: string | null;
  image_url: string | null;
  images: PrmPublicAdImage[];
  province: string | null;
  city: string | null;
  description: string;
  price_type: PrmPublicAdPriceType;
  price: string | null;
  currency: string | null;
  moq: string | null;
  moq_unit: string | null;
  company_name: string | null;
  has_verified_badge: boolean;
  is_laddered: boolean;
  views: number;
  phone: string | null;
  created_at: string;
}

export interface PrmPublicAdsStats {
  total: number;
  goods_count: number;
  services_count: number;
  offers_count: number;
  demands_count: number;
}

export interface PrmPublicAdsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  stats: PrmPublicAdsStats;
}

export interface PrmPublicAdsFilters {
  nature?: PrmPublicAdNature | "";
  type?: PrmPublicAdType | "";
  origin?: string | "";
  category?: string | "";
  province?: string | "";
  city?: string | "";
  search?: string;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  per_page?: number;
}

export async function prmGetPublicAdvertisements(
  filters: PrmPublicAdsFilters = {},
): Promise<{ items: PrmPublicAdvertisement[]; meta: PrmPublicAdsMeta }> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const response = await api.get("/v1/advertisements", { params });

  return {
    items: response.data.data,
    meta: response.data.meta,
  };
}

export async function prmGetPublicAdvertisementBySlug(
  identifier: string,
): Promise<PrmPublicAdvertisement> {
  const response = await api.get(`/v1/advertisements/${identifier}`);
  return response.data.data;
}
