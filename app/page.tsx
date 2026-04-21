import Link from "next/link";
import { ImobileBottomNav } from "@/app/components/imobile-bottom-nav";
import { GridIcon } from "@/app/components/home-grid-icons";
import { ICICI_LIGHT } from "@/app/theme/icici-light";

const TABS = ["Statement", "Manage", "Spends", "Mutual"] as const;

const GRID_ITEMS = [
  { lines: ["Send Money"], icon: "transfer", href: "#" },
  { lines: ["Pay Bills &", "Recharge"], icon: "bill", href: "#" },
  { lines: ["Get Instant", "Loans/Offers"], icon: "loan", href: "#" },
  { lines: ["Accounts &", "FD/RD"], icon: "accounts", href: "#" },
  { lines: ["Cards/Forex/", "Paylater"], icon: "cards", href: "#" },
  { lines: ["Loans"], icon: "loan", href: "#" },
  { lines: ["Demat/Mutual", "Funds"], icon: "demat", href: "#" },
  { lines: ["UPI", "Payments"], icon: "upi", href: "#" },
  { lines: ["Services"], icon: "services", href: "/services" },
] as const;

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-1 pb-2 pt-1 text-[13px] font-semibold text-white">
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5 pr-1">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden className="text-white">
          <path
            d="M1 9.5h2.5v2H1v-2zm4-2h2.5v4H5v-4zm4-3h2.5v7H9v-7zm4-2h2.5v9h-2.5V2.5z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden className="text-white">
          <path
            d="M8 2.5c2.5 1.8 4 4 4 6a4 4 0 11-8 0c0-2 1.5-4.2 4-6z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
        <div className="flex h-[11px] w-6 items-center rounded-sm border border-white/80 px-[2px]">
          <div className="h-[7px] flex-1 rounded-[1px] bg-white" />
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ backgroundColor: ICICI_LIGHT.pageBg }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        {/* Hero — orange header (reference light theme) */}
        <div
          className="px-4 pb-5 pt-1 text-white"
          style={{
            background: `linear-gradient(165deg, ${ICICI_LIGHT.headerGradientFrom} 0%, ${ICICI_LIGHT.orange} 42%, ${ICICI_LIGHT.orangeDark} 100%)`,
          }}
        >
          <StatusBar />

          <h1 className="mt-2 text-lg font-semibold tracking-tight">Savings portfolio</h1>

          <div className="mt-4 rounded-[1.25rem] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  ICICI Bank
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-zinc-800">Savings — XXXX 1288</p>
              </div>
              <span className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600">
                Primary
              </span>
            </div>
            <p className="mt-3 text-[1.65rem] font-bold tabular-nums leading-tight tracking-tight text-zinc-900">
              ₹ 12,34,560.00
            </p>
            <p className="mt-1 text-[13px] text-zinc-500">Total savings balance</p>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition active:scale-[0.99]"
              style={{
                backgroundColor: "rgba(255, 107, 53, 0.1)",
                color: ICICI_LIGHT.orangeDark,
              }}
            >
              <span>View total savings</span>
              <ChevronRight className="opacity-80" />
            </button>
          </div>

          <div
            className="mt-5 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Portfolio sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={tab === "Spends"}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                  tab === "Spends"
                    ? "bg-white text-[#E85A28] shadow-md"
                    : "text-white/90 ring-1 ring-white/35 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Assistance banner */}
        <div className="bg-white px-4 pb-2 pt-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <Link
            href="#"
            className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-white shadow-md transition active:scale-[0.99]"
            style={{
              background: `linear-gradient(90deg, ${ICICI_LIGHT.orange} 0%, ${ICICI_LIGHT.orangeDark} 100%)`,
            }}
          >
            <span className="text-[13px] font-semibold">Need help? 1800 1080</span>
            <ChevronRight className="text-white/90" />
          </Link>
        </div>

        {/* Service grid */}
        <div className="px-4 pb-8 pt-5">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Quick services
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {GRID_ITEMS.map((tile) => {
              const inner = (
                <>
                  <div className="mb-2.5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white text-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-zinc-200/80">
                    <GridIcon kind={tile.icon} />
                  </div>
                  <div className="text-center text-[10px] font-semibold leading-snug text-zinc-900">
                    {tile.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </>
              );
              const cardClass =
                "flex flex-col items-center rounded-2xl border border-white bg-white px-1.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition active:scale-[0.97] active:shadow-md";
              return tile.href !== "#" ? (
                <Link key={tile.lines.join("-")} href={tile.href} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div key={tile.lines.join("-")} className={cardClass + " cursor-default"}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ImobileBottomNav />
    </div>
  );
}
