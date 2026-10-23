"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FormEvent, ReactNode } from "react";
import { prmSearchTariffs } from "@/lib/prm-tariff-search/prm-tariff-search-api";
import type { PrmTariffItem } from "@/lib/prm-tariff-search/prm-tariff-search-api";
import "@/styles/tariff-search/prm-tariff-search.css";

interface PrmTariffSearchViewProps {
  token: string;
}

type PrmActiveModalType = "ai" | "chart" | null;

interface PrmModalState {
  type: PrmActiveModalType;
  item: PrmTariffItem | null;
}

export function PrmTariffSearchView({ token }: PrmTariffSearchViewProps): ReactNode {
  const [prmQuery, setPrmQuery] = useState<string>("");
  const [prmResults, setPrmResults] = useState<PrmTariffItem[]>([]);
  const [prmDurationMs, setPrmDurationMs] = useState<number | null>(null);
  const [prmResultCount, setPrmResultCount] = useState<number>(0);
  const [prmIsLoading, setPrmIsLoading] = useState<boolean>(false);
  const [prmHasSearched, setPrmHasSearched] = useState<boolean>(false);
  const [prmCopiedCodeId, setPrmCopiedCodeId] = useState<number | string | null>(null);
  const [prmCopiedDescId, setPrmCopiedDescId] = useState<number | string | null>(null);
  const [prmModalState, setPrmModalState] = useState<PrmModalState>({
    type: null,
    item: null,
  });

  const prmAbortControllerRef = useRef<AbortController | null>(null);
  const prmCopyCodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prmCopyDescTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prmExecuteSearch = useCallback(
    async (queryText: string): Promise<void> => {
      if (prmAbortControllerRef.current) {
        prmAbortControllerRef.current.abort();
      }

      const controller = new AbortController();
      prmAbortControllerRef.current = controller;

      setPrmIsLoading(true);
      setPrmHasSearched(true);

      try {
        const response = await prmSearchTariffs(
          token,
          {
            q: queryText,
            limit: 50,
          },
          controller.signal,
        );

        setPrmResults(response.items);
        setPrmDurationMs(response.meta.duration_ms);
        setPrmResultCount(response.meta.result_count);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setPrmResults([]);
        setPrmResultCount(0);
        setPrmDurationMs(0);
      } finally {
        if (prmAbortControllerRef.current === controller) {
          setPrmIsLoading(false);
        }
      }
    },
    [token],
  );

  const prmWriteClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      throw new Error();
    } catch {
      try {
        const prmTextarea = document.createElement("textarea");
        prmTextarea.value = text;
        prmTextarea.style.position = "fixed";
        prmTextarea.style.opacity = "0";
        document.body.appendChild(prmTextarea);
        prmTextarea.select();
        const prmSuccess = document.execCommand("copy");
        prmTextarea.remove();
        return prmSuccess;
      } catch {
        return false;
      }
    }
  };

  const prmHandleCopyCode = useCallback(async (item: PrmTariffItem): Promise<void> => {
    const success = await prmWriteClipboard(item.code_formatted);
    if (!success) return;

    setPrmCopiedCodeId(item.id);
    if (prmCopyCodeTimeoutRef.current) {
      clearTimeout(prmCopyCodeTimeoutRef.current);
    }
    prmCopyCodeTimeoutRef.current = setTimeout(() => {
      setPrmCopiedCodeId(null);
      prmCopyCodeTimeoutRef.current = null;
    }, 1800);
  }, []);

  const prmHandleCopyDesc = useCallback(async (item: PrmTariffItem): Promise<void> => {
    const success = await prmWriteClipboard(item.description);
    if (!success) return;

    setPrmCopiedDescId(item.id);
    if (prmCopyDescTimeoutRef.current) {
      clearTimeout(prmCopyDescTimeoutRef.current);
    }
    prmCopyDescTimeoutRef.current = setTimeout(() => {
      setPrmCopiedDescId(null);
      prmCopyDescTimeoutRef.current = null;
    }, 1800);
  }, []);

  const prmOpenModal = (type: PrmActiveModalType, item: PrmTariffItem): void => {
    setPrmModalState({ type, item });
  };

  const prmCloseModal = (): void => {
    setPrmModalState({ type: null, item: null });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      prmExecuteSearch(prmQuery.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [prmQuery, prmExecuteSearch]);

  useEffect(() => {
    return () => {
      if (prmAbortControllerRef.current) {
        prmAbortControllerRef.current.abort();
      }
      if (prmCopyCodeTimeoutRef.current) {
        clearTimeout(prmCopyCodeTimeoutRef.current);
      }
      if (prmCopyDescTimeoutRef.current) {
        clearTimeout(prmCopyDescTimeoutRef.current);
      }
    };
  }, []);

  const prmHandleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    prmExecuteSearch(prmQuery.trim());
  };

  return (
    <div className="prm-tariff-view">
      <div className="prm-tariff-glass-card prm-tariff-search-panel">
        <div className="prm-tariff-header-content">
          <div className="prm-tariff-header-title">
            <span className="prm-tariff-title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 21l-4.35-4.35" />
                <circle cx="11" cy="11" r="7" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </span>
            <span>سامانه کاوشگر تعرفه و قوانین گمرکی</span>
          </div>
          <span className="prm-tariff-header-subtitle">
            کاوش هوشمند و چندلایه‌ای در پایگاه کدهای HS، طبقه‌بندی کتاب تعرفه، شرح ارزش و مقررات صادرات و واردات
          </span>
        </div>

        <form onSubmit={prmHandleSubmit} className="prm-tariff-search-form">
          <div className="prm-tariff-input-wrapper">
            <svg
              className="prm-tariff-input-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="prm-tariff-search-input"
              placeholder="جستجو با کد ۸ یا ۱۰ رقمی گمرکی، شرح کالا یا کلیدواژه تجاری..."
              value={prmQuery}
              onChange={(e) => setPrmQuery(e.target.value)}
            />
            {prmQuery && (
              <button
                type="button"
                className="prm-tariff-clear-btn"
                onClick={() => setPrmQuery("")}
                aria-label="پاک‌سازی ورودی"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="prm-tariff-search-btn"
            disabled={prmIsLoading}
          >
            {prmIsLoading ? (
              <>
                <span className="prm-tariff-spinner" />
                <span>بررسی پایگاه</span>
              </>
            ) : (
              <>
                <span>کاوش تعرفه</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      {prmHasSearched && (
        <div className="prm-tariff-meta-bar">
          <div className="prm-tariff-meta-badges">
            <span className="prm-tariff-badge-accent">
              <span className="prm-tariff-badge-dot" />
              {prmResultCount.toLocaleString("fa-IR")} تعرفه منطبق
            </span>
            {prmDurationMs !== null && (
              <span className="prm-tariff-badge-speed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                زمان پردازش: {prmDurationMs.toLocaleString("fa-IR")} ms
              </span>
            )}
          </div>
          <span className="prm-tariff-database-label">
            <span className="prm-tariff-database-indicator" />
            مرجع جامع کدهای گمرکی بین‌المللی
          </span>
        </div>
      )}

      <div className="prm-tariff-results-grid">
        {prmResults.map((item) => {
          const prmIsCodeCopied = prmCopiedCodeId === item.id;
          const prmIsDescCopied = prmCopiedDescId === item.id;

          return (
            <div key={item.id} className="prm-tariff-item-card">
              <div className="prm-tariff-item-header">
                <div className="prm-tariff-item-code-cluster">
                  <span className="prm-tariff-code-box">{item.code_formatted}</span>
                  <span className="prm-tariff-code-raw">کد پایه: {item.code_raw}</span>
                  <button
                    type="button"
                    className={`prm-tariff-action-btn prm-tariff-code-copy-btn${
                      prmIsCodeCopied ? " prm-is-active-success" : ""
                    }`}
                    onClick={() => void prmHandleCopyCode(item)}
                    title={prmIsCodeCopied ? "کپی شد" : "کپی کد گمرکی"}
                  >
                    {prmIsCodeCopied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>کد کپی شد</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>کپی کد</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="prm-tariff-item-actions">
                  <div className="prm-tariff-category-tags">
                    {item.section && <span className="prm-tariff-tag">{item.section}</span>}
                    {item.chapter && <span className="prm-tariff-tag">{item.chapter}</span>}
                  </div>

                  <div className="prm-tariff-intelligence-cluster">
                    <button
                      type="button"
                      className="prm-tariff-action-btn prm-tariff-ai-btn"
                      onClick={() => prmOpenModal("ai", item)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span>تحلیل هوشمند AI</span>
                    </button>

                    <button
                      type="button"
                      className="prm-tariff-action-btn prm-tariff-chart-btn"
                      onClick={() => prmOpenModal("chart", item)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      <span>تحلیل نموداری</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="prm-tariff-desc-container">
                <p className="prm-tariff-item-description">{item.description}</p>
                <div className="prm-tariff-desc-footer">
                  <button
                    type="button"
                    className={`prm-tariff-action-btn prm-tariff-desc-copy-btn${
                      prmIsDescCopied ? " prm-is-active-success" : ""
                    }`}
                    onClick={() => void prmHandleCopyDesc(item)}
                  >
                    {prmIsDescCopied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>شرح کالا کپی شد</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        </svg>
                        <span>کپی شرح کامل کالا</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!prmIsLoading && prmHasSearched && prmResults.length === 0 && (
          <div className="prm-tariff-glass-card prm-tariff-empty-state">
            <span className="prm-tariff-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
            <p>هیچ رکوردی منطبق با عبارت مورد نظر یافت نشد.</p>
            <span className="prm-tariff-empty-hint">
              شماره استاندارد یا شرح کالا را به شکلی متفاوت جستجو نمایید.
            </span>
          </div>
        )}
      </div>

      {prmModalState.type && (
        <div className="prm-tariff-modal-backdrop" onClick={prmCloseModal}>
          <div
            className="prm-tariff-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prm-tariff-modal-header">
              <div className="prm-tariff-modal-header-info">
                <span className="prm-tariff-modal-icon">
                  {prmModalState.type === "ai" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  )}
                </span>
                <div>
                  <h3 className="prm-tariff-modal-title">
                    {prmModalState.type === "ai"
                      ? "موتور کاوشگر و تحلیلگر هوش مصنوعی آتریانا"
                      : "تحلیلگر تصویری و داده‌محور نموداری"}
                  </h3>
                  <span className="prm-tariff-modal-subtitle">
                    کد تعرفه انتخاب‌شده: {prmModalState.item?.code_formatted}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="prm-tariff-modal-close-btn"
                onClick={prmCloseModal}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="prm-tariff-modal-body">
              <div className="prm-tariff-modal-badge-wrapper">
                <span className="prm-tariff-coming-soon-badge">به زودی فعال می‌شود</span>
              </div>

              {prmModalState.type === "ai" ? (
                <div className="prm-tariff-modal-explanation">
                  <p>
                    با استفاده از این سرویس هوشمند، شما می‌توانید به صورت مستقیم کلیه تحلیل‌های
                    تخصصی گمرکی، ارزیابی بخشنامه‌های ترخیص، تعیین حقوق و عوارض ورود، مجوزهای
                    استاندارد و پیش‌بینی ریسک‌های بازرگانی را مستقیماً از دستیار هوش مصنوعی تجاری
                    آتریانا دریافت کنید.
                  </p>
                  <div className="prm-tariff-modal-card-preview">
                    <span>امکانات در حال توسعه:</span>
                    <ul>
                      <li>شناسایی خودکار مجوزهای وارداتی و صادراتی مورد نیاز کالا</li>
                      <li>تطبیق قوانین تعرفه‌ای کشورهای هدف با کدهای منطقه‌ای</li>
                      <li>ارائه راهکارهای بهینه‌سازی تعرفه و پیشگیری از جرایم گمرکی</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="prm-tariff-modal-explanation">
                  <p>
                    با این امکان نوین، تحلیل‌های جامع تصویری و نمودارهای تعاملی مقایسه‌ای شامل
                    روند تغییرات حقوق ورودی، حجم تبادلات تجاری کشور بر اساس این کد تعرفه و سهم
                    بازار مبادی ورودی و خروجی در قالب نمودارهای تحلیلی و لحظه‌ای در دسترس شما
                    خواهد بود.
                  </p>
                  <div className="prm-tariff-modal-card-preview">
                    <span>امکانات در حال توسعه:</span>
                    <ul>
                      <li>نمودار پایش ۱۰ ساله تغییرات طبقات تعرفه‌ای و جداول قانونی</li>
                      <li>نمودار ماتریسی مقایسه مبادی اصلی واردات بر اساس حجم ارزش دلاری</li>
                      <li>شاخص‌های نوسان قوانین و پیش‌بینی روندهای آتی ترخیص</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="prm-tariff-modal-footer">
              <button
                type="button"
                className="prm-tariff-modal-dismiss-btn"
                onClick={prmCloseModal}
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
