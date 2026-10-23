<?php

namespace Database\Seeders;

use App\Models\PrmIndustry;
use Illuminate\Database\Seeder;

class PrmIndustrySeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['name_fa' => 'خودرو و قطعات', 'name_en' => 'Automotive & Parts', 'sort_order' => 1, 'is_active' => 1],
            ['name_fa' => 'کشاورزی و باغبانی', 'name_en' => 'Agriculture & Gardening', 'sort_order' => 2, 'is_active' => 1],
            ['name_fa' => 'صنایع غذایی', 'name_en' => 'Food Industry', 'sort_order' => 3, 'is_active' => 1],
            ['name_fa' => 'نفت، گاز و پتروشیمی', 'name_en' => 'Oil, Gas & Petrochemicals', 'sort_order' => 4, 'is_active' => 1],
            ['name_fa' => 'ساختمان و معماری', 'name_en' => 'Construction & Architecture', 'sort_order' => 5, 'is_active' => 1],
            ['name_fa' => 'فلزات و معدن', 'name_en' => 'Metals & Mining', 'sort_order' => 6, 'is_active' => 1],
            ['name_fa' => 'پلاستیک و پلیمر', 'name_en' => 'Plastics & Polymers', 'sort_order' => 7, 'is_active' => 1],
            ['name_fa' => 'نساجی و پوشاک', 'name_en' => 'Textiles & Apparel', 'sort_order' => 8, 'is_active' => 1],
            ['name_fa' => 'الکترونیک و برق', 'name_en' => 'Electronics & Electricity', 'sort_order' => 9, 'is_active' => 1],
            ['name_fa' => 'مکانیک و ماشین‌آلات', 'name_en' => 'Mechanics & Machinery', 'sort_order' => 10, 'is_active' => 1],
            ['name_fa' => 'شیمیایی و آزمایشگاهی', 'name_en' => 'Chemical & Laboratory', 'sort_order' => 11, 'is_active' => 1],
            ['name_fa' => 'دارویی و بهداشتی', 'name_en' => 'Pharmaceutical', 'sort_order' => 12, 'is_active' => 1],
            ['name_fa' => 'آرایشی و بهداشتی', 'name_en' => 'Cosmetics & Personal Care', 'sort_order' => 13, 'is_active' => 1],
            ['name_fa' => 'چرم و کفش', 'name_en' => 'Leather & Footwear', 'sort_order' => 14, 'is_active' => 1],
            ['name_fa' => 'کاغذ و چوب', 'name_en' => 'Paper & Wood', 'sort_order' => 15, 'is_active' => 1],
            ['name_fa' => 'شیشه و سرامیک', 'name_en' => 'Glass & Ceramics', 'sort_order' => 16, 'is_active' => 1],
            ['name_fa' => 'لوازم خانگی', 'name_en' => 'Home Appliances', 'sort_order' => 17, 'is_active' => 1],
            ['name_fa' => 'مبلمان و دکوراسیون', 'name_en' => 'Furniture & Decoration', 'sort_order' => 18, 'is_active' => 1],
            ['name_fa' => 'ورزشی و تفریحی', 'name_en' => 'Sports & Recreation', 'sort_order' => 19, 'is_active' => 1],
            ['name_fa' => 'اسباب‌بازی', 'name_en' => 'Toys & Games', 'sort_order' => 20, 'is_active' => 1],
            ['name_fa' => 'لوازم التحریر', 'name_en' => 'Stationery', 'sort_order' => 21, 'is_active' => 1],
            ['name_fa' => 'صنایع دستی', 'name_en' => 'Handicrafts', 'sort_order' => 22, 'is_active' => 1],
            ['name_fa' => 'فرش و کفپوش', 'name_en' => 'Carpets & Flooring', 'sort_order' => 23, 'is_active' => 1],
            ['name_fa' => 'کامپیوتر و IT', 'name_en' => 'Computers & IT', 'sort_order' => 24, 'is_active' => 1],
            ['name_fa' => 'مخابرات', 'name_en' => 'Telecommunications', 'sort_order' => 25, 'is_active' => 1],
            ['name_fa' => 'انرژی‌های تجدیدپذیر', 'name_en' => 'Renewable Energy', 'sort_order' => 26, 'is_active' => 1],
            ['name_fa' => 'حمل و نقل', 'name_en' => 'Transportation & Logistics', 'sort_order' => 27, 'is_active' => 1],
            ['name_fa' => 'بسته‌بندی', 'name_en' => 'Packaging', 'sort_order' => 28, 'is_active' => 1],
            ['name_fa' => 'ابزارآلات', 'name_en' => 'Tools & Hardware', 'sort_order' => 29, 'is_active' => 1],
            ['name_fa' => 'محصولات دریایی', 'name_en' => 'Marine Products', 'sort_order' => 30, 'is_active' => 1],
        ];

        foreach ($rows as $row) {
            PrmIndustry::query()->updateOrCreate(
                ['name_fa' => $row['name_fa']],
                $row
            );
        }
    }
}
