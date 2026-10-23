<?php

namespace Database\Seeders;

use App\Enums\PrmAdmin\PrmUserRole;
use App\Enums\PrmAuth\PrmTradeRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PrmSuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@atriana.com'],
            [
                'first_name' => 'مهدیار',
                'last_name' => 'میری',
                'name' => 'مهدیار میری',
                'mobile' => '09152029925',
                'role' => PrmUserRole::SUPER_ADMIN,
                'trade_role' => PrmTradeRole::EXPORTER,
                'password' => Hash::make('Xcsd5643'),
                'email_verified_at' => now(),
                'mobile_verified_at' => now(),
                'country_id' => 1,
            ]
        );
    }
}
