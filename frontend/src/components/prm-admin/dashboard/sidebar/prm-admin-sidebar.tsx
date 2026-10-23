'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UserCog,
    ShieldAlert,
    Settings,
    LogOut,
    Megaphone,
    Building2,
    MessageSquare,
    Headphones,
    ShieldQuestion,
} from 'lucide-react';
import { PrmRole } from '@/types/prm-admin';

interface PrmAdminSidebarProps {
    locale: string;
    userRole: PrmRole;
}

interface MenuItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: PrmRole[];
    permission?: string;
}

export const PrmAdminSidebar: React.FC<PrmAdminSidebarProps> = ({
    locale,
    userRole,
}) => {
    const pathname = usePathname();
    const [userPermissions, setUserPermissions] = useState<string[]>([]);

    useEffect(() => {
        const storedUser = window.localStorage.getItem('prm_admin_user');
        if (!storedUser) return;

        try {
            const parsed = JSON.parse(storedUser);
            if (Array.isArray(parsed?.permissions)) {
                setUserPermissions(parsed.permissions);
            }
        } catch {
            setUserPermissions([]);
        }
    }, []);

    const menuItems: MenuItem[] = [
        {
            title: locale === 'fa' ? 'داشبورد' : 'Dashboard',
            href: `/${locale}/admin/dashboard`,
            icon: LayoutDashboard,
            roles: ['super_admin', 'admin'],
        },
        {
            title: locale === 'fa' ? 'میز پشتیبانی (ادمین)' : 'Support Desk',
            href: `/${locale}/admin/tickets`,
            icon: Headphones,
            roles: ['admin', 'super_admin'],
        },
        {
            title: locale === 'fa' ? 'پایش کل تیکت‌ها' : 'Master Tickets Hub',
            href: `/${locale}/admin/super-tickets`,
            icon: ShieldQuestion,
            roles: ['super_admin'],
        },
        {
            title: locale === 'fa' ? 'مدیریت آگهی‌ها' : 'Ads Management',
            href: `/${locale}/admin/ads`,
            icon: Megaphone,
            permission: 'ads.manage',
        },
        {
            title: locale === 'fa' ? 'مدیریت شرکت‌ها' : 'Companies',
            href: `/${locale}/admin/companies`,
            icon: Building2,
            permission: 'companies.manage',
        },
        {
            title: locale === 'fa' ? 'مدیریت نظرات' : 'Comments',
            href: `/${locale}/admin/comments`,
            icon: MessageSquare,
            permission: 'comments.manage',
        },
        {
            title: locale === 'fa' ? 'مدیریت کاربران' : 'User Management',
            href: `/${locale}/admin/users`,
            icon: Users,
            roles: ['super_admin'],
            permission: 'users.manage',
        },
        {
            title: locale === 'fa' ? 'مدیریت مدیران' : 'Admin Management',
            href: `/${locale}/admin/admins`,
            icon: UserCog,
            roles: ['super_admin'],
        },
        {
            title: locale === 'fa' ? 'لاگ‌های امنیتی' : 'Security Logs',
            href: `/${locale}/admin/audit-logs`,
            icon: ShieldAlert,
            roles: ['super_admin'],
        },
        {
            title: locale === 'fa' ? 'تنظیمات گیت' : 'Gate Settings',
            href: `/${locale}/admin/settings`,
            icon: Settings,
            roles: ['super_admin'],
        },
    ];

    const visibleMenuItems = menuItems.filter((item) => {
        if (userRole === 'super_admin') {
            return true;
        }

        if (item.roles && !item.roles.includes(userRole) && !item.permission) {
            return false;
        }

        if (item.permission) {
            return userPermissions.includes(item.permission);
        }

        return item.roles?.includes(userRole);
    });

    const handleLogout = (): void => {
        window.localStorage.removeItem('prm_admin_token');
        window.localStorage.removeItem('prm_admin_user');
        window.location.href = `/${locale}`;
    };

    return (
        <aside
            className={`w-64 min-h-screen p-4 flex flex-col justify-between bg-slate-950/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(15,23,42,0.37)] text-slate-100 ${
                locale === 'fa'
                    ? 'border-l border-white/20'
                    : 'border-r border-white/20'
            }`}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
        >
            <div>
                <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/10">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-amber-500/20">
                        {locale === 'fa' ? 'آ' : 'A'}
                    </div>

                    <div className="min-w-0">
                        <h1 className="font-bold text-sm text-slate-100 truncate">
                            {locale === 'fa'
                                ? 'هسته مرکزی آتریانا'
                                : 'Atriana Core'}
                        </h1>

                        <p className="text-[10px] text-amber-400 truncate">
                            {locale === 'fa'
                                ? 'سامانه مدیریت نسخه ۱.۰.۰'
                                : 'Management System v1.0.0'}
                        </p>
                    </div>
                </div>

                <nav
                    className="space-y-1"
                    aria-label={
                        locale === 'fa'
                            ? 'منوی مدیریت'
                            : 'Admin navigation'
                    }
                >
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                                    isActive
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5'
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 shrink-0 ${
                                        isActive
                                            ? 'text-amber-400'
                                            : 'text-slate-400'
                                    }`}
                                />
                                <span className="truncate">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>
                        {locale === 'fa' ? 'خروج امن' : 'Secure Logout'}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default PrmAdminSidebar;
