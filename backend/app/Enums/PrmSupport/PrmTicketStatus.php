<?php

namespace App\Enums\PrmSupport;

enum PrmTicketStatus: string
{
    case OPEN = 'open';
    case ANSWERED = 'answered';
    case PENDING_USER = 'pending_user';
    case CLOSED = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'باز',
            self::ANSWERED => 'پاسخ داده شده',
            self::PENDING_USER => 'در انتظار کاربر',
            self::CLOSED => 'بسته شده',
        };
    }
}
