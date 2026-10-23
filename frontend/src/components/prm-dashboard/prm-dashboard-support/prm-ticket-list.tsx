"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PrmTicket } from "@/types/prm-support";

interface PrmTicketListProps {
  tickets: PrmTicket[];
  isLoading: boolean;
  onTicketSelect: (ticketId: number) => void;
  onNewTicket: () => void;
}

export function PrmTicketList({
  tickets,
  isLoading,
  onTicketSelect,
  onNewTicket,
}: PrmTicketListProps): ReactNode {
  const t = useTranslations("dashboard.support");

  if (isLoading) {
    return (
      <div className="prm-support-loading">
        <div className="prm-support-spinner" />
      </div>
    );
  }

  return (
    <div className="prm-support-list">
      <div className="prm-support-list-header">
        <h2>{t("list.title")}</h2>
        <button
          type="button"
          className="prm-support-btn-primary"
          onClick={onNewTicket}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t("list.newTicket")}
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="prm-support-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>{t("list.empty")}</p>
          <button
            type="button"
            className="prm-support-btn-primary"
            onClick={onNewTicket}
          >
            {t("list.newTicket")}
          </button>
        </div>
      ) : (
        <div className="prm-support-tickets">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              className="prm-support-ticket-card"
              onClick={() => onTicketSelect(ticket.id)}
            >
              <div className="prm-support-ticket-top">
                <span className="prm-support-ticket-number">
                  #{ticket.ticket_number}
                </span>
                <span className={`prm-support-badge prm-support-status-${ticket.status}`}>
                  {t(`status.${ticket.status}`)}
                </span>
              </div>
              <h3>{ticket.subject}</h3>
              <div className="prm-support-ticket-bottom">
                <span>
                  {ticket.category
                    ? t("categoryLabel", { name: ticket.category.name_fa })
                    : ""}
                </span>
                <span className="prm-support-ticket-meta">
                  {t("replies", { count: ticket.messages_count ?? 0 })} ·{" "}
                  {new Date(ticket.last_reply_at ?? ticket.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
