<?php

namespace App\Enums\PrmAuth;

enum PrmTradeRole: string
{
    case EXPORTER = 'exporter';
    case IMPORTER = 'importer';
    case BOTH = 'both';
}
