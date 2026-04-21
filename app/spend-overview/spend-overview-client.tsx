"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  ICICI,
  MONTHS,
  type CategoryIconKind,
  type MomChange,
  type MonthKey,
  formatMomPct,
  getSpendInsight,
  formatInr,
  spendCardClass,
  spendCardShadow,
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

function Donut({
  segments,
  centerLabel,
}: {
  segments: { color: string; pct: number }[];
  centerLabel: string;
}) {
  const { stops } = segments.reduce(
    (out, s) => {
      const start = out.acc;
      const end = out.acc + s.pct;
      const piece = `${s.color} ${start * 100}% ${end * 100}%`;
      return {
        acc: end,
        stops: out.stops ? `${out.stops}, ${piece}` : piece,
      };
    },
    { acc: 0, stops: "" as string },
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[220px] w-[220px]"
        role="img"
        aria-label="Spending breakdown by category"
      >
        <div
          className="absolute inset-0 rounded-full shadow-inner"
          style={{
            background:
              segments.length > 0 && segments.some((s) => s.pct > 0)
                ? `conic-gradient(${stops})`
                : "#e4e4e7",
          }}
        />
        <div
          className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
          style={{ border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Total outflow
          </p>
          <p
            className="mt-1 text-center text-lg font-bold tabular-nums leading-tight"
            style={{ color: ICICI.oceanBlue }}
          >
            {centerLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function MomPill({ mom }: { mom: MomChange }) {
  if (!mom.hasPrevious) {
    return (
      <span className="text-[11px] leading-snug text-zinc-500">
        Trend compares from your second month in this view (February onward).
      </span>
    );
  }
  if (mom.variant === "new") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
        New vs prior month
      </span>
    );
  }
  if (mom.variant === "cleared") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
        ↓ to zero vs prior
      </span>
    );
  }
  if (mom.direction === "flat") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
        Flat vs prior month
      </span>
    );
  }
  const up = mom.direction === "up";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ring-1 ${
        up
          ? "bg-amber-50 text-amber-900 ring-amber-200/90"
          : "bg-emerald-50 text-emerald-900 ring-emerald-200/90"
      }`}
    >
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      {formatMomPct(mom.pct)}%
      <span className="font-medium opacity-90">
        {up ? " higher" : " lower"}
      </span>
    </span>
  );
}

function CategoryMomHint({ mom }: { mom: MomChange }) {
  if (!mom.hasPrevious) return null;
  if (mom.variant === "new") {
    return (
      <span className="text-[10px] font-medium text-zinc-600">
        New <span className="text-zinc-400">· vs prior month</span>
      </span>
    );
  }
  if (mom.variant === "cleared") {
    return (
      <span className="text-[10px] font-semibold text-emerald-800">
        ↓ to zero <span className="font-normal text-zinc-400">· vs prior</span>
      </span>
    );
  }
  if (mom.direction === "flat") {
    return (
      <span className="text-[10px] text-zinc-500">
        Flat <span className="text-zinc-400">· vs prior month</span>
      </span>
    );
  }
  const up = mom.direction === "up";
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`text-[10px] font-bold tabular-nums ${up ? "text-amber-800" : "text-emerald-800"}`}
      >
        {up ? "↑" : "↓"} {formatMomPct(mom.pct)}%
      </span>
      <span className="text-[9px] font-medium uppercase tracking-wide text-zinc-400">
        vs prior
      </span>
    </span>
  );
}

export function SpendOverviewClient({
  initialMonthKey,
}: {
  initialMonthKey: MonthKey;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [monthKey, setMonthKey] = useState<MonthKey>(initialMonthKey);

  const insight = useMemo(() => getSpendInsight(monthKey), [monthKey]);
  const { snapshot, previousMonthLabel, totalMom, categoryMom } = insight;

  const segments = useMemo(() => {
    const total = snapshot.total;
    if (total <= 0) return [];
    return CATEGORY_ORDER.map((slug) => ({
      color: CATEGORY_META[slug].color,
      pct: snapshot.categories[slug] / total,
    }));
  }, [snapshot]);

  return (
    <div
      className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      <div className="sticky top-0 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <header
          className="flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white"
          style={{
            background: `linear-gradient(135deg, ${ICICI.headerFrom} 0%, ${ICICI.headerTo} 100%)`,
          }}
        >
          <Link
            href="/services"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Back to Services"
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
              ICICI Bank
            </span>
            <h1 className="truncate text-base font-semibold leading-tight">
              Your Spending at a Glance
            </h1>
          </div>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-bold"
            aria-hidden
          >
            i
          </div>
        </header>

        <div className="border-b border-zinc-200/90 bg-zinc-100 px-3 pb-3 pt-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Month
          </p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MONTHS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setMonthKey(m.key);
                  router.replace(`${pathname}?m=${m.key}`, { scroll: false });
                }}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  m.key === monthKey
                    ? "text-white shadow-sm"
                    : "border border-zinc-200/90 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
                style={
                  m.key === monthKey ? { backgroundColor: ICICI.orange } : undefined
                }
              >
                {m.short}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Showing data for{" "}
            <span className="font-semibold text-zinc-900">{snapshot.monthLabel}</span>
          </p>
        </div>
      </div>

      <main className="space-y-4 px-4 pb-10 pt-4">
        <section className={`${spendCardClass} p-4`} style={spendCardShadow}>
          <p className="text-xs font-medium text-zinc-500">Total Spends</p>
          <p
            className="mt-1 text-3xl font-bold tabular-nums tracking-tight"
            style={{ color: ICICI.oceanBlue }}
          >
            {formatInr(snapshot.total)}
          </p>

          <div
            className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2.5"
            role="status"
            aria-live="polite"
          >
            <p className="text-[11px] font-medium text-zinc-600">
              {previousMonthLabel ? (
                <>
                  vs <span className="text-zinc-900">{previousMonthLabel}</span>
                </>
              ) : (
                "Month-over-month"
              )}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <MomPill mom={totalMom} />
            </div>
            {totalMom.hasPrevious && totalMom.variant === "normal" && totalMom.direction !== "flat" && (
              <p className="mt-2 text-[11px] leading-snug text-zinc-500">
                {totalMom.direction === "up"
                  ? "You spent more overall than the prior month."
                  : "You spent less overall than the prior month."}
              </p>
            )}
          </div>
        </section>

        <section className={`${spendCardClass} p-5`}>
          <h2 className="text-center text-sm font-semibold text-zinc-800">
            Visual breakdown
          </h2>
          {previousMonthLabel && totalMom.hasPrevious && totalMom.variant === "normal" && (
            <p className="mx-auto mt-1 max-w-[280px] text-center text-[11px] leading-relaxed text-zinc-500">
              {totalMom.direction === "flat" && (
                <>
                  Total outflow is about the same as{" "}
                  <span className="font-medium text-zinc-700">
                    {previousMonthLabel.replace(" 2026", "")}
                  </span>
                </>
              )}
              {totalMom.direction === "up" && (
                <>
                  Total outflow is{" "}
                  <span className="font-semibold text-amber-800">
                    {formatMomPct(totalMom.pct)}% higher
                  </span>{" "}
                  than{" "}
                  <span className="font-medium text-zinc-700">
                    {previousMonthLabel.replace(" 2026", "")}
                  </span>
                </>
              )}
              {totalMom.direction === "down" && (
                <>
                  Total outflow is{" "}
                  <span className="font-semibold text-emerald-800">
                    {formatMomPct(totalMom.pct)}% lower
                  </span>{" "}
                  than{" "}
                  <span className="font-medium text-zinc-700">
                    {previousMonthLabel.replace(" 2026", "")}
                  </span>
                </>
              )}
            </p>
          )}
          <div className="mt-4 flex justify-center">
            <Donut segments={segments} centerLabel={formatInr(snapshot.total)} />
          </div>
          <ul className="mx-auto mt-4 flex max-w-sm flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] text-zinc-600">
            {CATEGORY_ORDER.map((slug) => (
              <li key={slug} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_META[slug].color }}
                />
                {CATEGORY_META[slug].label}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 px-0.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Categories
          </h2>
          <ul className={`overflow-hidden ${spendCardClass}`}>
            {CATEGORY_ORDER.map((slug) => {
              const c = CATEGORY_META[slug];
              const amount = snapshot.categories[slug];
              return (
                <li key={slug} className="border-b border-zinc-100 last:border-0">
                  <Link
                    href={`/spend-overview/${slug}?m=${monthKey}`}
                    className="flex items-center gap-3 px-4 py-3.5 active:bg-zinc-50"
                    aria-label={`${c.label}, ${formatInr(amount)}`}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{
                        color: c.color,
                        backgroundColor: `${c.color}14`,
                      }}
                    >
                      <CategoryIcon kind={c.icon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-zinc-900">{c.label}</span>
                      {slug === "miscellaneous" && (
                        <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                          Not auto-categorised
                        </p>
                      )}
                    </div>
                    <div className="flex min-w-[7rem] shrink-0 flex-col items-end gap-1 text-right">
                      <span className="text-sm font-semibold tabular-nums text-zinc-900">
                        {formatInr(amount)}
                      </span>
                      {previousMonthLabel ? (
                        <CategoryMomHint mom={categoryMom[slug]} />
                      ) : null}
                    </div>
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
        </section>
      </main>
    </div>
  );
}
