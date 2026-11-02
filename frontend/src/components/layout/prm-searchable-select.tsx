"use client";

import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import prmStyles from "./prm-searchable-select.module.css";

export interface PrmSearchableSelectOption {
    value: string;
    label: string;
}

interface PrmSearchableSelectProps {
    id: string;
    label: string;
    value: string;
    options: readonly PrmSearchableSelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

interface PrmPopoverPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

function prmNormalizeSearch(value: string): string {
    return value
        .toLocaleLowerCase()
        .replace(/[يى]/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function PrmChevronIcon(): ReactNode {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function PrmSearchIcon(): ReactNode {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

function PrmCheckIcon(): ReactNode {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}

export function PrmSearchableSelect({
    id,
    label,
    value,
    options,
    onChange,
    placeholder = "انتخاب کنید",
    disabled = false,
}: PrmSearchableSelectProps): ReactNode {
    const prmGeneratedId = useId();
    const prmListId = `${prmGeneratedId}-list`;
    const prmTriggerRef = useRef<HTMLButtonElement>(null);
    const prmPopoverRef = useRef<HTMLDivElement>(null);
    const prmSearchRef = useRef<HTMLInputElement>(null);
    const [prmIsOpen, setPrmIsOpen] = useState(false);
    const [prmQuery, setPrmQuery] = useState("");
    const [prmActiveIndex, setPrmActiveIndex] = useState(0);
    const [prmPosition, setPrmPosition] = useState<PrmPopoverPosition | null>(
        null,
    );

    const prmSelectedOption = options.find((option) => option.value === value);
    const prmFilteredOptions = useMemo(() => {
        const normalizedQuery = prmNormalizeSearch(prmQuery);

        if (!normalizedQuery) {
            return options;
        }

        return options.filter((option) =>
            prmNormalizeSearch(option.label).includes(normalizedQuery),
        );
    }, [options, prmQuery]);

    const prmClose = useCallback(() => {
        setPrmIsOpen(false);
        setPrmQuery("");
        setPrmPosition(null);
    }, []);

    const prmOpen = () => {
        if (disabled) {
            return;
        }

        setPrmQuery("");
        setPrmActiveIndex(
            Math.max(
                0,
                options.findIndex((option) => option.value === value),
            ),
        );
        setPrmIsOpen(true);
    };

    const prmSelect = (selectedValue: string) => {
        onChange(selectedValue);
        prmClose();
        prmTriggerRef.current?.focus();
    };

    const prmMoveFocusFromTrigger = (backward: boolean) => {
        const focusableElements = Array.from(
            document.querySelectorAll<HTMLElement>(
                "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
            ),
        ).filter((element) => element.getClientRects().length > 0);

        const triggerIndex = focusableElements.indexOf(prmTriggerRef.current!);
        const nextElement =
            focusableElements[triggerIndex + (backward ? -1 : 1)];

        prmClose();
        nextElement?.focus();
    };

    useLayoutEffect(() => {
        if (!prmIsOpen) {
            return;
        }

        const updatePosition = () => {
            const trigger = prmTriggerRef.current;

            if (!trigger) {
                return;
            }

            const rect = trigger.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const openAbove = spaceBelow < 280 && spaceAbove > spaceBelow;
            const availableSpace = openAbove ? spaceAbove : spaceBelow;
            const desiredHeight = Math.min(
                324,
                Math.max(96, 76 + prmFilteredOptions.length * 44),
            );
            const height = Math.min(
                desiredHeight,
                Math.max(72, availableSpace - 16),
            );
            const width = Math.min(
                rect.width,
                Math.max(0, window.innerWidth - 24),
            );
            const left = Math.min(
                Math.max(12, rect.left),
                Math.max(12, window.innerWidth - width - 12),
            );

            setPrmPosition({
                top: openAbove
                    ? Math.max(8, rect.top - height - 8)
                    : Math.min(rect.bottom + 8, window.innerHeight - height - 8),
                left,
                width,
                height,
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [prmIsOpen, prmFilteredOptions.length]);

    useEffect(() => {
        if (!prmIsOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (
                !prmTriggerRef.current?.contains(target) &&
                !prmPopoverRef.current?.contains(target)
            ) {
                prmClose();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [prmIsOpen, prmClose]);

    const prmIsPopoverReady = prmPosition !== null;

    useEffect(() => {
        if (prmIsOpen && prmIsPopoverReady) {
            prmSearchRef.current?.focus();
        }
    }, [prmIsOpen, prmIsPopoverReady]);

    const prmHandleTriggerKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
    ) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            prmOpen();
        }
    };

    const prmHandleSearchKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setPrmActiveIndex((index) =>
                Math.min(index + 1, prmFilteredOptions.length - 1),
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setPrmActiveIndex((index) => Math.max(index - 1, 0));
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            setPrmActiveIndex(0);
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            setPrmActiveIndex(Math.max(prmFilteredOptions.length - 1, 0));
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();

            const option = prmFilteredOptions[prmActiveIndex];

            if (option) {
                prmSelect(option.value);
            }

            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            prmClose();
            prmTriggerRef.current?.focus();
            return;
        }

        if (event.key === "Tab") {
            event.preventDefault();
            prmMoveFocusFromTrigger(event.shiftKey);
        }
    };

    const prmPopoverStyle: CSSProperties | undefined = prmPosition
        ? {
              top: prmPosition.top,
              left: prmPosition.left,
              width: prmPosition.width,
              height: prmPosition.height,
          }
        : undefined;

    return (
        <>
            <button
                id={id}
                ref={prmTriggerRef}
                type="button"
                className={`${prmStyles.prmControl}${prmIsOpen ? ` ${prmStyles.prmControlOpen}` : ""}`}
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={prmIsOpen}
                aria-controls={prmIsOpen ? prmListId : undefined}
                onClick={() => (prmIsOpen ? prmClose() : prmOpen())}
                onKeyDown={prmHandleTriggerKeyDown}
                disabled={disabled}
            >
                <span
                    className={
                        prmSelectedOption
                            ? prmStyles.prmValue
                            : prmStyles.prmPlaceholder
                    }
                >
                    {prmSelectedOption?.label ?? placeholder}
                </span>
                <span className={prmStyles.prmChevron}>
                    <PrmChevronIcon />
                </span>
            </button>

            {prmIsOpen &&
                prmPosition &&
                createPortal(
                    <div
                        ref={prmPopoverRef}
                        className={prmStyles.prmPopover}
                        style={prmPopoverStyle}
                        dir="rtl"
                    >
                        <div className={prmStyles.prmSearchBox}>
                            <PrmSearchIcon />
                            <input
                                ref={prmSearchRef}
                                type="search"
                                role="combobox"
                                className={prmStyles.prmSearchInput}
                                placeholder="جستجو در گزینه‌ها..."
                                value={prmQuery}
                                aria-label={`جستجو در ${label}`}
                                aria-autocomplete="list"
                                aria-expanded={true}
                                aria-controls={prmListId}
                                aria-activedescendant={
                                    prmFilteredOptions[prmActiveIndex]
                                        ? `${prmListId}-option-${prmActiveIndex}`
                                        : undefined
                                }
                                onChange={(event) => {
                                    setPrmQuery(event.target.value);
                                    setPrmActiveIndex(0);
                                }}
                                onKeyDown={prmHandleSearchKeyDown}
                            />
                        </div>

                        <div
                            id={prmListId}
                            className={prmStyles.prmList}
                            role="listbox"
                            aria-label={label}
                        >
                            {prmFilteredOptions.length === 0 ? (
                                <div className={prmStyles.prmEmpty}>
                                    گزینه‌ای پیدا نشد
                                </div>
                            ) : (
                                prmFilteredOptions.map((option, index) => {
                                    const selected = option.value === value;
                                    const active = index === prmActiveIndex;

                                    return (
                                        <button
                                            key={option.value}
                                            id={`${prmListId}-option-${index}`}
                                            type="button"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected={selected}
                                            className={`${prmStyles.prmOption}${active ? ` ${prmStyles.prmOptionActive}` : ""}${selected ? ` ${prmStyles.prmOptionSelected}` : ""}`}
                                            onMouseEnter={() =>
                                                setPrmActiveIndex(index)
                                            }
                                            onClick={() =>
                                                prmSelect(option.value)
                                            }
                                        >
                                            <span>{option.label}</span>
                                            {selected && <PrmCheckIcon />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
