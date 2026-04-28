"use client";

import { computeMomChange, formatMomPct } from "@/lib/icici-spend";

/** Month-over-month trend for recurring totals — includes flat / new / cleared */
export function RecurringTrend({
  current,
  previous,
}: {
  current: number;
  previous: number | null;
}) {
  if (previous === null) return null;

  const change = computeMomChange(current, previous);

  if (change.variant === "new") {
    return (
      <span className="text-[11px] font-semibold tabular-nums text-emerald-700">New</span>
    );
  }

  if (!change.hasPrevious) return null;

  if (change.direction === "flat") {
    return (
      <span className="text-[11px] font-semibold tabular-nums text-zinc-400">0%</span>
    );
  }

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
