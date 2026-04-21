/** ICICI iMobile–style Spend Overview — shared types & month-based data */

export const ICICI = {
  maroon: "#7A1538",
  /** Primary accent — aligned with iMobile light theme orange */
  orange: "#FF6B35",
  orangeDark: "#E85A28",
  oceanBlue: "#0B4A7F",
  teal: "#0F8A8A",
  misc: "#64748B",
  /** Headers: orange gradient (light-theme prototype) */
  headerFrom: "#FF7A45",
  headerTo: "#E85A28",
  maroonGradientFrom: "#5C0F2A",
  maroonGradientTo: "#8B1E42",
} as const;

export type CategorySlug =
  | "shopping"
  | "food-dining"
  | "utilities"
  | "travel"
  | "miscellaneous";

export const CATEGORY_ORDER: CategorySlug[] = [
  "shopping",
  "food-dining",
  "utilities",
  "travel",
  "miscellaneous",
];

export type CategoryIconKind = "bag" | "fork" | "bulb" | "plane" | "misc";

export const CATEGORY_META: Record<
  CategorySlug,
  { label: string; color: string; icon: CategoryIconKind; drillHint: string }
> = {
  shopping: {
    label: "Shopping",
    color: ICICI.maroon,
    icon: "bag",
    drillHint: "Online & retail purchases",
  },
  "food-dining": {
    label: "Food & Dining",
    color: ICICI.orange,
    icon: "fork",
    drillHint: "Groceries, dining & UPI merchants",
  },
  utilities: {
    label: "Utilities",
    color: ICICI.oceanBlue,
    icon: "bulb",
    drillHint: "Bills & subscriptions",
  },
  travel: {
    label: "Travel",
    color: ICICI.teal,
    icon: "plane",
    drillHint: "Commute & travel",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: ICICI.misc,
    icon: "misc",
    drillHint: "Spend we couldn’t auto-categorise",
  },
};

/** @deprecated Use CATEGORY_META — kept for metadata / title helpers */
export const CATEGORIES = CATEGORY_META;

export type TxRow = {
  merchant: string;
  date: string;
  amount: number;
  initials: string;
  channel?: "UPI" | "Card" | "Net Banking";
};

export const MONTH_KEYS = [
  "jan2026",
  "feb2026",
  "mar2026",
  "apr2026",
  "may2026",
] as const;
export type MonthKey = (typeof MONTH_KEYS)[number];

export const DEFAULT_MONTH: MonthKey = "apr2026";

export const MONTHS: { key: MonthKey; label: string; short: string }[] = [
  { key: "jan2026", label: "January 2026", short: "Jan" },
  { key: "feb2026", label: "February 2026", short: "Feb" },
  { key: "mar2026", label: "March 2026", short: "Mar" },
  { key: "apr2026", label: "April 2026", short: "Apr" },
  { key: "may2026", label: "May 2026", short: "May" },
];

export const TRANSACTIONS_BY_MONTH: Record<
  MonthKey,
  Record<CategorySlug, TxRow[]>
> = {
  jan2026: {
    shopping: [
      { merchant: "Amazon", date: "28 Jan 2026", amount: 2100, initials: "A", channel: "Card" },
      { merchant: "Myntra", date: "22 Jan 2026", amount: 1899, initials: "M", channel: "UPI" },
      { merchant: "Flipkart", date: "15 Jan 2026", amount: 3420, initials: "F", channel: "Card" },
    ],
    "food-dining": [
      {
        merchant: "BigBasket",
        date: "29 Jan 2026",
        amount: 1240,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "JioMart",
        date: "26 Jan 2026",
        amount: 890,
        initials: "J",
        channel: "UPI",
      },
      { merchant: "Zomato", date: "20 Jan 2026", amount: 560, initials: "Z", channel: "UPI" },
      {
        merchant: "Local Kirana (UPI)",
        date: "18 Jan 2026",
        amount: 420,
        initials: "L",
        channel: "UPI",
      },
      { merchant: "Swiggy", date: "12 Jan 2026", amount: 780, initials: "S", channel: "UPI" },
    ],
    utilities: [
      {
        merchant: "Electricity (BESCOM)",
        date: "25 Jan 2026",
        amount: 2800,
        initials: "E",
        channel: "Net Banking",
      },
      { merchant: "Airtel Mobile", date: "08 Jan 2026", amount: 799, initials: "A", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "30 Jan 2026", amount: 280, initials: "U", channel: "UPI" },
      { merchant: "Petrol (IOCL)", date: "14 Jan 2026", amount: 2200, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      {
        merchant: "POS — uncategorised",
        date: "27 Jan 2026",
        amount: 199,
        initials: "P",
        channel: "Card",
      },
      {
        merchant: "Wallet adjustment",
        date: "05 Jan 2026",
        amount: 49,
        initials: "W",
        channel: "UPI",
      },
    ],
  },
  feb2026: {
    shopping: [
      { merchant: "Amazon", date: "26 Feb 2026", amount: 4100, initials: "A", channel: "Card" },
      { merchant: "Croma", date: "19 Feb 2026", amount: 8999, initials: "C", channel: "Card" },
      { merchant: "Flipkart", date: "07 Feb 2026", amount: 1750, initials: "F", channel: "UPI" },
    ],
    "food-dining": [
      {
        merchant: "Blinkit",
        date: "27 Feb 2026",
        amount: 640,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "MORE Retail",
        date: "24 Feb 2026",
        amount: 1120,
        initials: "M",
        channel: "UPI",
      },
      { merchant: "Swiggy Instamart", date: "21 Feb 2026", amount: 980, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "14 Feb 2026", amount: 1420, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "10 Feb 2026", amount: 2650, initials: "D", channel: "Card" },
    ],
    utilities: [
      {
        merchant: "Gas (Indane)",
        date: "22 Feb 2026",
        amount: 1100,
        initials: "G",
        channel: "UPI",
      },
      { merchant: "Broadband (ACT)", date: "03 Feb 2026", amount: 1499, initials: "A", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "28 Feb 2026", amount: 510, initials: "U", channel: "UPI" },
      { merchant: "Rapido", date: "16 Feb 2026", amount: 180, initials: "R", channel: "UPI" },
      { merchant: "Petrol (HP)", date: "08 Feb 2026", amount: 3000, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      {
        merchant: "Unknown merchant ******912",
        date: "18 Feb 2026",
        amount: 350,
        initials: "U",
        channel: "Card",
      },
      { merchant: "SMS charges", date: "01 Feb 2026", amount: 15, initials: "S", channel: "Card" },
    ],
  },
  mar2026: {
    shopping: [
      { merchant: "Amazon", date: "30 Mar 2026", amount: 2890, initials: "A", channel: "Card" },
      { merchant: "Nykaa", date: "25 Mar 2026", amount: 1599, initials: "N", channel: "UPI" },
      { merchant: "Flipkart", date: "12 Mar 2026", amount: 5200, initials: "F", channel: "Card" },
      { merchant: "Reliance Digital", date: "05 Mar 2026", amount: 4500, initials: "R", channel: "Card" },
    ],
    "food-dining": [
      {
        merchant: "BigBasket",
        date: "29 Mar 2026",
        amount: 2100,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "JioMart",
        date: "27 Mar 2026",
        amount: 1450,
        initials: "J",
        channel: "UPI",
      },
      {
        merchant: "FreshToHome",
        date: "22 Mar 2026",
        amount: 890,
        initials: "F",
        channel: "UPI",
      },
      { merchant: "Swiggy", date: "19 Mar 2026", amount: 1340, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "08 Mar 2026", amount: 760, initials: "Z", channel: "UPI" },
    ],
    utilities: [
      {
        merchant: "Electricity (BESCOM)",
        date: "18 Mar 2026",
        amount: 3100,
        initials: "E",
        channel: "Net Banking",
      },
      { merchant: "Water board", date: "10 Mar 2026", amount: 890, initials: "W", channel: "UPI" },
      { merchant: "Jio Mobile", date: "05 Mar 2026", amount: 749, initials: "J", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "31 Mar 2026", amount: 390, initials: "U", channel: "UPI" },
      { merchant: "IndiGo", date: "15 Mar 2026", amount: 4200, initials: "I", channel: "Card" },
      { merchant: "Petrol (Shell)", date: "09 Mar 2026", amount: 2800, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      {
        merchant: "Cross-border fee",
        date: "21 Mar 2026",
        amount: 225,
        initials: "C",
        channel: "Card",
      },
      {
        merchant: "ATM surcharge",
        date: "11 Mar 2026",
        amount: 24,
        initials: "A",
        channel: "Card",
      },
    ],
  },
  apr2026: {
    shopping: [
      { merchant: "Amazon", date: "18 Apr 2026", amount: 6240, initials: "A", channel: "Card" },
      { merchant: "Flipkart", date: "12 Apr 2026", amount: 4890, initials: "F", channel: "Card" },
      { merchant: "Amazon", date: "03 Apr 2026", amount: 3870, initials: "A", channel: "UPI" },
      { merchant: "Myntra", date: "01 Apr 2026", amount: 2199, initials: "M", channel: "UPI" },
    ],
    "food-dining": [
      {
        merchant: "BigBasket",
        date: "20 Apr 2026",
        amount: 1850,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "JioMart",
        date: "19 Apr 2026",
        amount: 920,
        initials: "J",
        channel: "UPI",
      },
      {
        merchant: "Blinkit",
        date: "18 Apr 2026",
        amount: 640,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "MORE Retail",
        date: "17 Apr 2026",
        amount: 780,
        initials: "M",
        channel: "UPI",
      },
      {
        merchant: "Local Kirana (UPI)",
        date: "16 Apr 2026",
        amount: 450,
        initials: "L",
        channel: "UPI",
      },
      {
        merchant: "Swiggy Instamart",
        date: "14 Apr 2026",
        amount: 1100,
        initials: "S",
        channel: "UPI",
      },
      { merchant: "Zomato", date: "13 Apr 2026", amount: 890, initials: "Z", channel: "UPI" },
      { merchant: "Swiggy", date: "11 Apr 2026", amount: 1240, initials: "S", channel: "UPI" },
      { merchant: "DMart", date: "09 Apr 2026", amount: 2650, initials: "D", channel: "Card" },
      { merchant: "Zomato", date: "08 Apr 2026", amount: 670, initials: "Z", channel: "UPI" },
      { merchant: "Swiggy", date: "02 Apr 2026", amount: 2100, initials: "S", channel: "UPI" },
    ],
    utilities: [
      {
        merchant: "Electricity (BESCOM)",
        date: "14 Apr 2026",
        amount: 3200,
        initials: "E",
        channel: "Net Banking",
      },
      { merchant: "Gas (Indane)", date: "10 Apr 2026", amount: 1850, initials: "G", channel: "UPI" },
      { merchant: "Mobile (Airtel)", date: "05 Apr 2026", amount: 799, initials: "M", channel: "UPI" },
      { merchant: "Broadband", date: "01 Apr 2026", amount: 2151, initials: "B", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "20 Apr 2026", amount: 420, initials: "U", channel: "UPI" },
      { merchant: "Petrol (HP)", date: "16 Apr 2026", amount: 3500, initials: "P", channel: "Card" },
      { merchant: "IndiGo", date: "09 Apr 2026", amount: 2850, initials: "I", channel: "Card" },
      { merchant: "Uber", date: "04 Apr 2026", amount: 730, initials: "U", channel: "UPI" },
      { merchant: "Metro recharge", date: "03 Apr 2026", amount: 500, initials: "M", channel: "UPI" },
    ],
    miscellaneous: [
      {
        merchant: "Unknown POS ******441",
        date: "22 Apr 2026",
        amount: 499,
        initials: "U",
        channel: "Card",
      },
      {
        merchant: "International txn fee",
        date: "15 Apr 2026",
        amount: 89,
        initials: "I",
        channel: "Card",
      },
      {
        merchant: "Wallet load (misc)",
        date: "06 Apr 2026",
        amount: 200,
        initials: "W",
        channel: "UPI",
      },
    ],
  },
  may2026: {
    shopping: [
      { merchant: "Amazon", date: "28 May 2026", amount: 8900, initials: "A", channel: "Card" },
      { merchant: "Flipkart", date: "20 May 2026", amount: 3200, initials: "F", channel: "UPI" },
      { merchant: "IKEA", date: "12 May 2026", amount: 7600, initials: "I", channel: "Card" },
      { merchant: "Croma", date: "05 May 2026", amount: 12999, initials: "C", channel: "Card" },
    ],
    "food-dining": [
      {
        merchant: "BigBasket",
        date: "29 May 2026",
        amount: 2400,
        initials: "B",
        channel: "UPI",
      },
      {
        merchant: "Nature's Basket",
        date: "25 May 2026",
        amount: 1800,
        initials: "N",
        channel: "Card",
      },
      {
        merchant: "JioMart",
        date: "23 May 2026",
        amount: 990,
        initials: "J",
        channel: "UPI",
      },
      { merchant: "Zomato", date: "18 May 2026", amount: 2100, initials: "Z", channel: "UPI" },
      { merchant: "Swiggy", date: "10 May 2026", amount: 4500, initials: "S", channel: "UPI" },
    ],
    utilities: [
      {
        merchant: "Electricity (BESCOM)",
        date: "22 May 2026",
        amount: 3600,
        initials: "E",
        channel: "Net Banking",
      },
      { merchant: "DTH (Tata Play)", date: "08 May 2026", amount: 450, initials: "D", channel: "UPI" },
      { merchant: "Insurance (auto-debit)", date: "02 May 2026", amount: 8200, initials: "I", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "30 May 2026", amount: 680, initials: "U", channel: "UPI" },
      { merchant: "Ola", date: "24 May 2026", amount: 520, initials: "O", channel: "UPI" },
      { merchant: "Petrol (BP)", date: "14 May 2026", amount: 4100, initials: "P", channel: "Card" },
      { merchant: "Vistara", date: "06 May 2026", amount: 8900, initials: "V", channel: "Card" },
    ],
    miscellaneous: [
      {
        merchant: "Unmatched UPI beneficiary",
        date: "27 May 2026",
        amount: 750,
        initials: "U",
        channel: "UPI",
      },
      {
        merchant: "Service fee",
        date: "04 May 2026",
        amount: 118,
        initials: "S",
        channel: "Card",
      },
    ],
  },
};

export type SpendSnapshot = {
  monthKey: MonthKey;
  monthLabel: string;
  total: number;
  categories: Record<CategorySlug, number>;
  transactions: Record<CategorySlug, TxRow[]>;
};

/** Month-over-month vs the immediately previous month in the dataset */
export type MomChange = {
  hasPrevious: boolean;
  direction: "up" | "down" | "flat";
  /** Rounded for display; meaning depends on `variant` */
  pct: number;
  variant: "normal" | "new" | "cleared";
};

export function getPreviousMonthKey(key: MonthKey): MonthKey | null {
  const i = MONTH_KEYS.indexOf(key);
  if (i <= 0) return null;
  return MONTH_KEYS[i - 1]!;
}

export function computeMomChange(current: number, previous: number): MomChange {
  if (previous <= 0 && current <= 0) {
    return {
      hasPrevious: true,
      direction: "flat",
      pct: 0,
      variant: "normal",
    };
  }
  if (previous <= 0 && current > 0) {
    return {
      hasPrevious: true,
      direction: "up",
      pct: 0,
      variant: "new",
    };
  }
  if (previous > 0 && current <= 0) {
    return {
      hasPrevious: true,
      direction: "down",
      pct: 100,
      variant: "cleared",
    };
  }
  const raw = ((current - previous) / previous) * 100;
  const rounded = Math.round(raw * 10) / 10;
  if (Math.abs(rounded) < 0.5) {
    return {
      hasPrevious: true,
      direction: "flat",
      pct: 0,
      variant: "normal",
    };
  }
  return {
    hasPrevious: true,
    direction: rounded > 0 ? "up" : "down",
    pct: Math.abs(rounded),
    variant: "normal",
  };
}

export function formatMomPct(pct: number): string {
  if (!Number.isFinite(pct)) return "0";
  const r = Math.round(pct * 10) / 10;
  if (Math.abs(r - Math.round(r)) < 0.05) return String(Math.round(r));
  return r.toFixed(1);
}

export type SpendInsight = {
  snapshot: SpendSnapshot;
  previousMonthKey: MonthKey | null;
  previousMonthLabel: string | null;
  totalMom: MomChange;
  categoryMom: Record<CategorySlug, MomChange>;
};

export function getSpendInsight(monthKey: MonthKey): SpendInsight {
  const snapshot = getSpendSnapshot(monthKey);
  const prevKey = getPreviousMonthKey(monthKey);
  if (!prevKey) {
    const empty: MomChange = {
      hasPrevious: false,
      direction: "flat",
      pct: 0,
      variant: "normal",
    };
    return {
      snapshot,
      previousMonthKey: null,
      previousMonthLabel: null,
      totalMom: empty,
      categoryMom: Object.fromEntries(
        CATEGORY_ORDER.map((s) => [s, { ...empty }]),
      ) as Record<CategorySlug, MomChange>,
    };
  }
  const prev = getSpendSnapshot(prevKey);
  const totalMom = computeMomChange(snapshot.total, prev.total);
  const categoryMom = {} as Record<CategorySlug, MomChange>;
  for (const slug of CATEGORY_ORDER) {
    categoryMom[slug] = computeMomChange(
      snapshot.categories[slug],
      prev.categories[slug],
    );
  }
  return {
    snapshot,
    previousMonthKey: prevKey,
    previousMonthLabel: prev.monthLabel,
    totalMom,
    categoryMom,
  };
}

export function getSpendSnapshot(monthKey: MonthKey): SpendSnapshot {
  const txMap = TRANSACTIONS_BY_MONTH[monthKey];
  const categories = {} as Record<CategorySlug, number>;
  for (const slug of CATEGORY_ORDER) {
    categories[slug] = txMap[slug].reduce((s, t) => s + t.amount, 0);
  }
  const total = CATEGORY_ORDER.reduce((sum, k) => sum + categories[k], 0);
  const monthLabel = MONTHS.find((m) => m.key === monthKey)?.label ?? monthKey;
  return { monthKey, monthLabel, total, categories, transactions: txMap };
}

export function parseMonthKey(value: string | undefined | null): MonthKey {
  if (value && MONTH_KEYS.includes(value as MonthKey)) {
    return value as MonthKey;
  }
  return DEFAULT_MONTH;
}

export function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function isCategorySlug(s: string): s is CategorySlug {
  return s in CATEGORY_META;
}

/** Shared card chrome for Spend Overview screens */
export const spendCardClass =
  "rounded-2xl border border-zinc-200/90 bg-white shadow-sm";
export const spendCardShadow = { boxShadow: "0 4px 14px rgba(0,0,0,0.06)" } as const;
