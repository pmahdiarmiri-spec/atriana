export interface PrmPlan {
    id: number;
    slug: string;
    name_fa: string;
    name_en: string;
    description_fa: string | null;
    description_en: string | null;
    price: string | number;
    currency: string;
    interval: "monthly" | "quarterly" | "yearly" | "lifetime";
    features: string[] | null;
    is_active: boolean;
}

export interface PrmSubscription {
    id: number;
    user_id: number;
    plan_id: number;
    status: "active" | "expired" | "cancelled" | "pending";
    starts_at: string | null;
    ends_at: string | null;
    cancelled_at: string | null;
    meta_data?: Record<string, unknown> | null;
    plan: PrmPlan;
    created_at: string;
    updated_at: string;
}

export interface PrmSubscriptionOverviewResponse {
    status: "success";
    active_subscription: PrmSubscription | null;
    history_subscriptions: PrmSubscription[];
    available_plans: PrmPlan[];
}
