// lib/theme.ts
export const WC_COLORS = {
  BLUE: "#0a1722",
  BLUE_SOFT: "#1c3e5e",
  PINK: "#E33955",
  CARD_BG: "rgba(255,255,255,0.04)",
  CARD_BORDER: "rgba(255,255,255,0.10)",
  MUTED: "rgba(255,255,255,0.75)",
};

export function homepageGradient(): string {
  // identico alla buyer-home originale
  return `radial-gradient(140% 140% at 50% -10%, ${WC_COLORS.BLUE_SOFT} 0%, ${WC_COLORS.BLUE} 60%, #000 140%)`;
}
