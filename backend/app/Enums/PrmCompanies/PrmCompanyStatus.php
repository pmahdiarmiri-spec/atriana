<?php

namespace App\Enums\PrmCompanies;

enum PrmCompanyStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case NEEDS_EDIT = 'needs_edit';
}
