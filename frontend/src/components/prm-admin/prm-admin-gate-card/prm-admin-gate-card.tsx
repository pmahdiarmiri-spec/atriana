import React from 'react';

interface PrmAdminGateCardProps {
    children: React.ReactNode;
}

export function PrmAdminGateCard({ children }: PrmAdminGateCardProps): React.ReactNode {
    return (
        <div className="prm-gate-wrapper relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div
                id="prm-admin-gate-container"
                className="relative w-full max-w-md rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] p-8 transition-all duration-300 z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 border border-white/20">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        ATRIANA GATE
                    </h1>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
                        Secure Authentication Port
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
