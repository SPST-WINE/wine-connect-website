// lib/theme.ts
export const WC_COLORS = {
  BLUE: "#0a1722",
  BLUE_SOFT: "#1c3e5e",
  PINK: "#E33955",
};

export function homepageGradient(): string {
  // identico alla vecchia buyer-home
  return `radial-gradient(140% 140% at 50% -10%, ${WC_COLORS.BLUE_SOFT} 0%, ${WC_COLORS.BLUE} 60%, #000 140%)`;
}
