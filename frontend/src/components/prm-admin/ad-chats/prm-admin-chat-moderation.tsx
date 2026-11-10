"use client";

import { useEffect, useState } from "react";
import {
    PrmAdminChatReport,
    PrmAdminChatState,
    prmAdminApplyChatAction,
    prmAdminChatReports,
    prmAdminChatState,
    prmAdminUpdateChatReport,
} from "@/lib/prm-admin/prm-admin-chat-moderation-api";

interface Props {
    conversationId: number | null;
    onChanged: () => void;
}

export function PrmAdminChatModeration({ conversationId, onChanged }: Props) {
    const [reports, setReports] = useState<PrmAdminChatReport[]>([]);
    const [state, setState] = useState<PrmAdminChatState | null>(null);
    const [filter, setFilter] = useState("pending");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [revision, setRevision] = useState(0);
    const [reason, setReason] = useState("");
    const [until, setUntil] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            return;
        }

        void prmAdminChatReports(token, filter, page)
            .then((result) => {
                if (active) {
                    setReports(result.data);
                    setLastPage(result.meta.last_page);
                }
            })
            .catch((failure: unknown) => {
                if (active) {
                    setError(failure instanceof Error ? failure.message : "دریافت گزارش‌ها ناموفق بود.");
                }
            });

        return () => {
            active = false;
        };
    }, [filter, page, revision]);

    useEffect(() => {
        if (conversationId === null) {
            setState(null);
            return;
        }

        let active = true;
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            return;
        }

        void prmAdminChatState(token, conversationId)
            .then((result) => {
                if (active) {
                    setState(result);
                }
            })
            .catch((failure: unknown) => {
                if (active) {
                    setError(failure instanceof Error ? failure.message : "دریافت وضعیت گفتگو ناموفق بود.");
                }
            });

        return () => {
            active = false;
        };
    }, [conversationId, revision]);

    async function updateReport(
        id: number,
        status: "in_review" | "resolved" | "rejected",
    ): Promise<void> {
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("نشست مدیریت در دسترس نیست.");
            return;
        }

        const note = status === "in_review"
            ? undefined
            : window.prompt("دلیل نتیجهٔ بررسی را وارد کنید:");

        if (status !== "in_review" && !note?.trim()) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            await prmAdminUpdateChatReport(token, id, status, note?.trim());
            setRevision((value) => value + 1);
            onChanged();
        } catch (failure) {
            setError(failure instanceof Error ? failure.message : "تغییر وضعیت گزارش ناموفق بود.");
        } finally {
            setBusy(false);
        }
    }

    async function applyAction(
        action: "suspend" | "block" | "close" | "restore",
    ): Promise<void> {
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token || conversationId === null) {
            setError("گفتگو یا نشست مدیریت در دسترس نیست.");
            return;
        }

        if (reason.trim().length < 5) {
            setError("دلیل اقدام باید دست‌کم ۵ نویسه باشد.");
            return;
        }

        let suspendedUntil: string | undefined;

        if (action === "suspend") {
            const date = new Date(until);

            if (!until || Number.isNaN(date.getTime()) || date <= new Date()) {
                setError("تاریخ پایان تعلیق باید در آینده باشد.");
                return;
            }

            suspendedUntil = date.toISOString();
        }

        if (
            (action === "block" || action === "close") &&
            !window.confirm("این اقدام ارسال پیام را برای هر دو طرف غیرفعال می‌کند. ادامه می‌دهید؟")
        ) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            await prmAdminApplyChatAction(
                token,
                conversationId,
                action,
                reason.trim(),
                suspendedUntil,
            );
            setReason("");
            setUntil("");
            setRevision((value) => value + 1);
            onChanged();
        } catch (failure) {
            setError(failure instanceof Error ? failure.message : "اعمال محدودیت ناموفق بود.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className="prm-admin-chat-moderation mb-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h2 className="font-bold">صف گزارش‌های گفتگو</h2>
                    <select
                        value={filter}
                        onChange={(event) => {
                            setFilter(event.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border p-2 text-xs"
                    >
                        <option value="pending">در انتظار بررسی</option>
                        <option value="in_review">در حال بررسی</option>
                        <option value="resolved">رسیدگی‌شده</option>
                        <option value="rejected">ردشده</option>
                        <option value="all">همه</option>
                    </select>
                </div>
                <div className="max-h-96 space-y-3 overflow-y-auto">
                    {reports.map((report) => (
                        <article key={report.id} className="rounded-2xl border border-slate-200 p-3 text-xs">
                            <p className="font-bold">
                                گزارش #{report.id} · گفتگو #{report.conversation_id}
                                {report.advertisement_id !== null && ` · آگهی #${report.advertisement_id}`}
                            </p>
                            <p className="mt-1">
                                گزارش‌دهنده: {report.reporter_name ?? report.reporter_id}
                                {" · "}
                                طرف مقابل: {report.reported_user_name ?? report.reported_user_id}
                            </p>
                            <p className="mt-1">دلیل: {report.reason}</p>
                            {report.message_id !== null && (
                                <p className="mt-1">پیام #{report.message_id}: {report.message_body ?? "پیوست یا متن ناموجود"}</p>
                            )}
                            {report.details && <p className="mt-1 whitespace-pre-wrap">{report.details}</p>}
                            <p className="mt-1 text-slate-500">وضعیت: {report.status}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {(report.status === "pending" ||
                                    report.status === "resolved" ||
                                    report.status === "rejected") && (
                                    <button type="button" disabled={busy} onClick={() => void updateReport(report.id, "in_review")} className="rounded-lg border px-2 py-1">
                                        شروع یا بازگشایی بررسی
                                    </button>
                                )}
                                {(report.status === "pending" || report.status === "in_review") && (
                                    <>
                                        <button type="button" disabled={busy} onClick={() => void updateReport(report.id, "resolved")} className="rounded-lg bg-green-700 px-2 py-1 text-white">
                                            رسیدگی شد
                                        </button>
                                        <button type="button" disabled={busy} onClick={() => void updateReport(report.id, "rejected")} className="rounded-lg bg-slate-700 px-2 py-1 text-white">
                                            رد گزارش
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    ))}
                    {reports.length === 0 && <p className="text-xs text-slate-500">گزارشی در این وضعیت نیست.</p>}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs">
                    <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>قبلی</button>
                    <span>{page} / {lastPage}</span>
                    <button type="button" disabled={page >= lastPage} onClick={() => setPage((value) => value + 1)}>بعدی</button>
                </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg">
                <h2 className="mb-3 font-bold">اقدامات مدیر برای گفتگوی انتخاب‌شده</h2>
                {conversationId === null ? (
                    <p className="text-xs text-slate-500">ابتدا یک گفتگو انتخاب کنید.</p>
                ) : (
                    <>
                        <p className="text-xs">
                            گفتگو #{conversationId} · وضعیت: {state?.status ?? "در حال دریافت"}
                        </p>
                        <textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            maxLength={1000}
                            placeholder="دلیل اقدام مدیر؛ الزامی"
                            className="mt-3 w-full rounded-xl border p-2 text-xs"
                        />
                        <label className="mt-2 block text-xs">
                            پایان تعلیق
                            <input
                                type="datetime-local"
                                value={until}
                                onChange={(event) => setUntil(event.target.value)}
                                className="mt-1 block w-full rounded-xl border p-2"
                            />
                        </label>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <button type="button" disabled={busy} onClick={() => void applyAction("suspend")} className="rounded-xl bg-amber-500 px-3 py-2">تعلیق موقت</button>
                            <button type="button" disabled={busy} onClick={() => void applyAction("block")} className="rounded-xl bg-red-700 px-3 py-2 text-white">مسدودسازی</button>
                            <button type="button" disabled={busy} onClick={() => void applyAction("close")} className="rounded-xl bg-slate-700 px-3 py-2 text-white">بستن گفتگو</button>
                            <button type="button" disabled={busy} onClick={() => void applyAction("restore")} className="rounded-xl bg-green-700 px-3 py-2 text-white">رفع محدودیت</button>
                        </div>
                        <h3 className="mt-4 text-xs font-bold">سابقهٔ اقدامات</h3>
                        <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-xs">
                            {state?.actions.map((item) => (
                                <p key={item.id} className="rounded-xl border p-2">
                                    {item.action} · مدیر #{item.admin_id} · {item.reason}
                                </p>
                            ))}
                        </div>
                    </>
                )}
                {error && <p role="alert" className="mt-3 text-xs text-red-700">{error}</p>}
            </div>
        </section>
    );
}
