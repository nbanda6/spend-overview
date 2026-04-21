import { parseMonthKey } from "@/lib/icici-spend";
import { SpendOverviewClient } from "./spend-overview-client";

export const metadata = {
  title: "Spend Overview | iMobile",
  description: "Your spending at a glance — ICICI iMobile prototype.",
};

export default async function SpendOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const monthKey = parseMonthKey(m);
  return (
    <SpendOverviewClient key={monthKey} initialMonthKey={monthKey} />
  );
}
