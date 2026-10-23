import { PrmAuthApiError } from "@/lib/prm-auth/prm-auth-api";
import {
  PrmTicket,
  PrmTicketCategory,
  PrmTicketMessage,
  PrmTicketPriority,
  PrmTicketStatus,
} from "@/types/prm-support";

const prmApiBaseUrl =
  process.env.NEXT_PUBLIC_PRM_API_URL ?? "http://localhost:8000/api";

interface PrmApiErrorResponse {
  status?: "error";
  code?: string;
}

async function prmSupportRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  let prmResponse: Response;

  try {
    prmResponse = await fetch(`${prmApiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch {
    throw new PrmAuthApiError("prm_support_request_failed");
  }

  const prmResponseData = (await prmResponse
    .json()
    .catch(() => null)) as T | PrmApiErrorResponse | null;

  if (!prmResponse.ok) {
    const prmErrorData = prmResponseData as PrmApiErrorResponse | null;

    throw new PrmAuthApiError(
      prmErrorData?.code ?? "prm_support_request_failed",
    );
  }

  return prmResponseData as T;
}

export function prmGetTicketCategories(
  token: string,
): Promise<{ status: "success"; categories: PrmTicketCategory[] }> {
  return prmSupportRequest("/v1/support/categories", token, {
    method: "GET",
  });
}

export function prmGetTickets(
  token: string,
): Promise<{ status: "success"; tickets: PrmTicket[] }> {
  return prmSupportRequest("/v1/support/tickets", token, {
    method: "GET",
  });
}

export function prmCreateTicket(
  token: string,
  payload: {
    categoryId: number;
    subject: string;
    message: string;
    priority: PrmTicketPriority;
  },
): Promise<{ status: "success"; ticket: PrmTicket }> {
  return prmSupportRequest("/v1/support/tickets", token, {
    method: "POST",
    body: JSON.stringify({
      category_id: payload.categoryId,
      subject: payload.subject,
      message: payload.message,
      priority: payload.priority,
    }),
  });
}

export function prmGetTicket(
  token: string,
  ticketId: number,
): Promise<{ status: "success"; ticket: PrmTicket }> {
  return prmSupportRequest(`/v1/support/tickets/${ticketId}`, token, {
    method: "GET",
  });
}

export function prmAddTicketMessage(
  token: string,
  ticketId: number,
  message: string,
): Promise<{ status: "success"; message: PrmTicketMessage }> {
  return prmSupportRequest(`/v1/support/tickets/${ticketId}/messages`, token, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export function prmCloseTicket(
  token: string,
  ticketId: number,
): Promise<{ status: "success"; ticket: PrmTicket }> {
  return prmSupportRequest(`/v1/support/tickets/${ticketId}/close`, token, {
    method: "POST",
  });
}
