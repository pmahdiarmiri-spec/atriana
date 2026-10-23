<?php

namespace App\Enums\PrmAdmin;

enum PrmUserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case USER = 'user';

    public function isSuperAdmin(): bool
    {
        return $this === self::SUPER_ADMIN;
    }

    public function isAdmin(): bool
    {
        return $this === self::ADMIN || $this === self::SUPER_ADMIN;
    }
}
