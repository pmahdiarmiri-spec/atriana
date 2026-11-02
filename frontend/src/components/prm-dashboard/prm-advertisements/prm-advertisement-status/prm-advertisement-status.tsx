import { ReactNode } from "react";
import { PrmAdvertisementItem } from "@/lib/prm-advertisements/prm-advertisements-api";

interface PrmAdvertisementStatusProps {
    status: PrmAdvertisementItem["status"];
}

const prmStatuses = {
    pending: {
        label: "در انتظار بررسی",
        description: "آگهی ثبت شده و هنوز بررسی نشده است.",
    },
    approved: {
        label: "تأیید شده",
        description: "آگهی تأیید شده و آمادهٔ نمایش است.",
    },
    rejected: {
        label: "رد شده",
        description: "آگهی تأیید نشده است؛ توضیح مدیر را بررسی کنید.",
    },
    expired: {
        label: "منقضی شده",
        description: "مدت اعتبار این آگهی به پایان رسیده است.",
    },
};

export function PrmAdvertisementStatus({
    status,
}: PrmAdvertisementStatusProps): ReactNode {
    const state = prmStatuses[status];

    return (
        <span
            className={`prm-ad-badge prm-ad-badge-${status} prm-ad-status`}
            title={state.description}
            aria-label={`وضعیت آگهی: ${state.label}`}
        >
            <span className="prm-ad-status-dot" aria-hidden="true" />
            {state.label}
        </span>
    );
}

export function prmGetAdvertisementStatusDescription(
    status: PrmAdvertisementItem["status"],
): string {
    return prmStatuses[status].description;
}
