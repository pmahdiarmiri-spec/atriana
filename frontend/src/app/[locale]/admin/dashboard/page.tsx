'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, KeyRound, Activity, CheckCircle2, Shield } from 'lucide-react';
import { PrmStatCard } from '@/components/prm-admin/dashboard/stats/prm-stat-card';
import { PrmRole } from '@/types/prm-admin';

export default function AdminDashboardPage() {
    const [userRole, setUserRole] = useState<PrmRole | null>(null);

    useEffect(() => {
        const storedUser = window.localStorage.getItem('prm_admin_user');
        if (!storedUser) return;

        try {
            const parsed = JSON.parse(storedUser);
            if (parsed?.role === 'super_admin' || parsed?.role === 'admin') {
                setUserRole(parsed.role);
            }
        } catch {
            setUserRole('admin');
        }
    }, []);

    const isSuperAdmin = userRole === 'super_admin';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">
                    {isSuperAdmin
                        ? 'مرکز فرماندهی و مانیتورینگ آتریانا'
                        : 'پنل مدیریت عملیات آتریانا'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    {isSuperAdmin
                        ? 'مدیریت سطوح دسترسی، امنیت گیت و گزارشات سیستمی در لحظه'
                        : 'مدیریت ماژول‌های مجاز و پایش فعالیت‌های جاری'}
                </p>
            </div>

            {isSuperAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <PrmStatCard
                        title="مدیران کل"
                        value="۱"
                        description="دسترسی ریشه فعال"
                        icon={ShieldCheck}
                    />
                    <PrmStatCard
                        title="کل مدیران"
                        value="۱"
                        description="حساب‌های تایید شده"
                        icon={Users}
                    />
                    <PrmStatCard
                        title="وضعیت گیت امنیتی"
                        value="محافظت‌شده"
                        description="کلید داینامیک فعال"
                        icon={KeyRound}
                        trend="۱۰۰٪ فعال"
                    />
                    <PrmStatCard
                        title="نشست‌های فعال"
                        value="۱"
                        description="ورود موفق جاری"
                        icon={Activity}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PrmStatCard
                        title="سطح دسترسی"
                        value="مدیر عملیات"
                        description="حساب کاربری استاندارد"
                        icon={Shield}
                    />
                    <PrmStatCard
                        title="وضعیت نشست"
                        value="فعال"
                        description="ارتباط مستقیم با سرور"
                        icon={Activity}
                        trend="امن"
                    />
                    <PrmStatCard
                        title="تایید امنیتی"
                        value="احراز شده"
                        description="گیت حفاظتی معتبر"
                        icon={CheckCircle2}
                    />
                </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">
                    {isSuperAdmin
                        ? 'وضعیت اتصال هسته لاراول (درگاه ارتباطی سیستم)'
                        : 'میز کار اداری آتریانا'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {isSuperAdmin
                        ? 'اتصال احراز هویت با موفقیت برقرار شد. توکن امنیتی معتبر است و ارتباط فرانت‌اند و بک‌اند تثبیت شده است.'
                        : 'شما به ماژول‌های تخصیص‌یافته توسط مدیر کل دسترسی دارید. جهت مدیریت هر بخش از منوی کناری استفاده فرمایید.'}
                </p>
            </div>
        </div>
    );
}
