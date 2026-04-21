/**
 * iPhone 17 Pro dimensions based on 6.3" display
 * Physical: 71.45 × 149.6 mm, Screen: 2622 × 1206 px @3x = 874 × 402 pt
 * Using standard iOS logical resolution for prototyping
 */
const IPHONE_17_PRO = {
  widthPx: 402,
  heightPx: 874,
} as const;

export function Ios17DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ios17-desk flex min-h-dvh flex-col items-center justify-center bg-[#c5c7cc] px-2 py-4 sm:px-4 sm:py-6">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), linear-gradient(170deg, #d0d2d6 0%, #b8babd 40%, #a6a8ac 100%)",
        }}
        aria-hidden
      />

      {/* Label above phone */}
      <div className="mb-2 text-center sm:mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600/90">
          Prototype
        </p>
        <p className="mt-0.5 text-xs font-semibold text-zinc-700">iPhone 17 Pro</p>
      </div>

      {/* Phone outer bezel - titanium frame */}
      <div
        className="relative w-full max-w-[430px] shrink-0 rounded-[54px] p-[9px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.08)]"
        style={{
          background:
            "linear-gradient(160deg, #4a4a4c 0%, #3a3a3c 15%, #2c2c2e 45%, #1c1c1e 100%)",
        }}
      >
        {/* Bezel shine highlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[54px] opacity-25"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, transparent 30%)",
          }}
          aria-hidden
        />

        {/* Side buttons - Action button (top left) */}
        <div className="pointer-events-none absolute -left-[2px] top-[95px] z-10 h-[30px] w-[3px] rounded-l-[2px] bg-[#3a3a3c] shadow-sm" />
        {/* Volume up */}
        <div className="pointer-events-none absolute -left-[2px] top-[145px] z-10 h-[55px] w-[3px] rounded-l-[2px] bg-[#3a3a3c] shadow-sm" />
        {/* Volume down */}
        <div className="pointer-events-none absolute -left-[2px] top-[210px] z-10 h-[55px] w-[3px] rounded-l-[2px] bg-[#3a3a3c] shadow-sm" />
        {/* Power button */}
        <div className="pointer-events-none absolute -right-[2px] top-[160px] z-10 h-[90px] w-[3px] rounded-r-[2px] bg-[#3a3a3c] shadow-sm" />

        {/* Inner screen area */}
        <div className="relative overflow-hidden rounded-[45px] bg-black ring-[0.5px] ring-black/80">
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute left-1/2 top-[11px] z-40 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          >
            {/* Camera lens inside dynamic island */}
            <div className="absolute right-[22px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-[#1a1a1c] ring-1 ring-zinc-800/60">
              <div className="absolute inset-[2px] rounded-full bg-[#0a1f3a]" />
              <div className="absolute left-[3px] top-[2px] h-[2px] w-[2px] rounded-full bg-white/20" />
            </div>
          </div>

          {/* Screen content wrapper */}
          <div
            className="relative mx-auto flex w-full flex-col overflow-hidden"
            style={{
              maxWidth: `${IPHONE_17_PRO.widthPx}px`,
              height: `min(${IPHONE_17_PRO.heightPx}px, calc(100dvh - 120px))`,
              backgroundColor: "#F5F6F8",
            }}
          >
            {/* Main content area - content starts from top, dynamic island overlays */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="ios-app-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
                {children}
              </div>
            </div>

            {/* Home indicator */}
            <div
              className="flex shrink-0 justify-center pb-2 pt-1"
              style={{ backgroundColor: "#F5F6F8" }}
            >
              <div className="h-[5px] w-[134px] rounded-full bg-black/25" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <p className="mt-5 max-w-sm px-4 text-center text-[10px] leading-relaxed text-zinc-600/90 sm:mt-6">
        Interactive preview · Not affiliated with Apple Inc. or ICICI Bank.
      </p>
    </div>
  );
}
