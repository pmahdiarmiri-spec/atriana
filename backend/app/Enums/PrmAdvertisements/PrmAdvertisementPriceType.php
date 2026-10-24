<?php

namespace App\Enums\PrmAdvertisements;

enum PrmAdvertisementPriceType: string
{
    case FIXED = 'fixed';
    case AGREEMENT = 'agreement';
    case CALL = 'call';
}
