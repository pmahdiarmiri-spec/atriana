<?php

namespace App\Enums\PrmSubscription;

enum PrmSubscriptionStatus: string
{
    case ACTIVE = 'active';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';
    case PENDING = 'pending';
}
