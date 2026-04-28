"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  HDFC,
  TIME_FILTERS,
  type CategoryIconKind,
  type CategorySlug,
  type MonthKey,
  type TimeFilter,
  getFilteredSpendData,
  getNewExpenseCategories,
  formatInr,
  spendCardClass,
  spendCardShadow,
  computeMomChange,
  formatMomPct,
} from "@/lib/icici-spend";

function CategoryIcon({ kind }: { kind: CategoryIconKind }) {
  const stroke = "currentColor";
  const className = "h-5 w-5";
  switch (kind) {
    case "bag":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 8h12l-1 12H7L6 8z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M9 8V6a3 3 0 016 0v2"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "fork":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 3v7M12 3v7M15 3v7M9 10v11M12 10v11M15 10v11"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bulb":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3a6 6 0 00-3 11.2V18h6v-3.8A6 6 0 0012 3z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M9 20h6" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "plane":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 12l18-6-6 6 6 6-18-6z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "misc":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.75" />
          <path
            d="M9.5 9.5a2 2 0 013.3-.9c.6.5 1 1.2 1 2.1 0 1.5-1.5 2-2.5 2.3h0"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="0.75" fill={stroke} />
        </svg>
      );
  }
}

function TrendBadge({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null || previous === 0) return null;
  
  const change = computeMomChange(current, previous);
  if (!change.hasPrevious || change.direction === "flat") return null;
  
  const isUp = change.direction === "up";
  
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold tabular-nums ${
        isUp ? "text-amber-700" : "text-emerald-700"
      }`}
    >
      <span aria-hidden>{isUp ? "↑" : "↓"}</span>
      {formatMomPct(change.pct)}%
    </span>
  );
}

function CategoryRow({
  slug,
  amount,
  previousAmount,
  monthKey,
  fromSource,
  isNew,
}: {
  slug: CategorySlug;
  amount: number;
  previousAmount: number | null;
  monthKey: MonthKey;
  fromSource: string;
  isNew?: boolean;
}) {
  const c = CATEGORY_META[slug];
  
  return (
    <Link
      href={`/spend-overview/${slug}?m=${monthKey}&from=${fromSource}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-zinc-50"
      aria-label={`${c.label}, ${formatInr(amount)}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          color: c.color,
          backgroundColor: `${c.color}14`,
        }}
      >
        <CategoryIcon kind={c.icon} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-900">{c.label}</span>
          {isNew && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
              New
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            {formatInr(amount)}
          </span>
          {previousAmount !== null && (
            <TrendBadge current={amount} previous={previousAmount} />
          )}
        </div>
        <span className="text-zinc-300" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
  );
}

export function SpendOverviewClient({
  initialMonthKey,
  backHref,
  fromSource,
}: {
  initialMonthKey: MonthKey;
  backHref: string;
  fromSource: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [monthKey] = useState<MonthKey>(initialMonthKey);
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("this-month");

  const spendData = useMemo(
    () => getFilteredSpendData(activeFilter, monthKey),
    [activeFilter, monthKey]
  );

  const newCategories = useMemo(
    () => getNewExpenseCategories(activeFilter, monthKey),
    [activeFilter, monthKey]
  );

  // Get previous period categories for comparison
  const previousCategories = useMemo(() => {
    if (activeFilter === "this-week") {
      // Compare with last week
      const prevData = getFilteredSpendData("this-week", monthKey);
      // This is a simplified approach - in real app you'd get actual previous week data
      return null;
    }
    if (activeFilter === "this-month" && spendData.comparisonLabel) {
      // We need to get the previous month's category data
      const prevFilter = getFilteredSpendData("this-month", monthKey);
      return prevFilter.previousTotal !== null ? spendData.categories : null;
    }
    return null;
  }, [activeFilter, monthKey, spendData]);

  // Calculate trend for total
  const totalTrend = useMemo(() => {
    if (spendData.previousTotal === null) return null;
    return computeMomChange(spendData.total, spendData.previousTotal);
  }, [spendData]);

  // Regular categories (not new)
  const regularCategories = CATEGORY_ORDER.filter(
    (slug) => !newCategories.includes(slug) && spendData.categories[slug] > 0
  );

  return (
    <div
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      <div className="sticky top-0 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <header
          className="flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white"
          style={{
            background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
          }}
        >
          <Link
            href={backHref}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Back"
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
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
              HDFC Bank
            </span>
            <h1 className="truncate text-base font-semibold leading-tight">
              Spend Overview
            </h1>
          </div>
        </header>

        {/* Time Filters */}
        <div className="border-b border-zinc-200/90 bg-white px-3 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setActiveFilter(f.key);
                  router.replace(`${pathname}?m=${monthKey}&f=${f.key}`, { scroll: false });
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  f.key === activeFilter
                    ? "text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
                style={
                  f.key === activeFilter ? { backgroundColor: HDFC.navyBlue } : undefined
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="space-y-4 px-4 pb-10 pt-4">
        {/* Total Spends Card */}
        <section className={`${spendCardClass} p-5`} style={spendCardShadow}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Total Spends
              </p>
              <p
                className="mt-1 text-2xl font-bold tabular-nums"
                style={{ color: HDFC.navyBlue }}
              >
                {formatInr(spendData.total)}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {spendData.label}
              </p>
            </div>
            {totalTrend && totalTrend.hasPrevious && totalTrend.direction !== "flat" && (
              <div
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  totalTrend.direction === "up"
                    ? "bg-amber-50 text-amber-800"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                <span aria-hidden>{totalTrend.direction === "up" ? "↑" : "↓"}</span>
                {formatMomPct(totalTrend.pct)}%
                <span className="font-normal text-zinc-500">
                  vs {spendData.comparisonLabel}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Smart Categories */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Smart Categories
          </h2>
          <div className={`overflow-hidden ${spendCardClass}`} style={spendCardShadow}>
            {regularCategories.length > 0 ? (
              <ul className="divide-y divide-zinc-100">
                {regularCategories.map((slug) => (
                  <li key={slug}>
                    <CategoryRow
                      slug={slug}
                      amount={spendData.categories[slug]}
                      previousAmount={previousCategories?.[slug] ?? null}
                      monthKey={monthKey}
                      fromSource={fromSource}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-zinc-500">
                No spending data available
              </p>
            )}
          </div>
        </section>

        {/* New Expenses */}
        {newCategories.length > 0 && (
          <section>
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              New Expenses
            </h2>
            <div className={`overflow-hidden ${spendCardClass}`} style={spendCardShadow}>
              <ul className="divide-y divide-zinc-100">
                {newCategories.map((slug) => (
                  <li key={slug}>
                    <CategoryRow
                      slug={slug}
                      amount={spendData.categories[slug]}
                      previousAmount={null}
                      monthKey={monthKey}
                      fromSource={fromSource}
                      isNew
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
