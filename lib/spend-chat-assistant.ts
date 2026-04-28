import {
  CATEGORY_META,
  CATEGORY_ORDER,
  MONTH_KEYS,
  TRANSACTIONS_BY_MONTH,
  type CategorySlug,
  type CustomDateRange,
  type MonthKey,
  type TimeFilter,
  type TxRow,
  getFilteredSpendData,
  getMonthDateRangeIso,
  getPreviousMonthKey,
  formatInr,
  parseTransactionDisplayDate,
  scaleTxAmount,
} from "@/lib/icici-spend";

export type ChatTxItem = {
  slug: CategorySlug;
  tx: TxRow;
  href: string | null;
};

export type ChatSection = {
  title: string;
  subtitle?: string;
  items: ChatTxItem[];
};

export type ChatOutcome = {
  /** Findings text (totals, match count, optional listed-total line). */
  narrative: string;
  /** Readable recap of the same data as `sections`; omit when empty. */
  aiSummary: string | null;
  sections: ChatSection[];
};

type FlatEntry = {
  slug: CategorySlug;
  tx: TxRow;
};

const MONTH_NAME_RE =
  "(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";

function toMonthPrefix(word: string): string | null {
  const x = word.toLowerCase().replace(/\.$/, "").slice(0, 3);
  if (
    x === "jan" || x === "feb" || x === "mar" || x === "apr" || x === "may" || x === "jun" || x === "jul" || x === "aug" || x === "sep" || x === "oct" || x === "nov" || x === "dec"
  )
    return x;
  return null;
}

function monthKeyFromPrefixYear(prefix: string, year: number): MonthKey | null {
  const k = `${prefix}${year}` as MonthKey;
  return MONTH_KEYS.includes(k) ? k : null;
}

function compareMonthKeys(a: MonthKey, b: MonthKey): number {
  return MONTH_KEYS.indexOf(a) - MONTH_KEYS.indexOf(b);
}

/** Merge inclusive calendar span across one or more stored months */
function customRangeAcrossKeys(startKey: MonthKey, endKey: MonthKey): CustomDateRange | null {
  const ordered =
    compareMonthKeys(startKey, endKey) <= 0
      ? [startKey, endKey]
      : [endKey, startKey];
  const rLo = getMonthDateRangeIso(ordered[0]!);
  const rHi = getMonthDateRangeIso(ordered[1]!);
  return { start: rLo.start, end: rHi.end };
}

type PagePeriod = {
  filter: TimeFilter;
  monthKey: MonthKey;
  customRange: CustomDateRange | null;
};

type ResolvedChatPeriod = PagePeriod & {
  fromQuery: boolean;
  /** Set when the user asked for dates we don't have in the demo dataset */
  unavailableNote: string | null;
};

/**
 * If the user names a time window in natural language, use that instead of the Spend Overview selection.
 */
function resolveChatPeriod(qRaw: string, page: PagePeriod): ResolvedChatPeriod {
  const q = qRaw.trim();
  const lower = q.toLowerCase();
  const base: ResolvedChatPeriod = {
    ...page,
    fromQuery: false,
    unavailableNote: null,
  };

  // 1a) "January to March 2026" (year once at end)
  const rangeOneYearAtEnd = new RegExp(
    `\\b${MONTH_NAME_RE}\\s*(?:to|through|until|–|-|,|and)\\s*${MONTH_NAME_RE}\\s+(20\\d{2})\\b`,
    "i",
  );
  const rYe = q.match(rangeOneYearAtEnd);
  if (rYe) {
    const p1 = toMonthPrefix(rYe[1]!);
    const p2 = toMonthPrefix(rYe[2]!);
    const y = parseInt(rYe[3]!, 10);
    if (p1 && p2) {
      const k1 = monthKeyFromPrefixYear(p1, y);
      const k2 = monthKeyFromPrefixYear(p2, y);
      if (k1 && k2) {
        const span = customRangeAcrossKeys(k1, k2);
        if (span && span.start <= span.end) {
          return {
            filter: "custom",
            monthKey: page.monthKey,
            customRange: span,
            fromQuery: true,
            unavailableNote: null,
          };
        }
      }
      return {
        ...page,
        fromQuery: true,
        unavailableNote:
          "That date range isn't in your Spend Overview demo data, so this answer uses your current page filter instead.",
      };
    }
  }

  // 1b) "Jan 2026 to Mar 2026" (year on both sides)
  const rangeTwoYears = new RegExp(
    `\\b${MONTH_NAME_RE}\\s+(20\\d{2})\\s*(?:to|through|until|–|-|,|and)\\s*${MONTH_NAME_RE}\\s+(20\\d{2})\\b`,
    "i",
  );
  const rm = q.match(rangeTwoYears);
  if (rm) {
    const p1 = toMonthPrefix(rm[1]!);
    const y1 = parseInt(rm[2]!, 10);
    const p2 = toMonthPrefix(rm[3]!);
    const y2 = parseInt(rm[4]!, 10);
    if (p1 && p2) {
      const k1 = monthKeyFromPrefixYear(p1, y1);
      const k2 = monthKeyFromPrefixYear(p2, y2);
      if (k1 && k2) {
        const span = customRangeAcrossKeys(k1, k2);
        if (span && span.start <= span.end) {
          return {
            filter: "custom",
            monthKey: page.monthKey,
            customRange: span,
            fromQuery: true,
            unavailableNote: null,
          };
        }
      }
      return {
        ...page,
        fromQuery: true,
        unavailableNote:
          "That date range isn't in your Spend Overview demo data, so this answer uses your current page filter instead.",
      };
    }
  }

  // 2) Relative windows (anchor end on the month selected on Spend Overview)
  if (/\bpast\s+3\s+months?\b/i.test(lower) || /\blast\s+3\s+months?\b/i.test(lower)) {
    return {
      filter: "last-3-months",
      monthKey: page.monthKey,
      customRange: null,
      fromQuery: true,
      unavailableNote: null,
    };
  }
  if (/\bthis\s+week\b/i.test(lower)) {
    return {
      filter: "this-week",
      monthKey: page.monthKey,
      customRange: null,
      fromQuery: true,
      unavailableNote: null,
    };
  }
  if (/\bthis\s+month\b/i.test(lower) || /\bcurrent\s+month\b/i.test(lower)) {
    return {
      filter: "this-month",
      monthKey: page.monthKey,
      customRange: null,
      fromQuery: true,
      unavailableNote: null,
    };
  }
  if (/\blast\s+month\b/i.test(lower) || /\bprevious\s+month\b/i.test(lower)) {
    const prev = getPreviousMonthKey(page.monthKey);
    if (prev) {
      return {
        filter: "this-month",
        monthKey: prev,
        customRange: null,
        fromQuery: true,
        unavailableNote: null,
      };
    }
  }

  // 3) Single calendar month + year
  const singleMy = new RegExp(`\\b${MONTH_NAME_RE}\\s+(20\\d{2})\\b`, "i");
  const sm = singleMy.exec(q);
  if (sm) {
    const p = toMonthPrefix(sm[1]!);
    const y = parseInt(sm[2]!, 10);
    if (p) {
      const mk = monthKeyFromPrefixYear(p, y);
      if (mk) {
        return {
          filter: "this-month",
          monthKey: mk,
          customRange: null,
          fromQuery: true,
          unavailableNote: null,
        };
      }
      return {
        ...base,
        fromQuery: true,
        unavailableNote:
          "That month isn't in your Spend Overview demo data, so the answer below uses your current page filter instead.",
      };
    }
  }

  const monthWithContext = new RegExp(
    `(?:\\b(?:in|during|for|from)\\s+)(${MONTH_NAME_RE})(?!\\s+20\\d{2})`,
    "i",
  );
  const mwc = monthWithContext.exec(q);
  if (mwc) {
    const p = toMonthPrefix(mwc[1]!);
    if (p) {
      const anchorY = parseInt(page.monthKey.slice(3), 10);
      const mk = monthKeyFromPrefixYear(p, anchorY);
      if (mk) {
        return {
          filter: "this-month",
          monthKey: mk,
          customRange: null,
          fromQuery: true,
          unavailableNote: null,
        };
      }
      return {
        ...page,
        fromQuery: true,
        unavailableNote:
          "That month isn't in your Spend Overview demo data, so this answer uses your current page filter instead.",
      };
    }
  }

  return base;
}

function applyPeriodContext(
  resolved: ResolvedChatPeriod,
  _periodLabel: string,
  narrative: string,
): string {
  if (resolved.unavailableNote) {
    return `${resolved.unavailableNote}\n\n${narrative}`;
  }
  return narrative;
}

function wrapOutcome(
  resolved: ResolvedChatPeriod,
  periodName: string,
  outcome: ChatOutcome,
): ChatOutcome {
  return {
    ...outcome,
    narrative: applyPeriodContext(resolved, periodName, outcome.narrative),
  };
}

function sumChatSections(sections: ChatSection[]): number {
  let total = 0;
  for (const sec of sections) {
    for (const item of sec.items) {
      total += item.tx.amount;
    }
  }
  return total;
}

/** ISO week start (Monday) in local time for grouping */
function startOfIsoWeekMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = x.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** One figure for the “Weekly: ₹…” line — single week total, or average when multiple weeks appear */
function weeklySummaryAmount(entries: FlatEntry[], sumTotal: number): number | null {
  const weekTotals = new Map<number, number>();
  for (const e of entries) {
    const d = parseTransactionDisplayDate(e.tx.date);
    if (!d) continue;
    const k = startOfIsoWeekMonday(d).getTime();
    weekTotals.set(k, (weekTotals.get(k) ?? 0) + e.tx.amount);
  }
  if (weekTotals.size === 0) return null;
  if (weekTotals.size === 1) return [...weekTotals.values()][0]!;
  return Math.round(sumTotal / weekTotals.size);
}

function periodPhraseForSummary(periodLabel: string): string {
  const t = periodLabel.trim();
  if (/^this\s+week$/i.test(t)) return "this week";
  if (/^last\s+3\s+months$/i.test(t)) return "over the last three months";
  if (t.includes("–") || /\s[–-]\s/.test(t)) return `across ${t}`;
  return `in ${t}`;
}

function categoryShort(slug: CategorySlug): string {
  const m: Record<CategorySlug, string> = {
    shopping: "shopping",
    "food-dining": "food",
    utilities: "utility",
    travel: "travel",
    miscellaneous: "misc",
  };
  return m[slug];
}

/** Only include weekly/per-week figures when the user asks for that breakdown explicitly */
function userAskedForWeeklyBreakdown(q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return false;
  return (
    /\bweekly\b/.test(s) ||
    /\bper week\b/.test(s) ||
    /\bweek by week\b/.test(s) ||
    /\bby week\b/.test(s) ||
    /\beach week\b/.test(s) ||
    /\bavg(?:\.?)\s+per\s+week\b/.test(s) ||
    /\baverage\s+per\s+week\b/.test(s) ||
    /\bper-week\b/.test(s) ||
    /\bsplit\s+by\s+week\b/.test(s)
  );
}

/** Short, conversational recap (shown at the bottom of the assistant message) */
function buildNaturalSummaryFromEntries(
  entries: FlatEntry[],
  periodLabel: string,
  userQuery: string,
): string {
  const n = entries.length;
  if (n === 0) return "";

  const sumTotal = entries.reduce((acc, e) => acc + e.tx.amount, 0);
  const pPhrase = periodPhraseForSummary(periodLabel);

  const catTotals = {} as Record<CategorySlug, number>;
  for (const slug of CATEGORY_ORDER) catTotals[slug] = 0;
  for (const e of entries) {
    catTotals[e.slug] += e.tx.amount;
  }

  const activeCats = CATEGORY_ORDER.filter((s) => catTotals[s] > 0);
  activeCats.sort((a, b) => catTotals[b]! - catTotals[a]!);

  let topMerchant = "";
  let topMerchantAmt = 0;
  const merchantTotals = new Map<string, number>();
  for (const e of entries) {
    merchantTotals.set(
      e.tx.merchant,
      (merchantTotals.get(e.tx.merchant) ?? 0) + e.tx.amount,
    );
  }
  for (const [name, amt] of merchantTotals) {
    if (amt > topMerchantAmt) {
      topMerchantAmt = amt;
      topMerchant = name;
    }
  }

  let upi = 0;
  let card = 0;
  let nb = 0;
  for (const e of entries) {
    const ch = e.tx.channel;
    if (ch === "UPI") upi += 1;
    else if (ch === "Card") card += 1;
    else if (ch === "Net Banking") nb += 1;
  }

  const weekly = weeklySummaryAmount(entries, sumTotal);
  const showWeekly =
    userAskedForWeeklyBreakdown(userQuery) && weekly != null && n > 1;

  const payTag =
    upi >= n
      ? "UPI"
      : card >= n
        ? "card"
        : nb >= n
          ? "net banking"
          : null;

  // Single category — mirrors: “You spent ₹X on Food & Dining this month. Weekly: ₹…. Merchant …”
  if (activeCats.length === 1 && activeCats[0]) {
    const slug = activeCats[0];
    const catLabel = CATEGORY_META[slug].label;
    const amt = catTotals[slug]!;
    const sentences: string[] = [];
    sentences.push(`You spent ${formatInr(amt)} on ${catLabel} ${pPhrase}.`);
    if (showWeekly) {
      sentences.push(`Weekly: ${formatInr(weekly!)}.`);
    }
    if (n === 1 && topMerchant) {
      sentences.push(`${topMerchant} (${formatInr(topMerchantAmt)}) was that spend.`);
    } else if (topMerchant) {
      sentences.push(
        `${topMerchant} (${formatInr(topMerchantAmt)}) was your biggest ${categoryShort(slug)} spend.`,
      );
    }
    if (payTag && n > 1) {
      sentences.push(`Most of these were on ${payTag}.`);
    }
    return sentences.join(" ");
  }

  // Multiple categories
  const topSlug = activeCats[0]!;
  const topLabel = CATEGORY_META[topSlug].label;
  const topAmt = catTotals[topSlug]!;
  const parts: string[] = [];
  parts.push(
    `You spent ${formatInr(sumTotal)} across ${n} transactions ${pPhrase}. ${topLabel} led with ${formatInr(topAmt)}.`,
  );
  if (showWeekly) {
    parts.push(`Weekly: ${formatInr(weekly!)}.`);
  }
  if (topMerchant && n > 1) {
    parts.push(
      `${topMerchant} (${formatInr(topMerchantAmt)}) was your biggest single merchant.`,
    );
  } else if (topMerchant && n === 1) {
    parts.push(`${topMerchant} (${formatInr(topMerchantAmt)}) was the only merchant.`);
  }
  if (!payTag && n > 1) {
    const bits: string[] = [];
    if (upi) bits.push(`${upi} on UPI`);
    if (card) bits.push(`${card} on card`);
    if (nb) bits.push(`${nb} via net banking`);
    if (bits.length) parts.push(`Payments: ${bits.join(", ")}.`);
  } else if (payTag && n > 1) {
    parts.push(`Nearly all of it was on ${payTag}.`);
  }

  return parts.join(" ");
}

/** Flowing prose for the full-period overview (matches Spend Overview filter). */
function buildPeriodOverviewNarrative(
  spend: {
    total: number;
    categories: Record<CategorySlug, number>;
    comparisonLabel: string | null;
    previousTotal: number | null;
  },
  flat: FlatEntry[],
  periodName: string,
  periodIntro: "page" | "query",
): string {
  const total = spend.total;
  const n = flat.length;
  const catRanked = CATEGORY_ORDER.map((slug) => ({
    slug,
    amt: spend.categories[slug],
    label: CATEGORY_META[slug].label,
  }))
    .filter((c) => c.amt > 0)
    .sort((a, b) => b.amt - a.amt);

  const parts: string[] = [];

  if (periodIntro === "query") {
    parts.push(
      `Here is a plain-language summary for ${periodName} — the period you named in your message.`,
    );
  } else {
    parts.push(
      `This summary is for the same window you selected on Spend Overview: ${periodName}.`,
    );
  }

  if (n === 0 || total === 0) {
    parts.push(
      "There is no debit spend recorded for that period in your overview data.",
    );
    return parts.join("\n\n");
  }

  parts.push(
    `Overall you spent ${formatInr(total)} across ${n} debit transaction${n !== 1 ? "s" : ""}.`,
  );

  const top = catRanked[0];
  if (top && catRanked.length === 1) {
    parts.push(`It was entirely in ${top.label} (${formatInr(top.amt)}).`);
  } else if (top && catRanked.length > 1) {
    const pctTop = Math.round((top.amt / total) * 100);
    const second = catRanked[1]!;
    const pct2 = Math.round((second.amt / total) * 100);
    parts.push(
      `${top.label} led the spend at ${formatInr(top.amt)} (about ${pctTop}% of the total). Next was ${second.label} at ${formatInr(second.amt)} (${pct2}%).`,
    );
    if (catRanked.length > 2) {
      const tail = catRanked
        .slice(2)
        .map((c) => `${c.label} (${formatInr(c.amt)})`)
        .join(", ");
      parts.push(`Smaller amounts went to ${tail}.`);
    }
  }

  const { comparisonLabel, previousTotal } = spend;
  if (comparisonLabel && previousTotal != null && previousTotal > 0) {
    const delta = total - previousTotal;
    const pct = Math.round((Math.abs(delta) / previousTotal) * 100);
    if (delta === 0) {
      parts.push(
        `That is in line with ${comparisonLabel}, when you also spent about ${formatInr(previousTotal)}.`,
      );
    } else if (delta > 0) {
      parts.push(
        `Compared with ${comparisonLabel} (${formatInr(previousTotal)}), this period is higher — roughly ${pct}% more overall.`,
      );
    } else {
      parts.push(
        `Compared with ${comparisonLabel} (${formatInr(previousTotal)}), this period is lower — about ${pct}% less overall.`,
      );
    }
  }

  const pay = describePaymentMixSentence(flat);
  if (pay) parts.push(pay);

  parts.push(
    "Below are sample transactions by category; a short recap is at the bottom of this reply.",
  );

  return parts.join("\n\n");
}

function describePaymentMixSentence(entries: FlatEntry[]): string | null {
  const n = entries.length;
  if (n === 0) return null;

  let upi = 0;
  let card = 0;
  let nb = 0;
  let unspecified = 0;
  for (const e of entries) {
    const ch = e.tx.channel;
    if (!ch) unspecified += 1;
    else if (ch === "UPI") upi += 1;
    else if (ch === "Card") card += 1;
    else if (ch === "Net Banking") nb += 1;
  }

  const half = n / 2;
  if (upi >= n) return "All of these were paid via UPI.";
  if (card >= n) return "All of these were paid by card.";
  if (nb >= n) return "All of these were paid via net banking.";
  if (upi >= half && upi >= card && upi >= nb) {
    return "Most payments were on UPI; card and net banking made up the rest.";
  }
  if (card >= half && card >= upi) {
    return "Card payments dominated for this period; UPI and other methods filled in the remainder.";
  }
  if (nb >= half && nb >= upi) {
    return "Net banking was the most common channel here, with UPI and card for the other spends.";
  }

  const bits: string[] = [];
  if (upi) bits.push(`${upi} on UPI`);
  if (card) bits.push(`${card} by card`);
  if (nb) bits.push(`${nb} via net banking`);
  if (unspecified) bits.push(`${unspecified} with no channel tagged`);
  return `How you paid: ${bits.join(", ")}.`;
}

function finalizeWithSummary(
  mainReply: string,
  sections: ChatSection[],
  entries: FlatEntry[],
  periodLabel: string,
  userQuery: string,
): ChatOutcome {
  const base = withListedTotal(mainReply.trim(), sections);
  if (entries.length === 0) {
    return { narrative: base.narrative, aiSummary: null, sections: base.sections };
  }
  return {
    narrative: base.narrative,
    aiSummary: buildNaturalSummaryFromEntries(entries, periodLabel, userQuery),
    sections: base.sections,
  };
}

/** Append listed-transactions total whenever sections include rows */
function withListedTotal(main: string, sections: ChatSection[]): ChatOutcome {
  const trimmed = main.trim();
  if (sections.length === 0) {
    return { narrative: trimmed, aiSummary: null, sections };
  }
  const listed = sumChatSections(sections);
  const suffix = `\nListed in detail below: ${formatInr(listed)}.`;
  return {
    narrative: trimmed.endsWith(".") ? `${trimmed}${suffix}` : `${trimmed}.${suffix}`,
    aiSummary: null,
    sections,
  };
}

function getSearchMonthsForFilter(
  filter: TimeFilter,
  monthKey: MonthKey,
): MonthKey[] {
  if (filter === "last-3-months") {
    const monthIdx = MONTH_KEYS.indexOf(monthKey);
    return MONTH_KEYS.slice(Math.max(0, monthIdx - 2), monthIdx + 1) as MonthKey[];
  }
  if (filter === "custom") {
    return [...MONTH_KEYS] as MonthKey[];
  }
  return [monthKey];
}

/** Resolve drill-down URL index + month for a transaction row */
export function resolveTransactionLink(
  slug: CategorySlug,
  tx: TxRow,
  searchMonths: MonthKey[],
): { monthKey: MonthKey; index: number } | null {
  for (const mk of searchMonths) {
    const rows = TRANSACTIONS_BY_MONTH[mk][slug];
    const idx = rows.findIndex(
      (r) =>
        r.merchant === tx.merchant &&
        r.date === tx.date &&
        scaleTxAmount(r.amount) === tx.amount &&
        r.channel === tx.channel,
    );
    if (idx >= 0) return { monthKey: mk, index: idx };
  }
  return null;
}

function flattenSpend(
  filter: TimeFilter,
  monthKey: MonthKey,
  customRange: CustomDateRange | null,
): FlatEntry[] {
  const spend = getFilteredSpendData(filter, monthKey, customRange);
  const out: FlatEntry[] = [];
  for (const slug of CATEGORY_ORDER) {
    for (const tx of spend.transactions[slug]) {
      out.push({ slug, tx });
    }
  }
  return out;
}

function withLinks(
  entries: FlatEntry[],
  searchMonths: MonthKey[],
  fromSource: string,
): ChatTxItem[] {
  return entries.map(({ slug, tx }) => {
    const link = resolveTransactionLink(slug, tx, searchMonths);
    const href = link
      ? `/spend-overview/${slug}/${link.index}?m=${link.monthKey}&from=${encodeURIComponent(fromSource)}`
      : null;
    return { slug, tx, href };
  });
}

const CATEGORY_ALIASES: { kw: RegExp; slug: CategorySlug }[] = [
  { kw: /\b(shopping|amazon|flipkart|retail|clothes)\b/i, slug: "shopping" },
  {
    kw: /\b(food|dining|restaurant|grocery|groceries|swiggy|zomato|big\s*basket)\b/i,
    slug: "food-dining",
  },
  {
    kw: /\b(utilities|utility|bills|electric|bescom|airtel|broadband|gas\s*\(|mobile\s*\()\b/i,
    slug: "utilities",
  },
  {
    kw: /\b(travel|uber|flight|petrol|metro|commute|indi\s*go|hp\s*\))\b/i,
    slug: "travel",
  },
  {
    kw: /\b(misc|miscellaneous|fee|wallet|unknown)\b/i,
    slug: "miscellaneous",
  },
];

function detectCategorySlugs(q: string): CategorySlug[] {
  const found = new Set<CategorySlug>();
  for (const { kw, slug } of CATEGORY_ALIASES) {
    if (kw.test(q)) found.add(slug);
  }
  return [...found];
}

function parseAmountFilter(q: string): { min?: number; max?: number } {
  let min: number | undefined;
  let max: number | undefined;

  const overM = q.match(
    /\b(?:over|above|more than|at least)\s*(?:rupees?|₹|rs\.?|inr)?\s*([\d,]+)/i,
  );
  const underM = q.match(
    /\b(?:under|below|less than|up to)\s*(?:rupees?|₹|rs\.?|inr)?\s*([\d,]+)/i,
  );

  if (overM) {
    min = parseInt(overM[1]!.replace(/,/g, ""), 10);
  }
  if (underM) {
    max = parseInt(underM[1]!.replace(/,/g, ""), 10);
  }

  return { min, max };
}

function parseTopN(q: string): number | null {
  const m = q.match(/\b(?:top|first|last)\s+(\d{1,2})\b/i);
  if (m) return Math.min(50, Math.max(1, parseInt(m[1]!, 10)));
  return null;
}

type Channel = NonNullable<TxRow["channel"]>;

function detectChannel(q: string): Channel | null {
  if (/\bupi\b/i.test(q)) return "UPI";
  if (/\b(card|credit|debit)\b/i.test(q)) return "Card";
  if (/\b(net banking|netbanking|nb)\b/i.test(q)) return "Net Banking";
  return null;
}

function merchantTokens(q: string): string[] {
  const stop = new Set(
    "the a an my your our me we us it there their one any show list all transactions spending spend spent for in on at of to from how what when where why top largest smallest biggest highest lowest summary overview summaries summarize summarise period month week weeks day days year years past current previous calendar during between through until starting ending selected selection asked specify bar filter demo data payment payments pay paytm about same page message transaction".split(
      " ",
    ),
  );
  const rails =
    "upi card cards credit debit banking netbanking nb net txn txns atm".split(" ");
  for (const x of rails) stop.add(x);
  const months =
    "january february march april may june july august september october november december jan feb mar apr jun jul aug sep oct nov dec".split(
      " ",
    );
  for (const m of months) stop.add(m);
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
}

export function runSpendChatQuery(
  query: string,
  filter: TimeFilter,
  monthKey: MonthKey,
  fromSource: string,
  customRange: CustomDateRange | null = null,
): ChatOutcome {
  const qRaw = query.trim();
  if (!qRaw) {
    return {
      narrative:
        "Ask about your spending for this period — totals, categories, UPI vs card, or largest debits. You can also name a month or range (for example “January 2026” or “February to April 2026”).",
      aiSummary: null,
      sections: [],
    };
  }

  const pagePeriod: PagePeriod = { filter, monthKey, customRange };
  const resolved = resolveChatPeriod(qRaw, pagePeriod);

  const spend = getFilteredSpendData(
    resolved.filter,
    resolved.monthKey,
    resolved.customRange,
  );
  const searchMonths = getSearchMonthsForFilter(
    resolved.filter,
    resolved.monthKey,
  );
  const flat = flattenSpend(
    resolved.filter,
    resolved.monthKey,
    resolved.customRange,
  );
  const periodName = spend.label;

  const periodIntro: "page" | "query" =
    resolved.fromQuery && !resolved.unavailableNote ? "query" : "page";

  const slugsFilter = detectCategorySlugs(qRaw);
  const { min, max } = parseAmountFilter(qRaw);
  const channel = detectChannel(qRaw);
  const topN = parseTopN(qRaw);
  const tokens = merchantTokens(qRaw);

  const summaryLike =
    /\b(summarize|summarise|summary|overview|breakdown|how much|total spend|spend total|totals?|this\s+period)\b/i.test(
      qRaw,
    );

  let working = [...flat];

  if (slugsFilter.length > 0) {
    working = working.filter((e) => slugsFilter.includes(e.slug));
  }

  if (channel) {
    working = working.filter((e) => e.tx.channel === channel);
  }

  if (min !== undefined) {
    working = working.filter((e) => e.tx.amount >= min);
  }
  if (max !== undefined) {
    working = working.filter((e) => e.tx.amount <= max);
  }

  if (tokens.length > 0 && slugsFilter.length === 0 && !summaryLike) {
    working = working.filter((e) => {
      const m = e.tx.merchant.toLowerCase();
      return tokens.some((t) => m.includes(t));
    });
  }

  if (/\b(largest|biggest|highest|max|expensive)\b/i.test(qRaw)) {
    working.sort((a, b) => b.tx.amount - a.tx.amount);
    working = working.slice(0, topN ?? 10);
  } else if (/\b(smallest|lowest|min|cheapest)\b/i.test(qRaw)) {
    working.sort((a, b) => a.tx.amount - b.tx.amount);
    working = working.slice(0, topN ?? 10);
  } else if (topN) {
    working.sort((a, b) => b.tx.amount - a.tx.amount);
    working = working.slice(0, topN);
  }

  if (summaryLike && slugsFilter.length === 0 && !channel && min === undefined && max === undefined) {
    const narrativeBody = buildPeriodOverviewNarrative(
      spend,
      flat,
      periodName,
      periodIntro,
    );

    const sections: ChatSection[] = [];
    for (const slug of CATEGORY_ORDER) {
      const txs = flat.filter((e) => e.slug === slug);
      if (txs.length === 0) continue;
      const sorted = [...txs].sort((a, b) => b.tx.amount - a.tx.amount);
      const pick = sorted.slice(0, 5);
      sections.push({
        title: CATEGORY_META[slug].label,
        subtitle: `Top ${pick.length} debits in this category for this period`,
        items: withLinks(pick, searchMonths, fromSource),
      });
    }

    return wrapOutcome(
      resolved,
      periodName,
      finalizeWithSummary(narrativeBody, sections, flat, periodName, qRaw),
    );
  }

  if (working.length === 0) {
    return wrapOutcome(resolved, periodName, {
      narrative: `No transactions matched in ${periodName}. Try broader words (e.g. “UPI”, “food”, “largest”), adjust the month or range in your message, or widen the filters.`,
      aiSummary: null,
      sections: [],
    });
  }

  let reply = "";
  const listIntent = /\b(show|list)\b/i.test(qRaw);
  const questionIntent = /\?\s*$/.test(qRaw);
  if (listIntent && !questionIntent) {
    reply += "Listed below — ";
  } else if (
    questionIntent &&
    /\b(how much|what did|where|which|did i)\b/i.test(qRaw) &&
    !summaryLike
  ) {
    reply += "Here’s the answer from your data — ";
  }

  reply += `Found ${working.length} matching transaction${working.length !== 1 ? "s" : ""} for ${periodName}`;
  if (slugsFilter.length === 1) {
    reply += ` · ${CATEGORY_META[slugsFilter[0]!].label}`;
  }
  if (channel) reply += ` · ${channel}`;
  reply += ".";

  const grouped = new Map<CategorySlug, FlatEntry[]>();
  for (const slug of CATEGORY_ORDER) grouped.set(slug, []);
  for (const e of working) {
    grouped.get(e.slug)!.push(e);
  }

  const sections: ChatSection[] = [];
  for (const slug of CATEGORY_ORDER) {
    const list = grouped.get(slug) ?? [];
    if (list.length === 0) continue;
    sections.push({
      title: CATEGORY_META[slug].label,
      subtitle: `${list.length} item${list.length !== 1 ? "s" : ""}`,
      items: withLinks(list, searchMonths, fromSource),
    });
  }

  return wrapOutcome(
    resolved,
    periodName,
    finalizeWithSummary(reply, sections, working, periodName, qRaw),
  );
}

/**
 * Builds structured spend context for Claude + the same deterministic outcome as {@link runSpendChatQuery}
 * (sections / links stay aligned with matcher logic).
 */
export function getSpendChatLlmPack(
  query: string,
  filter: TimeFilter,
  monthKey: MonthKey,
  fromSource: string,
  customRange: CustomDateRange | null,
): {
  outcome: ChatOutcome;
  contextJson: Record<string, unknown>;
} {
  const outcome = runSpendChatQuery(query, filter, monthKey, fromSource, customRange);
  const pagePeriod: PagePeriod = { filter, monthKey, customRange };
  const resolved = resolveChatPeriod(query.trim(), pagePeriod);
  const spend = getFilteredSpendData(resolved.filter, resolved.monthKey, resolved.customRange);
  const flat = flattenSpend(resolved.filter, resolved.monthKey, resolved.customRange);

  const txsFromSections = outcome.sections.flatMap((s) =>
    s.items.map((it) => ({
      category: CATEGORY_META[it.slug].label,
      merchant: it.tx.merchant,
      date: it.tx.date,
      amountInr: it.tx.amount,
      channel: it.tx.channel ?? null,
    })),
  );

  const topByAmount = [...flat]
    .sort((a, b) => b.tx.amount - a.tx.amount)
    .slice(0, 35)
    .map((e) => ({
      category: CATEGORY_META[e.slug].label,
      merchant: e.tx.merchant,
      date: e.tx.date,
      amountInr: e.tx.amount,
      channel: e.tx.channel ?? null,
    }));

  const byCategoryInr = Object.fromEntries(
    CATEGORY_ORDER.filter((s) => spend.categories[s] > 0).map((s) => [
      CATEGORY_META[s].label,
      spend.categories[s],
    ]),
  );

  const contextJson: Record<string, unknown> = {
    userQuery: query.trim(),
    periodLabel: spend.label,
    timeWindowNote: resolved.unavailableNote,
    usedDifferentPeriodFromMessage: resolved.fromQuery,
    aggregates: {
      totalInr: spend.total,
      transactionCount: flat.length,
      byCategoryInr,
      comparison: spend.comparisonLabel
        ? {
            versusLabel: spend.comparisonLabel,
            previousPeriodTotalInr: spend.previousTotal,
          }
        : null,
    },
    transactionsMatchingQuestion: txsFromSections.slice(0, 100),
    topTransactionsByAmountInPeriod: topByAmount,
  };

  return { outcome, contextJson };
}
