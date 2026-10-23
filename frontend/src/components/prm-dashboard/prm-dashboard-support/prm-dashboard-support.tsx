"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  prmAddTicketMessage,
  prmCloseTicket,
  prmCreateTicket,
  prmGetTicket,
  prmGetTicketCategories,
  prmGetTickets,
} from "@/lib/prm-support/prm-support-api";
import { PrmAuthApiError } from "@/lib/prm-auth/prm-auth-api";
import {
  PrmTicket,
  PrmTicketCategory,
  PrmTicketPriority,
} from "@/types/prm-support";
import { PrmTicketList } from "./prm-ticket-list";
import { PrmTicketNewForm } from "./prm-ticket-new-form";
import { PrmTicketThread } from "./prm-ticket-thread";
import "@/styles/dashboard/prm-support.css";

type PrmSupportView = "list" | "new" | "thread";

interface PrmDashboardSupportProps {
  token: string;
}

export function PrmDashboardSupport({ token }: PrmDashboardSupportProps): ReactNode {
  const t = useTranslations("dashboard.support");

  const [prmView, setPrmView] = useState<PrmSupportView>("list");
  const [prmTickets, setPrmTickets] = useState<PrmTicket[]>([]);
  const [prmCategories, setPrmCategories] = useState<PrmTicketCategory[]>([]);
  const [prmActiveTicket, setPrmActiveTicket] = useState<PrmTicket | null>(null);
  const [prmIsLoading, setPrmIsLoading] = useState(true);
  const [prmIsLoadingCategories, setPrmIsLoadingCategories] = useState(false);
  const [prmIsLoadingTicket, setPrmIsLoadingTicket] = useState(false);
  const [prmIsSubmitting, setPrmIsSubmitting] = useState(false);
  const [prmIsSending, setPrmIsSending] = useState(false);
  const [prmError, setPrmError] = useState("");

  const prmRefreshTickets = useCallback(async (): Promise<void> => {
    try {
      const prmResponse = await prmGetTickets(token);
      setPrmTickets(prmResponse.tickets);
    } catch {
      setPrmError(t("errors.loadFailed"));
    }
  }, [token, t]);

  const prmLoadCategories = useCallback(async (): Promise<void> => {
    setPrmIsLoadingCategories(true);

    try {
      const prmResponse = await prmGetTicketCategories(token);
      setPrmCategories(prmResponse.categories);
    } catch {
      setPrmError(t("errors.loadFailed"));
    } finally {
      setPrmIsLoadingCategories(false);
    }
  }, [token, t]);

  useEffect(() => {
    const prmInit = async (): Promise<void> => {
      setPrmIsLoading(true);
      await prmRefreshTickets();
      setPrmIsLoading(false);
    };

    prmInit();
  }, [prmRefreshTickets]);

  const prmHandleOpenNewTicket = (): void => {
    setPrmError("");

    if (prmCategories.length === 0 && !prmIsLoadingCategories) {
      prmLoadCategories();
    }

    setPrmView("new");
  };

  const prmHandleSelectTicket = async (ticketId: number): Promise<void> => {
    setPrmError("");
    setPrmView("thread");
    setPrmIsLoadingTicket(true);
    setPrmActiveTicket(null);

    try {
      const prmResponse = await prmGetTicket(token, ticketId);
      setPrmActiveTicket(prmResponse.ticket);
    } catch {
      setPrmError(t("errors.loadFailed"));
      setPrmView("list");
    } finally {
      setPrmIsLoadingTicket(false);
    }
  };

  const prmHandleCreateTicket = async (payload: {
    categoryId: number;
    subject: string;
    message: string;
    priority: PrmTicketPriority;
  }): Promise<boolean> => {
    setPrmIsSubmitting(true);
    setPrmError("");

    try {
      await prmCreateTicket(token, payload);
      await prmRefreshTickets();
      setPrmView("list");
      return true;
    } catch (prmException) {
      if (prmException instanceof PrmAuthApiError) {
        setPrmError(t("errors.createFailed"));
      }
      return false;
    } finally {
      setPrmIsSubmitting(false);
    }
  };

  const prmHandleSendMessage = async (message: string): Promise<boolean> => {
    if (!prmActiveTicket) {
      return false;
    }

    setPrmIsSending(true);

    try {
      await prmAddTicketMessage(token, prmActiveTicket.id, message);
      const prmResponse = await prmGetTicket(token, prmActiveTicket.id);
      setPrmActiveTicket(prmResponse.ticket);
      await prmRefreshTickets();
      return true;
    } catch {
      setPrmError(t("errors.sendFailed"));
      return false;
    } finally {
      setPrmIsSending(false);
    }
  };

  const prmHandleCloseTicket = async (): Promise<void> => {
    if (!prmActiveTicket) {
      return;
    }

    try {
      await prmCloseTicket(token, prmActiveTicket.id);
      await prmRefreshTickets();
      const prmResponse = await prmGetTicket(token, prmActiveTicket.id);
      setPrmActiveTicket(prmResponse.ticket);
    } catch {
      setPrmError(t("errors.closeFailed"));
    }
  };

  return (
    <div className="prm-support-container">
      {prmError && <div className="prm-support-error prm-support-global-error">{prmError}</div>}

      {prmView === "list" && (
        <PrmTicketList
          tickets={prmTickets}
          isLoading={prmIsLoading}
          onTicketSelect={prmHandleSelectTicket}
          onNewTicket={prmHandleOpenNewTicket}
        />
      )}

      {prmView === "new" && (
        <PrmTicketNewForm
          categories={prmCategories}
          isLoadingCategories={prmIsLoadingCategories}
          isSubmitting={prmIsSubmitting}
          onSubmit={prmHandleCreateTicket}
          onCancel={() => setPrmView("list")}
        />
      )}

      {prmView === "thread" && (
        <PrmTicketThread
          ticket={prmActiveTicket}
          isLoading={prmIsLoadingTicket}
          isSending={prmIsSending}
          onBack={() => setPrmView("list")}
          onSendMessage={prmHandleSendMessage}
          onCloseTicket={prmHandleCloseTicket}
        />
      )}
    </div>
  );
}
