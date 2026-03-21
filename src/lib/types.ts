// ─── Core Data Types ───
// Extend these as you add more careers, exams, universities

export type CareerThemeKey = "eng" | "sci" | "fin" | "des" | "def" | "eco";

export interface ThemeColors {
  accent: string;
  bg: string;
  card: string;
  ring: string;
  text: string;
  dim: string;
}

export interface Exam {
  name: string;
  when: string;
  reg: string;
  elig: string;
  format: string;
  syllabus: string;
  tip: string;
  prepStart: string;
}

export interface University {
  name: string;
  location: string;
  ranking: string;
  fees: string;
  pkg?: string;
  recruiters?: string;
  branches?: string;
  howToGetIn: string;
  curriculum?: string;
  campus?: string;
  scholarships?: string;
  website?: string;
}

export interface GeoPath {
  label: string;
  id: string;
  overview: string;
  exams: Exam[];
  universities?: University[];
}

export interface ActionPhase {
  phase: string;
  items: string[];
}

export interface ActionPlan {
  title: string;
  phases: ActionPhase[];
}

export interface CareerPath {
  id: CareerThemeKey;
  title: string;
  icon: string;
  theme: CareerThemeKey;
  desc: string;
  whyChoose: string;
  paths: Record<string, GeoPath>;
  actionPlan: ActionPlan;
}

export type CareerDataMap = Record<string, CareerPath>;
