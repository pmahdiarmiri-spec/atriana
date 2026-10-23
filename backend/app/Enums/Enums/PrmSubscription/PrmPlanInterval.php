<?php

namespace App\Enums\PrmSubscription;

enum PrmPlanInterval: string
{
    case MONTHLY = 'monthly';
    case QUARTERLY = 'quarterly';
    case YEARLY = 'yearly';
    case LIFETIME = 'lifetime';
}
