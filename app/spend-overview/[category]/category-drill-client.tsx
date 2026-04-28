"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CATEGORY_META,
  HDFC,
  type CategorySlug,
  type CustomDateRange,
  type MonthKey,
  type TimeFilter,
  formatInr,
  getFilteredCategoryTransactions,
  getFilteredSpendData,
  spendCardClass,
} from "@/lib/icici-spend";

export function CategoryDrillClient({
  slug,
  monthKey,
  timeFilter,
  customRange,
  periodQuery,
}: {
  slug: CategorySlug;
  monthKey: MonthKey;
  timeFilter: TimeFilter;
  customRange: CustomDateRange | null;
  periodQuery: string;
}) {
  const cat = CATEGORY_META[slug];

  const rows = useMemo(
    () => getFilteredCategoryTransactions(slug, timeFilter, monthKey, customRange),
    [slug, timeFilter, monthKey, customRange],
  );

  const periodLabel = useMemo(
    () => getFilteredSpendData(timeFilter, monthKey, customRange).label,
    [timeFilter, monthKey, customRange],
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
          href={`/spend-overview?${periodQuery}`}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Back to Spend Overview"
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
            {cat.label}
          </p>
          <h1 className="truncate text-base font-semibold">Transactions</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/75">{cat.drillHint}</p>
        </div>
      </header>

      <div className="border-b border-zinc-200/90 bg-zinc-100 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Period
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">{periodLabel}</p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-500">
          Matches the period selected on Spend Overview.
        </p>
      </div>

      <div className="px-4 pb-10 pt-4">
        <ul className={`overflow-hidden ${spendCardClass}`}>
          {rows.map((tx, i) => (
            <li
              key={`${tx.merchant}-${tx.date}-${i}`}
              className="border-b border-zinc-100 last:border-0"
            >
              <Link
                href={`/spend-overview/${slug}/${i}?${periodQuery}`}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-zinc-50"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {tx.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">{tx.merchant}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {tx.date}
                    {tx.channel ? (
                      <>
                        {" "}
                        · <span className="font-medium text-zinc-600">{tx.channel}</span>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-sm font-bold tabular-nums text-zinc-900">
                    {formatInr(tx.amount)}
                  </span>
                  <span className="text-zinc-300" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className="mt-4 rounded-xl border border-zinc-200/90 bg-white px-4 py-6 text-center text-sm text-zinc-500">
            No transactions in this category for the selected period.
          </p>
        )}

        {slug === "miscellaneous" && rows.length > 0 && (
          <p className="mt-4 rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-600">
            These debits could not be matched to a merchant category (e.g. unknown POS, fees, or
            one-off UPI beneficiaries). You can recategorise them in a full banking app.
          </p>
        )}
      </div>
    </div>
  );
}
