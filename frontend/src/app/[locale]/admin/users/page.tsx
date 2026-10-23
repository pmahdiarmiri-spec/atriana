'use client';

import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Shield } from 'lucide-react';
import { prmGetFilteredUsers } from '@/lib/prm-admin/prm-admin-api';
import { PrmAdminUser } from '@/types/prm-admin';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<PrmAdminUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('user');
    const [isLoading, setIsLoading] = useState(true);

    const loadUsers = async () => {
        setIsLoading(true);

        const token = window.localStorage.getItem('prm_admin_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await prmGetFilteredUsers(token, {
                search: searchTerm || undefined,
                role: roleFilter || undefined,
            });

            setUsers(res.data.data);
        } catch {
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loadUsers();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100">
                    مدیریت کاربران
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                    نظارت بر حساب‌های کاربری عادی و وضعیت فعالیت آن‌ها
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 relative"
                >
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، ایمیل یا تلفن همراه..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        className="w-full h-11 pr-10 pl-4 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                    />

                    <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                </form>

                <button
                    type="button"
                    onClick={loadUsers}
                    className="h-11 px-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${
                            isLoading ? 'animate-spin' : ''
                        }`}
                    />
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400">
                                <th className="p-4 font-medium">شناسه</th>
                                <th className="p-4 font-medium">
                                    نام و نام خانوادگی
                                </th>
                                <th className="p-4 font-medium">
                                    پست الکترونیک
                                </th>
                                <th className="p-4 font-medium">شماره تماس</th>
                                <th className="p-4 font-medium">نقش کاربری</th>
                                <th className="p-4 font-medium">وضعیت</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {users.length === 0 && !isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-slate-500"
                                    >
                                        هیچ کاربر عادی با مشخصات انتخابی یافت
                                        نشد.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-4 font-mono text-slate-400">
                                            {user.id}
                                        </td>

                                        <td className="p-4 font-medium text-slate-100">
                                            {user.name ||
                                                `${user.first_name || ''} ${
                                                    user.last_name || ''
                                                }`}
                                        </td>

                                        <td className="p-4 font-mono text-slate-300">
                                            {user.email}
                                        </td>

                                        <td className="p-4 font-mono text-slate-300">
                                            {user.mobile || '-'}
                                        </td>

                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-slate-500/10 border-slate-500/30 text-slate-300">
                                                <Shield className="w-3 h-3" />
                                                کاربر عادی
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                    user.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                            >
                                                {user.is_active
                                                    ? 'فعال'
                                                    : 'غیرفعال'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
