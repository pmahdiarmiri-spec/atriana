import { PrmRole } from "@/types/prm-admin";

export type PrmTicketStatus = "open" | "answered" | "pending_user" | "closed";

export type PrmTicketPriority = "low" | "normal" | "high" | "urgent";

export type PrmTicketMessageSender = "user" | "admin";

export interface PrmTicketCategory {
  id: number;
  slug: string;
  name_fa: string;
  name_en: string;
}

export interface PrmTicketUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  email?: string | null;
  mobile?: string | null;
  role?: PrmRole;
}

export interface PrmTicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  sender: PrmTicketMessageSender;
  message: string;
  read_at: string | null;
  created_at: string;
  user: PrmTicketUser;
}

export interface PrmTicket {
  id: number;
  user_id: number;
  category_id: number;
  ticket_number: string;
  subject: string;
  status: PrmTicketStatus;
  priority: PrmTicketPriority;
  last_reply_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  category?: PrmTicketCategory;
  messages?: PrmTicketMessage[];
  messages_count?: number;
  user?: PrmTicketUser;
}
