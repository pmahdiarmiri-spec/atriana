<?php

namespace App\Actions\PrmAdmin;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PrmFetchFilteredUsersAction
{
    public function execute(array $filters): LengthAwarePaginator
    {
        $query = User::query()->with(['country', 'province', 'city', 'activeSubscription']);

        if (! empty($filters['search'])) {
            $search = '%' . trim((string) $filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('mobile', 'like', $search);
            });
        }

        if (! empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (! empty($filters['trade_role'])) {
            $query->where('trade_role', $filters['trade_role']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['country_id'])) {
            $query->where('country_id', (int) $filters['country_id']);
        }

        $sortField = in_array($filters['sort_by'] ?? null, ['id', 'created_at', 'last_login_at', 'name'], true)
            ? $filters['sort_by']
            : 'id';

        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortField, $sortOrder)->paginate((int) ($filters['per_page'] ?? 20));
    }
}
