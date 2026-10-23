import React from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, TrendingUp, Cpu, BarChart2, Settings } from "lucide-react";

type PrmFaqFiltersProps = {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
};

export default function PrmFaqFilters({ currentFilter, onFilterChange }: PrmFaqFiltersProps) {
  const t = useTranslations("home.faq");

  const filters = [
    { key: 'all', label: t('filter_all'), icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { key: 'data_analysis', label: t('filter_data_analysis'), icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { key: 'ahp', label: t('filter_ahp'), icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'features', label: t('filter_features'), icon: <Settings className="w-3.5 h-3.5" /> },
    { key: 'ai', label: t('filter_ai'), icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="prm-faq-filters flex flex-wrap gap-2 justify-center mb-8 max-w-3xl mx-auto">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className="prm-prefix-class flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-sm"
          style={{
            backgroundColor: currentFilter === filter.key ? 'var(--prm-secondary-color)' : 'var(--prm-bg-light)',
            color: currentFilter === filter.key ? 'var(--prm-white)' : 'var(--prm-text-dark)',
            border: currentFilter === filter.key ? 'none' : '1px solid #e2e8f0'
          }}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
