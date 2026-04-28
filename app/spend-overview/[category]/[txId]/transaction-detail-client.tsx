"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  HDFC,
  MONTHS,
  type CategorySlug,
  type MonthKey,
  type TxRow,
  formatInr,
} from "@/lib/icici-spend";
import {
  IPHONE_APP_OVERLAY_ROOT_ID,
  IPHONE_APP_SCROLL_ROOT_ID,
} from "@/app/components/iphone-app-shell-ids";

const CATEGORY_LS_KEY = "spend-overview-tx-category-overrides";

type StoredCategoryChoice =
  | { kind: "standard"; slug: CategorySlug }
  | { kind: "custom"; label: string };

function transactionStorageKey(monthKey: MonthKey, tx: TxRow): string {
  return `${monthKey}|${tx.merchant}|${tx.date}|${tx.amount}|${tx.channel ?? ""}`;
}

function readCategoryOverrides(): Record<string, StoredCategoryChoice> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CATEGORY_LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredCategoryChoice>) : {};
  } catch {
    return {};
  }
}

function writeCategoryOverride(
  storageKey: string,
  choice: StoredCategoryChoice | null,
): void {
  if (typeof window === "undefined") return;
  const map = readCategoryOverrides();
  if (choice === null) delete map[storageKey];
  else map[storageKey] = choice;
  localStorage.setItem(CATEGORY_LS_KEY, JSON.stringify(map));
}

function effectiveCategoryDisplay(
  baseSlug: CategorySlug,
  choice: StoredCategoryChoice | null,
): { label: string; color: string } {
  if (!choice) {
    const m = CATEGORY_META[baseSlug];
    return { label: m.label, color: m.color };
  }
  if (choice.kind === "standard") {
    const m = CATEGORY_META[choice.slug];
    return { label: m.label, color: m.color };
  }
  return { label: choice.label.trim(), color: HDFC.misc };
}

type DraftSlug = CategorySlug | "__custom__";

export function TransactionDetailClient({
  slug,
  monthKey,
  transaction,
  txIndex,
  periodQuery,
}: {
  slug: CategorySlug;
  monthKey: MonthKey;
  transaction: TxRow;
  txIndex: number;
  periodQuery: string;
}) {
  const storageKey = useMemo(
    () => transactionStorageKey(monthKey, transaction),
    [monthKey, transaction],
  );

  const [override, setOverride] = useState<StoredCategoryChoice | null>(() => {
    if (typeof window === "undefined") return null;
    const key = transactionStorageKey(monthKey, transaction);
    return readCategoryOverrides()[key] ?? null;
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState(0);

  const display = useMemo(
    () => effectiveCategoryDisplay(slug, override),
    [slug, override],
  );

  const monthLabel = MONTHS.find((x) => x.key === monthKey)?.label ?? monthKey;

  const refNumber = `HDFC${monthKey.toUpperCase()}${txIndex.toString().padStart(4, "0")}${transaction.amount}`;
  const txTime = "14:32:18";

  const handleSaved = useCallback(
    (next: StoredCategoryChoice | null) => {
      writeCategoryOverride(storageKey, next);
      setOverride(next);
      setSheetOpen(false);
    },
    [storageKey],
  );

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white shadow-md"
        style={{
          background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
        }}
      >
        <Link
          href={`/spend-overview/${slug}?${periodQuery}`}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Back to Transactions"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Transaction Details
          </p>
          <h1 className="truncate text-base font-semibold">{transaction.merchant}</h1>
        </div>
      </header>

      <div className="bg-white px-4 py-6 text-center shadow-sm">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ backgroundColor: display.color }}
        >
          {transaction.initials}
        </div>
        <p className="text-3xl font-bold tabular-nums text-zinc-900">
          {formatInr(transaction.amount)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Debited from Account</p>
        <div
          className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${display.color}15`, color: display.color }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: display.color }} />
          {display.label}
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 pt-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <DetailRow label="Merchant" value={transaction.merchant} />
          <DetailRow label="Date" value={transaction.date} />
          <DetailRow label="Time" value={txTime} />
          <DetailRow label="Payment Mode" value={transaction.channel ?? "Unknown"} />
          <CategoryRowWithEdit
            displayLabel={display.label}
            onEdit={() => {
              setSheetSession((s) => s + 1);
              setSheetOpen(true);
            }}
          />
          <DetailRow label="Reference No." value={refNumber} isLast />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Account Details
            </p>
          </div>
          <DetailRow label="Account Type" value="Savings Account" />
          <DetailRow label="Transaction Type" value="Debit" />
          <DetailRow label="Status" value="Completed" valueColor="#16a34a" isLast />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Receipt
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Share Details
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
            style={{ backgroundColor: HDFC.navyBlue }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 16v-4M12 8h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Report an Issue
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Transaction from {monthLabel}
        </p>
      </div>

      {sheetOpen ? (
        <CategoryEditSheet
          key={sheetSession}
          baseSlug={slug}
          currentOverride={override}
          onClose={() => setSheetOpen(false)}
          onSave={handleSaved}
        />
      ) : null}
    </div>
  );
}

function CategoryRowWithEdit({
  displayLabel,
  onEdit,
}: {
  displayLabel: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3.5">
      <span className="shrink-0 text-sm text-zinc-500">Category</span>
      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate text-right text-sm font-medium text-zinc-900">{displayLabel}</span>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Edit category"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CategoryEditSheet({
  baseSlug,
  currentOverride,
  onClose,
  onSave,
}: {
  baseSlug: CategorySlug;
  currentOverride: StoredCategoryChoice | null;
  onClose: () => void;
  onSave: (next: StoredCategoryChoice | null) => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const scrollEl = document.getElementById(IPHONE_APP_SCROLL_ROOT_ID);
    if (!scrollEl) return;
    scrollEl.style.overflow = "hidden";
    return () => {
      scrollEl.style.overflow = "";
    };
  }, []);

  const [draftSlug, setDraftSlug] = useState<DraftSlug>(() => {
    if (!currentOverride) return baseSlug;
    if (currentOverride.kind === "custom") return "__custom__";
    return currentOverride.slug;
  });
  const [customLabel, setCustomLabel] = useState(() =>
    currentOverride?.kind === "custom" ? currentOverride.label : "",
  );

  const canSave =
    draftSlug !== "__custom__" || customLabel.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (draftSlug === "__custom__") {
      onSave({ kind: "custom", label: customLabel.trim() });
      return;
    }
    if (draftSlug === baseSlug) {
      onSave(null);
      return;
    }
    onSave({ kind: "standard", slug: draftSlug });
  };

  const overlayRoot =
    typeof document !== "undefined"
      ? document.getElementById(IPHONE_APP_OVERLAY_ROOT_ID)
      : null;

  const layer = (
    <div className="absolute inset-0 z-0 flex min-h-0 flex-col justify-end bg-black/45">
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default"
        aria-label="Close category editor"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex min-h-0 w-full max-h-[88%] flex-col overflow-hidden rounded-t-[20px] bg-[#F5F6F8] shadow-2xl"
      >
        <header
          className="flex shrink-0 items-center gap-3 rounded-t-[20px] px-4 pb-3 pt-[14px] text-white"
          style={{
            background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
          }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_10px_rgba(0,30,70,0.25)] ring-2 ring-white/30">
            <svg
              width={26}
              height={26}
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              aria-hidden
            >
              <path
                d="M7 7h.01M7 3h5a2 2 0 01.9.22l.1.06 7 7a2 2 0 010 2.83l-5.64 5.64a2 2 0 01-2.83 0L2.64 12.7A1.99 1.99 0 012 11.3V7a4 4 0 014-4z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p id={titleId} className="text-[15px] font-semibold leading-tight">
              Edit category
            </p>
            <p className="truncate text-[11px] text-white/75">
              Smart categories or your own label — saved on this device
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 pb-3 pt-3">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-1 [-webkit-overflow-scrolling:touch]">
            <div>
              <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Smart categories
              </p>
              <ul className="space-y-1 rounded-xl border border-zinc-200/90 bg-white p-1 shadow-sm">
                {CATEGORY_ORDER.map((s) => {
                  const meta = CATEGORY_META[s];
                  const checked = draftSlug === s;
                  return (
                    <li key={s}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 active:bg-zinc-50">
                        <input
                          type="radio"
                          name="cat-slug"
                          className="h-4 w-4 shrink-0 accent-[#004C8F]"
                          checked={checked}
                          onChange={() => {
                            setDraftSlug(s);
                            setCustomLabel("");
                          }}
                        />
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.label.slice(0, 1)}
                        </span>
                        <span className="min-w-0 flex-1 text-[14px] font-medium text-zinc-900">
                          {meta.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Custom category
              </p>
              <div className="rounded-xl border border-zinc-200/90 bg-white p-3 shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="cat-slug"
                    className="mt-1 h-4 w-4 shrink-0 accent-[#004C8F]"
                    checked={draftSlug === "__custom__"}
                    onChange={() => setDraftSlug("__custom__")}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-zinc-900">Use my own label</span>
                    <p className="mt-0.5 text-[12px] text-zinc-500">
                      Name a category that fits this spend.
                    </p>
                    <input
                      type="text"
                      value={customLabel}
                      onChange={(e) => {
                        setCustomLabel(e.target.value);
                        setDraftSlug("__custom__");
                      }}
                      placeholder="e.g. Kids · Tuition · Pet care"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#004C8F] focus:ring-1 focus:ring-[#004C8F]"
                      maxLength={48}
                      autoComplete="off"
                    />
                  </div>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSave(null)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 text-[13px] font-semibold text-zinc-700 shadow-sm active:bg-zinc-50"
            >
              Restore original category ({CATEGORY_META[baseSlug].label})
            </button>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-3 text-[13px] font-semibold text-zinc-700 shadow-sm active:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="flex-1 rounded-xl py-3 text-[13px] font-semibold text-white shadow-sm disabled:opacity-40"
              style={{ backgroundColor: HDFC.navyBlue }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!overlayRoot) return null;

  return createPortal(layer, overlayRoot);
}

function DetailRow({
  label,
  value,
  valueColor,
  isLast = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3.5 ${
        !isLast ? "border-b border-zinc-100" : ""
      }`}
    >
      <span className="text-sm text-zinc-500">{label}</span>
      <span
        className="text-right text-sm font-medium"
        style={{ color: valueColor ?? "#18181b" }}
      >
        {value}
      </span>
    </div>
  );
}
