'use client';

import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { prmCreateAdmin } from '@/lib/prm-admin/prm-admin-api';

interface PrmCreateAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const PrmCreateAdminModal: React.FC<PrmCreateAdminModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState<string[]>([
        'ads.manage',
        'companies.manage',
        'comments.manage',
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const availablePermissions = [
        { id: 'ads.manage', label: 'مدیریت آگهی‌ها' },
        { id: 'companies.manage', label: 'مدیریت شرکت‌ها' },
        { id: 'comments.manage', label: 'مدیریت نظرات' },
        { id: 'users.manage', label: 'مدیریت کاربران عادی' },
    ];

    const togglePermission = (permId: string) => {
        setPermissions((prev) =>
            prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const token = localStorage.getItem('prm_admin_token');
        if (!token) {
            setError('نشست کاربری شما منقضی شده است.');
            setIsLoading(false);
            return;
        }

        try {
            await prmCreateAdmin(token, {
                first_name: firstName,
                last_name: lastName,
                email,
                mobile,
                password,
                permissions,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.prmCode || 'خطایی در ثبت اطلاعات مدیر جدید رخ داد.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-[0_16px_40px_0_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <span>افزودن مدیر جدید به سامانه</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-2 text-xs text-red-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">نام</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">نام خانوادگی</label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">آدرس ایمیل</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">شماره تلفن همراه</label>
                        <input
                            type="text"
                            required
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">گذرواژه امنیتی (حداقل ۱۰ کاراکتر)</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">سطوح دسترسی مدیریتی</label>
                        <div className="grid grid-cols-2 gap-2">
                            {availablePermissions.map((perm) => {
                                const isChecked = permissions.includes(perm.id);
                                return (
                                    <button
                                        type="button"
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-right transition-all ${
                                            isChecked
                                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                                : 'border-white/10 bg-white/[0.02] text-slate-400'
                                        }`}
                                    >
                                        <CheckCircle2
                                            className={`w-4 h-4 shrink-0 ${
                                                isChecked ? 'text-amber-400' : 'text-slate-600'
                                            }`}
                                        />
                                        <span>{perm.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5 transition-all"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-semibold text-white shadow-lg shadow-amber-500/20 hover:opacity-95 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? 'در حال ثبت...' : 'ایجاد حساب مدیر'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
