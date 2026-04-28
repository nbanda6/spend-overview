"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import {
  CATEGORY_META,
  HDFC,
  type CustomDateRange,
  type MonthKey,
  type TimeFilter,
  formatInr,
} from "@/lib/icici-spend";
import type { ChatSection } from "@/lib/spend-chat-assistant";
import { SpendAssistantIcon } from "@/app/components/spend-assistant-icon";
import {
  IPHONE_APP_OVERLAY_ROOT_ID,
  IPHONE_APP_SCROLL_ROOT_ID,
} from "@/app/components/iphone-app-shell-ids";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Structured recap aligned with listed transactions (assistant only). */
  aiSummary?: string | null;
  sections?: ChatSection[];
};

type SpendChatApiResponse = {
  narrative: string;
  aiSummary: string | null;
  sections: ChatSection[];
  source?: string;
};

const SUGGESTIONS = [
  "Summarize this period",
  "UPI payments",
  "Show food & dining",
] as const;

export function SpendChatPanel({
  open,
  onClose,
  monthKey,
  activeFilter,
  customRange,
  fromSource,
}: {
  open: boolean;
  onClose: () => void;
  monthKey: MonthKey;
  activeFilter: TimeFilter;
  customRange: CustomDateRange | null;
  fromSource: string;
}) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextMsgId = useRef(0);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: `Ask about spending for your selected time filter — totals, categories, payment mode, or merchants. Answers use your overview data; with ANTHROPIC_API_KEY set, Claude refines the reply while transaction rows stay grounded in the same matcher.`,
    },
  ]);

  useEffect(() => {
    const scrollEl = document.getElementById(IPHONE_APP_SCROLL_ROOT_ID);
    if (!scrollEl) return;
    if (open) {
      scrollEl.style.overflow = "hidden";
    } else {
      scrollEl.style.overflow = "";
    }
    return () => {
      scrollEl.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    nextMsgId.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${nextMsgId.current}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/spend-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          monthKey,
          activeFilter,
          customRange,
          fromSource,
        }),
      });

      const raw = await res.json().catch(() => null);
      if (!res.ok || !raw || typeof raw !== "object") {
        throw new Error("bad response");
      }

      const data = raw as SpendChatApiResponse;
      const narrative =
        typeof data.narrative === "string" ? data.narrative : "";
      const sections = Array.isArray(data.sections) ? data.sections : [];

      nextMsgId.current += 1;
      const assistantMsg: ChatMessage = {
        id: `a-${nextMsgId.current}`,
        role: "assistant",
        text: narrative || "No response text.",
        aiSummary:
          data.aiSummary === undefined || data.aiSummary === null
            ? null
            : data.aiSummary,
        sections: sections.length > 0 ? sections : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      nextMsgId.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${nextMsgId.current}`,
          role: "assistant",
          text: "Couldn’t reach the assistant. Check your connection and try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const overlayRoot =
    typeof document !== "undefined"
      ? document.getElementById(IPHONE_APP_OVERLAY_ROOT_ID)
      : null;

  const layer = (
    <div className="absolute inset-0 z-0 flex min-h-0 flex-col justify-end bg-black/45">
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default"
        aria-label="Close Spent AI assistant"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex min-h-0 w-full max-h-[88%] flex-col overflow-hidden rounded-t-[20px] bg-[#F5F6F8] shadow-2xl"
      >
        <header
          className="flex shrink-0 items-center gap-3 rounded-t-[20px] px-4 pb-3 pt-[14px] text-white"
          style={{
            background: `linear-gradient(180deg, ${HDFC.headerFrom} 0%, ${HDFC.headerTo} 100%)`,
          }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_10px_rgba(0,30,70,0.25)] ring-2 ring-white/30">
            <SpendAssistantIcon size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <p id={titleId} className="text-[15px] font-semibold leading-tight">
              Spent AI assistant
            </p>
            <p className="truncate text-[11px] text-white/75">
              Your filters + typed ranges · Claude when API key is set
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 pb-3 pt-3">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-1 [-webkit-overflow-scrolling:touch]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-snug ${
                    m.role === "user"
                      ? "rounded-br-md bg-[#004C8F] text-white"
                      : "rounded-bl-md border border-zinc-200/90 bg-white text-zinc-800 shadow-sm"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <>
                      {m.sections && m.sections.length > 0 ? (
                        <div className="space-y-4">
                          {m.sections.map((sec, i) => (
                            <section key={`${sec.title}-${i}`}>
                              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                                {sec.title}
                              </h3>
                              {sec.subtitle && (
                                <p className="mt-0.5 text-[11px] text-zinc-400">{sec.subtitle}</p>
                              )}
                              <ul className="mt-2 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200/90 bg-white">
                                {sec.items.map((item, j) => {
                                  const cat = CATEGORY_META[item.slug];
                                  const inner = (
                                    <>
                                      <span
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={{ backgroundColor: cat.color }}
                                      >
                                        {item.tx.initials}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-zinc-900">
                                          {item.tx.merchant}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                          {item.tx.date}
                                          {item.tx.channel ? (
                                            <>
                                              {" "}
                                              ·{" "}
                                              <span className="font-medium text-zinc-600">
                                                {item.tx.channel}
                                              </span>
                                            </>
                                          ) : null}
                                        </p>
                                      </div>
                                      <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900">
                                        {formatInr(item.tx.amount)}
                                      </span>
                                    </>
                                  );
                                  return (
                                    <li key={`${item.tx.merchant}-${item.tx.date}-${j}`}>
                                      {item.href ? (
                                        <Link
                                          href={item.href}
                                          className="flex items-center gap-3 px-3 py-2.5 active:bg-zinc-50"
                                          onClick={onClose}
                                        >
                                          {inner}
                                          <span className="text-zinc-300" aria-hidden>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                              <path
                                                d="M9 6l6 6-6 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </span>
                                        </Link>
                                      ) : (
                                        <div className="flex items-center gap-3 px-3 py-2.5 opacity-90">
                                          {inner}
                                        </div>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ) : null}

                      {m.text.trim() ? (
                        <p
                          className={`whitespace-pre-wrap text-zinc-800 ${
                            m.sections && m.sections.length > 0
                              ? "mt-3 border-t border-zinc-100 pt-3"
                              : ""
                          }`}
                        >
                          {m.text}
                        </p>
                      ) : null}

                      {m.aiSummary ? (
                        <div
                          className={`rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2.5 ${
                            (m.sections && m.sections.length > 0) || m.text.trim()
                              ? "mt-3 border-t border-zinc-100 pt-3"
                              : ""
                          }`}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            Summary
                          </p>
                          <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-700">
                            {m.aiSummary}
                          </p>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
            {busy ? (
              <div className="flex items-center gap-2 px-1 py-2 text-[12px] text-zinc-400">
                <span
                  className="inline-flex h-2 w-2 animate-pulse rounded-full bg-zinc-400"
                  aria-hidden
                />
                Thinking…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => send(s)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm active:bg-zinc-50"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex shrink-0 gap-2 rounded-2xl border border-zinc-200/90 bg-white p-1.5 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your transactions…"
              className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400"
              autoComplete="off"
              disabled={busy}
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
              style={{ backgroundColor: HDFC.navyBlue }}
              disabled={!input.trim() || busy}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (!overlayRoot) return null;

  return createPortal(layer, overlayRoot);
}
