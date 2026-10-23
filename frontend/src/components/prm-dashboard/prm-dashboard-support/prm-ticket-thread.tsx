"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PrmTicket, PrmTicketMessage } from "@/types/prm-support";

interface PrmTicketThreadProps {
  ticket: PrmTicket | null;
  isLoading: boolean;
  isSending: boolean;
  onBack: () => void;
  onSendMessage: (message: string) => Promise<boolean>;
  onCloseTicket: () => Promise<void>;
}

export function PrmTicketThread({
  ticket,
  isLoading,
  isSending,
  onBack,
  onSendMessage,
  onCloseTicket,
}: PrmTicketThreadProps): ReactNode {
  const t = useTranslations("dashboard.support");

  const [prmReply, setPrmReply] = useState("");
  const [prmReplyError, setPrmReplyError] = useState("");
  const prmMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prmMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  if (isLoading || !ticket) {
    return (
      <div className="prm-support-loading">
        <div className="prm-support-spinner" />
      </div>
    );
  }

  const prmHandleSend = async (): Promise<void> => {
    setPrmReplyError("");

    if (prmReply.trim().length < 2) {
      setPrmReplyError(t("thread.errors.empty"));
      return;
    }

    const prmSuccess = await onSendMessage(prmReply.trim());

    if (prmSuccess) {
      setPrmReply("");
    }
  };

  const prmIsClosed = ticket.status === "closed";

  const prmRenderMessage = (message: PrmTicketMessage): ReactNode => (
    <div
      key={message.id}
      className={`prm-support-message ${message.sender === "admin" ? "prm-support-message-admin" : "prm-support-message-user"}`}
    >
      <div className="prm-support-message-header">
        <strong>
          {message.sender === "admin"
            ? t("thread.adminName")
            : message.user?.name || message.user?.first_name || t("thread.userName")}
        </strong>
        <span>
          {new Date(message.created_at).toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p>{message.message}</p>
    </div>
  );

  return (
    <div className="prm-support-thread">
      <div className="prm-support-thread-header">
        <button type="button" className="prm-support-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="prm-support-thread-info">
          <h2>{ticket.subject}</h2>
          <span>#{ticket.ticket_number}</span>
        </div>
        <span className={`prm-support-badge prm-support-status-${ticket.status}`}>
          {t(`status.${ticket.status}`)}
        </span>
        {!prmIsClosed && (
          <button
            type="button"
            className="prm-support-close-btn"
            onClick={onCloseTicket}
          >
            {t("thread.closeTicket")}
          </button>
        )}
      </div>

      <div className="prm-support-messages">
        {ticket.messages?.map(prmRenderMessage)}
        <div ref={prmMessagesEndRef} />
      </div>

      {prmIsClosed ? (
        <div className="prm-support-closed-notice">{t("thread.closedNotice")}</div>
      ) : (
        <div className="prm-support-reply-box">
          {prmReplyError && <div className="prm-support-error">{prmReplyError}</div>}
          <textarea
            rows={3}
            maxLength={5000}
            value={prmReply}
            onChange={(event) => setPrmReply(event.target.value)}
            placeholder={t("thread.replyPlaceholder")}
          />
          <button
            type="button"
            className="prm-support-btn-primary"
            onClick={prmHandleSend}
            disabled={isSending}
          >
            {isSending ? t("thread.sending") : t("thread.send")}
          </button>
        </div>
      )}
    </div>
  );
}
