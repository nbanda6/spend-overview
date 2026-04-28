import {
  buildSpendOverviewPeriodQuery,
  getFilteredSpendData,
  getMonthDateRangeIso,
  getTransactionsForPaymentType,
  isPaymentTypeParam,
  parseCustomRangeFromSearch,
  parseMonthKey,
  parseTimeFilter,
} from "@/lib/icici-spend";
import { notFound } from "next/navigation";
import { PaymentTxListClient } from "./payment-tx-list-client";

type PageProps = {
  params: Promise<{ paymentType: string }>;
  searchParams: Promise<{ m?: string; from?: string; f?: string; start?: string; end?: string }>;
};

export default async function PaymentTypeDrillPage({ params, searchParams }: PageProps) {
  const { paymentType: raw } = await params;
  const sp = await searchParams;

  if (!isPaymentTypeParam(raw)) notFound();

  const paymentType = raw;
  const monthKey = parseMonthKey(sp.m);
  const fromSource = sp.from ?? "services";
  const timeFilter = parseTimeFilter(sp.f);
  const customRangeArg =
    timeFilter === "custom"
      ? parseCustomRangeFromSearch(sp.start, sp.end) ?? getMonthDateRangeIso(monthKey)
      : null;

  const periodQuery = buildSpendOverviewPeriodQuery(
    monthKey,
    fromSource,
    timeFilter,
    customRangeArg,
  );

  const spend = getFilteredSpendData(timeFilter, monthKey, customRangeArg);

  const items = getTransactionsForPaymentType(paymentType, monthKey, customRangeArg, timeFilter);

  return (
    <PaymentTxListClient
      paymentType={paymentType}
      periodLabel={spend.label}
      fromSource={fromSource}
      periodQuery={periodQuery}
      items={items}
    />
  );
}
