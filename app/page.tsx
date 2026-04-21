import Link from "next/link";
import { ImobileBottomNav } from "@/app/components/imobile-bottom-nav";
import { GridIcon } from "@/app/components/home-grid-icons";
import { ICICI_LIGHT } from "@/app/theme/icici-light";

const GRID_ITEMS = [
  { lines: ["Send Money"], icon: "transfer", href: "#" },
  { lines: ["Pay Bills &", "Recharge"], icon: "bill", href: "#" },
  { lines: ["Get Instant", "Loans/Offers"], icon: "loan", href: "#" },
  { lines: ["Accounts &", "FD/RD"], icon: "accounts", href: "#" },
  { lines: ["Spends", "Overview"], icon: "spends", href: "/spend-overview?from=home" },
  { lines: ["Loans"], icon: "loan", href: "#" },
  { lines: ["Demat/Mutual", "Funds"], icon: "demat", href: "#" },
  { lines: ["UPI", "Payments"], icon: "upi", href: "#" },
  { lines: ["Services"], icon: "services", href: "/services" },
] as const;

function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-6 pb-1 pt-0 text-[14px] font-semibold text-white">
      {/* Time - left side */}
      <span className="tabular-nums tracking-tight">9:41</span>
      
      {/* Space for Dynamic Island in center */}
      <div className="w-[126px]" />
      
      {/* Status icons - right side */}
      <div className="flex items-center gap-[5px]">
        {/* Signal bars */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden className="text-white">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="4" y="5.5" width="3" height="6.5" rx="0.5" fill="currentColor" />
          <rect x="8" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden className="text-white">
          <path d="M8 2.4c3.1 0 5.8 1.4 7.5 3.5l-1.3 1.4C12.8 5.5 10.5 4.4 8 4.4S3.2 5.5 1.8 7.3L.5 5.9C2.2 3.8 4.9 2.4 8 2.4z" fill="currentColor" />
          <path d="M8 6c1.9 0 3.6.9 4.7 2.2l-1.3 1.4C10.5 8.6 9.3 8 8 8s-2.5.6-3.4 1.6L3.3 8.2C4.4 6.9 6.1 6 8 6z" fill="currentColor" />
          <circle cx="8" cy="11" r="1.5" fill="currentColor" />
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="flex h-[12px] w-[24px] items-center rounded-[3px] border-[1.5px] border-white px-[2px]">
            <div className="h-[7px] w-full rounded-[1.5px] bg-white" />
          </div>
          <div className="ml-[1px] h-[5px] w-[1.5px] rounded-r-sm bg-white" />
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
        {/* Hero — orange header overlapping dynamic island */}
        <div
          className="px-4 pb-5 pt-[14px] text-white"
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
