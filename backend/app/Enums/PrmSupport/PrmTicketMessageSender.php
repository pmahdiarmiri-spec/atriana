<?php

namespace App\Enums\PrmSupport;

enum PrmTicketMessageSender: string
{
    case USER = 'user';
    case ADMIN = 'admin';
}
