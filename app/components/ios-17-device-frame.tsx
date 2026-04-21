/**
 * iPhone 17 Pro–sized viewport (logical ~402 × 874 pt from 1206 × 2622 px @3×).
 * iOS-style phone chrome for prototypes (not affiliated with Apple).
 */
const IPHONE_17_PRO = {
  widthPx: 402,
  /** Content area height (full screen rectangle); home indicator sits below in UI chrome */
  heightPx: 874,
} as const;

export function Ios17DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ios17-desk flex min-h-dvh flex-col items-center justify-center bg-[#a8aaae] px-3 py-4 sm:px-6 sm:py-8">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(255,255,255,0.35) 0%, transparent 55%), linear-gradient(165deg, #b9bbc0 0%, #9b9ea4 45%, #8a8d94 100%)",
        }}
        aria-hidden
      />

      <div className="mb-2 text-center sm:mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-700/90">
          Prototype
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">iPhone 17 · iOS</p>
      </div>

      <div
        className="relative w-full max-w-[432px] shrink-0 rounded-[3rem] p-[11px] shadow-[0_32px_100px_-16px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]"
        style={{
          background:
            "linear-gradient(155deg, #48484a 0%, #3a3a3c 22%, #2c2c2e 55%, #1d1d1f 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[3rem] opacity-40"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.16) 0%, transparent 42%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="pointer-events-none absolute -left-[2px] top-[92px] z-10 h-9 w-[3px] rounded-l-[2px] bg-[#3f3f41] shadow-sm" />
        <div className="pointer-events-none absolute -left-[2px] top-[148px] z-10 h-14 w-[3px] rounded-l-[2px] bg-[#3f3f41] shadow-sm" />
        <div className="pointer-events-none absolute -right-[2px] top-[124px] z-10 h-20 w-[3px] rounded-r-[2px] bg-[#3f3f41] shadow-sm" />

        <div className="relative overflow-hidden rounded-[2.35rem] bg-black ring-1 ring-black/60">
          <div
            className="pointer-events-none absolute left-1/2 top-[11px] z-30 h-[29px] w-[118px] -translate-x-1/2 rounded-full bg-black shadow-[0_4px_12px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.12]"
            aria-hidden
          />

          {/* Fixed iPhone 17 Pro logical size; shrinks only if viewport is shorter */}
          <div
            className="mx-auto flex w-full max-w-[402px] flex-col overflow-hidden"
            style={{
              height: `min(${IPHONE_17_PRO.heightPx}px, calc(100dvh - 120px))`,
              backgroundColor: "#F5F6F8",
            }}
          >
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="ios-app-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
                {children}
              </div>
            </div>

            <div
              className="flex shrink-0 justify-center pb-2 pt-1.5"
              style={{ backgroundColor: "#F5F6F8" }}
            >
              <div className="h-[5px] w-[128px] rounded-full bg-black/[0.22]" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 max-w-sm px-4 text-center text-[11px] leading-relaxed text-zinc-700/85 sm:mt-5">
        Interactive preview · Not affiliated with Apple Inc. or ICICI Bank.
      </p>
    </div>
  );
}
