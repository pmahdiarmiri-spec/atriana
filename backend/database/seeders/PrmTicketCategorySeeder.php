<?php

namespace Database\Seeders;

use App\Models\PrmTicketCategory;
use Illuminate\Database\Seeder;

class PrmTicketCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'technical', 'name_fa' => 'مشکل فنی', 'name_en' => 'Technical Issue'],
            ['slug' => 'financial', 'name_fa' => 'امور مالی و پرداخت', 'name_en' => 'Financial & Payment'],
            ['slug' => 'account', 'name_fa' => 'حساب کاربری و احراز هویت', 'name_en' => 'Account & Verification'],
            ['slug' => 'listings', 'name_fa' => 'آگهی‌ها و محصولات', 'name_en' => 'Listings & Products'],
            ['slug' => 'meetings', 'name_fa' => 'جلسات و مذاکرات', 'name_en' => 'Meetings & Negotiations'],
            ['slug' => 'suggestion', 'name_fa' => 'پیشنهاد و انتقاد', 'name_en' => 'Suggestion & Feedback'],
            ['slug' => 'other', 'name_fa' => 'سایر موارد', 'name_en' => 'Other'],
        ];

        foreach ($categories as $category) {
            PrmTicketCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category + ['is_active' => true]
            );
        }
    }
}
