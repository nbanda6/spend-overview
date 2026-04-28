import {
  DEFAULT_MONTH,
  MONTH_KEYS,
  getPreviousRecurringPayeeAmount,
  getRecurringPayeeForMonth,
  type MonthKey,
} from "@/lib/icici-spend";
import { notFound } from "next/navigation";
import { RecurringDetailClient } from "./recurring-detail-client";

type PageProps = {
  params: Promise<{ payeeId: string }>;
  searchParams: Promise<{ m?: string; from?: string }>;
};

export default async function RecurringPayeeDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { payeeId } = await params;
  const { m, from } = await searchParams;

  const monthKey = MONTH_KEYS.includes(m as MonthKey) ? (m as MonthKey) : DEFAULT_MONTH;
  const fromSource = from ?? "services";

  const payee = getRecurringPayeeForMonth(monthKey, payeeId);
  if (!payee) notFound();

  const previousAmount = getPreviousRecurringPayeeAmount(monthKey, payeeId);

  return (
    <RecurringDetailClient
      monthKey={monthKey}
      payee={payee}
      previousAmount={previousAmount}
      fromSource={fromSource}
    />
  );
}
