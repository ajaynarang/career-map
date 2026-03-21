import { CareerThemeKey, ThemeColors } from "./types";

export const THEMES: Record<CareerThemeKey, ThemeColors> = {
  eng: { accent: "#3B82F6", bg: "#0c1929", card: "#111f36", ring: "#1e3a5f", text: "#93C5FD", dim: "#3b6db5" },
  sci: { accent: "#8B5CF6", bg: "#110c20", card: "#1a1233", ring: "#2e1065", text: "#C4B5FD", dim: "#6d4dbd" },
  fin: { accent: "#F59E0B", bg: "#18130a", card: "#261e0f", ring: "#422006", text: "#FCD34D", dim: "#b8850e" },
  des: { accent: "#EC4899", bg: "#1a0c16", card: "#2a1224", ring: "#4a0e2e", text: "#F9A8D4", dim: "#b8367a" },
  def: { accent: "#10B981", bg: "#0c1a16", card: "#12261e", ring: "#064E3B", text: "#6EE7B7", dim: "#0d9468" },
  eco: { accent: "#F97316", bg: "#1a110a", card: "#261a0f", ring: "#5a2d0c", text: "#FDBA74", dim: "#c46012" },
};
