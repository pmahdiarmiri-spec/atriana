"use client";

import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

export interface PrmTooltipLine {
    label: string;
    value: string;
}

interface PrmTooltipData {
    title: string;
    lines: PrmTooltipLine[];
    x: number;
    y: number;
}

export function usePrmChartTooltip() {
    const [tooltip, setTooltip] = useState<PrmTooltipData | null>(null);

    const show = (
        event: React.MouseEvent<Element>,
        title: string,
        lines: PrmTooltipLine[]
    ) => {
        setTooltip({
            title,
            lines,
            x: Math.max(8, Math.min(event.clientX + 14, window.innerWidth - 328)),
            y: Math.max(8, Math.min(event.clientY + 14, window.innerHeight - 170)),
        });
    };

    const focus = (
        event: React.FocusEvent<Element>,
        title: string,
        lines: PrmTooltipLine[]
    ) => {
        const bounds = event.currentTarget.getBoundingClientRect();

        setTooltip({
            title,
            lines,
            x: Math.max(8, Math.min(bounds.left, window.innerWidth - 328)),
            y: Math.max(8, Math.min(bounds.top - 12, window.innerHeight - 170)),
        });
    };

    const hide = () => setTooltip(null);

    const element: ReactNode = tooltip && typeof document !== "undefined"
        ? createPortal(
            <div
                className="prm-tf-floating-tooltip"
                style={{ left: tooltip.x, top: tooltip.y }}
                role="tooltip"
                dir="rtl"
            >
                <strong className="prm-tf-floating-title">{tooltip.title}</strong>
                {tooltip.lines.map((line, index) => (
                    <div className="prm-tf-floating-line" key={`${line.label}-${index}`}>
                        <span>{line.label}</span>
                        <b dir="ltr">{line.value}</b>
                    </div>
                ))}
            </div>,
            document.body
        )
        : null;

    return { show, focus, hide, element };
}
