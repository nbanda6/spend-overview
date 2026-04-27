/** HDFC Bank app theme tokens (prototype — reference: MobileBanking UI) */

export const HDFC = {
  /** Primary dark navy blue */
  navyBlue: "#004C8F",
  navyDark: "#00305A",
  navyLight: "#0066B3",
  /** Accent blue for links and highlights */
  accentBlue: "#0066B3",
  pageBg: "#F0F2F5",
  surface: "#FFFFFF",
  text: "#1C1C1E",
  textMuted: "#6C6C70",
  icon: "#2C2C2E",
  headerGradientFrom: "#004C8F",
  headerGradientTo: "#00305A",
} as const;

// Keep backward compatibility alias
export const ICICI_LIGHT = HDFC;
