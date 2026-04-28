"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  HDFC,
  TIME_FILTERS,
  PAYMENT_TYPE_META,
  type CategoryIconKind,
  type CategorySlug,
  type MonthKey,
  type TimeFilter,
  type PaymentType,
  type CustomDateRange,
  buildSpendOverviewPeriodQuery,
  getDatasetDateIsoBounds,
  getFilteredSpendData,
  getMonthDateRangeIso,
  getNewExpenseCategories,
  getPaymentTypeBreakdown,
  getPreviousRecurringDebitTotalForSpendFilter,
  getOverviewPreviousCombinedTotal,
  getRecurringDebitTotalForSpendFilter,
  getRecurringExpenses,
  getFrequentApps,
  getPreviousMonthKey,
  getSpendSnapshot,
  getWeeklySpendSnapshot,
  isValidCustomRange,
  formatInr,
  spendCardClass,
  spendCardShadow,
  computeMomChange,
  formatMomPct,
} from "@/lib/icici-spend";
import { FrequentAppBrandIcon } from "@/app/components/frequent-app-brand-icon";
import { RecurringTrend } from "@/app/components/recurring-trend";
import { SpendAssistantIcon } from "@/app/components/spend-assistant-icon";
import { SpendChatPanel } from "@/app/components/spend-chat-panel";

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

function PaymentTypeIcon({ type }: { type: PaymentType }) {
  const className = "h-5 w-5";
  const stroke = "currentColor";
  
  switch (type) {
    case "upi":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={stroke} strokeWidth="1.75" />
          <path d="M7 12h2M12 10v4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "credit":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={stroke} strokeWidth="1.75" />
          <path d="M2 10h20" stroke={stroke} strokeWidth="1.75" />
          <path d="M6 15h4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "transfer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M17 8l4 4-4 4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12h18" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
          <path d="M7 16l-4-4 4-4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "debit":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={stroke} strokeWidth="1.75" />
          <circle cx="16" cy="12" r="2" stroke={stroke} strokeWidth="1.5" />
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
  periodQuery,
  isNew,
}: {
  slug: CategorySlug;
  amount: number;
  previousAmount: number | null;
  periodQuery: string;
  isNew?: boolean;
}) {
  const c = CATEGORY_META[slug];

  return (
    <Link
      href={`/spend-overview/${slug}?${periodQuery}`}
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
        <div className="flex flex-col items-end gap-0.5">
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

function RecurringSmartRow({
  total,
  previousTotal,
  monthKey,
  fromSource,
}: {
  total: number;
  previousTotal: number | null;
  monthKey: MonthKey;
  fromSource: string;
}) {
  return (
    <Link
      href={`/spend-overview/recurring?m=${monthKey}&from=${encodeURIComponent(fromSource)}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-zinc-50"
      aria-label={`Recurring, ${formatInr(total)}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          color: HDFC.navyBlue,
          backgroundColor: `${HDFC.navyBlue}14`,
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17 3v4M7 3v4M5 9h14M7 5h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 14l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <span className="font-medium text-zinc-900">Recurring</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            {formatInr(total)}
          </span>
          <RecurringTrend current={total} previous={previousTotal} />
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
  initialTimeFilter = "this-month",
  initialCustomRange,
  backHref,
  fromSource,
}: {
  initialMonthKey: MonthKey;
  initialTimeFilter?: TimeFilter;
  initialCustomRange?: CustomDateRange;
  backHref: string;
  fromSource: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [monthKey] = useState<MonthKey>(initialMonthKey);
  const [activeFilter, setActiveFilter] = useState<TimeFilter>(() => initialTimeFilter);
  const [customRange, setCustomRange] = useState<CustomDateRange>(
    () => initialCustomRange ?? getMonthDateRangeIso(initialMonthKey),
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [totalSpendsExpanded, setTotalSpendsExpanded] = useState(false);

  const datasetBounds = useMemo(() => getDatasetDateIsoBounds(), []);

  const clampIsoToDataset = useCallback(
    (iso: string) => {
      let v = iso;
      if (v < datasetBounds.min) v = datasetBounds.min;
      if (v > datasetBounds.max) v = datasetBounds.max;
      return v;
    },
    [datasetBounds],
  );

  const customRangeArg = useMemo(() => {
    if (activeFilter !== "custom") return null;
    return isValidCustomRange(customRange) ? customRange : null;
  }, [activeFilter, customRange]);

  const periodQuery = useMemo(
    () =>
      buildSpendOverviewPeriodQuery(monthKey, fromSource, activeFilter, customRangeArg),
    [monthKey, fromSource, activeFilter, customRangeArg],
  );

  const spendData = useMemo(
    () => getFilteredSpendData(activeFilter, monthKey, customRangeArg),
    [activeFilter, monthKey, customRangeArg],
  );

  const newCategories = useMemo(
    () => getNewExpenseCategories(activeFilter, monthKey, customRangeArg),
    [activeFilter, monthKey, customRangeArg],
  );

  const paymentTypes = useMemo(
    () => getPaymentTypeBreakdown(monthKey, customRangeArg, activeFilter),
    [monthKey, customRangeArg, activeFilter],
  );

  const recurringExpenses = useMemo(
    () => getRecurringExpenses(monthKey),
    [monthKey]
  );

  const recurringDebitTotal = useMemo(
    () => getRecurringDebitTotalForSpendFilter(activeFilter, monthKey),
    [activeFilter, monthKey],
  );

  const overviewTotal = useMemo(
    () => spendData.total + recurringDebitTotal,
    [spendData.total, recurringDebitTotal],
  );

  const overviewPreviousCombined = useMemo(
    () => getOverviewPreviousCombinedTotal(activeFilter, monthKey),
    [activeFilter, monthKey],
  );

  const frequentApps = useMemo(
    () => getFrequentApps(monthKey, customRangeArg),
    [monthKey, customRangeArg],
  );

  const chatCustomRange =
    activeFilter === "custom" ? customRange : null;

  // Prior-period category totals for trend badges (mom / week-over-week)
  const previousCategories = useMemo(() => {
    if (activeFilter === "last-3-months") return null;
    if (activeFilter === "custom") return null;

    if (activeFilter === "this-week") {
      return getWeeklySpendSnapshot(monthKey, 3).categories;
    }

    if (activeFilter === "this-month") {
      const prevKey = getPreviousMonthKey(monthKey);
      if (!prevKey) return null;
      return getSpendSnapshot(prevKey).categories;
    }

    return null;
  }, [activeFilter, monthKey]);

  const previousRecurringTotal = useMemo(
    () => getPreviousRecurringDebitTotalForSpendFilter(activeFilter, monthKey),
    [activeFilter, monthKey],
  );

  // Calculate trend for total (transactions + recurring, same window as Smart Categories)
  const totalTrend = useMemo(() => {
    if (overviewPreviousCombined === null) return null;
    return computeMomChange(overviewTotal, overviewPreviousCombined);
  }, [overviewTotal, overviewPreviousCombined]);

  const totalTrendSubtitle = useMemo(() => {
    const cl = spendData.comparisonLabel;
    if (!cl) return null;
    if (cl === "Last Week") return "from last week";
    if (activeFilter === "last-3-months") return "vs prior 3 months";
    if (activeFilter === "this-month") return "from last month";
    return `vs ${cl}`;
  }, [spendData.comparisonLabel, activeFilter]);

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
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.15),0_4px_14px_rgba(0,40,90,0.35)] outline-none ring-2 ring-white/35 ring-offset-2 ring-offset-[#004C8F] transition-[box-shadow,background-color,transform] hover:bg-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_0_1px_rgba(255,255,255,0.25),0_6px_18px_rgba(0,40,90,0.45)] active:scale-[0.96]"
            aria-label="Open Spent AI assistant"
          >
            <SpendAssistantIcon size={26} />
          </button>
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
                  const arg =
                    f.key === "custom" && isValidCustomRange(customRange) ? customRange : null;
                  router.replace(
                    `${pathname}?${buildSpendOverviewPeriodQuery(monthKey, fromSource, f.key, arg)}`,
                    { scroll: false },
                  );
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
          {activeFilter === "custom" && (
            <div className="mt-3 flex flex-wrap items-end gap-4 border-t border-zinc-100 pt-3">
              <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-600">
                From
                <input
                  type="date"
                  value={customRange.start}
                  min={datasetBounds.min}
                  max={datasetBounds.max}
                  onChange={(e) => {
                    const start = clampIsoToDataset(e.target.value);
                    setCustomRange((prev) => {
                      let end = prev.end;
                      if (start > end) end = start;
                      end = clampIsoToDataset(end);
                      return { start, end };
                    });
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#004C8F]/25"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-medium text-zinc-600">
                To
                <input
                  type="date"
                  value={customRange.end}
                  min={datasetBounds.min}
                  max={datasetBounds.max}
                  onChange={(e) => {
                    const end = clampIsoToDataset(e.target.value);
                    setCustomRange((prev) => {
                      let start = prev.start;
                      if (end < start) start = end;
                      start = clampIsoToDataset(start);
                      return { start, end };
                    });
                  }}
                  className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#004C8F]/25"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <main className="space-y-4 px-4 pb-10 pt-4">
        {/* Total Spends — collapsible breakdown */}
        <section className={`${spendCardClass} overflow-hidden p-4`} style={spendCardShadow}>
          <button
            type="button"
            id="total-spends-toggle"
            aria-expanded={totalSpendsExpanded}
            aria-controls="total-spends-breakdown"
            onClick={() => setTotalSpendsExpanded((v) => !v)}
            className={`flex w-full items-start justify-between gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#004C8F]/30 focus-visible:ring-offset-2 rounded-lg -m-1 p-1 ${totalSpendsExpanded ? "pb-3 border-b border-zinc-100" : ""}`}
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-500">Total Spends</p>
              <p
                className="mt-1 text-2xl font-bold tabular-nums"
                style={{ color: HDFC.navyBlue }}
              >
                {formatInr(overviewTotal)}
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-2 pt-0.5">
              {totalTrend && totalTrend.hasPrevious && totalTrend.direction !== "flat" && (
                <div className="flex flex-col items-end gap-0.5">
                  <div
                    className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 ${
                      totalTrend.direction === "up"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="text-[10px] font-semibold leading-none"
                    >
                      {totalTrend.direction === "up" ? "↑" : "↓"}
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums leading-none">
                      {formatMomPct(totalTrend.pct)}%
                    </span>
                  </div>
                  {totalTrendSubtitle && (
                    <span className="max-w-[7.5rem] text-right text-[10px] font-medium leading-tight text-zinc-500">
                      {totalTrendSubtitle}
                    </span>
                  )}
                </div>
              )}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-transform duration-200 ${
                  totalSpendsExpanded ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </button>

          {totalSpendsExpanded && (
            <ul
              id="total-spends-breakdown"
              className="mt-3 space-y-2"
            >
              {paymentTypes
                .filter((p) => p.amount > 0)
                .map((p) => {
                  const trend =
                    p.previousAmount !== null
                      ? computeMomChange(p.amount, p.previousAmount)
                      : null;
                  return (
                    <li key={p.type}>
                      <Link
                        href={`/spend-overview/payment/${p.type}?${periodQuery}`}
                        className="flex items-center gap-3 rounded-xl py-1.5 pl-1 pr-0 -mx-1 active:bg-zinc-50/90 outline-none focus-visible:ring-2 focus-visible:ring-[#004C8F]/25"
                        aria-label={`${PAYMENT_TYPE_META[p.type].label}, ${formatInr(p.amount)} — view transactions`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <PaymentTypeIcon type={p.type} />
                        </span>
                        <span className="flex-1 text-sm font-medium text-zinc-700">
                          {PAYMENT_TYPE_META[p.type].label}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-zinc-900">
                          {formatInr(p.amount)}
                        </span>
                        {trend && trend.hasPrevious && trend.direction !== "flat" && (
                          <span
                            className={`text-[11px] font-semibold tabular-nums ${
                              trend.direction === "up" ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {trend.direction === "up" ? "↑" : "↓"}
                            {formatMomPct(trend.pct)}%
                          </span>
                        )}
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
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>

        {/* Frequent Used Apps — compact horizontal tiles (each tile links to transactions) */}
        {frequentApps.length > 0 && (
          <section>
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Frequent Used Apps
            </h2>
            <div
              className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {frequentApps.map((app) => {
                const href = `/spend-overview/frequent/${encodeURIComponent(app.name)}?m=${monthKey}&from=${encodeURIComponent(fromSource)}`;
                return (
                  <Link
                    key={app.id}
                    href={href}
                    className="flex w-[92px] shrink-0 flex-col items-center rounded-xl border border-zinc-200/90 bg-white px-2 py-2 text-center shadow-sm active:opacity-90"
                    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
                    aria-label={`${app.name}, ${formatInr(app.totalSpend)} — view related transactions`}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${app.color}18` }}
                    >
                      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-white shadow-sm">
                        <FrequentAppBrandIcon merchantName={app.name} accentColor={app.color} />
                      </span>
                    </span>
                    <p className="mt-1.5 line-clamp-2 min-h-[2rem] text-[10px] font-semibold leading-tight text-zinc-900">
                      {app.name}
                    </p>
                    <p className="mt-1 text-[11px] font-bold tabular-nums leading-tight text-zinc-900">
                      {formatInr(app.totalSpend)}
                    </p>
                    <p className="mt-1 text-[9px] font-medium text-zinc-400">View activity</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Smart Categories — includes recurring + category spend with trends */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Smart Categories
          </h2>
          <div className={`overflow-hidden ${spendCardClass}`} style={spendCardShadow}>
            {recurringExpenses.payees.length > 0 || regularCategories.length > 0 ? (
              <ul className="divide-y divide-zinc-100">
                {recurringExpenses.payees.length > 0 && (
                  <li>
                    <RecurringSmartRow
                      total={recurringDebitTotal}
                      previousTotal={previousRecurringTotal}
                      monthKey={monthKey}
                      fromSource={fromSource}
                    />
                  </li>
                )}
                {regularCategories.map((slug) => (
                  <li key={slug}>
                    <CategoryRow
                      slug={slug}
                      amount={spendData.categories[slug]}
                      previousAmount={previousCategories?.[slug] ?? null}
                      periodQuery={periodQuery}
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
                      periodQuery={periodQuery}
                      isNew
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <SpendChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        monthKey={monthKey}
        activeFilter={activeFilter}
        customRange={chatCustomRange}
        fromSource={fromSource}
      />
    </div>
  );
}
