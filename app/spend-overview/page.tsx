import {
  getMonthDateRangeIso,
  parseCustomRangeFromSearch,
  parseMonthKey,
  parseTimeFilter,
} from "@/lib/icici-spend";
import { SpendOverviewClient } from "./spend-overview-client";

export const metadata = {
  title: "Spend Overview | iMobile",
  description: "Your spending at a glance — ICICI iMobile prototype.",
};

export default async function SpendOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; from?: string; f?: string; start?: string; end?: string }>;
}) {
  const sp = await searchParams;
  const monthKey = parseMonthKey(sp.m);
  const backHref = sp.from === "home" ? "/" : "/services";
  const initialTimeFilter = parseTimeFilter(sp.f);
  const initialCustomRange =
    initialTimeFilter === "custom"
      ? parseCustomRangeFromSearch(sp.start, sp.end) ?? getMonthDateRangeIso(monthKey)
      : undefined;

  return (
    <SpendOverviewClient
      initialMonthKey={monthKey}
      initialTimeFilter={initialTimeFilter}
      initialCustomRange={initialCustomRange}
      backHref={backHref}
      fromSource={sp.from ?? "services"}
    />
  );
}
