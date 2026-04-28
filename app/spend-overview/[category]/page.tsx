import { notFound } from "next/navigation";
import { CategoryDrillClient } from "./category-drill-client";
import {
  CATEGORY_META,
  buildSpendOverviewPeriodQuery,
  isCategorySlug,
  parseCustomRangeFromSearch,
  parseMonthKey,
  parseTimeFilter,
  type CategorySlug,
  type CustomDateRange,
} from "@/lib/icici-spend";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ m?: string; from?: string; f?: string; start?: string; end?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  if (!isCategorySlug(category)) return { title: "Not found" };
  return {
    title: `${CATEGORY_META[category as CategorySlug].label} | Spend Overview`,
  };
}

export default async function CategoryDrillPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { m, from, f, start, end } = await searchParams;
  if (!isCategorySlug(category)) notFound();
  const fromSource = from ?? "services";
  const monthKey = parseMonthKey(m);
  const timeFilter = parseTimeFilter(f);
  let customRange: CustomDateRange | null = null;
  if (timeFilter === "custom") {
    customRange = parseCustomRangeFromSearch(start, end);
  }
  const periodQuery = buildSpendOverviewPeriodQuery(monthKey, fromSource, timeFilter, customRange);

  return (
    <CategoryDrillClient
      slug={category}
      monthKey={monthKey}
      timeFilter={timeFilter}
      customRange={customRange}
      periodQuery={periodQuery}
    />
  );
}
