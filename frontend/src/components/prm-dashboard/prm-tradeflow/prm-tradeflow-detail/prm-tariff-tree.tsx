"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prmGetTariffTree } from "@/lib/prm-tradeflow/prm-tradeflow-api";
import { prmFormatExact, prmMetricLabel } from "@/lib/prm-tradeflow/prm-tradeflow-number";
import {
    PrmTariffTreeData,
    PrmTariffTreeNode,
    PrmTradeFlowFilterState,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTariffTreeProps {
    filters: PrmTradeFlowFilterState;
    token: string;
}

interface PrmTile {
    node: PrmTariffTreeNode;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface PrmWeightedNode {
    node: PrmTariffTreeNode;
    weight: number;
}

function prmBuildTiles(
    nodes: PrmWeightedNode[],
    x: number,
    y: number,
    width: number,
    height: number
): PrmTile[] {
    if (nodes.length === 0 || width <= 0 || height <= 0) return [];

    if (nodes.length === 1) {
        return [{ node: nodes[0].node, x, y, width, height }];
    }

    const total = nodes.reduce((sum, item) => sum + item.weight, 0);
    let firstTotal = 0;
    let cut = 0;

    while (cut < nodes.length - 1 && firstTotal < total / 2) {
        firstTotal += nodes[cut].weight;
        cut += 1;
    }

    const ratio = firstTotal / total;
    const first = nodes.slice(0, cut);
    const second = nodes.slice(cut);

    if (width >= height) {
        const firstWidth = width * ratio;
        return [
            ...prmBuildTiles(first, x, y, firstWidth, height),
            ...prmBuildTiles(second, x + firstWidth, y, width - firstWidth, height),
        ];
    }

    const firstHeight = height * ratio;

    return [
        ...prmBuildTiles(first, x, y, width, firstHeight),
        ...prmBuildTiles(second, x, y + firstHeight, width, height - firstHeight),
    ];
}

export function PrmTariffTree({ filters, token }: PrmTariffTreeProps) {
    const [prefix, setPrefix] = useState("");
    const [data, setData] = useState<PrmTariffTreeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver(entries => {
            setWidth(Math.round(entries[0].contentRect.width));
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let active = true;

        setLoading(true);
        setError("");
        setData(null);

        prmGetTariffTree(filters, token, prefix)
            .then(result => {
                if (active) setData(result);
            })
            .catch(() => {
                if (active) setError("دریافت نمودار درختی ناموفق بود.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [filters, token, prefix]);

    const positive = useMemo(() => {
        const available = (data?.nodes ?? [])
            .map(node => ({ node, weight: Number(node.value) }))
            .filter(item => Number.isFinite(item.weight) && item.weight > 0)
            .sort((a, b) => b.weight - a.weight);

        const maximum = available[0]?.weight ?? 0;

        return maximum > 0
            ? available.map(item => ({ ...item, weight: item.weight / maximum }))
            : [];
    }, [data]);

    const tiles = useMemo(
        () => prmBuildTiles(positive, 0, 0, width, 360),
        [positive, width]
    );

    return (
        <section className="prm-tf-detail-card prm-tf-tree-card" dir="rtl">
            <div className="prm-tf-detail-heading">
                <h2>نمودار درختی تعرفه‌ها</h2>
                <p>مساحت هر بلوک متناسب با {prmMetricLabel(filters.metric)} است.</p>
            </div>

            <div className="prm-tf-tree-navigation">
                <span>سطح فعلی: {prefix || "کل فصل‌ها (۲ رقمی)"}</span>
                {prefix && (
                    <button
                        type="button"
                        onClick={() => setPrefix(current => current.slice(0, -2))}
                    >
                        بازگشت به سطح قبلی
                    </button>
                )}
            </div>

            {error && <p className="prm-tf-detail-error" role="alert">{error}</p>}
            {loading && <p className="prm-tf-detail-status" role="status">در حال آماده‌سازی نمودار درختی…</p>}

            <div ref={containerRef} className="prm-tf-treemap" aria-label="نمودار درختی تعرفه‌ها">
                {!loading && positive.length === 0 && (
                    <p className="prm-tf-detail-status">
                        داده‌ای با ارزش مثبت جهت رسم بلوک یافت نشد.
                    </p>
                )}
                {!loading && tiles.map((tile, index) => {
                    const canExpand =
                        tile.node.code.length === data?.depth &&
                        tile.node.code.length < 8;

                    return (
                        <button
                            key={tile.node.code}
                            type="button"
                            className="prm-tf-tree-tile"
                            disabled={!canExpand}
                            onClick={() => setPrefix(tile.node.code)}
                            title={`کد تعرفه: ${tile.node.code} | ${prmMetricLabel(filters.metric)}: ${prmFormatExact(tile.node.value)} | تعداد: ${prmFormatExact(tile.node.record_count)}`}
                            style={{
                                left: tile.x,
                                top: tile.y,
                                width: tile.width,
                                height: tile.height,
                                backgroundColor: [
                                    "#0f172a",
                                    "#1e3a5f",
                                    "#284c72",
                                    "#bc720d",
                                    "#ea580c",
                                ][index % 5],
                            }}
                        >
                            {tile.width >= 58 && tile.height >= 35 && (
                                <>
                                    <strong dir="ltr">{tile.node.code}</strong>
                                    {tile.width >= 110 && tile.height >= 62 && (
                                        <small>{prmFormatExact(tile.node.value)}</small>
                                    )}
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
            <p className="prm-tf-tree-note">
                روی هر بلوک برای ورود به زیرمجموعه‌های ۴، ۶ و ۸ رقمی کلیک کنید.
            </p>
        </section>
    );
}
