"use client";

import { ChangeEvent, ReactNode } from "react";
import {
    PrmMetricType,
    PrmTradeFlowFilterOptions,
    PrmTradeFlowFilterState,
    PrmTradeType,
} from "@/lib/prm-tradeflow/prm-tradeflow-types";

interface PrmTradeFlowFiltersProps {
    filters: PrmTradeFlowFilterState;
    options: PrmTradeFlowFilterOptions;
    onChange: (updated: Partial<PrmTradeFlowFilterState>) => void;
    onReset: () => void;
}

export function PrmTradeFlowFilters({
    filters,
    options,
    onChange,
    onReset,
}: PrmTradeFlowFiltersProps): ReactNode {
    const handleSelect = (key: keyof PrmTradeFlowFilterState) => {
        return (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            onChange({ [key]: e.target.value });
        };
    };

    return (
        <div className="prm-tf-filters-panel prm-liquid-glass">
            <div className="prm-tf-header-card" style={{ padding: 0 }}>
                <div className="prm-tf-trade-type-tabs">
                    <button
                        type="button"
                        className={`prm-tf-tab-btn ${filters.trade_type === "all" ? "prm-tf-tab-btn-active" : ""}`}
                        onClick={() => onChange({ trade_type: "all" })}
                    >
                        صادرات و واردات
                    </button>
                    <button
                        type="button"
                        className={`prm-tf-tab-btn ${filters.trade_type === "export" ? "prm-tf-tab-btn-active" : ""}`}
                        onClick={() => onChange({ trade_type: "export" })}
                    >
                        صادرات
                    </button>
                    <button
                        type="button"
                        className={`prm-tf-tab-btn ${filters.trade_type === "import" ? "prm-tf-tab-btn-active" : ""}`}
                        onClick={() => onChange({ trade_type: "import" })}
                    >
                        واردات
                    </button>
                </div>

                <div className="prm-tf-metric-tabs">
                    <button
                        type="button"
                        className={`prm-tf-metric-btn ${filters.metric === "dolar" ? "prm-tf-metric-btn-active" : ""}`}
                        onClick={() => onChange({ metric: "dolar" })}
                    >
                        دلاری
                    </button>
                    <button
                        type="button"
                        className={`prm-tf-metric-btn ${filters.metric === "rial" ? "prm-tf-metric-btn-active" : ""}`}
                        onClick={() => onChange({ metric: "rial" })}
                    >
                        ریالی
                    </button>
                    <button
                        type="button"
                        className={`prm-tf-metric-btn ${filters.metric === "weight" ? "prm-tf-metric-btn-active" : ""}`}
                        onClick={() => onChange({ metric: "weight" })}
                    >
                        وزنی
                    </button>
                </div>

                <button
                    type="button"
                    className="prm-btn-glass"
                    onClick={onReset}
                >
                    پاکسازی همه
                </button>
            </div>

            <div className="prm-tf-filters-grid">
                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">سال</label>
                    <select
                        className="prm-tf-select"
                        value={filters.year}
                        onChange={handleSelect("year")}
                    >
                        <option value="">همه سال‌ها</option>
                        {options.years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">ماه</label>
                    <select
                        className="prm-tf-select"
                        value={filters.month}
                        onChange={handleSelect("month")}
                    >
                        <option value="">همه ماه‌ها</option>
                        {options.months.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">فصل سال</label>
                    <select
                        className="prm-tf-select"
                        value={filters.season}
                        onChange={handleSelect("season")}
                    >
                        <option value="">همه فصل‌ها</option>
                        {options.seasons.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">قاره</label>
                    <select
                        className="prm-tf-select"
                        value={filters.continent_id}
                        onChange={handleSelect("continent_id")}
                    >
                        <option value="">همه قاره‌ها</option>
                        {options.continents.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">منطقه</label>
                    <select
                        className="prm-tf-select"
                        value={filters.region_id}
                        onChange={handleSelect("region_id")}
                    >
                        <option value="">همه مناطق</option>
                        {options.regions.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">اتحادیه</label>
                    <select
                        className="prm-tf-select"
                        value={filters.united_id}
                        onChange={handleSelect("united_id")}
                    >
                        <option value="">همه اتحادیه‌ها</option>
                        {options.unions.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">کشور</label>
                    <select
                        className="prm-tf-select"
                        value={filters.country_id}
                        onChange={handleSelect("country_id")}
                    >
                        <option value="">همه کشورها</option>
                        {options.countries.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">استان</label>
                    <select
                        className="prm-tf-select"
                        value={filters.province_id}
                        onChange={handleSelect("province_id")}
                    >
                        <option value="">همه استان‌ها</option>
                        {options.provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">گمرک</label>
                    <select
                        className="prm-tf-select"
                        value={filters.custom_id}
                        onChange={handleSelect("custom_id")}
                    >
                        <option value="">همه گمرک‌ها</option>
                        {options.customs.map((cm) => (
                            <option key={cm.id} value={cm.id}>
                                {cm.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group">
                    <label className="prm-tf-field-label">قسمت تعرفه</label>
                    <select
                        className="prm-tf-select"
                        value={filters.section_id}
                        onChange={handleSelect("section_id")}
                    >
                        <option value="">همه قسمت‌ها</option>
                        {options.sections.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                                {sec.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="prm-tf-field-group" style={{ gridColumn: "span 2" }}>
                    <label className="prm-tf-field-label">کد/شرح تعرفه</label>
                    <input
                        type="text"
                        className="prm-tf-input"
                        placeholder="کد ۸ رقمی یا بخشی از شرح کالا..."
                        value={filters.tariff}
                        onChange={handleSelect("tariff")}
                    />
                </div>
            </div>
        </div>
    );
}
