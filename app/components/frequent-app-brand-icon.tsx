import type { SimpleIcon } from "simple-icons";
import {
  siAmazon,
  siBigbasket,
  siDunzo,
  siFlipkart,
  siGooglepay,
  siIndigo,
  siInstacart,
  siPaytm,
  siPhonepe,
  siRelianceindustrieslimited,
  siSwiggy,
  siUber,
  siWalmart,
  siZomato,
} from "simple-icons";

/** Flipkart wordmark SVG from Simple Icons uses brand blue; we tint it yellow to match their yellow “f” mark on white tiles. */
const FLIPKART_ICON_FILL = "#FFE11B";

type BrandKind =
  | { kind: "simple"; icon: SimpleIcon; fill?: string }
  | { kind: "blinkit" }
  | { kind: "ride" }
  | { kind: "letter"; char: string };

/** Maps merchant strings to Simple Icons data (Blinkit uses a local mark — not in Simple Icons). */
export function resolveFrequentAppBrand(merchantName: string): BrandKind {
  const l = merchantName.toLowerCase().trim();

  if (l.includes("blinkit")) return { kind: "blinkit" };
  if (l.includes("instamart")) return { kind: "simple", icon: siInstacart };
  if (l.includes("swiggy")) return { kind: "simple", icon: siSwiggy };
  if (l.includes("zomato")) return { kind: "simple", icon: siZomato };
  if (l.includes("dunzo")) return { kind: "simple", icon: siDunzo };
  if (l.includes("uber")) return { kind: "simple", icon: siUber };
  if (l.includes("ola") || l.includes("rapido")) return { kind: "ride" };
  if (l.includes("amazon")) return { kind: "simple", icon: siAmazon };
  if (l.includes("flipkart"))
    return { kind: "simple", icon: siFlipkart, fill: FLIPKART_ICON_FILL };
  if (l.includes("bigbasket")) return { kind: "simple", icon: siBigbasket };
  if (l.includes("jiomart")) return { kind: "simple", icon: siRelianceindustrieslimited };
  if (l.includes("reliance")) return { kind: "simple", icon: siRelianceindustrieslimited };
  if (l.includes("dmart") || l.includes("d-mart")) return { kind: "simple", icon: siWalmart };
  if (l.includes("indigo")) return { kind: "simple", icon: siIndigo };
  if (l.includes("phonepe") || l.includes("phone pe")) return { kind: "simple", icon: siPhonepe };
  if (l.includes("paytm")) return { kind: "simple", icon: siPaytm };
  if (l.includes("google pay") || l.includes("gpay")) return { kind: "simple", icon: siGooglepay };

  const letter = merchantName.trim().charAt(0).toUpperCase();
  return { kind: "letter", char: letter || "?" };
}

function SimplePath({
  icon,
  className,
  fill,
}: {
  icon: SimpleIcon;
  className?: string;
  fill?: string;
}) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} aria-hidden>
      <title>{icon.title}</title>
      <path d={icon.path} fill={fill ?? `#${icon.hex}`} />
    </svg>
  );
}

function RideIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 17h14v-5l-2-4H7l-2 4v5z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="2" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/** Blinkit-style quick-commerce mark (not affiliated — geometric approximation for UI). */
function BlinkitMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="5" fill="#F8C023" />
      <path
        d="M13 4L6 14h5.5l-1 6 7.5-10H13l1-6z"
        fill="#141414"
      />
    </svg>
  );
}

export function FrequentAppBrandIcon({
  merchantName,
  accentColor,
  className = "h-[18px] w-[18px]",
}: {
  merchantName: string;
  accentColor: string;
  className?: string;
}) {
  const r = resolveFrequentAppBrand(merchantName);

  switch (r.kind) {
    case "simple":
      return <SimplePath icon={r.icon} className={className} fill={r.fill} />;
    case "blinkit":
      return <BlinkitMark className={className} />;
    case "ride":
      return <RideIcon color={accentColor} className={className} />;
    case "letter":
      return (
        <span
          className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${className}`}
          style={{ backgroundColor: accentColor, fontSize: "10px" }}
          aria-hidden
        >
          {r.char}
        </span>
      );
  }
}
