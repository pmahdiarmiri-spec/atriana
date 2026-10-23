<?php

namespace App\Enums\PrmCompanies;

enum PrmCompanyActivityType: string
{
    case PRODUCTION = 'production';
    case DISTRIBUTION = 'distribution';
    case TRADING = 'trading';
}
