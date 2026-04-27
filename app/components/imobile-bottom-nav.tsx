import Link from "next/link";
import { HDFC } from "@/app/theme/icici-light";

const navItems = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "#", label: "Funds Transfer", icon: "transfer" as const },
  { href: "#", label: "Pay Bills", icon: "bill" as const },
  { href: "#", label: "More", icon: "more" as const },
];

type IconKind = (typeof navItems)[number]["icon"];

function NavIcon({ kind }: { kind: IconKind }) {
  const s = "h-6 w-6";
  const stroke = "currentColor";
  switch (kind) {
    case "home":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "transfer":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17 4l4 4-4 4M3 8h18M7 20l-4-4 4-4M21 16H3"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bill":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <rect x="9" y="3" width="6" height="4" rx="1" stroke={stroke} strokeWidth="1.5" />
          <path d="M9 12h6M9 16h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "more":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="1.5" fill={stroke} />
          <circle cx="12" cy="6" r="1.5" fill={stroke} />
          <circle cx="12" cy="18" r="1.5" fill={stroke} />
        </svg>
      );
    default:
      return null;
  }
}

export function ImobileBottomNav() {
  return (
    <nav
      className="relative z-30 mt-auto flex h-[68px] w-full shrink-0 items-center justify-around border-t border-zinc-200 bg-white px-2 pb-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      aria-label="Primary"
    >
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium"
          style={{ color: item.icon === "home" ? HDFC.navyBlue : "#64748B" }}
        >
          <NavIcon kind={item.icon} />
          <span className="max-w-[4.5rem] text-center">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
