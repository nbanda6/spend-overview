import Link from "next/link";
import { HDFC, spendCardClass } from "@/lib/icici-spend";

const SERVICE_LIST = [
  {
    href: "/spend-overview?from=services",
    title: "Spend Overview",
    subtitle: "Track spends by category",
    icon: "donut" as const,
    accent: HDFC.accentBlue,
  },
  {
    href: "#",
    title: "Account Services",
    subtitle: "Statements, nominees & more",
    icon: "doc" as const,
    accent: "#1a1a1a",
  },
  {
    href: "#",
    title: "Cheque Services",
    subtitle: "Request, stop cheque",
    icon: "cheque" as const,
    accent: "#1a1a1a",
  },
  {
    href: "#",
    title: "Tax & Finance",
    subtitle: "Tax planning tools",
    icon: "tax" as const,
    accent: "#1a1a1a",
  },
  {
    href: "#",
    title: "Safety & Security",
    subtitle: "Limits, alerts, devices",
    icon: "lock" as const,
    accent: "#1a1a1a",
  },
  {
    href: "#",
    title: "Customer Care",
    subtitle: "Help & support",
    icon: "help" as const,
    accent: "#1a1a1a",
  },
];

function ListIcon({
  kind,
  accent,
}: {
  kind: (typeof SERVICE_LIST)[number]["icon"];
  accent: string;
}) {
  const c = "h-6 w-6";
  const stroke = "currentColor";
  const color = accent;
  switch (kind) {
    case "donut":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" opacity="0.2" />
            <path
              d="M12 3a9 9 0 019 9"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="4" fill="white" stroke={stroke} strokeWidth="1.75" />
          </svg>
        </span>
      );
    case "doc":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <path
              d="M7 3h7l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
              stroke={stroke}
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path d="M9 12h6M9 16h4" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "cheque":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke={stroke} strokeWidth="1.75" />
            <path d="M7 10h10M7 14h6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "tax":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <path
              d="M12 3v18M8 7h8M8 11h5"
              stroke={stroke}
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.75" opacity="0.35" />
          </svg>
        </span>
      );
    case "lock":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <rect x="6" y="10" width="12" height="10" rx="2" stroke={stroke} strokeWidth="1.75" />
            <path
              d="M8 10V8a4 4 0 018 0v2"
              stroke={stroke}
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
      );
    case "help":
      return (
        <span className={c} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
            <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.75" />
            <path
              d="M9.5 9.5a2.5 2.5 0 114.2 1.8c-.7.6-1.2 1.2-1.2 2.2H11"
              stroke={stroke}
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="0.75" fill={stroke} />
          </svg>
        </span>
      );
  }
}

export const metadata = {
  title: "Services | iMobile",
};

export default function ServicesPage() {
  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      style={{ backgroundColor: "#F5F6F8" }}
    >
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-3 pb-3.5 pt-[52px] text-white shadow-md"
        style={{
          background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
        }}
      >
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Back"
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
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
            HDFC Bank
          </p>
          <h1 className="text-lg font-semibold leading-tight">Services</h1>
        </div>
      </header>

      <main className="px-0 pb-8 pt-2">
        <p className="px-4 pb-3 text-sm text-zinc-600">
          Choose a service. <span className="font-medium text-zinc-900">Spend Overview</span> opens
          the spending dashboard.
        </p>
        <ul className={`mx-4 overflow-hidden divide-y divide-zinc-100 rounded-2xl ${spendCardClass}`}>
          {SERVICE_LIST.map((item) => {
            const row = (
              <>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100"
                  style={{ color: item.accent }}
                >
                  <ListIcon kind={item.icon} accent={item.accent} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{item.subtitle}</p>
                </div>
                <span className="text-zinc-300" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </>
            );
            const base =
              "flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-zinc-50";
            return (
              <li key={item.title}>
                {item.href !== "#" ? (
                  <Link href={item.href} className={base}>
                    {row}
                  </Link>
                ) : (
                  <div className={base + " cursor-default opacity-75"} role="presentation">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
