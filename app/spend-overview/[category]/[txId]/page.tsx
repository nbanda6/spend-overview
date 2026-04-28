import {
  CATEGORY_META,
  DEFAULT_MONTH,
  MONTH_KEYS,
  buildSpendOverviewPeriodQuery,
  getFilteredCategoryTransactions,
  parseCustomRangeFromSearch,
  parseTimeFilter,
  type CategorySlug,
  type MonthKey,
} from "@/lib/icici-spend";
import { notFound } from "next/navigation";
import { TransactionDetailClient } from "./transaction-detail-client";

type PageProps = {
  params: Promise<{ category: string; txId: string }>;
  searchParams: Promise<{ m?: string; from?: string; f?: string; start?: string; end?: string }>;
};

export default async function TransactionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { category, txId } = await params;
  const { m, from, f, start, end } = await searchParams;

  const slug = category as CategorySlug;
  if (!CATEGORY_META[slug]) notFound();

  const monthKey = MONTH_KEYS.includes(m as MonthKey)
    ? (m as MonthKey)
    : DEFAULT_MONTH;

  const fromSource = from ?? "services";
  const timeFilter = parseTimeFilter(f);
  const customRange = timeFilter === "custom" ? parseCustomRangeFromSearch(start, end) : null;
  const periodQuery = buildSpendOverviewPeriodQuery(monthKey, fromSource, timeFilter, customRange);

  const txIndex = parseInt(txId, 10);
  const filtered = getFilteredCategoryTransactions(slug, timeFilter, monthKey, customRange);

  if (isNaN(txIndex) || txIndex < 0 || txIndex >= filtered.length) {
    notFound();
  }

  const transaction = filtered[txIndex];

  return (
    <TransactionDetailClient
      key={`${monthKey}-${txId}-${slug}`}
      slug={slug}
      monthKey={monthKey}
      transaction={transaction}
      txIndex={txIndex}
      periodQuery={periodQuery}
    />
  );
}
