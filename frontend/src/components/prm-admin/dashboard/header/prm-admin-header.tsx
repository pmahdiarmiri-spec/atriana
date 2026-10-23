'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Bell } from 'lucide-react';
import { PrmRole } from '@/types/prm-admin';

interface PrmAdminHeaderProps {
    locale: string;
    userRole: PrmRole;
}

export const PrmAdminHeader: React.FC<PrmAdminHeaderProps> = ({
    locale,
    userRole,
}) => {
    const [adminName, setAdminName] = useState<string>(
        locale === 'fa' ? 'مدیر ارشد' : 'Administrator',
    );

    useEffect(() => {
        const storedUser = window.localStorage.getItem('prm_admin_user');

        if (!storedUser) {
            return;
        }

        try {
            const parsedUser: unknown = JSON.parse(storedUser);

            if (
                typeof parsedUser === 'object' &&
                parsedUser !== null &&
                'name' in parsedUser &&
                typeof parsedUser.name === 'string'
            ) {
                setAdminName(parsedUser.name);
                return;
            }

            if (
                typeof parsedUser === 'object' &&
                parsedUser !== null &&
                'email' in parsedUser &&
                typeof parsedUser.email === 'string'
            ) {
                setAdminName(parsedUser.email);
            }
        } catch {
            setAdminName(locale === 'fa' ? 'مدیر ارشد' : 'Administrator');
        }
    }, [locale]);

    const adminRoleDisplay =
        userRole === 'super_admin'
            ? locale === 'fa'
                ? 'مدیر کل سیستم'
                : 'Super Administrator'
            : locale === 'fa'
              ? 'مدیر'
              : 'Administrator';

    return (
        <header
            className="h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between shadow-sm"
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
        >
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-300">
                    {locale === 'fa'
                        ? 'سیستم امنیتی فعال'
                        : 'Security system active'}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    aria-label={locale === 'fa' ? 'اعلان‌ها' : 'Notifications'}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                >
                    <Bell className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 pr-3 border-r border-white/10">
                    <div className="text-right">
                        <div className="text-xs font-semibold text-slate-200">
                            {adminName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                            {adminRoleDisplay}
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PrmAdminHeader;
