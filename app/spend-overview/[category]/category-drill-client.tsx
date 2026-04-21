"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  ICICI,
  MONTHS,
  TRANSACTIONS_BY_MONTH,
  type CategorySlug,
  type MonthKey,
  formatInr,
  spendCardClass,
} from "@/lib/icici-spend";

const FILTERS = ["Last 7 Days", "This Month", "Custom Range"] as const;

export function CategoryDrillClient({
  slug,
  monthKey,
}: {
  slug: CategorySlug;
  monthKey: MonthKey;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("This Month");
  const cat = CATEGORY_META[slug];
  const rows = TRANSACTIONS_BY_MONTH[monthKey][slug];

  const monthLabel = useMemo(
    () => MONTHS.find((x) => x.key === monthKey)?.label ?? monthKey,
    [monthKey],
  );

  const subtitle = useMemo(() => {
    if (filter === "Last 7 Days") return `Last 7 days · ${monthLabel}`;
    if (filter === "This Month") return monthLabel;
    return "Pick a custom range";
  }, [filter, monthLabel]);

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white shadow-md"
        style={{
          background: `linear-gradient(135deg, ${ICICI.headerFrom} 0%, ${ICICI.headerTo} 100%)`,
        }}
      >
        <Link
          href={`/spend-overview?m=${monthKey}`}
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
        <p className="mt-1 text-sm font-medium text-zinc-800">{monthLabel}</p>
      </div>

      <div className="px-4 pb-10 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === f
                  ? "border-transparent text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
              style={filter === f ? { backgroundColor: ICICI.orange } : undefined}
            >
              {f}
            </button>
          ))}
        </div>
        <p className="mb-3 text-xs text-zinc-500">{subtitle}</p>

        <ul className={`overflow-hidden ${spendCardClass}`}>
          {rows.map((tx, i) => (
            <li
              key={`${tx.merchant}-${tx.date}-${i}`}
              className="border-b border-zinc-100 last:border-0"
            >
              <Link
                href={`/spend-overview/${slug}/${i}?m=${monthKey}`}
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

        {slug === "miscellaneous" && (
          <p className="mt-4 rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-600">
            These debits could not be matched to a merchant category (e.g. unknown POS, fees, or
            one-off UPI beneficiaries). You can recategorise them in a full banking app.
          </p>
        )}

        {filter === "Custom Range" && (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-center text-sm text-zinc-500">
            In a full app, a date picker would open here.
          </p>
        )}
      </div>
    </div>
  );
}
