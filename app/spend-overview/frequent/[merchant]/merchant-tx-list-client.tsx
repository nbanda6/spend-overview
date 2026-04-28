"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FrequentAppBrandIcon } from "@/app/components/frequent-app-brand-icon";
import {
  CATEGORY_META,
  HDFC,
  MONTHS,
  type MonthKey,
  type MerchantTxRef,
  formatInr,
  spendCardClass,
} from "@/lib/icici-spend";

export function MerchantTxListClient({
  merchant,
  monthKey,
  fromSource,
  items,
  accentColor,
}: {
  merchant: string;
  monthKey: MonthKey;
  fromSource: string;
  items: MerchantTxRef[];
  accentColor: string;
}) {
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
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          <span className="flex h-[28px] w-[28px] items-center justify-center rounded-lg bg-white shadow-sm">
            <FrequentAppBrandIcon merchantName={merchant} accentColor={accentColor} />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Frequent app
          </p>
          <h1 className="truncate text-base font-semibold">{merchant}</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/75">
            {items.length} transaction{items.length !== 1 ? "s" : ""} · {monthLabel}
          </p>
        </div>
      </header>

      <div className="px-4 pb-10 pt-4">
        <ul className={`overflow-hidden ${spendCardClass}`}>
          {items.map((row, i) => {
            const cat = CATEGORY_META[row.slug];
            const href = `/spend-overview/${row.slug}/${row.txIndex}?m=${monthKey}&from=${encodeURIComponent(fromSource)}`;
            return (
              <li
                key={`${row.slug}-${row.txIndex}-${row.tx.date}-${i}`}
                className="border-b border-zinc-100 last:border-0"
              >
                <Link
                  href={href}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-zinc-50"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {row.tx.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900">{row.tx.merchant}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-600">{cat.label}</span>
                      {" · "}
                      {row.tx.date}
                      {row.tx.channel ? (
                        <>
                          {" "}
                          · <span className="font-medium text-zinc-600">{row.tx.channel}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-900">
                    {formatInr(row.tx.amount)}
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
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
