<?php

namespace App\Enums\PrmAdvertisements;

enum PrmAdvertisementStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';
}
