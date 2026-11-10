"use client";

import { FormEvent, useEffect, useState } from "react";
import {
    prmAdminChatAdvertisements,
    prmAdminChatConversations,
    prmAdminChatDetails,
    prmAdminDownloadChatAttachment,
} from "@/lib/prm-admin/prm-admin-ad-chats-api";
import {
    PrmAdminAdChatAdvertisement,
    PrmAdminAdChatConversation,
    PrmAdminAdChatDetails,
    PrmAdminAdChatMessage,
    PrmAdminAdChatMeta,
    PrmAdminAdChatUser,
} from "@/types/prm-admin-ad-chats";
import { PrmAdminChatModeration } from "./prm-admin-chat-moderation";

interface PrmAdminAdChatsProps {
    locale: string;
}

const emptyMeta: PrmAdminAdChatMeta = {
    current_page: 1,
    last_page: 1,
    total: 0,
};

function prmError(error: unknown): string {
    return error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد.";
}

function prmDate(value: string | null, locale: string): string {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
}

function PrmParticipantCard({
    title,
    user,
}: {
    title: string;
    user: PrmAdminAdChatUser | null;
}) {
    return (
        <div className="rounded-2xl border border-white/50 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <p className="text-xs font-bold text-[#ea580c]">{title}</p>
            {user ? (
                <div className="mt-2 space-y-1 text-sm text-[#1e293b]">
                    <p className="font-semibold">{user.name}</p>
                    <p>شناسه: {user.id}</p>
                    <p>شرکت: {user.company_name ?? "—"}</p>
                    <p dir="ltr" className="text-right">
                        {user.mobile ?? "—"}
                    </p>
                    <p dir="ltr" className="break-all text-right">
                        {user.email ?? "—"}
                    </p>
                </div>
            ) : (
                <p className="mt-2 text-sm text-[#64748b]">
                    اطلاعات کاربر در دسترس نیست.
                </p>
            )}
        </div>
    );
}

export default function PrmAdminAdChats({
    locale,
}: PrmAdminAdChatsProps) {
    const [ads, setAds] = useState<PrmAdminAdChatAdvertisement[]>([]);
    const [adMeta, setAdMeta] = useState<PrmAdminAdChatMeta>(emptyMeta);
    const [adPage, setAdPage] = useState(1);
    const [adInput, setAdInput] = useState("");
    const [adSearch, setAdSearch] = useState("");
    const [selectedAd, setSelectedAd] =
        useState<PrmAdminAdChatAdvertisement | null>(null);

    const [conversations, setConversations] =
        useState<PrmAdminAdChatConversation[]>([]);
    const [conversationMeta, setConversationMeta] =
        useState<PrmAdminAdChatMeta>(emptyMeta);
    const [conversationPage, setConversationPage] = useState(1);
    const [conversationInput, setConversationInput] = useState("");
    const [conversationSearch, setConversationSearch] = useState("");
    const [selectedConversationId, setSelectedConversationId] =
        useState<number | null>(null);

    const [details, setDetails] = useState<PrmAdminAdChatDetails | null>(null);
    const [messages, setMessages] = useState<PrmAdminAdChatMessage[]>([]);
    const [messagePage, setMessagePage] = useState(1);
    const [messageMeta, setMessageMeta] =
        useState<PrmAdminAdChatMeta>(emptyMeta);

    const [revision, setRevision] = useState(0);
    const [detailRevision, setDetailRevision] = useState(0);
    const [loadingAds, setLoadingAds] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("برای مشاهدهٔ گفتگوها ابتدا وارد پنل مدیریت شوید.");
            return;
        }

        setLoadingAds(true);
        setError(null);

        prmAdminChatAdvertisements(
            token,
            adPage,
            adSearch,
            controller.signal,
        )
            .then((result) => {
                setAds(result.data);
                setAdMeta(result.meta);
            })
            .catch((failure: unknown) => {
                if (!controller.signal.aborted) {
                    setError(prmError(failure));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoadingAds(false);
                }
            });

        return () => controller.abort();
    }, [adPage, adSearch, revision]);

    useEffect(() => {
        if (!selectedAd) {
            return;
        }

        const controller = new AbortController();
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("نشست مدیریت در دسترس نیست.");
            return;
        }

        setLoadingConversations(true);
        setError(null);

        prmAdminChatConversations(
            token,
            selectedAd.id,
            conversationPage,
            conversationSearch,
            controller.signal,
        )
            .then((result) => {
                setConversations(result.data);
                setConversationMeta(result.meta);
            })
            .catch((failure: unknown) => {
                if (!controller.signal.aborted) {
                    setError(prmError(failure));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoadingConversations(false);
                }
            });

        return () => controller.abort();
    }, [
        selectedAd,
        conversationPage,
        conversationSearch,
        revision,
    ]);

    useEffect(() => {
        if (selectedConversationId === null) {
            return;
        }

        const controller = new AbortController();
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("نشست مدیریت در دسترس نیست.");
            return;
        }

        setLoadingDetails(true);
        setError(null);

        prmAdminChatDetails(
            token,
            selectedConversationId,
            1,
            controller.signal,
        )
            .then((result) => {
                setDetails(result);
                setMessages(result.messages);
                setMessageMeta(result.meta);
                setMessagePage(1);
            })
            .catch((failure: unknown) => {
                if (!controller.signal.aborted) {
                    setError(prmError(failure));
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoadingDetails(false);
                }
            });

        return () => controller.abort();
    }, [selectedConversationId, detailRevision]);

    function selectAd(ad: PrmAdminAdChatAdvertisement): void {
        setSelectedAd(ad);
        setConversationPage(1);
        setConversationInput("");
        setConversationSearch("");
        setConversations([]);
        setConversationMeta(emptyMeta);
        setSelectedConversationId(null);
        setDetails(null);
        setMessages([]);
        setMessagePage(1);
        setMessageMeta(emptyMeta);
        setError(null);
    }

    function selectConversation(id: number): void {
        setSelectedConversationId(id);
        setDetails(null);
        setMessages([]);
        setMessagePage(1);
        setMessageMeta(emptyMeta);
        setError(null);
    }

    function submitAds(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setAdPage(1);
        setAdSearch(adInput.trim());
    }

    function submitConversations(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setConversationPage(1);
        setConversationSearch(conversationInput.trim());
    }

    async function loadOlder(): Promise<void> {
        if (
            selectedConversationId === null ||
            loadingOlder ||
            messagePage >= messageMeta.last_page
        ) {
            return;
        }

        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("نشست مدیریت در دسترس نیست.");
            return;
        }

        const currentConversationId = selectedConversationId;
        const nextPage = messagePage + 1;

        setLoadingOlder(true);
        setError(null);

        try {
            const result = await prmAdminChatDetails(
                token,
                currentConversationId,
                nextPage,
            );

            if (selectedConversationId !== currentConversationId) {
                return;
            }

            setMessages((current) => {
                const combined = [...result.messages, ...current];
                const unique = new Map(
                    combined.map((message) => [message.id, message]),
                );

                return [...unique.values()].sort((a, b) => a.id - b.id);
            });
            setMessagePage(nextPage);
            setMessageMeta(result.meta);
        } catch (failure) {
            setError(prmError(failure));
        } finally {
            setLoadingOlder(false);
        }
    }

    async function downloadAttachment(
        attachmentId: number,
        filename: string,
    ): Promise<void> {
        const token = window.localStorage.getItem("prm_admin_token");

        if (!token) {
            setError("نشست مدیریت در دسترس نیست.");
            return;
        }

        setDownloadingId(attachmentId);
        setError(null);

        try {
            await prmAdminDownloadChatAttachment(
                token,
                attachmentId,
                filename,
            );
        } catch (failure) {
            setError(prmError(failure));
        } finally {
            setDownloadingId(null);
        }
    }

    const card =
        "min-w-0 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.09)] backdrop-blur-2xl";
    const input =
        "min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-[#1e293b] outline-none focus:border-[#f59e0b]";
    const button =
        "rounded-xl bg-[#0f172a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <main
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="min-h-screen bg-[#f8fafc] p-4 text-[#1e293b] lg:p-6"
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-black text-[#0f172a]">
                        پایش آگهی‌ها و گفتگوها
                    </h1>
                    <p className="mt-1 text-sm text-[#64748b]">
                        مشاهدهٔ آگهی‌ها، طرفین گفتگو و تاریخچهٔ پیام‌ها
                    </p>
                </div>
                <button
                    type="button"
                    className={button}
                    onClick={() => {
                        setRevision((value) => value + 1);
                        if (selectedConversationId !== null) {
                            setDetailRevision((value) => value + 1);
                        }
                    }}
                >
                    تازه‌سازی
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}
<PrmAdminChatModeration
    conversationId={selectedConversationId}
    onChanged={() => {
        setRevision((value) => value + 1);
        setDetailRevision((value) => value + 1);
    }}
/>

            <div className="grid gap-4 xl:grid-cols-[minmax(220px,1fr)_minmax(260px,1.1fr)_minmax(350px,1.8fr)]">
                <section className={card}>
                    <h2 className="mb-3 font-bold">همهٔ آگهی‌ها</h2>
                    <form onSubmit={submitAds} className="mb-4 flex gap-2">
                        <input
                            className={input}
                            value={adInput}
                            onChange={(event) =>
                                setAdInput(event.target.value)
                            }
                            placeholder="عنوان یا شناسهٔ آگهی"
                            maxLength={100}
                        />
                        <button className={button} type="submit">
                            جست‌وجو
                        </button>
                    </form>

                    <p className="mb-2 text-xs text-[#64748b]">
                        تعداد: {adMeta.total}
                    </p>

                    {loadingAds && (
                        <p className="text-sm">در حال دریافت آگهی‌ها...</p>
                    )}

                    {!loadingAds && ads.length === 0 && (
                        <p className="text-sm text-[#64748b]">
                            آگهی‌ای پیدا نشد.
                        </p>
                    )}

                    <div className="space-y-2">
                        {ads.map((ad) => (
                            <button
                                key={ad.id}
                                type="button"
                                onClick={() => selectAd(ad)}
                                className={`w-full rounded-2xl border p-3 text-start transition ${
                                    selectedAd?.id === ad.id
                                        ? "border-[#f59e0b] bg-amber-50"
                                        : "border-slate-200 bg-white/70 hover:border-amber-300"
                                }`}
                            >
                                <p className="font-semibold">{ad.title}</p>
                                <p className="mt-1 text-xs text-[#64748b]">
                                    آگهی #{ad.id} · گفتگو:{" "}
                                    {ad.conversation_count ?? 0}
                                </p>
                                <p className="mt-1 text-xs text-[#64748b]">
                                    مالک: {ad.owner?.name ?? "نامشخص"}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                        <button
                            type="button"
                            className={button}
                            disabled={adPage <= 1}
                            onClick={() => setAdPage((page) => page - 1)}
                        >
                            قبلی
                        </button>
                        <span>
                            {adMeta.current_page} / {adMeta.last_page}
                        </span>
                        <button
                            type="button"
                            className={button}
                            disabled={adPage >= adMeta.last_page}
                            onClick={() => setAdPage((page) => page + 1)}
                        >
                            بعدی
                        </button>
                    </div>
                </section>

                <section className={card}>
                    <h2 className="mb-3 font-bold">گفتگوهای آگهی</h2>

                    {selectedAd ? (
                        <>
                            <div className="mb-4 rounded-2xl bg-[#0f172a] p-3 text-sm text-white">
                                <p className="font-semibold">
                                    {selectedAd.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-300">
                                    مالک:{" "}
                                    {selectedAd.owner?.name ?? "نامشخص"}
                                </p>
                            </div>

                            <form
                                onSubmit={submitConversations}
                                className="mb-4 flex gap-2"
                            >
                                <input
                                    className={input}
                                    value={conversationInput}
                                    onChange={(event) =>
                                        setConversationInput(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="نام، ایمیل یا موبایل طرفین"
                                    maxLength={100}
                                />
                                <button
                                    className={button}
                                    type="submit"
                                >
                                    جست‌وجو
                                </button>
                            </form>

                            <p className="mb-2 text-xs text-[#64748b]">
                                تعداد گفتگو: {conversationMeta.total}
                            </p>

                            {loadingConversations && (
                                <p className="text-sm">
                                    در حال دریافت گفتگوها...
                                </p>
                            )}

                            {!loadingConversations &&
                                conversations.length === 0 && (
                                    <p className="text-sm text-[#64748b]">
                                        گفتگویی پیدا نشد.
                                    </p>
                                )}

                            <div className="space-y-2">
                                {conversations.map((conversation) => (
                                    <button
                                        key={conversation.id}
                                        type="button"
                                        onClick={() =>
                                            selectConversation(
                                                conversation.id,
                                            )
                                        }
                                        className={`w-full rounded-2xl border p-3 text-start transition ${
                                            selectedConversationId ===
                                            conversation.id
                                                ? "border-[#f59e0b] bg-amber-50"
                                                : "border-slate-200 bg-white/70 hover:border-amber-300"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold">
                                            {conversation.creator?.name ??
                                                "کاربر نامشخص"}
                                            {" ↔ "}
                                            {conversation.recipient?.name ??
                                                "کاربر نامشخص"}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-xs text-[#64748b]">
                                            {conversation.last_message?.body ??
                                                (conversation.last_message
                                                    ?.attachment
                                                    ? "پیوست"
                                                    : "بدون پیام")}
                                        </p>
                                        <p className="mt-2 text-xs text-[#64748b]">
                                            #{conversation.id} ·{" "}
                                            {conversation.message_count} پیام
                                            {" · "}
                                            {prmDate(
                                                conversation.last_message_at,
                                                locale,
                                            )}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                                <button
                                    type="button"
                                    className={button}
                                    disabled={conversationPage <= 1}
                                    onClick={() =>
                                        setConversationPage(
                                            (page) => page - 1,
                                        )
                                    }
                                >
                                    قبلی
                                </button>
                                <span>
                                    {conversationMeta.current_page} /{" "}
                                    {conversationMeta.last_page}
                                </span>
                                <button
                                    type="button"
                                    className={button}
                                    disabled={
                                        conversationPage >=
                                        conversationMeta.last_page
                                    }
                                    onClick={() =>
                                        setConversationPage(
                                            (page) => page + 1,
                                        )
                                    }
                                >
                                    بعدی
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-[#64748b]">
                            ابتدا یک آگهی انتخاب کنید.
                        </p>
                    )}
                </section>

                <section className={card}>
                    <h2 className="mb-3 font-bold">تاریخچهٔ چت</h2>

                    {loadingDetails && (
                        <p className="text-sm">در حال دریافت پیام‌ها...</p>
                    )}

                    {!loadingDetails && !details && (
                        <p className="text-sm text-[#64748b]">
                            یک گفتگو انتخاب کنید.
                        </p>
                    )}

                    {details && (
                        <>
                            <div className="mb-4 grid gap-3 md:grid-cols-2">
                                <PrmParticipantCard
                                    title="شروع‌کنندهٔ گفتگو"
                                    user={details.conversation.creator}
                                />
                                <PrmParticipantCard
                                    title="طرف مقابل"
                                    user={details.conversation.recipient}
                                />
                            </div>

                            <p className="mb-3 text-xs text-[#64748b]">
                                گفتگوی #{details.conversation.id} · آگهی:{" "}
                                {details.advertisement?.title ??
                                    details.conversation.advertisement_id}
                                {" · "}
                                {details.conversation.message_count} پیام
                            </p>

                            {messagePage < messageMeta.last_page && (
                                <button
                                    type="button"
                                    className={`${button} mb-4`}
                                    disabled={loadingOlder}
                                    onClick={loadOlder}
                                >
                                    {loadingOlder
                                        ? "در حال دریافت..."
                                        : "نمایش پیام‌های قدیمی‌تر"}
                                </button>
                            )}

                            {messages.length === 0 && (
                                <p className="text-sm text-[#64748b]">
                                    این گفتگو هنوز پیامی ندارد.
                                </p>
                            )}

                            <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1">
                                {messages.map((message) => (
                                    <article
                                        key={message.id}
                                        className={`rounded-2xl border p-3 ${
                                            message.sender_id ===
                                            details.conversation.creator?.id
                                                ? "border-amber-200 bg-amber-50/90"
                                                : "border-slate-200 bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                            <strong>
                                                {message.sender_name}
                                            </strong>
                                            <span className="text-[#64748b]">
                                                {prmDate(
                                                    message.created_at,
                                                    locale,
                                                )}
                                            </span>
                                        </div>

                                        {message.body && (
                                            <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                                                {message.body}
                                            </p>
                                        )}

                                        {message.attachment && (
                                            <button
                                                type="button"
                                                className="mt-3 rounded-lg border border-[#f59e0b] px-3 py-2 text-xs font-semibold text-[#0f172a] hover:bg-amber-100 disabled:opacity-40"
                                                disabled={
                                                    downloadingId ===
                                                    message.attachment.id
                                                }
                                                onClick={() =>
                                                    downloadAttachment(
                                                        message.attachment!.id,
                                                        message.attachment!.name,
                                                    )
                                                }
                                            >
                                                {downloadingId ===
                                                message.attachment.id
                                                    ? "در حال دریافت..."
                                                    : `دریافت پیوست: ${message.attachment.name}`}
                                            </button>
                                        )}

                                        <p className="mt-2 text-[11px] text-[#64748b]">
                                            پیام #{message.id}
                                            {" · "}
                                            {message.read_at
                                                ? "خوانده‌شده توسط مخاطب"
                                                : "هنوز خوانده نشده"}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
