"use client";

import { ReactNode } from "react";
import { PrmPlanStatusData } from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowPlanBadgeProps {
    plan: PrmPlanStatusData | null;
}

export function PrmTradeFlowPlanBadge({
    plan,
}: PrmTradeFlowPlanBadgeProps): ReactNode {
    return (
        <div className="prm-tf-plan-badge">
            <span className="prm-tf-plan-dot" />
            <span>{plan?.plan_name || "پلن سازمانی فعال"}</span>
        </div>
    );
}
