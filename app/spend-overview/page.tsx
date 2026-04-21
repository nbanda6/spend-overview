import { parseMonthKey } from "@/lib/icici-spend";
import { SpendOverviewClient } from "./spend-overview-client";

export const metadata = {
  title: "Spend Overview | iMobile",
  description: "Your spending at a glance — ICICI iMobile prototype.",
};

export default async function SpendOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; from?: string }>;
}) {
  const { m, from } = await searchParams;
  const monthKey = parseMonthKey(m);
  const backHref = from === "home" ? "/" : "/services";
  return (
    <SpendOverviewClient key={monthKey} initialMonthKey={monthKey} backHref={backHref} fromSource={from ?? "services"} />
  );
}
