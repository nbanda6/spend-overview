import { parseMonthKey } from "@/lib/icici-spend";
import { RecurringListClient } from "./recurring-list-client";

export default async function RecurringExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; from?: string }>;
}) {
  const { m, from } = await searchParams;
  return (
    <RecurringListClient
      monthKey={parseMonthKey(m)}
      fromSource={from ?? "services"}
    />
  );
}
