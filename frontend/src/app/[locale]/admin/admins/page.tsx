'use client';

import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, UserPlus, ShieldAlert, ShieldCheck } from 'lucide-react';
import { prmGetFilteredUsers } from '@/lib/prm-admin/prm-admin-api';
import { PrmAdminUser } from '@/types/prm-admin';
import { PrmCreateAdminModal } from '@/components/prm-admin/users/prm-create-admin-modal';

export default function AdminAdminsPage() {
    const [admins, setAdmins] = useState<PrmAdminUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const loadAdmins = async () => {
        setIsLoading(true);

        const token = window.localStorage.getItem('prm_admin_token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await prmGetFilteredUsers(token, {
                search: searchTerm || undefined,
                role: 'admin',
            });

            setAdmins(res.data.data);
        } catch {
            setAdmins([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loadAdmins();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">
                        مدیریت مدیران
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        تعریف، ویرایش و نظارت بر دسترسی‌های مدیران سامانه آتریانا
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-10 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs flex items-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>افزودن مدیر جدید</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 relative"
                >
                    <input
                        type="text"
                        placeholder="جستجو بر اساس نام، ایمیل یا تلفن همراه مدیر..."
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
                    onClick={loadAdmins}
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
                                <th className="p-4 font-medium">نام و نام خانوادگی</th>
                                <th className="p-4 font-medium">پست الکترونیک</th>
                                <th className="p-4 font-medium">شماره تماس</th>
                                <th className="p-4 font-medium">نقش</th>
                                <th className="p-4 font-medium">وضعیت</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-slate-200">
                            {admins.length === 0 && !isLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-slate-500"
                                    >
                                        هیچ مدیری با این مشخصات یافت نشد.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr
                                        key={admin.id}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-4 font-mono text-slate-400">
                                            {admin.id}
                                        </td>

                                        <td className="p-4 font-medium text-slate-100">
                                            {admin.name ||
                                                `${admin.first_name || ''} ${
                                                    admin.last_name || ''
                                                }`}
                                        </td>

                                        <td className="p-4 font-mono text-slate-300">
                                            {admin.email}
                                        </td>

                                        <td className="p-4 font-mono text-slate-300">
                                            {admin.mobile || '-'}
                                        </td>

                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                                                admin.role === 'super_admin'
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                            }`}>
                                                {admin.role === 'super_admin' ? (
                                                    <ShieldAlert className="w-3 h-3" />
                                                ) : (
                                                    <ShieldCheck className="w-3 h-3" />
                                                )}
                                                {admin.role === 'super_admin' ? 'مدیر کل' : 'مدیر'}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                    admin.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                            >
                                                {admin.is_active ? 'فعال' : 'غیرفعال'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PrmCreateAdminModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    loadAdmins();
                }}
            />
        </div>
    );
}
