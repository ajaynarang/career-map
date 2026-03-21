import type { CareerTheme } from "./types";

export const CAREER_THEMES: Record<string, CareerTheme> = {
  engineering:     { color: "#3B82F6", icon: "cpu" },
  science:         { color: "#8B5CF6", icon: "atom" },
  finance:         { color: "#F59E0B", icon: "trending-up" },
  architecture:    { color: "#F97316", icon: "building-2" },
  defence:         { color: "#10B981", icon: "shield" },
  design:          { color: "#EC4899", icon: "palette" },
  "merchant-navy": { color: "#06B6D4", icon: "ship" },
  aviation:        { color: "#6366F1", icon: "plane" },
};

export const COUNTRY_FLAGS: Record<string, string> = {
  india: "\u{1F1EE}\u{1F1F3}",
  usa: "\u{1F1FA}\u{1F1F8}",
  germany: "\u{1F1E9}\u{1F1EA}",
  uk: "\u{1F1EC}\u{1F1E7}",
  canada: "\u{1F1E8}\u{1F1E6}",
  australia: "\u{1F1E6}\u{1F1FA}",
};

export const COUNTRY_LABELS: Record<string, string> = {
  india: "India",
  usa: "USA",
  germany: "Germany",
  uk: "UK",
  canada: "Canada",
  australia: "Australia",
};
