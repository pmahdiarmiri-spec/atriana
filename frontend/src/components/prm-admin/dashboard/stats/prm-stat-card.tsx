import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PrmStatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    trend?: string;
}

export const PrmStatCard: React.FC<PrmStatCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    trend,
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400">{title}</span>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-400">
                    <Icon className="w-4 h-4" />
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-2xl font-black text-slate-100 tracking-tight font-mono">{value}</div>
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{description}</span>
                    {trend && <span className="text-emerald-400 font-semibold">{trend}</span>}
                </div>
            </div>
        </div>
    );
};
