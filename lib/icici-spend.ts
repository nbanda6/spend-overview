/** HDFC Bank–style Spend Overview — shared types & month-based data */

export const HDFC = {
  /** Primary navy blue */
  navyBlue: "#004C8F",
  navyDark: "#00305A",
  /** Accent blue for interactive elements */
  accentBlue: "#0066B3",
  oceanBlue: "#0B4A7F",
  teal: "#0F8A8A",
  misc: "#64748B",
  /** Headers: navy gradient */
  headerFrom: "#004C8F",
  headerTo: "#00305A",
} as const;

// Backward compatibility alias
export const ICICI = HDFC;

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
    color: "#7B2D8E",
    icon: "bag",
    drillHint: "Online & retail purchases",
  },
  "food-dining": {
    label: "Food & Dining",
    color: HDFC.accentBlue,
    icon: "fork",
    drillHint: "Groceries, dining & UPI merchants",
  },
  utilities: {
    label: "Utilities",
    color: HDFC.oceanBlue,
    icon: "bulb",
    drillHint: "Bills & subscriptions",
  },
  travel: {
    label: "Travel",
    color: HDFC.teal,
    icon: "plane",
    drillHint: "Commute & travel",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: HDFC.misc,
    icon: "misc",
    drillHint: "Spend we couldn't auto-categorise",
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

/** Demo dataset scales — keeps monthly totals in a relatable range (well under ₹1–1.5L including recurring). */
export const DEMO_TX_AMOUNT_SCALE = 0.38;
export const DEMO_RECURRING_SCALE = 0.3;

export function scaleTxAmount(raw: number): number {
  if (raw <= 0) return 0;
  return Math.max(1, Math.round(raw * DEMO_TX_AMOUNT_SCALE));
}

export function scaleRecurringAmount(raw: number): number {
  if (raw <= 0) return 0;
  return Math.max(1, Math.round(raw * DEMO_RECURRING_SCALE));
}

function scaleTxRow(tx: TxRow): TxRow {
  return { ...tx, amount: scaleTxAmount(tx.amount) };
}

export const MONTH_KEYS = [
  "may2025",
  "jun2025",
  "jul2025",
  "aug2025",
  "sep2025",
  "oct2025",
  "nov2025",
  "dec2025",
  "jan2026",
  "feb2026",
  "mar2026",
  "apr2026",
] as const;
export type MonthKey = (typeof MONTH_KEYS)[number];

export const DEFAULT_MONTH: MonthKey = "apr2026";

export type ViewPeriod = "weekly" | "monthly";

export type WeekKey = `w1-${MonthKey}` | `w2-${MonthKey}` | `w3-${MonthKey}` | `w4-${MonthKey}`;

export function getWeeksForMonth(monthKey: MonthKey): { key: WeekKey; label: string; short: string }[] {
  const monthData = MONTHS.find((m) => m.key === monthKey);
  const monthLabel = monthData?.label ?? monthKey;
  const isCurrentMonth = monthKey === DEFAULT_MONTH;
  return [
    { key: `w1-${monthKey}` as WeekKey, label: `Week 1, ${monthLabel}`, short: "Week 1" },
    { key: `w2-${monthKey}` as WeekKey, label: `Week 2, ${monthLabel}`, short: "Week 2" },
    { key: `w3-${monthKey}` as WeekKey, label: `Week 3, ${monthLabel}`, short: "Week 3" },
    { key: `w4-${monthKey}` as WeekKey, label: isCurrentMonth ? `This Week` : `Week 4, ${monthLabel}`, short: isCurrentMonth ? "This Week" : "Week 4" },
  ];
}

export function parseWeekKey(value: string | undefined | null, monthKey: MonthKey): WeekKey {
  if (value && value.startsWith("w") && value.includes(monthKey)) {
    return value as WeekKey;
  }
  return `w4-${monthKey}` as WeekKey;
}

function getWeekNumber(dateStr: string): number {
  // Parse date like "18 Apr 2026"
  const day = parseInt(dateStr.split(" ")[0], 10);
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}

export function getWeeklySpendSnapshot(monthKey: MonthKey, weekNum: number): SpendSnapshot {
  const txMap = TRANSACTIONS_BY_MONTH[monthKey];
  const categories = {} as Record<CategorySlug, number>;
  const weekTransactions = {} as Record<CategorySlug, TxRow[]>;

  for (const slug of CATEGORY_ORDER) {
    const weekTxs = txMap[slug].filter((tx) => getWeekNumber(tx.date) === weekNum);
    weekTransactions[slug] = weekTxs.map(scaleTxRow);
    categories[slug] = weekTransactions[slug].reduce((s, t) => s + t.amount, 0);
  }

  const total = CATEGORY_ORDER.reduce((sum, k) => sum + categories[k], 0);
  const monthLabel = MONTHS.find((m) => m.key === monthKey)?.label ?? monthKey;
  const weekLabel = `Week ${weekNum}, ${monthLabel}`;

  return { monthKey, monthLabel: weekLabel, total, categories, transactions: weekTransactions };
}

export function getWeeklySpendInsight(monthKey: MonthKey, weekNum: number): SpendInsight {
  const snapshot = getWeeklySpendSnapshot(monthKey, weekNum);
  
  // Compare with previous week
  let prevSnapshot: SpendSnapshot | null = null;
  if (weekNum > 1) {
    prevSnapshot = getWeeklySpendSnapshot(monthKey, weekNum - 1);
  } else {
    // Get previous month's week 4
    const prevMonthKey = getPreviousMonthKey(monthKey);
    if (prevMonthKey) {
      prevSnapshot = getWeeklySpendSnapshot(prevMonthKey, 4);
    }
  }
  
  if (!prevSnapshot) {
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
  
  const totalMom = computeMomChange(snapshot.total, prevSnapshot.total);
  const categoryMom = {} as Record<CategorySlug, MomChange>;
  for (const slug of CATEGORY_ORDER) {
    categoryMom[slug] = computeMomChange(
      snapshot.categories[slug],
      prevSnapshot.categories[slug],
    );
  }
  
  return {
    snapshot,
    previousMonthKey: null,
    previousMonthLabel: prevSnapshot.monthLabel,
    totalMom,
    categoryMom,
  };
}

export const MONTHS: { key: MonthKey; label: string; short: string }[] = [
  { key: "may2025", label: "May 2025", short: "May '25" },
  { key: "jun2025", label: "June 2025", short: "Jun '25" },
  { key: "jul2025", label: "July 2025", short: "Jul '25" },
  { key: "aug2025", label: "August 2025", short: "Aug '25" },
  { key: "sep2025", label: "September 2025", short: "Sep '25" },
  { key: "oct2025", label: "October 2025", short: "Oct '25" },
  { key: "nov2025", label: "November 2025", short: "Nov '25" },
  { key: "dec2025", label: "December 2025", short: "Dec '25" },
  { key: "jan2026", label: "January 2026", short: "Jan" },
  { key: "feb2026", label: "February 2026", short: "Feb" },
  { key: "mar2026", label: "March 2026", short: "Mar" },
  { key: "apr2026", label: "April 2026", short: "Apr" },
];

export const TRANSACTIONS_BY_MONTH: Record<
  MonthKey,
  Record<CategorySlug, TxRow[]>
> = {
  may2025: {
    shopping: [
      { merchant: "Amazon", date: "04 May 2025", amount: 2100, initials: "A", channel: "UPI" },
      { merchant: "Flipkart", date: "12 May 2025", amount: 1650, initials: "F", channel: "Card" },
      { merchant: "Amazon", date: "28 May 2025", amount: 3200, initials: "A", channel: "Card" },
    ],
    "food-dining": [
      { merchant: "Swiggy", date: "03 May 2025", amount: 520, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "09 May 2025", amount: 1180, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "14 May 2025", amount: 650, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "21 May 2025", amount: 2400, initials: "D", channel: "Card" },
      { merchant: "BigBasket", date: "29 May 2025", amount: 1450, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "06 May 2025", amount: 2600, initials: "E", channel: "Net Banking" },
      { merchant: "Airtel Mobile", date: "05 May 2025", amount: 699, initials: "A", channel: "UPI" },
      { merchant: "Gas (Indane)", date: "22 May 2025", amount: 980, initials: "G", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "08 May 2025", amount: 240, initials: "U", channel: "UPI" },
      { merchant: "Petrol (IOCL)", date: "18 May 2025", amount: 2400, initials: "P", channel: "Card" },
      { merchant: "Uber", date: "30 May 2025", amount: 380, initials: "U", channel: "UPI" },
    ],
    miscellaneous: [
      { merchant: "ATM withdrawal fee", date: "25 May 2025", amount: 21, initials: "A", channel: "Card" },
      { merchant: "Mobile recharge", date: "27 May 2025", amount: 349, initials: "M", channel: "UPI" },
    ],
  },
  jun2025: {
    shopping: [
      { merchant: "Myntra", date: "25 Jun 2025", amount: 4500, initials: "M", channel: "UPI" },
      { merchant: "Amazon", date: "18 Jun 2025", amount: 2890, initials: "A", channel: "Card" },
      { merchant: "Flipkart", date: "08 Jun 2025", amount: 1750, initials: "F", channel: "Card" },
    ],
    "food-dining": [
      { merchant: "JioMart", date: "28 Jun 2025", amount: 1200, initials: "J", channel: "UPI" },
      { merchant: "Swiggy", date: "22 Jun 2025", amount: 1100, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "15 Jun 2025", amount: 780, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "05 Jun 2025", amount: 2200, initials: "D", channel: "Card" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "20 Jun 2025", amount: 2900, initials: "E", channel: "Net Banking" },
      { merchant: "Gas (Indane)", date: "12 Jun 2025", amount: 1050, initials: "G", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "29 Jun 2025", amount: 520, initials: "U", channel: "UPI" },
      { merchant: "Petrol (HP)", date: "16 Jun 2025", amount: 2800, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "Service charge", date: "10 Jun 2025", amount: 150, initials: "S", channel: "Card" },
    ],
  },
  jul2025: {
    shopping: [
      { merchant: "Amazon", date: "30 Jul 2025", amount: 5600, initials: "A", channel: "Card" },
      { merchant: "Croma", date: "22 Jul 2025", amount: 8500, initials: "C", channel: "Card" },
      { merchant: "Flipkart", date: "10 Jul 2025", amount: 3200, initials: "F", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "BigBasket", date: "28 Jul 2025", amount: 1800, initials: "B", channel: "UPI" },
      { merchant: "Swiggy", date: "20 Jul 2025", amount: 1450, initials: "S", channel: "UPI" },
      { merchant: "Blinkit", date: "15 Jul 2025", amount: 680, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "08 Jul 2025", amount: 920, initials: "Z", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "18 Jul 2025", amount: 3200, initials: "E", channel: "Net Banking" },
      { merchant: "Broadband (ACT)", date: "05 Jul 2025", amount: 1499, initials: "A", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "29 Jul 2025", amount: 620, initials: "U", channel: "UPI" },
      { merchant: "IndiGo", date: "15 Jul 2025", amount: 5200, initials: "I", channel: "Card" },
      { merchant: "Petrol (Shell)", date: "05 Jul 2025", amount: 3100, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "Unknown merchant", date: "12 Jul 2025", amount: 299, initials: "U", channel: "Card" },
    ],
  },
  aug2025: {
    shopping: [
      { merchant: "Amazon", date: "28 Aug 2025", amount: 4200, initials: "A", channel: "Card" },
      { merchant: "Myntra", date: "18 Aug 2025", amount: 2890, initials: "M", channel: "UPI" },
      { merchant: "Flipkart", date: "08 Aug 2025", amount: 1950, initials: "F", channel: "Card" },
    ],
    "food-dining": [
      { merchant: "JioMart", date: "29 Aug 2025", amount: 1350, initials: "J", channel: "UPI" },
      { merchant: "Swiggy", date: "22 Aug 2025", amount: 1680, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "14 Aug 2025", amount: 1100, initials: "Z", channel: "UPI" },
      { merchant: "BigBasket", date: "05 Aug 2025", amount: 2100, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "20 Aug 2025", amount: 3400, initials: "E", channel: "Net Banking" },
      { merchant: "Jio Mobile", date: "10 Aug 2025", amount: 749, initials: "J", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "30 Aug 2025", amount: 480, initials: "U", channel: "UPI" },
      { merchant: "Petrol (BP)", date: "20 Aug 2025", amount: 2900, initials: "P", channel: "Card" },
      { merchant: "Rapido", date: "12 Aug 2025", amount: 220, initials: "R", channel: "UPI" },
    ],
    miscellaneous: [
      { merchant: "SMS charges", date: "01 Aug 2025", amount: 15, initials: "S", channel: "Card" },
    ],
  },
  sep2025: {
    shopping: [
      { merchant: "Amazon", date: "28 Sep 2025", amount: 7800, initials: "A", channel: "Card" },
      { merchant: "Reliance Digital", date: "20 Sep 2025", amount: 12500, initials: "R", channel: "Card" },
      { merchant: "Flipkart", date: "10 Sep 2025", amount: 4200, initials: "F", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "BigBasket", date: "29 Sep 2025", amount: 2200, initials: "B", channel: "UPI" },
      { merchant: "Swiggy", date: "22 Sep 2025", amount: 1890, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "15 Sep 2025", amount: 1350, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "08 Sep 2025", amount: 2800, initials: "D", channel: "Card" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "18 Sep 2025", amount: 3100, initials: "E", channel: "Net Banking" },
      { merchant: "Gas (Indane)", date: "12 Sep 2025", amount: 1100, initials: "G", channel: "UPI" },
      { merchant: "Broadband", date: "05 Sep 2025", amount: 1499, initials: "B", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "30 Sep 2025", amount: 720, initials: "U", channel: "UPI" },
      { merchant: "Petrol (IOCL)", date: "18 Sep 2025", amount: 3200, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "International fee", date: "25 Sep 2025", amount: 180, initials: "I", channel: "Card" },
    ],
  },
  oct2025: {
    shopping: [
      { merchant: "Amazon", date: "30 Oct 2025", amount: 9500, initials: "A", channel: "Card" },
      { merchant: "Flipkart", date: "22 Oct 2025", amount: 6800, initials: "F", channel: "Card" },
      { merchant: "Myntra", date: "12 Oct 2025", amount: 3500, initials: "M", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "JioMart", date: "28 Oct 2025", amount: 1650, initials: "J", channel: "UPI" },
      { merchant: "Swiggy", date: "20 Oct 2025", amount: 2100, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "15 Oct 2025", amount: 2400, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "08 Oct 2025", amount: 1450, initials: "Z", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "22 Oct 2025", amount: 2800, initials: "E", channel: "Net Banking" },
      { merchant: "Airtel Mobile", date: "10 Oct 2025", amount: 799, initials: "A", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "29 Oct 2025", amount: 580, initials: "U", channel: "UPI" },
      { merchant: "Petrol (HP)", date: "18 Oct 2025", amount: 3400, initials: "P", channel: "Card" },
      { merchant: "IndiGo", date: "10 Oct 2025", amount: 4800, initials: "I", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "POS transaction", date: "25 Oct 2025", amount: 350, initials: "P", channel: "Card" },
    ],
  },
  nov2025: {
    shopping: [
      { merchant: "Amazon", date: "28 Nov 2025", amount: 12000, initials: "A", channel: "Card" },
      { merchant: "Croma", date: "20 Nov 2025", amount: 15000, initials: "C", channel: "Card" },
      { merchant: "Flipkart", date: "10 Nov 2025", amount: 8500, initials: "F", channel: "Card" },
    ],
    "food-dining": [
      { merchant: "BigBasket", date: "29 Nov 2025", amount: 2800, initials: "B", channel: "UPI" },
      { merchant: "Swiggy", date: "22 Nov 2025", amount: 2200, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "15 Nov 2025", amount: 1800, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "08 Nov 2025", amount: 3500, initials: "D", channel: "Card" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "20 Nov 2025", amount: 2600, initials: "E", channel: "Net Banking" },
      { merchant: "Gas (Indane)", date: "12 Nov 2025", amount: 1100, initials: "G", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "30 Nov 2025", amount: 650, initials: "U", channel: "UPI" },
      { merchant: "Petrol (Shell)", date: "18 Nov 2025", amount: 3600, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "Wallet adjustment", date: "10 Nov 2025", amount: 200, initials: "W", channel: "UPI" },
    ],
  },
  dec2025: {
    shopping: [
      { merchant: "Amazon", date: "28 Dec 2025", amount: 8500, initials: "A", channel: "Card" },
      { merchant: "Flipkart", date: "22 Dec 2025", amount: 5200, initials: "F", channel: "Card" },
      { merchant: "Myntra", date: "15 Dec 2025", amount: 3800, initials: "M", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "JioMart", date: "29 Dec 2025", amount: 1900, initials: "J", channel: "UPI" },
      { merchant: "Swiggy", date: "24 Dec 2025", amount: 2500, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "18 Dec 2025", amount: 2200, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "10 Dec 2025", amount: 1650, initials: "Z", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "18 Dec 2025", amount: 2400, initials: "E", channel: "Net Banking" },
      { merchant: "Broadband (ACT)", date: "05 Dec 2025", amount: 1499, initials: "A", channel: "Net Banking" },
    ],
    travel: [
      { merchant: "Uber", date: "30 Dec 2025", amount: 780, initials: "U", channel: "UPI" },
      { merchant: "Ola", date: "25 Dec 2025", amount: 420, initials: "O", channel: "UPI" },
      { merchant: "Petrol (BP)", date: "15 Dec 2025", amount: 3800, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "Service fee", date: "20 Dec 2025", amount: 118, initials: "S", channel: "Card" },
    ],
  },
  jan2026: {
    shopping: [
      { merchant: "Flipkart", date: "03 Jan 2026", amount: 990, initials: "F", channel: "UPI" },
      { merchant: "Amazon", date: "09 Jan 2026", amount: 4200, initials: "A", channel: "Card" },
      { merchant: "Myntra", date: "15 Jan 2026", amount: 1899, initials: "M", channel: "UPI" },
      { merchant: "Flipkart", date: "21 Jan 2026", amount: 3420, initials: "F", channel: "Card" },
      { merchant: "Nykaa", date: "26 Jan 2026", amount: 760, initials: "N", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "Swiggy", date: "02 Jan 2026", amount: 560, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "06 Jan 2026", amount: 980, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "11 Jan 2026", amount: 780, initials: "Z", channel: "UPI" },
      { merchant: "JioMart", date: "14 Jan 2026", amount: 890, initials: "J", channel: "UPI" },
      { merchant: "Local Kirana (UPI)", date: "16 Jan 2026", amount: 420, initials: "L", channel: "UPI" },
      { merchant: "DMart", date: "19 Jan 2026", amount: 2200, initials: "D", channel: "Card" },
      { merchant: "Swiggy", date: "24 Jan 2026", amount: 1120, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "27 Jan 2026", amount: 1240, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "04 Jan 2026", amount: 2800, initials: "E", channel: "Net Banking" },
      { merchant: "Airtel Mobile", date: "08 Jan 2026", amount: 799, initials: "A", channel: "UPI" },
      { merchant: "DTH (Tata Play)", date: "20 Jan 2026", amount: 459, initials: "D", channel: "UPI" },
    ],
    travel: [
      { merchant: "Petrol (IOCL)", date: "05 Jan 2026", amount: 2200, initials: "P", channel: "Card" },
      { merchant: "Uber", date: "12 Jan 2026", amount: 240, initials: "U", channel: "UPI" },
      { merchant: "Rapido", date: "18 Jan 2026", amount: 95, initials: "R", channel: "UPI" },
      { merchant: "Uber", date: "30 Jan 2026", amount: 280, initials: "U", channel: "UPI" },
    ],
    miscellaneous: [
      { merchant: "Wallet adjustment", date: "05 Jan 2026", amount: 49, initials: "W", channel: "UPI" },
      { merchant: "POS — uncategorised", date: "19 Jan 2026", amount: 199, initials: "P", channel: "Card" },
    ],
  },
  feb2026: {
    shopping: [
      { merchant: "Flipkart", date: "02 Feb 2026", amount: 1299, initials: "F", channel: "UPI" },
      { merchant: "Amazon", date: "07 Feb 2026", amount: 2650, initials: "A", channel: "Card" },
      { merchant: "Croma", date: "14 Feb 2026", amount: 8999, initials: "C", channel: "Card" },
      { merchant: "Amazon", date: "19 Feb 2026", amount: 4100, initials: "A", channel: "Card" },
      { merchant: "Nykaa", date: "23 Feb 2026", amount: 1880, initials: "N", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "Swiggy", date: "01 Feb 2026", amount: 720, initials: "S", channel: "UPI" },
      { merchant: "Blinkit", date: "03 Feb 2026", amount: 420, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "05 Feb 2026", amount: 1120, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "08 Feb 2026", amount: 2650, initials: "D", channel: "Card" },
      { merchant: "BigBasket", date: "10 Feb 2026", amount: 1540, initials: "B", channel: "UPI" },
      { merchant: "Swiggy Instamart", date: "14 Feb 2026", amount: 1420, initials: "S", channel: "UPI" },
      { merchant: "MORE Retail", date: "18 Feb 2026", amount: 820, initials: "M", channel: "UPI" },
      { merchant: "JioMart", date: "21 Feb 2026", amount: 980, initials: "J", channel: "UPI" },
      { merchant: "Zomato", date: "24 Feb 2026", amount: 980, initials: "Z", channel: "UPI" },
      { merchant: "Starbucks", date: "26 Feb 2026", amount: 650, initials: "S", channel: "Card" },
      { merchant: "Blinkit", date: "27 Feb 2026", amount: 640, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Broadband (ACT)", date: "03 Feb 2026", amount: 1499, initials: "A", channel: "Net Banking" },
      { merchant: "Electricity (BESCOM)", date: "09 Feb 2026", amount: 2750, initials: "E", channel: "Net Banking" },
      { merchant: "Gas (Indane)", date: "14 Feb 2026", amount: 1100, initials: "G", channel: "UPI" },
      { merchant: "Airtel Mobile", date: "22 Feb 2026", amount: 799, initials: "A", channel: "UPI" },
    ],
    travel: [
      { merchant: "Uber", date: "02 Feb 2026", amount: 380, initials: "U", channel: "UPI" },
      { merchant: "Petrol (HP)", date: "06 Feb 2026", amount: 3000, initials: "P", channel: "Card" },
      { merchant: "Rapido", date: "11 Feb 2026", amount: 180, initials: "R", channel: "UPI" },
      { merchant: "Metro recharge", date: "16 Feb 2026", amount: 300, initials: "M", channel: "UPI" },
      { merchant: "Uber", date: "21 Feb 2026", amount: 510, initials: "U", channel: "UPI" },
      { merchant: "Petrol (Shell)", date: "26 Feb 2026", amount: 2950, initials: "P", channel: "Card" },
    ],
    miscellaneous: [
      { merchant: "Unknown merchant ******912", date: "08 Feb 2026", amount: 350, initials: "U", channel: "Card" },
      { merchant: "SMS charges", date: "01 Feb 2026", amount: 15, initials: "S", channel: "Card" },
      { merchant: "BookMyShow", date: "15 Feb 2026", amount: 860, initials: "B", channel: "UPI" },
    ],
  },
  mar2026: {
    shopping: [
      { merchant: "Amazon", date: "03 Mar 2026", amount: 1499, initials: "A", channel: "UPI" },
      { merchant: "Nykaa", date: "07 Mar 2026", amount: 1599, initials: "N", channel: "UPI" },
      { merchant: "Flipkart", date: "12 Mar 2026", amount: 5200, initials: "F", channel: "Card" },
      { merchant: "Amazon", date: "18 Mar 2026", amount: 2890, initials: "A", channel: "Card" },
      { merchant: "Reliance Digital", date: "21 Mar 2026", amount: 4500, initials: "R", channel: "Card" },
      { merchant: "Myntra", date: "26 Mar 2026", amount: 2799, initials: "M", channel: "UPI" },
    ],
    "food-dining": [
      { merchant: "Swiggy", date: "01 Mar 2026", amount: 640, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "04 Mar 2026", amount: 1680, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "08 Mar 2026", amount: 760, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "10 Mar 2026", amount: 3100, initials: "D", channel: "Card" },
      { merchant: "JioMart", date: "15 Mar 2026", amount: 1120, initials: "J", channel: "UPI" },
      { merchant: "FreshToHome", date: "16 Mar 2026", amount: 890, initials: "F", channel: "UPI" },
      { merchant: "Swiggy", date: "19 Mar 2026", amount: 1340, initials: "S", channel: "UPI" },
      { merchant: "BigBasket", date: "22 Mar 2026", amount: 1950, initials: "B", channel: "UPI" },
      { merchant: "Zepto", date: "24 Mar 2026", amount: 480, initials: "Z", channel: "UPI" },
      { merchant: "JioMart", date: "27 Mar 2026", amount: 1450, initials: "J", channel: "UPI" },
      { merchant: "BigBasket", date: "29 Mar 2026", amount: 2100, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Electricity (BESCOM)", date: "02 Mar 2026", amount: 3100, initials: "E", channel: "Net Banking" },
      { merchant: "Jio Mobile", date: "05 Mar 2026", amount: 749, initials: "J", channel: "UPI" },
      { merchant: "Water board", date: "10 Mar 2026", amount: 890, initials: "W", channel: "UPI" },
      { merchant: "Spotify", date: "14 Mar 2026", amount: 119, initials: "S", channel: "Card" },
      { merchant: "Gas (Indane)", date: "20 Mar 2026", amount: 1020, initials: "G", channel: "UPI" },
    ],
    travel: [
      { merchant: "Rapido", date: "01 Mar 2026", amount: 90, initials: "R", channel: "UPI" },
      { merchant: "Uber", date: "05 Mar 2026", amount: 320, initials: "U", channel: "UPI" },
      { merchant: "IndiGo", date: "11 Mar 2026", amount: 4200, initials: "I", channel: "Card" },
      { merchant: "Petrol (Shell)", date: "15 Mar 2026", amount: 2800, initials: "P", channel: "Card" },
      { merchant: "Uber", date: "18 Mar 2026", amount: 420, initials: "U", channel: "UPI" },
      { merchant: "Petrol (IOCL)", date: "25 Mar 2026", amount: 3100, initials: "P", channel: "Card" },
      { merchant: "Ola", date: "28 Mar 2026", amount: 360, initials: "O", channel: "UPI" },
    ],
    miscellaneous: [
      { merchant: "Cross-border fee", date: "11 Mar 2026", amount: 225, initials: "C", channel: "Card" },
      { merchant: "ATM surcharge", date: "11 Mar 2026", amount: 24, initials: "A", channel: "Card" },
      { merchant: "YouTube Premium", date: "20 Mar 2026", amount: 129, initials: "Y", channel: "Card" },
    ],
  },
  apr2026: {
    shopping: [
      { merchant: "Amazon", date: "05 Apr 2026", amount: 1899, initials: "A", channel: "UPI" },
      { merchant: "Flipkart", date: "08 Apr 2026", amount: 3240, initials: "F", channel: "Card" },
      { merchant: "Nykaa", date: "12 Apr 2026", amount: 1560, initials: "N", channel: "UPI" },
      { merchant: "Amazon", date: "18 Apr 2026", amount: 6240, initials: "A", channel: "Card" },
      { merchant: "Croma", date: "22 Apr 2026", amount: 8990, initials: "C", channel: "Card" },
      { merchant: "Myntra", date: "24 Apr 2026", amount: 2199, initials: "M", channel: "UPI" },
      { merchant: "Flipkart", date: "27 Apr 2026", amount: 4120, initials: "F", channel: "Card" },
      { merchant: "Reliance Digital", date: "29 Apr 2026", amount: 12990, initials: "R", channel: "Card" },
    ],
    "food-dining": [
      { merchant: "Swiggy", date: "02 Apr 2026", amount: 890, initials: "S", channel: "UPI" },
      { merchant: "Blinkit", date: "03 Apr 2026", amount: 620, initials: "B", channel: "UPI" },
      { merchant: "BigBasket", date: "06 Apr 2026", amount: 1240, initials: "B", channel: "UPI" },
      { merchant: "Zomato", date: "07 Apr 2026", amount: 480, initials: "Z", channel: "UPI" },
      { merchant: "DMart", date: "09 Apr 2026", amount: 2650, initials: "D", channel: "Card" },
      { merchant: "Zepto", date: "10 Apr 2026", amount: 340, initials: "Z", channel: "UPI" },
      { merchant: "Swiggy", date: "11 Apr 2026", amount: 2100, initials: "S", channel: "UPI" },
      { merchant: "Zomato", date: "13 Apr 2026", amount: 760, initials: "Z", channel: "UPI" },
      { merchant: "Swiggy Instamart", date: "14 Apr 2026", amount: 1100, initials: "S", channel: "UPI" },
      { merchant: "Local Kirana (UPI)", date: "15 Apr 2026", amount: 450, initials: "L", channel: "UPI" },
      { merchant: "MORE Retail", date: "16 Apr 2026", amount: 820, initials: "M", channel: "UPI" },
      { merchant: "JioMart", date: "17 Apr 2026", amount: 1120, initials: "J", channel: "UPI" },
      { merchant: "Blinkit", date: "18 Apr 2026", amount: 1280, initials: "B", channel: "UPI" },
      { merchant: "JioMart", date: "19 Apr 2026", amount: 920, initials: "J", channel: "UPI" },
      { merchant: "BigBasket", date: "20 Apr 2026", amount: 1850, initials: "B", channel: "UPI" },
      { merchant: "Barbeque Nation", date: "21 Apr 2026", amount: 2860, initials: "B", channel: "Card" },
      { merchant: "Blinkit", date: "23 Apr 2026", amount: 990, initials: "B", channel: "UPI" },
      { merchant: "BigBasket", date: "24 Apr 2026", amount: 1620, initials: "B", channel: "UPI" },
      { merchant: "Blinkit", date: "25 Apr 2026", amount: 1420, initials: "B", channel: "UPI" },
      { merchant: "FreshToHome", date: "26 Apr 2026", amount: 740, initials: "F", channel: "UPI" },
      { merchant: "Zomato", date: "28 Apr 2026", amount: 540, initials: "Z", channel: "UPI" },
      { merchant: "Starbucks", date: "29 Apr 2026", amount: 890, initials: "S", channel: "Card" },
      { merchant: "BigBasket", date: "30 Apr 2026", amount: 980, initials: "B", channel: "UPI" },
    ],
    utilities: [
      { merchant: "Broadband (ACT)", date: "01 Apr 2026", amount: 2151, initials: "A", channel: "Net Banking" },
      { merchant: "Electricity (BESCOM)", date: "03 Apr 2026", amount: 3200, initials: "E", channel: "Net Banking" },
      { merchant: "Mobile (Airtel)", date: "05 Apr 2026", amount: 799, initials: "M", channel: "UPI" },
      { merchant: "Gas (Indane)", date: "10 Apr 2026", amount: 1850, initials: "G", channel: "UPI" },
      { merchant: "DTH (Tata Play)", date: "12 Apr 2026", amount: 459, initials: "D", channel: "UPI" },
      { merchant: "Water board", date: "14 Apr 2026", amount: 920, initials: "W", channel: "Net Banking" },
      { merchant: "Health insurance premium", date: "18 Apr 2026", amount: 8400, initials: "H", channel: "Net Banking" },
      { merchant: "Netflix", date: "21 Apr 2026", amount: 649, initials: "N", channel: "Card" },
    ],
    travel: [
      { merchant: "Metro recharge", date: "03 Apr 2026", amount: 500, initials: "M", channel: "UPI" },
      { merchant: "Uber", date: "04 Apr 2026", amount: 730, initials: "U", channel: "UPI" },
      { merchant: "Rapido", date: "06 Apr 2026", amount: 140, initials: "R", channel: "UPI" },
      { merchant: "IndiGo", date: "09 Apr 2026", amount: 2850, initials: "I", channel: "Card" },
      { merchant: "Petrol (HP)", date: "16 Apr 2026", amount: 3500, initials: "P", channel: "Card" },
      { merchant: "Uber", date: "20 Apr 2026", amount: 420, initials: "U", channel: "UPI" },
      { merchant: "IRCTC", date: "22 Apr 2026", amount: 1640, initials: "I", channel: "UPI" },
      { merchant: "Uber", date: "24 Apr 2026", amount: 290, initials: "U", channel: "UPI" },
      { merchant: "Petrol (Shell)", date: "26 Apr 2026", amount: 3100, initials: "P", channel: "Card" },
      { merchant: "Ola", date: "27 Apr 2026", amount: 380, initials: "O", channel: "UPI" },
    ],
    miscellaneous: [
      { merchant: "Wallet load (misc)", date: "06 Apr 2026", amount: 200, initials: "W", channel: "UPI" },
      { merchant: "International txn fee", date: "15 Apr 2026", amount: 89, initials: "I", channel: "Card" },
      { merchant: "Tuition (partner portal)", date: "17 Apr 2026", amount: 11500, initials: "T", channel: "Net Banking" },
      { merchant: "Charitable donation", date: "19 Apr 2026", amount: 2100, initials: "C", channel: "UPI" },
      { merchant: "Unknown POS ******441", date: "22 Apr 2026", amount: 499, initials: "U", channel: "Card" },
      { merchant: "PharmEasy", date: "25 Apr 2026", amount: 1180, initials: "P", channel: "UPI" },
      { merchant: "Apollo Pharmacy", date: "27 Apr 2026", amount: 640, initials: "A", channel: "UPI" },
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
  const transactions = {} as Record<CategorySlug, TxRow[]>;
  const categories = {} as Record<CategorySlug, number>;
  for (const slug of CATEGORY_ORDER) {
    transactions[slug] = txMap[slug].map(scaleTxRow);
    categories[slug] = transactions[slug].reduce((s, t) => s + t.amount, 0);
  }
  const total = CATEGORY_ORDER.reduce((sum, k) => sum + categories[k], 0);
  const monthLabel = MONTHS.find((m) => m.key === monthKey)?.label ?? monthKey;
  return { monthKey, monthLabel, total, categories, transactions };
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

/** Custom date range for Spend Overview (inclusive days, local, YYYY-MM-DD) */
export type CustomDateRange = { start: string; end: string };

const M3_TO_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function monthKeyToYmd(monthKey: MonthKey): { y: number; m0: number } {
  const m3 = monthKey.slice(0, 3).toLowerCase();
  const y = parseInt(monthKey.slice(3), 10);
  return { y, m0: M3_TO_INDEX[m3]! };
}

function toIsoDate(y: number, m0: number, d: number): string {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Calendar month bounds (inclusive) for the selected data month key */
export function getMonthDateRangeIso(monthKey: MonthKey): CustomDateRange {
  const { y, m0 } = monthKeyToYmd(monthKey);
  const last = new Date(y, m0 + 1, 0).getDate();
  return { start: toIsoDate(y, m0, 1), end: toIsoDate(y, m0, last) };
}

/** Min/max ISO dates present in demo transaction data */
export function getDatasetDateIsoBounds(): { min: string; max: string } {
  const first = MONTH_KEYS[0]!;
  const last = MONTH_KEYS[MONTH_KEYS.length - 1]!;
  return {
    min: getMonthDateRangeIso(first).start,
    max: getMonthDateRangeIso(last).end,
  };
}

function parseIsoToLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const TX_MON: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/** Parse transaction `date` like "20 Apr 2026" */
export function parseTransactionDisplayDate(dateStr: string): Date | null {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const mon = parts[1].slice(0, 3).toLowerCase();
  const year = parseInt(parts[2], 10);
  const m0 = TX_MON[mon];
  if (m0 === undefined || !Number.isFinite(day) || !Number.isFinite(year)) return null;
  return new Date(year, m0, day);
}

export function transactionInDateRange(tx: TxRow, range: CustomDateRange): boolean {
  const txd = parseTransactionDisplayDate(tx.date);
  if (!txd || isNaN(txd.getTime())) return false;
  const start = parseIsoToLocal(range.start);
  start.setHours(0, 0, 0, 0);
  const end = parseIsoToLocal(range.end);
  end.setHours(23, 59, 59, 999);
  const cal = new Date(txd.getFullYear(), txd.getMonth(), txd.getDate());
  return cal >= start && cal <= end;
}

export function formatCustomRangeLabel(startIso: string, endIso: string): string {
  const s = parseIsoToLocal(startIso);
  const e = parseIsoToLocal(endIso);
  const fmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${fmt.format(s)} – ${fmt.format(e)}`;
}

export function isValidCustomRange(range: CustomDateRange): boolean {
  if (!range.start || !range.end) return false;
  return parseIsoToLocal(range.start) <= parseIsoToLocal(range.end);
}

export function isCategorySlug(s: string): s is CategorySlug {
  return s in CATEGORY_META;
}

/** Shared card chrome for Spend Overview screens */
export const spendCardClass =
  "rounded-2xl border border-zinc-200/90 bg-white shadow-sm";
export const spendCardShadow = { boxShadow: "0 4px 14px rgba(0,0,0,0.06)" } as const;

/** Payment types breakdown */
export type PaymentType = "upi" | "credit" | "transfer" | "debit";

export const PAYMENT_TYPE_META: Record<PaymentType, { label: string; icon: string }> = {
  upi: { label: "UPI", icon: "upi" },
  credit: { label: "Credit Card", icon: "credit" },
  transfer: { label: "Transfer", icon: "transfer" },
  debit: { label: "Debit Card", icon: "debit" },
};

export type PaymentTypeData = {
  type: PaymentType;
  amount: number;
  previousAmount: number | null;
};

/** Recurring expense payee */
export type RecurringPayee = {
  id: string;
  name: string;
  amount: number;
  icon: string;
  /** How this standing instruction runs (rolled into payment mode breakdown) */
  paymentMode: PaymentType;
};

/** Frequent-app strip: one row per recognised consumer app (aggregated spend only). */
export type FrequentApp = {
  id: string;
  name: string;
  color: string;
  /** Total debit through this app in the selected window */
  totalSpend: number;
};

/** All transactions for a merchant name in a month */
export type MerchantTxRef = {
  slug: CategorySlug;
  txIndex: number;
  tx: TxRow;
};

/** Map a statement line to a single consumer-app label, or null (fuel, bills, cash, etc.). */
function matchAppBrand(merchant: string): string | null {
  const m = merchant.toLowerCase();
  if (m.includes("swiggy")) return "Swiggy";
  if (m.includes("zomato")) return "Zomato";
  if (m.includes("bigbasket")) return "BigBasket";
  if (m.includes("blinkit")) return "Blinkit";
  if (m.includes("jiomart")) return "JioMart";
  if (m.includes("zepto")) return "Zepto";
  if (m.includes("amazon")) return "Amazon";
  if (m.includes("flipkart")) return "Flipkart";
  if (m.includes("myntra")) return "Myntra";
  if (m.includes("nykaa")) return "Nykaa";
  if (m.includes("croma")) return "Croma";
  if (m.includes("reliance digital")) return "Reliance Digital";
  if (m.includes("uber")) return "Uber";
  if (m.startsWith("ola") || /\boola\b/.test(m)) return "Ola";
  if (m.includes("rapido")) return "Rapido";
  if (m.includes("indigo")) return "IndiGo";
  if (m.includes("irctc")) return "IRCTC";
  if (m.includes("pharmeasy")) return "PharmEasy";
  if (m.includes("apollo")) return "Apollo";
  if (m.includes("netflix")) return "Netflix";
  if (m.includes("bookmyshow")) return "BookMyShow";
  if (m.includes("youtube")) return "YouTube";
  if (m.includes("spotify")) return "Spotify";
  if (m.includes("starbucks")) return "Starbucks";
  return null;
}

export function getTransactionsForMerchant(
  monthKey: MonthKey,
  merchant: string,
): MerchantTxRef[] {
  const selectedCanon = matchAppBrand(merchant) ?? merchant;
  const out: MerchantTxRef[] = [];
  for (const slug of CATEGORY_ORDER) {
    const rows = TRANSACTIONS_BY_MONTH[monthKey][slug];
    rows.forEach((tx, txIndex) => {
      const rowCanon = matchAppBrand(tx.merchant);
      const matches =
        rowCanon != null
          ? rowCanon === selectedCanon
          : tx.merchant === merchant || tx.merchant === selectedCanon;
      if (matches) {
        out.push({ slug, txIndex, tx: scaleTxRow(tx) });
      }
    });
  }
  return out.sort((a, b) => {
    const ta = Date.parse(a.tx.date);
    const tb = Date.parse(b.tx.date);
    const na = Number.isFinite(ta) ? ta : 0;
    const nb = Number.isFinite(tb) ? tb : 0;
    return nb - na;
  });
}

/** Sample recurring expenses data by month */
export const RECURRING_EXPENSES: Record<MonthKey, RecurringPayee[]> = {
  apr2026: [
    { id: "dad", name: "Dad", amount: 20000, icon: "user", paymentMode: "transfer" },
    { id: "owner", name: "House Owner", amount: 40000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 9000, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3500, icon: "sparkles", paymentMode: "upi" },
    { id: "loan", name: "Loan EMI", amount: 20000, icon: "bank", paymentMode: "credit" },
    { id: "invest", name: "Investment SIP", amount: 50000, icon: "trending", paymentMode: "debit" },
  ],
  mar2026: [
    { id: "dad", name: "Dad", amount: 20000, icon: "user", paymentMode: "transfer" },
    { id: "owner", name: "House Owner", amount: 40000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 9000, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3500, icon: "sparkles", paymentMode: "upi" },
    { id: "loan", name: "Loan EMI", amount: 20000, icon: "bank", paymentMode: "credit" },
    { id: "invest", name: "Investment SIP", amount: 50000, icon: "trending", paymentMode: "debit" },
  ],
  feb2026: [
    { id: "dad", name: "Dad", amount: 18000, icon: "user", paymentMode: "transfer" },
    { id: "owner", name: "House Owner", amount: 40000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 8500, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3500, icon: "sparkles", paymentMode: "upi" },
    { id: "loan", name: "Loan EMI", amount: 20000, icon: "bank", paymentMode: "credit" },
    { id: "invest", name: "Investment SIP", amount: 45000, icon: "trending", paymentMode: "debit" },
  ],
  jan2026: [
    { id: "dad", name: "Dad", amount: 15000, icon: "user", paymentMode: "transfer" },
    { id: "owner", name: "House Owner", amount: 40000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 8000, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3000, icon: "sparkles", paymentMode: "upi" },
    { id: "loan", name: "Loan EMI", amount: 20000, icon: "bank", paymentMode: "credit" },
  ],
  dec2025: [
    { id: "dad", name: "Dad", amount: 15000, icon: "user", paymentMode: "transfer" },
    { id: "owner", name: "House Owner", amount: 38000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 8000, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3000, icon: "sparkles", paymentMode: "upi" },
  ],
  nov2025: [
    { id: "owner", name: "House Owner", amount: 38000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 7500, icon: "utensils", paymentMode: "upi" },
    { id: "maid", name: "Maid", amount: 3000, icon: "sparkles", paymentMode: "upi" },
  ],
  oct2025: [
    { id: "owner", name: "House Owner", amount: 38000, icon: "home", paymentMode: "transfer" },
    { id: "cook", name: "Cook", amount: 7500, icon: "utensils", paymentMode: "upi" },
  ],
  sep2025: [
    { id: "owner", name: "House Owner", amount: 35000, icon: "home", paymentMode: "transfer" },
  ],
  aug2025: [],
  jul2025: [],
  jun2025: [],
  may2025: [],
};

function addTxToPaymentTotals(tx: TxRow, totals: Record<PaymentType, number>) {
  const amt = scaleTxAmount(tx.amount);
  if (tx.channel === "UPI") {
    totals.upi += amt;
  } else if (tx.channel === "Card") {
    totals.credit += Math.round(amt * 0.6);
    totals.debit += Math.round(amt * 0.4);
  } else if (tx.channel === "Net Banking") {
    totals.transfer += amt;
  }
}

function customRangeOverlapsMonth(monthKey: MonthKey, range: CustomDateRange): boolean {
  const b = getMonthDateRangeIso(monthKey);
  return !(range.end < b.start || range.start > b.end);
}

/** Roll recurring standing instructions into UPI / card / transfer / debit buckets */
function addRecurringSplitForMonths(monthKeys: MonthKey[], totals: Record<PaymentType, number>): void {
  for (const mk of monthKeys) {
    for (const p of RECURRING_EXPENSES[mk] ?? []) {
      const a = scaleRecurringAmount(p.amount);
      if (p.paymentMode === "upi") {
        totals.upi += a;
      } else if (p.paymentMode === "credit") {
        totals.credit += a;
      } else if (p.paymentMode === "transfer") {
        totals.transfer += a;
      } else {
        totals.debit += a;
      }
    }
  }
}

/** Aggregate spend on recognised consumer apps (A–Z, not by amount). */
export function getFrequentApps(
  monthKey: MonthKey,
  customRange: CustomDateRange | null = null,
): FrequentApp[] {
  const appMap: Record<string, number> = {};

  const considerRow = (tx: TxRow) => {
    if (customRange && isValidCustomRange(customRange) && !transactionInDateRange(tx, customRange)) {
      return;
    }
    const brand = matchAppBrand(tx.merchant);
    if (!brand) return;
    const amt = scaleTxAmount(tx.amount);
    appMap[brand] = (appMap[brand] ?? 0) + amt;
  };

  const accumulateFromTxMap = (txMap: (typeof TRANSACTIONS_BY_MONTH)[MonthKey]) => {
    for (const slug of CATEGORY_ORDER) {
      for (const tx of txMap[slug]) {
        considerRow(tx);
      }
    }
  };

  if (customRange && isValidCustomRange(customRange)) {
    for (const mk of MONTH_KEYS) {
      accumulateFromTxMap(TRANSACTIONS_BY_MONTH[mk as MonthKey]);
    }
  } else {
    accumulateFromTxMap(TRANSACTIONS_BY_MONTH[monthKey]);
  }

  return Object.entries(appMap)
    .filter(([, total]) => total > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 10)
    .map(([name, totalSpend]) => ({
      id: name,
      name,
      color: getAppColor(name),
      totalSpend,
    }));
}

function getAppColor(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("blinkit")) return "#F8C023";
  if (lower.includes("zepto")) return "#7C3AED";
  if (lower.includes("swiggy")) return "#FC8019";
  if (lower.includes("uber")) return "#000000";
  if (lower.includes("amazon")) return "#FF9900";
  if (lower.includes("flipkart")) return "#2874F0";
  if (lower.includes("zomato")) return "#E23744";
  if (lower.includes("bigbasket")) return "#84C225";
  if (lower.includes("pharmeasy") || lower.includes("apollo")) return "#10847E";
  if (lower.includes("irctc")) return "#00843D";
  return "#64748B";
}

/** Time filter for spend overview */
export type TimeFilter = "this-week" | "this-month" | "last-3-months" | "custom";

export const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "this-week", label: "This Week" },
  { key: "this-month", label: "This Month" },
  { key: "custom", label: "Custom" },
];

/** Get payment type breakdown (transactions + recurring standing instructions by payment mode) */
export function getPaymentTypeBreakdown(
  monthKey: MonthKey,
  customRange: CustomDateRange | null = null,
  filter: TimeFilter = "this-month",
): PaymentTypeData[] {
  const totals: Record<PaymentType, number> = {
    upi: 0,
    credit: 0,
    transfer: 0,
    debit: 0,
  };

  if (customRange && isValidCustomRange(customRange)) {
    for (const mk of MONTH_KEYS) {
      const txMap = TRANSACTIONS_BY_MONTH[mk as MonthKey];
      for (const slug of CATEGORY_ORDER) {
        for (const tx of txMap[slug]) {
          if (transactionInDateRange(tx, customRange)) {
            addTxToPaymentTotals(tx, totals);
          }
        }
      }
    }
    for (const mk of MONTH_KEYS) {
      if (customRangeOverlapsMonth(mk as MonthKey, customRange)) {
        addRecurringSplitForMonths([mk as MonthKey], totals);
      }
    }
    return [
      { type: "upi" as PaymentType, amount: totals.upi, previousAmount: null },
      { type: "credit" as PaymentType, amount: totals.credit, previousAmount: null },
      { type: "transfer" as PaymentType, amount: totals.transfer, previousAmount: null },
      { type: "debit" as PaymentType, amount: totals.debit, previousAmount: null },
    ];
  }

  const txMap = TRANSACTIONS_BY_MONTH[monthKey];

  for (const slug of CATEGORY_ORDER) {
    for (const tx of txMap[slug]) {
      addTxToPaymentTotals(tx, totals);
    }
  }

  addRecurringSplitForMonths(getRecurringMonthKeysForFilter(filter, monthKey), totals);

  const monthIdx = MONTH_KEYS.indexOf(monthKey);
  const prevKey = getPreviousMonthKey(monthKey);
  let prevTotals: Record<PaymentType, number> | null = null;

  if (prevKey) {
    prevTotals = { upi: 0, credit: 0, transfer: 0, debit: 0 };

    const prevTxMap = TRANSACTIONS_BY_MONTH[prevKey];
    for (const slug of CATEGORY_ORDER) {
      for (const tx of prevTxMap[slug]) {
        addTxToPaymentTotals(tx, prevTotals);
      }
    }

    if (filter === "last-3-months") {
      const prevMonths = MONTH_KEYS.slice(
        Math.max(0, monthIdx - 5),
        Math.max(0, monthIdx - 2),
      ) as MonthKey[];
      addRecurringSplitForMonths(prevMonths, prevTotals);
    } else {
      addRecurringSplitForMonths([prevKey], prevTotals);
    }
  }

  return [
    { type: "upi" as PaymentType, amount: totals.upi, previousAmount: prevTotals?.upi ?? null },
    { type: "credit" as PaymentType, amount: totals.credit, previousAmount: prevTotals?.credit ?? null },
    { type: "transfer" as PaymentType, amount: totals.transfer, previousAmount: prevTotals?.transfer ?? null },
    { type: "debit" as PaymentType, amount: totals.debit, previousAmount: prevTotals?.debit ?? null },
  ];
}

/** URL segment / drill-down for {@link PAYMENT_TYPE_META} */
export function isPaymentTypeParam(s: string): s is PaymentType {
  return s === "upi" || s === "credit" || s === "transfer" || s === "debit";
}

/** One row in the payment-mode transaction list (aligned with {@link getPaymentTypeBreakdown}). */
export type PaymentModeListItem =
  | {
      kind: "purchase";
      slug: CategorySlug;
      monthKey: MonthKey;
      txIndex: number;
      merchant: string;
      date: string;
      channel?: TxRow["channel"];
      initials: string;
      /** Amount attributed to this payment bucket (card purchases are split 60/40 credit/debit). */
      displayAmount: number;
    }
  | {
      kind: "recurring";
      monthKey: MonthKey;
      payeeId: string;
      name: string;
      displayAmount: number;
    };

function cardBucketAmounts(amountScaled: number): { credit: number; debit: number } {
  return {
    credit: Math.round(amountScaled * 0.6),
    debit: Math.round(amountScaled * 0.4),
  };
}

/**
 * Line items that make up the rolled-up payment totals for the same window as {@link getPaymentTypeBreakdown}.
 */
export function getTransactionsForPaymentType(
  paymentType: PaymentType,
  monthKey: MonthKey,
  customRange: CustomDateRange | null,
  filter: TimeFilter,
): PaymentModeListItem[] {
  const out: PaymentModeListItem[] = [];

  const considerPurchase = (mk: MonthKey, slug: CategorySlug, tx: TxRow, txIndex: number) => {
    const st = scaleTxRow(tx);
    const amt = scaleTxAmount(tx.amount);
    const ch = st.channel;

    if (ch === "UPI") {
      if (paymentType === "upi") {
        out.push({
          kind: "purchase",
          slug,
          monthKey: mk,
          txIndex,
          merchant: st.merchant,
          date: st.date,
          channel: st.channel,
          initials: st.initials,
          displayAmount: amt,
        });
      }
      return;
    }

    if (ch === "Net Banking") {
      if (paymentType === "transfer") {
        out.push({
          kind: "purchase",
          slug,
          monthKey: mk,
          txIndex,
          merchant: st.merchant,
          date: st.date,
          channel: st.channel,
          initials: st.initials,
          displayAmount: amt,
        });
      }
      return;
    }

    if (ch === "Card") {
      const { credit, debit } = cardBucketAmounts(amt);
      if (paymentType === "credit" && credit > 0) {
        out.push({
          kind: "purchase",
          slug,
          monthKey: mk,
          txIndex,
          merchant: st.merchant,
          date: st.date,
          channel: st.channel,
          initials: st.initials,
          displayAmount: credit,
        });
      }
      if (paymentType === "debit" && debit > 0) {
        out.push({
          kind: "purchase",
          slug,
          monthKey: mk,
          txIndex,
          merchant: st.merchant,
          date: st.date,
          channel: st.channel,
          initials: st.initials,
          displayAmount: debit,
        });
      }
    }
  };

  if (customRange && isValidCustomRange(customRange)) {
    for (const mk of MONTH_KEYS) {
      const mkKey = mk as MonthKey;
      for (const slug of CATEGORY_ORDER) {
        const rows = TRANSACTIONS_BY_MONTH[mkKey][slug];
        rows.forEach((tx, txIndex) => {
          if (transactionInDateRange(tx, customRange)) {
            considerPurchase(mkKey, slug, tx, txIndex);
          }
        });
      }
    }
    for (const mk of MONTH_KEYS) {
      const mkKey = mk as MonthKey;
      if (!customRangeOverlapsMonth(mkKey, customRange)) continue;
      for (const p of RECURRING_EXPENSES[mkKey] ?? []) {
        if (p.paymentMode === paymentType) {
          out.push({
            kind: "recurring",
            monthKey: mkKey,
            payeeId: p.id,
            name: p.name,
            displayAmount: scaleRecurringAmount(p.amount),
          });
        }
      }
    }
  } else {
    const mkKey = monthKey;
    for (const slug of CATEGORY_ORDER) {
      const rows = TRANSACTIONS_BY_MONTH[mkKey][slug];
      rows.forEach((tx, txIndex) => considerPurchase(mkKey, slug, tx, txIndex));
    }
    for (const mk of getRecurringMonthKeysForFilter(filter, monthKey)) {
      for (const p of RECURRING_EXPENSES[mk] ?? []) {
        if (p.paymentMode === paymentType) {
          out.push({
            kind: "recurring",
            monthKey: mk,
            payeeId: p.id,
            name: p.name,
            displayAmount: scaleRecurringAmount(p.amount),
          });
        }
      }
    }
  }

  const sortKey = (r: PaymentModeListItem): number => {
    if (r.kind === "purchase") {
      return parseTransactionDisplayDate(r.date)?.getTime() ?? 0;
    }
    return Date.parse(getMonthDateRangeIso(r.monthKey).end);
  };

  return out.sort((a, b) => sortKey(b) - sortKey(a));
}

/** Get recurring expenses for a month */
export function getRecurringExpenses(monthKey: MonthKey): { payees: RecurringPayee[]; total: number } {
  const payees = (RECURRING_EXPENSES[monthKey] || []).map((p) => ({
    ...p,
    amount: scaleRecurringAmount(p.amount),
  }));
  const total = payees.reduce((sum, p) => sum + p.amount, 0);
  return { payees, total };
}

/** Resolve a recurring payee for a month by stable id */
export function getRecurringPayeeForMonth(
  monthKey: MonthKey,
  payeeId: string,
): RecurringPayee | null {
  const raw = RECURRING_EXPENSES[monthKey] ?? [];
  const p = raw.find((x) => x.id === payeeId);
  if (!p) return null;
  return { ...p, amount: scaleRecurringAmount(p.amount) };
}

/** Same payee’s amount in the prior month when that entry exists */
export function getPreviousRecurringPayeeAmount(
  monthKey: MonthKey,
  payeeId: string,
): number | null {
  const prevKey = getPreviousMonthKey(monthKey);
  if (!prevKey) return null;
  const prev = getRecurringPayeeForMonth(prevKey, payeeId);
  return prev?.amount ?? null;
}

/** Parse `f` query on spend / category drill routes */
export function parseTimeFilter(value: string | undefined | null): TimeFilter {
  if (
    value === "this-week" ||
    value === "this-month" ||
    value === "last-3-months" ||
    value === "custom"
  ) {
    return value;
  }
  return "this-month";
}

/** Parse custom range from `start` / `end` query (YYYY-MM-DD) */
export function parseCustomRangeFromSearch(
  start: string | undefined,
  end: string | undefined,
): CustomDateRange | null {
  if (!start || !end) return null;
  const range: CustomDateRange = { start, end };
  return isValidCustomRange(range) ? range : null;
}

/** Query string for spend overview & category drill (without leading `?`) */
export function buildSpendOverviewPeriodQuery(
  monthKey: MonthKey,
  fromSource: string,
  timeFilter: TimeFilter,
  customRangeArg: CustomDateRange | null,
): string {
  let q = `m=${monthKey}&from=${encodeURIComponent(fromSource)}&f=${timeFilter}`;
  if (timeFilter === "custom" && customRangeArg && isValidCustomRange(customRangeArg)) {
    q += `&start=${encodeURIComponent(customRangeArg.start)}&end=${encodeURIComponent(customRangeArg.end)}`;
  }
  return q;
}

function sortTxRowsByDateDesc(rows: TxRow[]): TxRow[] {
  return [...rows].sort((a, b) => {
    const ta = parseTransactionDisplayDate(a.date)?.getTime() ?? 0;
    const tb = parseTransactionDisplayDate(b.date)?.getTime() ?? 0;
    return tb - ta;
  });
}

/** Transactions for one category matching the Spend Overview period filter */
export function getFilteredCategoryTransactions(
  slug: CategorySlug,
  filter: TimeFilter,
  monthKey: MonthKey,
  customRange: CustomDateRange | null,
): TxRow[] {
  const txMap = TRANSACTIONS_BY_MONTH[monthKey];

  if (filter === "this-week") {
    return txMap[slug]
      .filter((tx) => getWeekNumber(tx.date) === 4)
      .map(scaleTxRow);
  }

  if (filter === "this-month") {
    return txMap[slug].map(scaleTxRow);
  }

  if (filter === "last-3-months") {
    const monthIdx = MONTH_KEYS.indexOf(monthKey);
    const monthsToAggregate = MONTH_KEYS.slice(Math.max(0, monthIdx - 2), monthIdx + 1) as MonthKey[];
    const out: TxRow[] = [];
    for (const mk of monthsToAggregate) {
      out.push(...TRANSACTIONS_BY_MONTH[mk][slug].map(scaleTxRow));
    }
    return sortTxRowsByDateDesc(out);
  }

  if (filter === "custom") {
    if (customRange && isValidCustomRange(customRange)) {
      const out: TxRow[] = [];
      for (const mk of MONTH_KEYS) {
        for (const tx of TRANSACTIONS_BY_MONTH[mk as MonthKey][slug]) {
          if (transactionInDateRange(tx, customRange)) {
            out.push(scaleTxRow(tx));
          }
        }
      }
      return sortTxRowsByDateDesc(out);
    }
    return txMap[slug].map(scaleTxRow);
  }

  return txMap[slug].map(scaleTxRow);
}

/**
 * Month keys whose recurring debits roll into Spend Overview for this filter
 * (aligned with transaction aggregation for last-3-months).
 */
export function getRecurringMonthKeysForFilter(filter: TimeFilter, monthKey: MonthKey): MonthKey[] {
  const monthIdx = MONTH_KEYS.indexOf(monthKey);
  if (filter === "last-3-months") {
    return MONTH_KEYS.slice(Math.max(0, monthIdx - 2), monthIdx + 1) as MonthKey[];
  }
  return [monthKey];
}

/** Sum of recurring debit totals for the same window as {@link getRecurringMonthKeysForFilter} */
export function getRecurringDebitTotalForSpendFilter(filter: TimeFilter, monthKey: MonthKey): number {
  return getRecurringMonthKeysForFilter(filter, monthKey).reduce(
    (sum, mk) => sum + getRecurringExpenses(mk).total,
    0,
  );
}

/** Prior comparison period: tx total + recurring (matches hero MoM when filter supports comparison) */
export function getOverviewPreviousCombinedTotal(filter: TimeFilter, monthKey: MonthKey): number | null {
  const monthIdx = MONTH_KEYS.indexOf(monthKey);

  if (filter === "this-month") {
    const pk = getPreviousMonthKey(monthKey);
    if (!pk) return null;
    return getSpendSnapshot(pk).total + getRecurringExpenses(pk).total;
  }

  if (filter === "this-week") {
    return getWeeklySpendSnapshot(monthKey, 3).total + getRecurringExpenses(monthKey).total;
  }

  if (filter === "last-3-months") {
    const prevMonths = MONTH_KEYS.slice(Math.max(0, monthIdx - 5), Math.max(0, monthIdx - 2)) as MonthKey[];
    if (prevMonths.length === 0) return null;
    let sum = 0;
    for (const mk of prevMonths) {
      sum += getSpendSnapshot(mk).total + getRecurringExpenses(mk).total;
    }
    return sum;
  }

  return null;
}

/** Prior recurring-only total for payment breakdown comparison */
export function getPreviousRecurringDebitTotalForSpendFilter(
  filter: TimeFilter,
  monthKey: MonthKey,
): number | null {
  const monthIdx = MONTH_KEYS.indexOf(monthKey);

  if (filter === "this-month") {
    const pk = getPreviousMonthKey(monthKey);
    return pk ? getRecurringExpenses(pk).total : null;
  }

  if (filter === "this-week") {
    return getRecurringExpenses(monthKey).total;
  }

  if (filter === "last-3-months") {
    const prevMonths = MONTH_KEYS.slice(Math.max(0, monthIdx - 5), Math.max(0, monthIdx - 2)) as MonthKey[];
    if (prevMonths.length === 0) return null;
    return prevMonths.reduce((s, mk) => s + getRecurringExpenses(mk).total, 0);
  }

  return null;
}

function aggregateSpendInCustomRange(range: CustomDateRange): {
  total: number;
  categories: Record<CategorySlug, number>;
  transactions: Record<CategorySlug, TxRow[]>;
} {
  const categories = {} as Record<CategorySlug, number>;
  const transactions = {} as Record<CategorySlug, TxRow[]>;
  for (const slug of CATEGORY_ORDER) {
    categories[slug] = 0;
    transactions[slug] = [];
  }
  for (const mk of MONTH_KEYS) {
    const txMap = TRANSACTIONS_BY_MONTH[mk as MonthKey];
    for (const slug of CATEGORY_ORDER) {
      for (const tx of txMap[slug]) {
        if (transactionInDateRange(tx, range)) {
          const st = scaleTxRow(tx);
          categories[slug] += st.amount;
          transactions[slug].push(st);
        }
      }
    }
  }
  const total = CATEGORY_ORDER.reduce((sum, k) => sum + categories[k], 0);
  return { total, categories, transactions };
}

/** Get aggregated spend data for a time filter */
export function getFilteredSpendData(
  filter: TimeFilter,
  monthKey: MonthKey = DEFAULT_MONTH,
  customRange: CustomDateRange | null = null,
): {
  total: number;
  categories: Record<CategorySlug, number>;
  transactions: Record<CategorySlug, TxRow[]>;
  label: string;
  comparisonLabel: string | null;
  previousTotal: number | null;
} {
  if (filter === "this-week") {
    // Week 4 of the current month (last week)
    const snapshot = getWeeklySpendSnapshot(monthKey, 4);
    const prevSnapshot = getWeeklySpendSnapshot(monthKey, 3);
    return {
      total: snapshot.total,
      categories: snapshot.categories,
      transactions: snapshot.transactions,
      label: "This Week",
      comparisonLabel: "Last Week",
      previousTotal: prevSnapshot.total,
    };
  }
  
  if (filter === "this-month") {
    const snapshot = getSpendSnapshot(monthKey);
    const prevKey = getPreviousMonthKey(monthKey);
    const prevSnapshot = prevKey ? getSpendSnapshot(prevKey) : null;
    return {
      total: snapshot.total,
      categories: snapshot.categories,
      transactions: snapshot.transactions,
      label: snapshot.monthLabel,
      comparisonLabel: prevSnapshot?.monthLabel ?? null,
      previousTotal: prevSnapshot?.total ?? null,
    };
  }
  
  if (filter === "last-3-months") {
    // Aggregate last 3 months
    const monthIdx = MONTH_KEYS.indexOf(monthKey);
    const monthsToAggregate = MONTH_KEYS.slice(Math.max(0, monthIdx - 2), monthIdx + 1);
    
    const categories = {} as Record<CategorySlug, number>;
    const transactions = {} as Record<CategorySlug, TxRow[]>;
    for (const slug of CATEGORY_ORDER) {
      categories[slug] = 0;
      transactions[slug] = [];
    }
    
    for (const mk of monthsToAggregate) {
      const snap = getSpendSnapshot(mk as MonthKey);
      for (const slug of CATEGORY_ORDER) {
        categories[slug] += snap.categories[slug];
        transactions[slug] = [...transactions[slug], ...snap.transactions[slug]];
      }
    }
    
    const total = CATEGORY_ORDER.reduce((sum, k) => sum + categories[k], 0);
    
    // Previous 3 months for comparison
    const prevMonths = MONTH_KEYS.slice(Math.max(0, monthIdx - 5), Math.max(0, monthIdx - 2));
    let prevTotal: number | null = null;
    if (prevMonths.length > 0) {
      prevTotal = 0;
      for (const mk of prevMonths) {
        const snap = getSpendSnapshot(mk as MonthKey);
        prevTotal += snap.total;
      }
    }
    
    return {
      total,
      categories,
      transactions,
      label: "Last 3 Months",
      comparisonLabel: prevTotal !== null ? "Prior 3 Months" : null,
      previousTotal: prevTotal,
    };
  }
  
  // custom — optional date range; invalid/missing range falls back to selected month
  if (filter === "custom") {
    if (customRange && isValidCustomRange(customRange)) {
      const agg = aggregateSpendInCustomRange(customRange);
      return {
        total: agg.total,
        categories: agg.categories,
        transactions: agg.transactions,
        label: formatCustomRangeLabel(customRange.start, customRange.end),
        comparisonLabel: null,
        previousTotal: null,
      };
    }
    const snapshot = getSpendSnapshot(monthKey);
    return {
      total: snapshot.total,
      categories: snapshot.categories,
      transactions: snapshot.transactions,
      label: snapshot.monthLabel,
      comparisonLabel: null,
      previousTotal: null,
    };
  }

  const _exhaustive: never = filter;
  return _exhaustive;
}

/** Find new expense categories (present this period, not in previous) */
export function getNewExpenseCategories(
  filter: TimeFilter,
  monthKey: MonthKey = DEFAULT_MONTH,
  customRange: CustomDateRange | null = null,
): CategorySlug[] {
  if (filter === "custom") return [];

  const current = getFilteredSpendData(filter, monthKey, customRange);

  // Get previous period data
  let prevCategories: Record<CategorySlug, number> | null = null;
  
  if (filter === "this-week") {
    const prevWeek = getWeeklySpendSnapshot(monthKey, 3);
    prevCategories = prevWeek.categories;
  } else if (filter === "this-month") {
    const prevKey = getPreviousMonthKey(monthKey);
    if (prevKey) {
      const prevSnap = getSpendSnapshot(prevKey);
      prevCategories = prevSnap.categories;
    }
  }
  
  if (!prevCategories) return [];
  
  return CATEGORY_ORDER.filter(
    (slug) => current.categories[slug] > 0 && prevCategories![slug] === 0
  );
}
