<?php

namespace App\Enums\PrmAdvertisements;

enum PrmAdvertisementOrigin: string
{
    case DOMESTIC = 'domestic';
    case EXPORT = 'export';
    case IMPORT = 'import';
}
