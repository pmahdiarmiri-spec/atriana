"use client";

import { useEffect, useState } from "react";
import { prmGetTradeFlowTable } from "@/lib/prm-tradeflow/prm-tradeflow-api";
import { prmFormatExact } from "@/lib/prm-tradeflow/prm-tradeflow-number";
import {
    PrmSortDirection,
    PrmTableSort,
    PrmTableTab,
    PrmTradeFlowFilterState,
    PrmTradeFlowTableData,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowTableProps {
    filters: PrmTradeFlowFilterState;
    token: string;
}

const prmTabs: { id: PrmTableTab; title: string }[] = [
    { id: "tariffs", title: "تعرفه‌ها" },
    { id: "countries", title: "کشورها" },
    { id: "customs", title: "گمرک‌ها" },
    { id: "provinces", title: "استان‌ها" },
    { id: "annual", title: "سالانه" },
    { id: "monthly", title: "ماهانه" },
];

const prmColumns: { id: PrmTableSort; title: string }[] = [
    { id: "tariff_code", title: "کد تعرفه" },
    { id: "description", title: "شرح کالا" },
    { id: "total_usd", title: "ارزش دلاری" },
    { id: "total_rial", title: "ارزش ریالی" },
    { id: "total_weight", title: "وزن" },
    { id: "record_count", title: "تعداد" },
    { id: "country", title: "کشور" },
];

export function PrmTradeFlowTable({ filters, token }: PrmTradeFlowTableProps) {
    const [tab, setTab] = useState<PrmTableTab>("tariffs");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<PrmTableSort | null>(null);
    const [sortDir, setSortDir] = useState<PrmSortDirection>("desc");
    const [data, setData] = useState<PrmTradeFlowTableData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        setLoading(true);
        setError("");
        setData(null);

        prmGetTradeFlowTable(filters, token, tab, page, sortBy, sortDir)
            .then(result => {
                if (active) setData(result);
            })
            .catch(() => {
                if (active) setError("دریافت جدول ناموفق بود.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [filters, token, tab, page, sortBy, sortDir]);

    const selectTab = (next: PrmTableTab) => {
        if (next === tab) return;
        setTab(next);
        setPage(1);
        setSortBy(null);
        setSortDir("desc");
    };

    const selectSort = (column: PrmTableSort) => {
        setSortDir(previous =>
            sortBy === column && previous === "desc" ? "asc" : "desc"
        );
        setSortBy(column);
        setPage(1);
    };

    return (
        <section className="prm-tf-detail-card prm-tf-table-card" dir="rtl">
            <div className="prm-tf-detail-heading">
                <h2>جدول جریان تجارت</h2>
                <p>۱۰ ردیف در هر صفحه؛ مرتب‌سازی روی تمام رکوردهای سرور اعمال می‌شود.</p>
            </div>

            <div className="prm-tf-detail-tabs" role="tablist" aria-label="بخش جدول">
                {prmTabs.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === item.id}
                        className={tab === item.id ? "prm-tf-detail-tab prm-tf-detail-tab-active" : "prm-tf-detail-tab"}
                        onClick={() => selectTab(item.id)}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            {error && <p className="prm-tf-detail-error" role="alert">{error}</p>}
            {loading && <p className="prm-tf-detail-status" role="status">در حال دریافت داده‌های جدول…</p>}

            {!loading && data && (
                <>
                    <div className="prm-tf-table-scroll">
                        <table className="prm-tf-detail-table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    {prmColumns.map(column => (
                                        <th scope="col" key={column.id}>
                                            <button
                                                type="button"
                                                className="prm-tf-sort-button"
                                                onClick={() => selectSort(column.id)}
                                                aria-label={`مرتب‌سازی بر اساس ${column.title}`}
                                            >
                                                {column.title}
                                                {sortBy === column.id ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows.map((row, index) => (
                                    <tr key={`${tab}-${page}-${index}-${row.tariff_code ?? row.label}-${row.country ?? ""}`}>
                                        <td>{prmFormatExact((page - 1) * data.per_page + index + 1)}</td>
                                        <td dir="ltr">{row.tariff_code || "—"}</td>
                                        <td>{row.description || (tab === "tariffs" ? "—" : row.label)}</td>
                                        <td dir="ltr">{prmFormatExact(row.total_usd)}</td>
                                        <td dir="ltr">{prmFormatExact(row.total_rial)}</td>
                                        <td dir="ltr">{prmFormatExact(row.total_weight)}</td>
                                        <td dir="ltr">{prmFormatExact(row.record_count)}</td>
                                        <td>{row.country || "—"}</td>
                                    </tr>
                                ))}
                                {data.rows.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="prm-tf-empty-cell">
                                            داده‌ای برای این بخش و فیلترها یافت نشد.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="prm-tf-table-footer">
                        <span>
                            {prmFormatExact(data.total === 0 ? 0 : (page - 1) * data.per_page + 1)}
                            {" تا "}
                            {prmFormatExact(Math.min(page * data.per_page, data.total))}
                            {" از "}
                            {prmFormatExact(data.total)}
                        </span>
                        <div className="prm-tf-pagination">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage(current => current - 1)}
                            >
                                قبلی
                            </button>
                            <span>{prmFormatExact(page)} / {prmFormatExact(data.last_page)}</span>
                            <button
                                type="button"
                                disabled={page >= data.last_page}
                                onClick={() => setPage(current => current + 1)}
                            >
                                بعدی
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
