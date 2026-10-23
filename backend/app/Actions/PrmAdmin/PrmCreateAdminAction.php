<?php

namespace App\Actions\PrmAdmin;

use App\Enums\PrmAdmin\PrmUserRole;
use App\Models\PrmAdminAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PrmCreateAdminAction
{
    public function execute(User $actor, array $data, ?string $ipAddress = null, ?string $userAgent = null): User
    {
        return DB::transaction(function () use ($actor, $data, $ipAddress, $userAgent) {
            $roleValue = 'admin';
            if (isset($data['role'])) {
                $roleValue = $data['role'] instanceof PrmUserRole ? $data['role']->value : (string) $data['role'];
            } elseif (defined(PrmUserRole::class . '::ADMIN')) {
                $roleValue = PrmUserRole::ADMIN->value;
            }

            $admin = User::query()->create([
                'name' => $data['name'] ?? null,
                'email' => $data['email'],
                'mobile' => $data['mobile'] ?? null,
                'role' => $roleValue,
                'permissions' => $data['permissions'] ?? ['ads.manage', 'companies.manage', 'comments.manage'],
                'is_active' => true,
                'country_id' => $data['country_id'] ?? 1,
                'password' => Hash::make($data['password']),
                'email_verified_at' => now(),
                'mobile_verified_at' => now(),
            ]);

            PrmAdminAuditLog::query()->create([
                'user_id' => $actor->id,
                'action' => 'admin_created',
                'target_type' => User::class,
                'target_id' => $admin->id,
                'payload' => [
                    'created_email' => $admin->email,
                    'permissions' => $admin->permissions,
                ],
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return $admin;
        });
    }
}
