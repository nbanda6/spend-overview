import { notFound } from "next/navigation";
import { CategoryDrillClient } from "./category-drill-client";
import {
  CATEGORY_META,
  isCategorySlug,
  parseMonthKey,
  type CategorySlug,
} from "@/lib/icici-spend";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ m?: string; from?: string }>;
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
  const { m, from } = await searchParams;
  if (!isCategorySlug(category)) notFound();
  const fromSource = from ?? "services";
  return (
    <CategoryDrillClient slug={category} monthKey={parseMonthKey(m)} fromSource={fromSource} />
  );
}
