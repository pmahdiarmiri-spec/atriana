<?php

namespace App\Services\PrmAdvertisements;

final class PrmAdvertisementCategories
{
    public static function goodsFa(): array
    {
        return [
            'مواد اولیه شیمیایی و پلیمری', 'محصولات کشاورزی و غذایی', 'فلزات و آلیاژها', 'ماشین‌آلات صنعتی', 'تجهیزات کشاورزی',
            'منسوجات و پوشاک', 'مصالح ساختمانی', 'الکترونیک و قطعات', 'محصولات پلاستیکی و بسته‌بندی', 'مواد معدنی و سنگ',
            'محصولات چوبی و کاغذی', 'تجهیزات پزشکی و دارویی', 'خودرو و قطعات یدکی', 'لوازم خانگی و دکوراسیون',
            'محصولات بهداشتی و آرایشی', 'ابزارآلات و یراق‌آلات', 'تجهیزات برقی و روشنایی', 'محصولات چرمی و کیف و کفش',
            'لاستیک و محصولات لاستیکی', 'شیشه و سرامیک', 'فرش و کف‌پوش', 'محصولات دریایی و آبزیان', 'دام و طیور زنده',
            'نهاده‌های دامی و کشاورزی', 'بذر و نهال', 'کود و سموم کشاورزی', 'انواع چای و قهوه', 'ادویه و چاشنی',
            'روغن‌های خوراکی', 'شکر و شیرینی', 'لبنیات و فرآورده‌های شیری', 'گوشت و فرآورده‌های گوشتی', 'میوه و سبزیجات تازه',
            'میوه و سبزیجات خشک', 'آجیل و خشکبار', 'نوشیدنی‌های غیرالکلی', 'آب معدنی و نوشابه', 'بیسکویت و شیرینی',
            'کنسرو و کمپوت', 'ماکارونی و فرآورده‌های آردی', 'برنج و غلات', 'حبوبات', 'سایر کالاها',
        ];
    }

    public static function goodsEn(): array
    {
        return [
            'Chemical & Polymer Raw Materials', 'Agricultural & Food Products', 'Metals & Alloys', 'Industrial Machinery', 'Agricultural Equipment',
            'Textiles & Clothing', 'Building Materials', 'Electronics & Components', 'Plastic & Packaging Products', 'Minerals & Stones',
            'Wood & Paper Products', 'Medical & Pharmaceutical Equipment', 'Automotive & Spare Parts', 'Home Appliances & Decoration',
            'Health & Cosmetic Products', 'Tools & Hardware', 'Electrical & Lighting Equipment', 'Leather, Bags & Shoes',
            'Rubber & Rubber Products', 'Glass & Ceramics', 'Carpets & Flooring', 'Seafood & Marine Products', 'Live Livestock & Poultry',
            'Livestock & Agricultural Inputs', 'Seeds & Seedlings', 'Fertilizers & Pesticides', 'Tea & Coffee', 'Spices & Seasonings',
            'Edible Oils', 'Sugar & Confectionery', 'Dairy & Milk Products', 'Meat & Meat Products', 'Fresh Fruits & Vegetables',
            'Dried Fruits & Vegetables', 'Nuts & Dried Fruits', 'Non-Alcoholic Beverages', 'Mineral Water & Soft Drinks', 'Biscuits & Pastries',
            'Canned Foods & Compotes', 'Macaroni & Flour Products', 'Rice & Grains', 'Legumes', 'Other Goods',
        ];
    }

    public static function servicesFa(): array
    {
        return [
            'حمل و نقل دریایی', 'حمل و نقل هوایی', 'حمل و نقل زمینی', 'حمل و نقل ریلی', 'خدمات لجستیک و زنجیره تامین',
            'انبارداری و توزیع', 'بسته‌بندی و برچسب‌گذاری', 'ترخیص کالا و خدمات گمرکی', 'مشاوره صادرات و واردات',
            'مشاوره بازرگانی و تجاری', 'بازاریابی و تبلیغات', 'طراحی و برندینگ', 'خدمات دیجیتال مارکتینگ', 'تحقیقات بازار',
            'خدمات مالی و بانکی', 'تامین مالی تجاری', 'بیمه محموله', 'خدمات ارزی و صرافی', 'ترجمه و تفسیر',
            'خدمات زبانی تخصصی', 'خدمات حقوقی بین‌المللی', 'ثبت برند و اختراع', 'تنظیم قراردادهای تجاری', 'داوری و حل اختلاف',
            'خدمات فناوری اطلاعات', 'طراحی و توسعه نرم‌افزار', 'خدمات ابری', 'امنیت سایبری', 'مشاوره مدیریت',
            'مشاوره استراتژیک', 'توسعه منابع انسانی (ویژه کارفرمایان)', 'موقعیت شغلی (ویژه کارجویان)', 'خدمات حسابداری و حسابرسی',
            'خدمات مالیاتی', 'بازرسی و کنترل کیفیت', 'صدور گواهینامه‌های بین‌المللی', 'تست و آزمایشگاه', 'خدمات مهندسی',
            'طراحی صنعتی', 'نصب و راه‌اندازی', 'تعمیر و نگهداری', 'خدمات پس از فروش', 'خدمات نمایشگاهی',
            'برگزاری رویدادهای تجاری', 'خدمات هتلداری و گردشگری', 'خدمات رستوران و کترینگ', 'سایر خدمات',
        ];
    }

    public static function servicesEn(): array
    {
        return [
            'Sea Transportation', 'Air Transportation', 'Land Transportation', 'Rail Transportation', 'Logistics & Supply Chain Services',
            'Warehousing & Distribution', 'Packaging & Labeling', 'Customs Clearance & Services', 'Export & Import Consulting',
            'Commercial & Trade Consulting', 'Marketing & Advertising', 'Design & Branding', 'Digital Marketing Services', 'Market Research',
            'Financial & Banking Services', 'Trade Financing', 'Cargo Insurance', 'Currency & Exchange Services', 'Translation & Interpretation',
            'Specialized Language Services', 'International Legal Services', 'Brand & Patent Registration', 'Drafting Commercial Contracts', 'Arbitration & Dispute Resolution',
            'Information Technology Services', 'Software Design & Development', 'Cloud Services', 'Cybersecurity', 'Management Consulting',
            'Strategic Consulting', 'Human Resources Development (Employers)', 'Job Position (Job Seekers)', 'Accounting & Auditing Services',
            'Tax Services', 'Inspection & Quality Control', 'Issuance of International Certificates', 'Testing & Laboratory', 'Engineering Services',
            'Industrial Design', 'Installation & Setup', 'Maintenance & Repair', 'After-Sales Services', 'Exhibition Services',
            'Organizing Business Events', 'Hospitality & Tourism Services', 'Restaurant & Catering Services', 'Other Services',
        ];
    }
}
