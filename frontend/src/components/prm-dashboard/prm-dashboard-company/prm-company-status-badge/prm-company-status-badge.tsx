"use client";

import { ReactNode } from "react";
import { PrmCompanyStatus } from "@/types/prm-company";

interface PrmCompanyStatusBadgeProps {
  status: PrmCompanyStatus;
}

const statusMap: Record<PrmCompanyStatus, { label: string; className: string }> = {
  draft: { label: "پیش‌نویس", className: "prm-status-draft" },
  pending: { label: "در انتظار بررسی ادمین", className: "prm-status-pending" },
  approved: { label: "تایید شده (فعال)", className: "prm-status-approved" },
  rejected: { label: "رد شده", className: "prm-status-rejected" },
  needs_edit: { label: "نیازمند ویرایش", className: "prm-status-needs_edit" },
  expired: { label: "منقضی شده (نیازمند تمدید)", className: "prm-status-rejected" },
};

export function PrmCompanyStatusBadge({ status }: PrmCompanyStatusBadgeProps): ReactNode {
  const current = statusMap[status] ?? { label: status, className: "prm-status-draft" };

  return (
    <span className={`prm-status-badge ${current.className}`}>
      {current.label}
    </span>
  );
}
