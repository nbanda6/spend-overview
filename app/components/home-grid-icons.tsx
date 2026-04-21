/** Line-style icons for the home 3×3 services grid */

export function GridIcon({ kind }: { kind: string }) {
  const c = "h-7 w-7";
  const stroke = "currentColor";
  switch (kind) {
    case "transfer":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 7h10M7 7l2.5-2.5M7 7l2.5 2.5M17 17H7M17 17l-2.5-2.5M17 17l-2.5 2.5"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bill":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4h10v16l-3-2-3 2-3-2-3 2V4z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M9 8h6M9 12h4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "invest":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 18V6M4 18h16M8 14l3-3 4 4 5-6" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "insurance":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s8-4.5 8-11V5l-8-3-8 3v5c0 6.5 8 11 8 11z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "services":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.75" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.75" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.75" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.75" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 8a2 2 0 012-2h11l4 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M17 12h2" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "atm":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={stroke} strokeWidth="1.75" />
          <path d="M8 8h8M8 12h5" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
          <rect x="9" y="15" width="6" height="3" rx="0.5" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "cards":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={stroke} strokeWidth="1.75" />
          <path d="M3 10h18" stroke={stroke} strokeWidth="1.75" />
        </svg>
      );
    case "more":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6" cy="12" r="1.5" fill={stroke} />
          <circle cx="12" cy="12" r="1.5" fill={stroke} />
          <circle cx="18" cy="12" r="1.5" fill={stroke} />
        </svg>
      );
    case "loan":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v18M8 8h11M8 16h7"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" opacity="0.3" />
        </svg>
      );
    case "upi":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 4L4 8v8l8 4 8-4V8l-8-4z"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M12 8v8M9 11h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "accounts":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 19V9l8-4 8 4v10M4 19h16M4 19v-5h16v5"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 14h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "demat":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 16l4-4 4 4 8-8" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 20h16" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.75" />
        </svg>
      );
  }
}
