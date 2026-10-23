<?php

namespace App\Enums\PrmSupport;

enum PrmTicketPriority: string
{
    case LOW = 'low';
    case NORMAL = 'normal';
    case HIGH = 'high';
    case URGENT = 'urgent';
}
