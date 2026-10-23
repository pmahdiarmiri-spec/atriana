'use client';

import React, { useState } from 'react';
import { Lock, UserCheck, ArrowRight, Loader2 } from 'lucide-react';

interface PrmAdminGateFormProps {
    isSubmitting: boolean;
    errorMessage: string | null;
    onSubmit: (identifier: string, password: string) => Promise<void>;
}

export const PrmAdminGateForm: React.FC<PrmAdminGateFormProps> = ({
    isSubmitting,
    errorMessage,
    onSubmit,
}) => {
    const [prmIdentifier, setPrmIdentifier] = useState('');
    const [prmPassword, setPrmPassword] = useState('');

    const prmHandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prmIdentifier || !prmPassword || isSubmitting) {
            return;
        }
        await onSubmit(prmIdentifier, prmPassword);
    };

    return (
        <form onSubmit={prmHandleSubmit} className="space-y-4">
            {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                    Email or Mobile Number
                </label>
                <div className="relative">
                    <input
                        type="text"
                        required
                        value={prmIdentifier}
                        onChange={(e) => setPrmIdentifier(e.target.value)}
                        className="w-full h-11 px-4 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                        placeholder="admin@atriana.com"
                    />
                    <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                    Security Password
                </label>
                <div className="relative">
                    <input
                        type="password"
                        required
                        value={prmPassword}
                        onChange={(e) => setPrmPassword(e.target.value)}
                        className="w-full h-11 px-4 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                        placeholder="••••••••••••"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <span>Authenticate & Enter</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
};
