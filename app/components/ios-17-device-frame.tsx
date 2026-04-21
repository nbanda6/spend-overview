/**
 * iPhone 17 Pro–sized viewport (logical ~393 × 852 pt).
 * iOS-style phone chrome for prototypes (not affiliated with Apple).
 */
const IPHONE_17_PRO = {
  widthPx: 393,
  heightPx: 852,
} as const;

export function Ios17DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="ios17-desk flex min-h-dvh flex-col items-center justify-center bg-[#c5c7cc] px-3 py-6 sm:px-6 sm:py-10">
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
      <div className="mb-3 text-center sm:mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600/90">
          Prototype
        </p>
        <p className="mt-1 text-sm font-semibold text-zinc-700">iPhone 17 Pro</p>
      </div>

      {/* Phone outer bezel */}
      <div
        className="relative w-full max-w-[420px] shrink-0 rounded-[52px] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        style={{
          background:
            "linear-gradient(160deg, #5a5a5c 0%, #3d3d3f 20%, #2a2a2c 50%, #1c1c1e 100%)",
        }}
      >
        {/* Bezel shine highlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[52px] opacity-30"
          style={{
            background:
              "linear-gradient(130deg, rgba(255,255,255,0.2) 0%, transparent 35%)",
          }}
          aria-hidden
        />

        {/* Side buttons */}
        <div className="pointer-events-none absolute -left-[2.5px] top-[100px] z-10 h-8 w-[3px] rounded-l-[2px] bg-[#4a4a4c] shadow-sm" />
        <div className="pointer-events-none absolute -left-[2.5px] top-[150px] z-10 h-16 w-[3px] rounded-l-[2px] bg-[#4a4a4c] shadow-sm" />
        <div className="pointer-events-none absolute -left-[2.5px] top-[200px] z-10 h-16 w-[3px] rounded-l-[2px] bg-[#4a4a4c] shadow-sm" />
        <div className="pointer-events-none absolute -right-[2.5px] top-[140px] z-10 h-24 w-[3px] rounded-r-[2px] bg-[#4a4a4c] shadow-sm" />

        {/* Inner screen area */}
        <div className="relative overflow-hidden rounded-[42px] bg-black ring-1 ring-black/70">
          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute left-1/2 top-[12px] z-40 h-[34px] w-[126px] -translate-x-1/2 rounded-full bg-black shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            aria-hidden
          >
            {/* Camera lens inside dynamic island */}
            <div className="absolute right-[18px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-[#1a1a1c] ring-1 ring-zinc-700/50">
              <div className="absolute inset-[2px] rounded-full bg-[#0d2847]" />
              <div className="absolute left-[3px] top-[2px] h-[2px] w-[2px] rounded-full bg-white/30" />
            </div>
          </div>

          {/* Screen content wrapper */}
          <div
            className="relative mx-auto flex w-full flex-col overflow-hidden"
            style={{
              maxWidth: `${IPHONE_17_PRO.widthPx}px`,
              height: `min(${IPHONE_17_PRO.heightPx}px, calc(100dvh - 160px))`,
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
