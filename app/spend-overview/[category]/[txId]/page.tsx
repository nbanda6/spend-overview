import {
  CATEGORY_META,
  DEFAULT_MONTH,
  MONTH_KEYS,
  TRANSACTIONS_BY_MONTH,
  type CategorySlug,
  type MonthKey,
} from "@/lib/icici-spend";
import { notFound } from "next/navigation";
import { TransactionDetailClient } from "./transaction-detail-client";

type PageProps = {
  params: Promise<{ category: string; txId: string }>;
  searchParams: Promise<{ m?: string; from?: string }>;
};

export default async function TransactionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { category, txId } = await params;
  const { m, from } = await searchParams;

  const slug = category as CategorySlug;
  if (!CATEGORY_META[slug]) notFound();

  const monthKey = MONTH_KEYS.includes(m as MonthKey)
    ? (m as MonthKey)
    : DEFAULT_MONTH;

  const fromSource = from ?? "services";

  const txIndex = parseInt(txId, 10);
  const rows = TRANSACTIONS_BY_MONTH[monthKey][slug];
  
  if (isNaN(txIndex) || txIndex < 0 || txIndex >= rows.length) {
    notFound();
  }

  const transaction = rows[txIndex];

  return (
    <TransactionDetailClient
      slug={slug}
      monthKey={monthKey}
      transaction={transaction}
      txIndex={txIndex}
      fromSource={fromSource}
    />
  );
}
