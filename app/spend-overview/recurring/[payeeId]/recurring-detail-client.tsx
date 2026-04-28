"use client";

import Link from "next/link";
import { RecurringTrend } from "@/app/components/recurring-trend";
import { RecurringPayeeIcon } from "@/app/components/recurring-payee-icon";
import {
  HDFC,
  MONTHS,
  PAYMENT_TYPE_META,
  type MonthKey,
  type RecurringPayee,
  formatInr,
} from "@/lib/icici-spend";

function payeeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function RecurringDetailClient({
  monthKey,
  payee,
  previousAmount,
  fromSource,
}: {
  monthKey: MonthKey;
  payee: RecurringPayee;
  previousAmount: number | null;
  fromSource: string;
}) {
  const monthLabel = MONTHS.find((x) => x.key === monthKey)?.label ?? monthKey;
  const refNumber = `HDFCRCUR${monthKey.toUpperCase()}${payee.id}${payee.amount}`;

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
          href={`/spend-overview/recurring?m=${monthKey}&from=${encodeURIComponent(fromSource)}`}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Back to Recurring"
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
          <h1 className="truncate text-base font-semibold">{payee.name}</h1>
        </div>
      </header>

      <div className="bg-white px-4 py-6 text-center shadow-sm">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: HDFC.navyBlue }}
        >
          {payeeInitials(payee.name)}
        </div>
        <p className="text-3xl font-bold tabular-nums text-zinc-900">{formatInr(payee.amount)}</p>
        <p className="mt-1 text-sm text-zinc-500">Recurring debit for this period</p>
        <div
          className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${HDFC.navyBlue}15`, color: HDFC.navyBlue }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-zinc-700"
            aria-hidden
          >
            <RecurringPayeeIcon icon={payee.icon} />
          </span>
          Recurring
        </div>
        {previousAmount !== null && (
          <div className="mt-3 flex justify-center">
            <RecurringTrend current={payee.amount} previous={previousAmount} />
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-8 pt-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <DetailRow label="Payee" value={payee.name} />
          <DetailRow label="Amount" value={formatInr(payee.amount)} />
          <DetailRow label="Billing period" value={monthLabel} />
          <DetailRow label="Schedule" value="Monthly (recurring)" />
          <DetailRow
            label="Payment mode"
            value={PAYMENT_TYPE_META[payee.paymentMode].label}
          />
          <DetailRow label="Category" value="Recurring" />
          <DetailRow label="Reference no." value={refNumber} isLast />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Account details
            </p>
          </div>
          <DetailRow label="Account type" value="Savings account" />
          <DetailRow label="Transaction type" value="Debit" />
          <DetailRow label="Status" value="Active" valueColor="#16a34a" isLast />
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
            Download mandate
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
            Share details
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
            Manage recurring payment
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Recurring setup for {monthLabel}
        </p>
      </div>
    </div>
  );
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
      className={`flex items-center justify-between gap-3 px-4 py-3.5 ${
        !isLast ? "border-b border-zinc-100" : ""
      }`}
    >
      <span className="text-sm text-zinc-500">{label}</span>
      <span
        className="max-w-[65%] text-right text-sm font-medium"
        style={{ color: valueColor ?? "#18181b" }}
      >
        {value}
      </span>
    </div>
  );
}
