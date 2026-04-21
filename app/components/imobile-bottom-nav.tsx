import Link from "next/link";
import { ICICI_LIGHT } from "@/app/theme/icici-light";

const leftItems = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "#", label: "Scan QR", icon: "scan" as const },
];

const rightItems = [
  { href: "#", label: "Contact", icon: "contact" as const },
  { href: "#", label: "Smart Loan", icon: "loan" as const },
];

type IconKind =
  | (typeof leftItems)[number]["icon"]
  | (typeof rightItems)[number]["icon"]
  | "center";

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
    case "scan":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 7H5v2M17 7h2v2M7 17H5v-2M17 17h2v-2"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect x="8" y="8" width="8" height="8" rx="1" stroke={stroke} strokeWidth="1.75" />
        </svg>
      );
    case "contact":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8.5 3.5c-.8 0-1.5.6-1.5 1.4 0 3.2 1.3 6.2 3.6 8.5 2.3 2.3 5.3 3.6 8.5 3.6.8 0 1.4-.7 1.4-1.5v-2.2c0-.4-.3-.8-.7-.9l-3-1.2c-.4-.15-.9 0-1.1.4l-.7 1.4c-1.8-.9-3.2-2.3-4.1-4.1l1.4-.7c.4-.2.55-.7.4-1.1l-1.2-3c-.1-.4-.5-.7-.9-.7h-2.2z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "loan":
      return (
        <svg className={s} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v18M8 8h11M8 16h7"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" opacity="0.35" />
        </svg>
      );
    case "center":
      return (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 4h13v16H8V4zM4 8h4v12H4V8z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M11 9h6M11 13h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function ImobileBottomNav() {
  return (
    <nav
      className="relative z-30 mt-auto flex h-[72px] w-full shrink-0 items-end justify-between border-t border-white/15 px-1.5 pb-1.5 pt-1 text-white shadow-[0_-8px_28px_rgba(0,0,0,0.12)]"
      style={{
        background: `linear-gradient(180deg, ${ICICI_LIGHT.orange} 0%, ${ICICI_LIGHT.orangeDark} 100%)`,
      }}
      aria-label="Primary"
    >
      {leftItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-1 flex-col items-center gap-0.5 pb-1 text-[9px] font-semibold leading-tight text-white/95"
        >
          <NavIcon kind={item.icon} />
          <span className="max-w-[4.5rem] text-center">{item.label}</span>
        </Link>
      ))}

      <div className="relative flex flex-1 flex-col items-center justify-end pb-1">
        <Link
          href="#"
          className="absolute -top-8 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-lg ring-[4px] ring-white/35"
          style={{ color: ICICI_LIGHT.orangeDark }}
          aria-label="My Requests"
        >
          <NavIcon kind="center" />
        </Link>
        <span className="mt-8 max-w-[5rem] text-center text-[9px] font-bold leading-tight text-white">
          My Requests
        </span>
      </div>

      {rightItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-1 flex-col items-center gap-0.5 pb-1 text-[9px] font-semibold leading-tight text-white/95"
        >
          <NavIcon kind={item.icon} />
          <span className="max-w-[4.5rem] text-center">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
