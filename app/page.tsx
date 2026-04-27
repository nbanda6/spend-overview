import Link from "next/link";
import { ImobileBottomNav } from "@/app/components/imobile-bottom-nav";
import { GridIcon } from "@/app/components/home-grid-icons";
import { HDFC } from "@/app/theme/icici-light";

const GRID_ITEMS = [
  { lines: ["Bill", "Payments"], icon: "bill", href: "#" },
  { lines: ["Money", "Transfer"], icon: "transfer", href: "#" },
  { lines: ["Add Payee"], icon: "accounts", href: "#" },
  { lines: ["Scan & Pay"], icon: "upi", href: "#" },
  { lines: ["Recharge"], icon: "recharge", href: "#" },
  { lines: ["UPI", "Payment"], icon: "upipay", href: "#" },
  { lines: ["Spends", "Overview"], icon: "spends", href: "/spend-overview?from=home" },
  { lines: ["Services"], icon: "services", href: "/services" },
] as const;

function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-6 pb-1 pt-0 text-[14px] font-semibold text-white">
      {/* Time - left side */}
      <span className="tabular-nums tracking-tight">10:13</span>
      
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

export default function HomePage() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ backgroundColor: HDFC.pageBg }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        {/* Hero — navy blue header */}
        <div
          className="px-4 pb-4 pt-[14px] text-white"
          style={{
            background: `linear-gradient(180deg, ${HDFC.headerGradientFrom} 0%, ${HDFC.headerGradientTo} 100%)`,
          }}
        >
          <StatusBar />

          {/* Menu bar */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" className="p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-xs text-white/80">Menu</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="p-1 text-white/90">?</button>
              <button type="button" className="p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex border-b border-white/20">
            <button 
              type="button" 
              className="flex-1 border-b-2 border-white pb-2 text-center text-sm font-semibold text-white"
            >
              OVERVIEW
            </button>
            <button 
              type="button" 
              className="flex-1 pb-2 text-center text-sm font-medium text-white/60"
            >
              FAVOURITE
            </button>
          </div>
        </div>

        {/* Accounts Card */}
        <div className="px-4 -mt-0">
          <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-bold text-zinc-900">ACCOUNTS</h2>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: HDFC.accentBlue }}>
                  Savings Account
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900">
                  ₹ 4,040.00
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="text-zinc-400">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2.5 text-center text-sm font-semibold"
              style={{ color: HDFC.accentBlue }}
            >
              View All
            </button>
          </div>
        </div>

        {/* Service grid */}
        <div className="px-4 pb-4 pt-5">
          <div className="grid grid-cols-3 gap-x-4 gap-y-5">
            {GRID_ITEMS.map((tile) => {
              const inner = (
                <>
                  <div 
                    className="mb-2 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
                  >
                    <GridIcon kind={tile.icon} />
                  </div>
                  <div className="text-center text-[11px] font-medium leading-snug text-zinc-700">
                    {tile.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </>
              );
              const cardClass = "flex flex-col items-center py-2 transition active:scale-[0.97]";
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

        {/* Due Bills Section */}
        <div className="border-t-4 border-zinc-200 bg-white px-4 py-4">
          <h3 className="text-base font-bold text-zinc-900">Due Bills</h3>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Register your billers and pay all your bills<br />with 2 clicks
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-lg py-3 text-center text-sm font-semibold text-white"
            style={{ backgroundColor: HDFC.navyBlue }}
          >
            ADD BILLER
          </button>
        </div>
      </div>

      <ImobileBottomNav />
    </div>
  );
}
