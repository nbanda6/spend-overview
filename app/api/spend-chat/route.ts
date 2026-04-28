import { NextResponse, type NextRequest } from "next/server";
import { getSpendChatLlmPack } from "@/lib/spend-chat-assistant";
import {
  MONTH_KEYS,
  TIME_FILTERS,
  type MonthKey,
  type TimeFilter,
} from "@/lib/icici-spend";

function isTimeFilter(x: string): x is TimeFilter {
  return TIME_FILTERS.some((f) => f.key === x);
}

function parseAssistantJson(raw: string): {
  narrative: string;
  summary: string | null;
} | null {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonSlice = fence ? fence[1]!.trim() : trimmed;
  try {
    const o = JSON.parse(jsonSlice) as {
      narrative?: unknown;
      summary?: unknown;
    };
    const narrative =
      typeof o.narrative === "string" ? o.narrative.trim() : null;
    if (!narrative) return null;
    const summary =
      typeof o.summary === "string" ? o.summary.trim() || null : null;
    return { narrative, summary };
  } catch {
    return null;
  }
}

async function completeSpendAssistantWithClaude(
  contextPayload: Record<string, unknown>,
  userQuery: string,
): Promise<{ narrative: string; summary: string | null }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model =
    process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";

  if (!apiKey?.trim()) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const system = `You are **Spent AI**, the in-app assistant for an ICICI-style **Spend Overview demo** (India, INR).

Rules:
- Use ONLY facts present in CONTEXT. Never invent merchants, dates, amounts, or categories.
- Currency is INR; write amounts like ₹12,345 or spell out lakhs conservatively only if CONTEXT supports it.
- If CONTEXT shows no matching transactions but aggregates exist, explain the mismatch briefly (filters / wording).
- If timeWindowNote appears, mention it once.
- The app UI lists **transaction rows first**, then your **narrative**, then the **Summary** strip — avoid phrases like “below” or “above” for the list; say “these transactions” or “this period” instead.
- Be concise and helpful: answer the user's question directly.
- Respond with **valid JSON only**, no prose outside JSON, markdown fences optional:
  {"narrative":"...", "summary":"..."}
  - narrative: explanatory prose only (plain text; short paragraphs separated by \\n\\n ok; no markdown headings).
  - summary: ONE short footer recap sentence (or empty string "") if redundant.`;

  const user = `CONTEXT (JSON):\n${JSON.stringify(contextPayload, null, 2)}\n\nUSER QUESTION:\n${userQuery.trim()}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey.trim(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  const rawBody = await res.text();
  if (!res.ok) {
    console.error("[spend-chat] Anthropic HTTP", res.status, rawBody.slice(0, 500));
    throw new Error(`Anthropic API error: ${res.status}`);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error("Anthropic invalid JSON body");
  }

  const blocks = body as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = blocks.content
    ?.filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n")
    .trim();
  if (!text) throw new Error("Anthropic empty content");

  const parsed = parseAssistantJson(text);
  if (parsed) return parsed;

  return { narrative: text, summary: null };
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const p = payload as Record<string, unknown>;
  const query = typeof p.query === "string" ? p.query : "";
  const monthKey = typeof p.monthKey === "string" ? p.monthKey : "";
  const activeFilter =
    typeof p.activeFilter === "string" ? p.activeFilter : "this-month";
  const fromSource =
    typeof p.fromSource === "string" ? p.fromSource : "services";
  const customRange =
    p.customRange &&
    typeof p.customRange === "object" &&
    p.customRange !== null &&
    "start" in p.customRange &&
    "end" in p.customRange
      ? {
          start: String((p.customRange as { start: string }).start),
          end: String((p.customRange as { end: string }).end),
        }
      : null;

  if (!MONTH_KEYS.includes(monthKey as MonthKey)) {
    return NextResponse.json({ error: "Invalid monthKey" }, { status: 400 });
  }

  if (!isTimeFilter(activeFilter)) {
    return NextResponse.json({ error: "Invalid activeFilter" }, { status: 400 });
  }

  const { outcome, contextJson } = getSpendChatLlmPack(
    query,
    activeFilter,
    monthKey as MonthKey,
    fromSource,
    customRange,
  );

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const q = query.trim();

  if (!apiKey || !q) {
    return NextResponse.json({
      narrative: outcome.narrative,
      aiSummary: outcome.aiSummary,
      sections: outcome.sections,
      source: "rules",
    });
  }

  try {
    const enriched = await completeSpendAssistantWithClaude(contextJson, q);

    return NextResponse.json({
      narrative: enriched.narrative,
      aiSummary: enriched.summary ?? outcome.aiSummary,
      sections: outcome.sections,
      source: "claude",
    });
  } catch (err) {
    console.error("[spend-chat]", err);
    return NextResponse.json({
      narrative: outcome.narrative,
      aiSummary: outcome.aiSummary,
      sections: outcome.sections,
      source: "rules",
    });
  }
}
