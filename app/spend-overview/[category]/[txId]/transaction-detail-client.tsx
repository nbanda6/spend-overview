"use client";

import Link from "next/link";
import {
  CATEGORY_META,
  HDFC,
  MONTHS,
  type CategorySlug,
  type MonthKey,
  type TxRow,
  formatInr,
} from "@/lib/icici-spend";

export function TransactionDetailClient({
  slug,
  monthKey,
  transaction,
  txIndex,
  fromSource,
}: {
  slug: CategorySlug;
  monthKey: MonthKey;
  transaction: TxRow;
  txIndex: number;
  fromSource: string;
}) {
  const cat = CATEGORY_META[slug];
  const monthLabel = MONTHS.find((x) => x.key === monthKey)?.label ?? monthKey;

  // Generate a mock reference number based on transaction details
  const refNumber = `HDFC${monthKey.toUpperCase()}${txIndex.toString().padStart(4, "0")}${transaction.amount}`;
  
  // Generate mock time from date
  const txTime = "14:32:18";

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white shadow-md"
        style={{
          background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
        }}
      >
        <Link
          href={`/spend-overview/${slug}?m=${monthKey}&from=${fromSource}`}
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

      {/* Transaction Amount Hero */}
      <div className="bg-white px-4 py-6 text-center shadow-sm">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ backgroundColor: cat.color }}
        >
          {transaction.initials}
        </div>
        <p className="text-3xl font-bold tabular-nums text-zinc-900">
          {formatInr(transaction.amount)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Debited from Account</p>
        <div
          className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          {cat.label}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex-1 px-4 pb-8 pt-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <DetailRow label="Merchant" value={transaction.merchant} />
          <DetailRow label="Date" value={transaction.date} />
          <DetailRow label="Time" value={txTime} />
          <DetailRow label="Payment Mode" value={transaction.channel ?? "Unknown"} />
          <DetailRow label="Category" value={cat.label} />
          <DetailRow label="Reference No." value={refNumber} isLast />
        </div>

        {/* Additional Info Card */}
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

        {/* Action Buttons */}
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

        {/* Period indicator */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          Transaction from {monthLabel}
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
