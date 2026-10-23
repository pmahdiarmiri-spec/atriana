'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { 
    Search, 
    Send, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ShieldAlert, 
    User, 
    Building2,
    Shield, 
    MessageSquare,
    RefreshCw
} from 'lucide-react';
import { 
    prmAdminGetTickets, 
    prmAdminGetTicket, 
    prmAdminReplyTicket, 
    prmAdminUpdateTicketStatus 
} from '@/lib/prm-admin/prm-admin-api';
import { PrmTicket, PrmTicketPriority, PrmTicketStatus } from '@/types/prm-support';
import { PrmRole } from '@/types/prm-admin';

interface PrmAdminTicketManagerProps {
    locale: string;
    isSuperAdminView?: boolean;
}

export const PrmAdminTicketManager: React.FC<PrmAdminTicketManagerProps> = ({
    locale,
    isSuperAdminView = false,
}) => {
    const [tickets, setTickets] = useState<PrmTicket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [activeTicket, setActiveTicket] = useState<PrmTicket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [replyMessage, setReplyMessage] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const fetchTickets = async () => {
        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        try {
            setLoading(true);
            const res = await prmAdminGetTickets(token, {
                status: statusFilter || undefined,
                priority: priorityFilter || undefined,
                search: searchTerm || undefined,
            });
            setTickets(res.tickets);
            if (res.tickets.length > 0 && !selectedTicketId) {
                setSelectedTicketId(res.tickets[0].id);
            }
        } catch {
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTicketDetail = async (id: number) => {
        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        try {
            setDetailLoading(true);
            const res = await prmAdminGetTicket(token, id);
            setActiveTicket(res.ticket);
        } catch {
            setActiveTicket(null);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter]);

    useEffect(() => {
        if (selectedTicketId) {
            fetchTicketDetail(selectedTicketId);
        }
    }, [selectedTicketId]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicketId || !replyMessage.trim()) return;

        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        startTransition(async () => {
            try {
                await prmAdminReplyTicket(token, selectedTicketId, replyMessage.trim());
                setReplyMessage('');
                await fetchTicketDetail(selectedTicketId);
                await fetchTickets();
            } catch {
            }
        });
    };

    const handleStatusChange = async (newStatus: PrmTicketStatus) => {
        if (!selectedTicketId) return;

        const token = window.localStorage.getItem('prm_admin_token');
        if (!token) return;

        startTransition(async () => {
            try {
                await prmAdminUpdateTicketStatus(token, selectedTicketId, newStatus);
                await fetchTicketDetail(selectedTicketId);
                await fetchTickets();
            } catch {
            }
        });
    };

    const getPriorityBadge = (priority: PrmTicketPriority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'high':
                return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'normal':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusBadge = (status: PrmTicketStatus) => {
        switch (status) {
            case 'open':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'answered':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending_user':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'closed':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        {isSuperAdminView ? (
                            <>
                                <Shield className="w-5 h-5 text-amber-500" />
                                <span>{locale === 'fa' ? 'پایش کلان و پاسخگویی سوپرادمین تیکت‌ها' : 'Master Tickets Control Hub'}</span>
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-5 h-5 text-amber-500" />
                                <span>{locale === 'fa' ? 'میز پاسخگویی به درخواست‌های کاربران' : 'Admin Support Desk'}</span>
                            </>
                        )}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        {isSuperAdminView
                            ? (locale === 'fa' ? 'نظارت ریشه، حسابرسی پیام‌های پشتیبانان، تغییر فوری وضعیت و پاسخگویی با هویت سوپرادمین' : 'Root supervision, response audit, and direct super admin reply capability.')
                            : (locale === 'fa' ? 'بررسی تیکت‌های ورودی، ثبت پاسخ مستقیم به کاربران و مدیریت چرخه حیات تیکت' : 'Review inbound inquiries, direct replies to clients, and ticket lifecycle tracking.')}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchTickets}
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-all shadow-[0_4px_16px_0_rgba(15,23,42,0.2)]"
                        title={locale === 'fa' ? 'بروزرسانی' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="prm-card rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-wrap gap-4 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px]">
                    <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={locale === 'fa' ? 'جستجو بر اساس شماره تیکت، موضوع یا نام کاربر...' : 'Search by ticket #, subject or user...'}
                        className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                </form>

                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-amber-500/50"
                    >
                        <option value="">{locale === 'fa' ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
                        <option value="open">{locale === 'fa' ? 'باز' : 'Open'}</option>
                        <option value="answered">{locale === 'fa' ? 'پاسخ داده شده' : 'Answered'}</option>
                        <option value="pending_user">{locale === 'fa' ? 'در انتظار کاربر' : 'Pending User'}</option>
                        <option value="closed">{locale === 'fa' ? 'بسته شده' : 'Closed'}</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-amber-500/50"
                    >
                        <option value="">{locale === 'fa' ? 'همه اولویت‌ها' : 'All Priorities'}</option>
                        <option value="low">{locale === 'fa' ? 'پایین' : 'Low'}</option>
                        <option value="normal">{locale === 'fa' ? 'معمولی' : 'Normal'}</option>
                        <option value="high">{locale === 'fa' ? 'بالا' : 'High'}</option>
                        <option value="urgent">{locale === 'fa' ? 'فوری' : 'Urgent'}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
                <div className="lg:col-span-4 prm-card rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-2xl p-3 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
                    <div className="text-xs font-semibold text-slate-300 px-3 py-2 border-b border-white/10 flex justify-between items-center">
                        <span>{locale === 'fa' ? 'فهرست درخواست‌ها' : 'Inquiries'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {tickets.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-xs">
                                {locale === 'fa' ? 'تیکتی یافت نشد.' : 'No tickets found.'}
                            </div>
                        ) : (
                            tickets.map((t) => {
                                const isSelected = t.id === selectedTicketId;
                                return (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTicketId(t.id)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all border ${
                                            isSelected
                                                ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_4px_16px_0_rgba(245,158,11,0.1)]'
                                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                                            <span className="font-mono text-amber-400 font-semibold">{t.ticket_number}</span>
                                            <span className={`px-2 py-0.5 rounded-md border text-[9px] ${getStatusBadge(t.status)}`}>
                                                {t.status}
                                            </span>
                                        </div>

                                        <h4 className="text-xs font-medium text-slate-200 line-clamp-1 mb-2">
                                            {t.subject}
                                        </h4>

                                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                                            <span className="truncate max-w-[120px]">
                                                {t.user?.name ?? t.user?.email ?? '---'}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded border text-[9px] ${getPriorityBadge(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8 prm-card rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-2xl p-4 flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                    {detailLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        </div>
                    ) : activeTicket ? (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="border-b border-white/10 pb-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                                            {activeTicket.ticket_number}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityBadge(activeTicket.priority)}`}>
                                            {activeTicket.priority}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(activeTicket.status)}`}>
                                            {activeTicket.status}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-100">{activeTicket.subject}</h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={activeTicket.status}
                                        disabled={isPending}
                                        onChange={(e) => handleStatusChange(e.target.value as PrmTicketStatus)}
                                        className="px-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-white/20 text-slate-200 focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="open">{locale === 'fa' ? 'تغییر به: باز' : 'Status: Open'}</option>
                                        <option value="answered">{locale === 'fa' ? 'تغییر به: پاسخ‌داده‌شده' : 'Status: Answered'}</option>
                                        <option value="pending_user">{locale === 'fa' ? 'تغییر به: در انتظار کاربر' : 'Status: Pending'}</option>
                                        <option value="closed">{locale === 'fa' ? 'تغییر به: بسته شده' : 'Status: Closed'}</option>
                                    </select>
                                </div>
                            </div>

                            {isSuperAdminView && (
                                <div className="p-3 mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-slate-400">{locale === 'fa' ? 'کاربر:' : 'Client:'}</span>
                                        <span className="text-slate-200 font-medium">{activeTicket.user?.name ?? '---'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-slate-400">{locale === 'fa' ? 'ایمیل:' : 'Email:'}</span>
                                        <span className="text-slate-200 font-mono text-[11px] truncate">{activeTicket.user?.email ?? '---'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-slate-400">{locale === 'fa' ? 'موبایل:' : 'Mobile:'}</span>
                                        <span className="text-slate-200 font-mono text-[11px]">{activeTicket.user?.mobile ?? '---'}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 max-h-[380px]">
                                {activeTicket.messages?.map((msg) => {
                                    const isFromAdmin = msg.sender === 'admin';
                                    const isSuperAdminSender = msg.user?.role === 'super_admin';

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isFromAdmin ? 'items-start' : 'items-end'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl p-4 text-xs backdrop-blur-xl border ${
                                                    isFromAdmin
                                                        ? isSuperAdminSender
                                                            ? 'bg-gradient-to-br from-amber-950/40 to-slate-900/60 border-amber-500/30 text-amber-100 shadow-[0_4px_20px_0_rgba(245,158,11,0.08)]'
                                                            : 'bg-gradient-to-br from-blue-950/40 to-slate-900/60 border-blue-500/20 text-slate-100'
                                                        : 'bg-white/[0.05] border-white/10 text-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[10px] text-slate-400">
                                                    <span className="font-semibold flex items-center gap-1.5">
                                                        {isFromAdmin ? (
                                                            isSuperAdminSender ? (
                                                                <span className="text-amber-400 flex items-center gap-1">
                                                                    <Shield className="w-3 h-3" />
                                                                    {locale === 'fa' ? 'پاسخ سوپر ادمین' : 'Super Admin Reply'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-blue-400 flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    {locale === 'fa' ? 'پاسخ ادمین' : 'Admin Reply'}
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span>{activeTicket.user?.name ?? 'کاربر'}</span>
                                                        )}
                                                    </span>
                                                    <span className="font-mono text-[9px]">
                                                        {new Date(msg.created_at).toLocaleTimeString(locale === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                <p className="whitespace-pre-line leading-relaxed text-slate-200">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSendReply} className="pt-3 border-t border-white/10">
                                <div className="relative">
                                    <textarea
                                        rows={3}
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder={
                                            isSuperAdminView
                                                ? (locale === 'fa' ? 'متن پاسخ با مهر سوپر ادمین را بنویسید...' : 'Type master response as super admin...')
                                                : (locale === 'fa' ? 'متن پاسخ پشتیبانی را بنویسید...' : 'Type your support response...')
                                        }
                                        className="w-full p-3 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isPending || !replyMessage.trim()}
                                        className="prm-btn-primary absolute bottom-3 left-3 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-400 hover:to-orange-500 transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{locale === 'fa' ? 'ارسال پاسخ' : 'Send'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                            <MessageSquare className="w-8 h-8 stroke-[1.5] mb-2 text-slate-600" />
                            <span>{locale === 'fa' ? 'لطفاً یک تیکت را از لیست انتخاب کنید.' : 'Select a ticket to view conversation.'}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
