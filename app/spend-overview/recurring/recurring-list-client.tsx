"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RecurringTrend } from "@/app/components/recurring-trend";
import { RecurringPayeeIcon } from "@/app/components/recurring-payee-icon";
import {
  HDFC,
  MONTHS,
  getPreviousMonthKey,
  getRecurringExpenses,
  type MonthKey,
  formatInr,
  spendCardClass,
} from "@/lib/icici-spend";

export function RecurringListClient({
  monthKey,
  fromSource,
}: {
  monthKey: MonthKey;
  fromSource: string;
}) {
  const { payees, total } = useMemo(
    () => getRecurringExpenses(monthKey),
    [monthKey],
  );

  const previousTotal = useMemo(() => {
    const prevKey = getPreviousMonthKey(monthKey);
    if (!prevKey) return null;
    return getRecurringExpenses(prevKey).total;
  }, [monthKey]);

  const monthLabel = useMemo(
    () => MONTHS.find((x) => x.key === monthKey)?.label ?? monthKey,
    [monthKey],
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
          href={`/spend-overview?m=${monthKey}&from=${fromSource}`}
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
            Smart category
          </p>
          <h1 className="truncate text-base font-semibold">Recurring</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/75">
            Fixed debits for the month
          </p>
        </div>
      </header>

      <div className="border-b border-zinc-200/90 bg-zinc-100 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Period
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">{monthLabel}</p>
      </div>

      <div className="px-4 pb-10 pt-4">
        <div className={`mb-3 flex items-center justify-between px-1`}>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total
          </span>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-sm font-bold tabular-nums text-zinc-900">
              {formatInr(total)}
            </span>
            <RecurringTrend current={total} previous={previousTotal} />
          </div>
        </div>

        <ul className={`overflow-hidden ${spendCardClass}`}>
          {payees.map((payee) => (
            <li key={payee.id} className="border-b border-zinc-100 last:border-0">
              <Link
                href={`/spend-overview/recurring/${encodeURIComponent(payee.id)}?m=${monthKey}&from=${encodeURIComponent(fromSource)}`}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-zinc-50"
                aria-label={`${payee.name}, ${formatInr(payee.amount)}, view details`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                  <RecurringPayeeIcon icon={payee.icon} />
                </span>
                <span className="flex-1 text-sm font-medium text-zinc-900">{payee.name}</span>
                <span className="text-sm font-semibold tabular-nums text-zinc-900">
                  {formatInr(payee.amount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
