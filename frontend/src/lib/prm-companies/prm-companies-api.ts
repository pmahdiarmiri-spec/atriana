import {
  PrmCompany,
  PrmCompanyFormData,
  PrmIndustry,
  PrmCompanyValidationError,
} from "@/types/prm-company";

const prmApiBaseUrl =
  process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

export class PrmCompanyApiError extends Error {
  public errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "PrmCompanyApiError";
    this.errors = errors;
  }
}

async function prmCompanyRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${prmApiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as PrmCompanyValidationError | null;
    throw new PrmCompanyApiError(
      errorData?.message ?? "خطایی در برقراری ارتباط با سرور رخ داد.",
      errorData?.errors
    );
  }

  return data as T;
}

export function prmGetMyCompany(
  token: string
): Promise<{ status: string; company: PrmCompany | null }> {
  return prmCompanyRequest("/v1/companies/my", token, {
    method: "GET",
  });
}

export function prmGetCompanyIndustries(
  token: string
): Promise<{ status: string; industries: PrmIndustry[] }> {
  return prmCompanyRequest("/v1/companies/industries", token, {
    method: "GET",
  });
}

export function prmSaveCompanyDraft(
  token: string,
  payload: Partial<PrmCompanyFormData>
): Promise<{ status: string; company: PrmCompany }> {
  return prmCompanyRequest("/v1/companies/my/draft", token, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function prmUploadCompanyFile(
  token: string,
  type: "logo" | "cover" | "catalog" | "resume" | "gallery" | "certs",
  files: File | File[]
): Promise<{ status: string; company: PrmCompany }> {
  const formData = new FormData();
  formData.append("type", type);

  if (Array.isArray(files)) {
    files.forEach((file) => formData.append("files[]", file));
  } else {
    formData.append("file", files);
  }

  return prmCompanyRequest("/v1/companies/my/upload", token, {
    method: "POST",
    body: formData,
  });
}

export function prmGetCompanyPaymentQuote(
  token: string
): Promise<{ status: string; amount_rials: number }> {
  return prmCompanyRequest("/v1/company-payments/my/quote", token, {
    method: "GET",
  });
}

export function prmSubmitCompany(
  token: string,
  paymentMethod: "fake" = "fake"
): Promise<{ status: string; company: PrmCompany; payment: any }> {
  return prmCompanyRequest("/v1/companies/my/submit", token, {
    method: "POST",
    body: JSON.stringify({ payment_method: paymentMethod }),
  });
}
