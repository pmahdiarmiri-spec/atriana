"use client";

import React from "react";

interface PrmAdsPaginationProps {
    currentPage: number;
    lastPage: number;
    onChange: (page: number) => void;
}

export default function PrmAdsPagination({
    currentPage,
    lastPage,
    onChange,
}: PrmAdsPaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const pages = Array.from(
        { length: lastPage },
        (_, index) => index + 1,
    ).filter(
        (page) =>
            page === 1 || page === lastPage || Math.abs(page - currentPage) <= 1,
    );

    return (
        <nav className="prm-ads-pagination flex items-center justify-center gap-2">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                className="prm-ads-pagination-btn h-10 rounded-xl border border-slate-200 bg-[var(--prm-white)] px-4 text-sm font-bold text-[var(--prm-text-dark)] transition-colors hover:border-[var(--prm-secondary-color)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                قبلی
            </button>

            {pages.map((page, index) => {
                const previous = pages[index - 1];
                const showGap = previous !== undefined && page - previous > 1;

                return (
                    <React.Fragment key={page}>
                        {showGap && <span className="text-slate-400">...</span>}
                        <button
                            type="button"
                            onClick={() => onChange(page)}
                            className={`prm-ads-pagination-page h-10 w-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                                page === currentPage
                                    ? "bg-[var(--prm-primary-color)] text-[var(--prm-white)] shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6)]"
                                    : "border border-slate-200 bg-[var(--prm-white)] text-[var(--prm-text-dark)] hover:border-[var(--prm-secondary-color)]"
                            }`}
                        >
                            {page.toLocaleString("fa-IR")}
                        </button>
                    </React.Fragment>
                );
            })}

            <button
                type="button"
                disabled={currentPage === lastPage}
                onClick={() => onChange(currentPage + 1)}
                className="prm-ads-pagination-btn h-10 rounded-xl border border-slate-200 bg-[var(--prm-white)] px-4 text-sm font-bold text-[var(--prm-text-dark)] transition-colors hover:border-[var(--prm-secondary-color)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                بعدی
            </button>
        </nav>
    );
}
