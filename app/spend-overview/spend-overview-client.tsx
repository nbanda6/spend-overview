"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  type RecurringPayee,
  type FrequentApp,
  getFilteredSpendData,
  getNewExpenseCategories,
  getPaymentTypeBreakdown,
  getRecurringExpenses,
  getFrequentApps,
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

function RecurringIcon({ icon }: { icon: string }) {
  const className = "h-5 w-5";
  const stroke = "currentColor";
  
  switch (icon) {
    case "user":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="4" stroke={stroke} strokeWidth="1.75" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "home":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" stroke={stroke} strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "utensils":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 3v7M12 3v7M15 3v7M9 10v11M12 10v11M15 10v11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" stroke={stroke} strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "bank":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 21h18M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M12 3l9 7H3l9-7z" stroke={stroke} strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "trending":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 17l6-6 4 4 8-8" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 7h4v4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.75" />
        </svg>
      );
  }
}

function AppIcon({ icon, color }: { icon: string; color: string }) {
  const className = "h-5 w-5";
  
  switch (icon) {
    case "zap":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "car":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 17h14v-5l-2-4H7l-2 4v5z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="2" stroke={color} strokeWidth="1.5" />
          <circle cx="17" cy="17" r="2" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case "package":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 9l9-5 9 5v10l-9 5-9-5V9z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M12 22V12M3 9l9 3 9-3" stroke={color} strokeWidth="1.75" />
        </svg>
      );
    case "shopping-bag":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 8h12l-1 12H7L6 8z" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "shopping-cart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="21" r="1" fill={color} />
          <circle cx="20" cy="21" r="1" fill={color} />
        </svg>
      );
    case "utensils":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 3v7M12 3v7M15 3v7M9 10v11M12 10v11M15 10v11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.75" />
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

  const paymentTypes = useMemo(
    () => getPaymentTypeBreakdown(monthKey),
    [monthKey]
  );

  const recurringExpenses = useMemo(
    () => getRecurringExpenses(monthKey),
    [monthKey]
  );

  const frequentApps = useMemo(
    () => getFrequentApps(monthKey),
    [monthKey]
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
        {/* Total Spends with Payment Type Breakdown */}
        <section className={`${spendCardClass} p-4`} style={spendCardShadow}>
          <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
            <div>
              <p className="text-xs font-medium text-zinc-500">Total Spends</p>
              <p
                className="mt-1 text-2xl font-bold tabular-nums"
                style={{ color: HDFC.navyBlue }}
              >
                {formatInr(spendData.total)}
              </p>
            </div>
            {totalTrend && totalTrend.hasPrevious && totalTrend.direction !== "flat" && (
              <div
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  totalTrend.direction === "up"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span aria-hidden>{totalTrend.direction === "up" ? "↑" : "↓"}</span>
                {formatMomPct(totalTrend.pct)}%
              </div>
            )}
          </div>
          
          {/* Payment Type Breakdown */}
          <ul className="mt-3 space-y-2">
            {paymentTypes.filter(p => p.amount > 0).map((p) => {
              const trend = p.previousAmount !== null ? computeMomChange(p.amount, p.previousAmount) : null;
              return (
                <li key={p.type} className="flex items-center gap-3">
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
                      {trend.direction === "up" ? "↑" : "↓"}{formatMomPct(trend.pct)}%
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recurring Expenses */}
        {recurringExpenses.payees.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Recurring Expenses
              </h2>
              <span className="text-xs font-semibold text-zinc-700">
                {formatInr(recurringExpenses.total)}
              </span>
            </div>
            <div className={`overflow-hidden ${spendCardClass}`} style={spendCardShadow}>
              <ul className="divide-y divide-zinc-100">
                {recurringExpenses.payees.map((payee) => (
                  <li key={payee.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                      <RecurringIcon icon={payee.icon} />
                    </span>
                    <span className="flex-1 text-sm font-medium text-zinc-800">
                      {payee.name}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-zinc-900">
                      {formatInr(payee.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

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

        {/* Frequent Used Apps */}
        {frequentApps.length > 0 && (
          <section>
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Frequent Used Apps
            </h2>
            <div className={`overflow-hidden ${spendCardClass}`} style={spendCardShadow}>
              <ul className="divide-y divide-zinc-100">
                {frequentApps.map((app) => {
                  const trend = app.previousSpend !== null ? computeMomChange(app.totalSpend, app.previousSpend) : null;
                  return (
                    <li key={app.id} className="flex items-center gap-3 px-4 py-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${app.color}15` }}
                      >
                        <AppIcon icon={app.icon} color={app.color} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-800 truncate">
                          {app.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {app.txCount} transaction{app.txCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums text-zinc-900">
                          {formatInr(app.totalSpend)}
                        </p>
                        {trend && trend.hasPrevious && trend.direction !== "flat" && (
                          <p
                            className={`text-[11px] font-semibold tabular-nums ${
                              trend.direction === "up" ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {trend.direction === "up" ? "↑" : "↓"}{formatMomPct(trend.pct)}%
                          </p>
                        )}
                        {trend && trend.variant === "new" && (
                          <span className="text-[10px] font-medium text-zinc-500">New</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
