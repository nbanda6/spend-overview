"use client";

import Link from "next/link";
import {
  CATEGORY_META,
  HDFC,
  MONTHS,
  PAYMENT_TYPE_META,
  type PaymentModeListItem,
  type PaymentType,
  formatInr,
  spendCardClass,
} from "@/lib/icici-spend";

function PaymentGlyph({ type }: { type: PaymentType }) {
  const icon = PAYMENT_TYPE_META[type].icon;
  if (icon === "upi") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === "credit") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x={3} y={5} width={18} height={14} rx={2} stroke="currentColor" strokeWidth={2} />
        <path d="M3 10h18" stroke="currentColor" strokeWidth={2} />
      </svg>
    );
  }
  if (icon === "transfer") {
    return (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 12h16M14 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x={3} y={6} width={18} height={12} rx={2} stroke="currentColor" strokeWidth={2} />
      <path d="M7 10h6M7 14h4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function PaymentTxListClient({
  paymentType,
  periodLabel,
  fromSource,
  periodQuery,
  items,
}: {
  paymentType: PaymentType;
  periodLabel: string;
  fromSource: string;
  periodQuery: string;
  items: PaymentModeListItem[];
}) {
  const meta = PAYMENT_TYPE_META[paymentType];
  const total = items.reduce((s, r) => s + r.displayAmount, 0);
  const backHref = `/spend-overview?${periodQuery}`;

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
          href={backHref}
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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
          <PaymentGlyph type={paymentType} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Total Spends · {meta.label}
          </p>
          <h1 className="truncate text-base font-semibold tabular-nums">{formatInr(total)}</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/75">{periodLabel}</p>
        </div>
      </header>

      <div className="px-4 pb-10 pt-4">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-zinc-200/90 bg-white px-4 py-8 text-center text-sm text-zinc-500 shadow-sm">
            No activity for this payment type in this period.
          </p>
        ) : (
          <ul className={`overflow-hidden ${spendCardClass}`}>
            {items.map((row, i) => {
              if (row.kind === "recurring") {
                const href = `/spend-overview/recurring/${encodeURIComponent(row.payeeId)}?m=${row.monthKey}&from=${encodeURIComponent(fromSource)}`;
                const monthLabel =
                  MONTHS.find((x) => x.key === row.monthKey)?.label ?? row.monthKey;
                return (
                  <li
                    key={`rec-${row.monthKey}-${row.payeeId}-${i}`}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <Link
                      href={href}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-zinc-50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-800">
                        SI
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-zinc-900">{row.name}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Recurring · {monthLabel}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-900">
                        {formatInr(row.displayAmount)}
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
              }

              const cat = CATEGORY_META[row.slug];
              const href = `/spend-overview/${row.slug}/${row.txIndex}?${periodQuery}`;
              const portionNote =
                row.channel === "Card" &&
                (paymentType === "credit" || paymentType === "debit")
                  ? paymentType === "credit"
                    ? "Credit portion"
                    : "Debit portion"
                  : null;

              return (
                <li
                  key={`${row.slug}-${row.monthKey}-${row.txIndex}-${row.date}-${i}`}
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
                      {row.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-900">{row.merchant}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        <span className="font-medium text-zinc-600">{cat.label}</span>
                        {" · "}
                        {row.date}
                        {row.channel ? (
                          <>
                            {" "}
                            ·{" "}
                            <span className="font-medium text-zinc-600">{row.channel}</span>
                          </>
                        ) : null}
                        {portionNote ? (
                          <>
                            {" "}
                            ·{" "}
                            <span className="font-medium text-zinc-600">{portionNote}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-900">
                      {formatInr(row.displayAmount)}
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
        )}
      </div>
    </div>
  );
}
