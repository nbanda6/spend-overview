/** HDFC-style line icons for the home services grid */

const HDFC_BLUE = "#004C8F";

export function GridIcon({ kind }: { kind: string }) {
  const c = "h-7 w-7";
  
  switch (kind) {
    case "bill":
      // Bill Payments - Document with rupee symbol
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="2" width="16" height="20" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M8 7h8M8 11h4" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
          <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="600" fill={HDFC_BLUE}>₹</text>
        </svg>
      );
    case "transfer":
      // Money Transfer - Envelope with rupee
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 8l9 6 9-6" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="6" width="18" height="14" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="600" fill={HDFC_BLUE}>₹</text>
        </svg>
      );
    case "accounts":
      // Add Payee - Person with plus
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="10" cy="8" r="4" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M3 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="18" cy="8" r="4" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M18 6v4M16 8h4" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "upi":
      // UPI / Scan & Pay - QR style or UPI arrows
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="14" y="14" width="4" height="4" rx="0.5" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M14 21h7v-3" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "recharge":
      // Recharge - Lightning bolt in phone
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="6" y="3" width="12" height="18" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M13 8l-3 5h4l-3 5" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "upipay":
      // UPI Payment - UPI logo style with arrows
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 12h12M14 8l4 4-4 4" stroke="#138808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 12H6M10 8L6 12l4 4" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "services":
      // Services - 4 squares grid
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="8" height="8" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
        </svg>
      );
    case "spends":
      // Spends Overview - Pie chart style
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M12 3v9l6.36 6.36" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12l-6.36 6.36" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "invest":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 18V6M4 18h16M8 14l3-3 4 4 5-6" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "insurance":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s8-4.5 8-11V5l-8-3-8 3v5c0 6.5 8 11 8 11z"
            stroke={HDFC_BLUE}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "wallet":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="14" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M16 13a1 1 0 100-2 1 1 0 000 2z" fill={HDFC_BLUE} />
          <path d="M3 10h18" stroke={HDFC_BLUE} strokeWidth="1.5" />
        </svg>
      );
    case "atm":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M8 8h8M8 12h5" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="9" y="15" width="6" height="3" rx="0.5" stroke={HDFC_BLUE} strokeWidth="1.5" />
        </svg>
      );
    case "cards":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M3 10h18" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <path d="M7 14h4" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "loan":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={HDFC_BLUE} strokeWidth="1.5" />
          <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill={HDFC_BLUE}>₹</text>
        </svg>
      );
    case "demat":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 16l4-4 4 4 8-8" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 20h16" stroke={HDFC_BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "more":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6" cy="12" r="1.5" fill={HDFC_BLUE} />
          <circle cx="12" cy="12" r="1.5" fill={HDFC_BLUE} />
          <circle cx="18" cy="12" r="1.5" fill={HDFC_BLUE} />
        </svg>
      );
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke={HDFC_BLUE} strokeWidth="1.5" />
        </svg>
      );
  }
}
