export function SpendAssistantIcon({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Sparkles — orbit the bot to read as AI / magic, not plain chat */}
      <path
        fill="currentColor"
        fillOpacity={0.42}
        d="M3.4 10.2l.32.98h1.02l-.82.6.31.96-.84-.61-.84.61.31-.96-.82-.6h1.02z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.55}
        d="M20.6 6.8l.42 1.28h1.34l-1.08.78.41 1.28-1.09-.79-1.09.79.41-1.28-1.08-.78h1.34z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.38}
        d="M21.4 14.6l.28.88h.9l-.73.53.28.86-.74-.54-.74.54.28-.86-.73-.53h.9z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.48}
        d="M17.8 20.3l.34 1.05h1.08l-.88.64.33 1.03-.9-.65-.9.65.33-1.03-.88-.64h1.08z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.45}
        d="M6.2 20.8l.3.92h.96l-.78.57.29.9-.79-.58-.79.58.29-.9-.78-.57h.96z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.5}
        d="M2.6 15.5l.26.8h.82l-.67.49.25.78-.68-.5-.68.5.25-.78-.67-.49h.82z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.52}
        d="M19.5 11.3l.22.68h.69l-.56.41.21.66-.57-.42-.57.42.21-.66-.56-.41h.69z"
      />

      {/* Antenna */}
      <path
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        d="M12 7.1V9.4"
      />
      <circle cx="12" cy="5.4" r="1.35" fill="currentColor" />

      {/* Robot “display” head */}
      <rect
        x="5.55"
        y="9.6"
        width="12.9"
        height="11.2"
        rx="3.15"
        stroke="currentColor"
        strokeWidth="1.65"
      />

      {/* Eyes — pixel / tech vibe */}
      <rect x="8.25" y="13" width="2.2" height="2.2" rx="0.55" fill="currentColor" />
      <rect x="13.55" y="13" width="2.2" height="2.2" rx="0.55" fill="currentColor" />

      {/* Smile */}
      <path
        d="M9 17.75c.85 1 1.95 1.55 3 1.55s2.15-.55 3-1.55"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />

      {/* Accent sparkles — foreground glints */}
      <path
        fill="currentColor"
        fillOpacity={0.75}
        d="M15.8 8.9l.24.74h.76l-.62.45.23.72-.63-.46-.63.46.23-.72-.62-.45h.76z"
      />
      <path
        fill="currentColor"
        fillOpacity={0.65}
        d="M7.5 8.2l.2.62h.64l-.52.38.2.6-.53-.39-.53.39.2-.6-.52-.38h.64z"
      />
    </svg>
  );
}
