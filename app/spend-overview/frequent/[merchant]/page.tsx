import {
  getFrequentApps,
  getTransactionsForMerchant,
  parseMonthKey,
} from "@/lib/icici-spend";
import { notFound } from "next/navigation";
import { MerchantTxListClient } from "./merchant-tx-list-client";

export default async function FrequentMerchantTxPage({
  params,
  searchParams,
}: {
  params: Promise<{ merchant: string }>;
  searchParams: Promise<{ m?: string; from?: string }>;
}) {
  const { merchant: encoded } = await params;
  const { m, from } = await searchParams;
  const merchant = decodeURIComponent(encoded);
  const monthKey = parseMonthKey(m);
  const fromSource = from ?? "services";

  const items = getTransactionsForMerchant(monthKey, merchant);
  if (items.length === 0) notFound();

  const apps = getFrequentApps(monthKey);
  const meta = apps.find((a) => a.name === merchant || a.id === merchant);
  const accentColor = meta?.color ?? "#64748B";

  return (
    <MerchantTxListClient
      merchant={merchant}
      monthKey={monthKey}
      fromSource={fromSource}
      items={items}
      accentColor={accentColor}
    />
  );
}
