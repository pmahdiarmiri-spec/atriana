<?php

namespace App\Enums\PrmCompanies;

enum PrmCompanyUpdateStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case NEEDS_EDIT = 'needs_edit';
}
