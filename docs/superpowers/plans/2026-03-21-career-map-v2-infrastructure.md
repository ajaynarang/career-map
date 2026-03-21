# PCM Career Map v2 — Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Next.js app shell with MDX pipeline, light/dark theming, routing, and all UI components — ready for content to be dropped into `content/` directory.

**Architecture:** Hub + detail page navigation using Next.js App Router dynamic routes. MDX files in `content/` directory are read at build time via `gray-matter` + `next-mdx-remote`. Server Components everywhere except interactive widgets (theme toggle, expandable exam cards, country filter). Full SSG via `generateStaticParams`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 3.4 + @tailwindcss/typography, next-themes, next-mdx-remote, gray-matter, lucide-react, DM Sans + Space Mono

---

## Chunk 1: Foundation — Dependencies, Theming, Layout

### Task 1: Install new dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install next-themes, next-mdx-remote, gray-matter**

```bash
bun add next-themes next-mdx-remote gray-matter
```

- [ ] **Step 2: Verify installation**

```bash
bun run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "deps: add next-themes, next-mdx-remote, gray-matter"
```

---

### Task 2: Update Tailwind config for light/dark mode

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update tailwind.config.ts**

Replace the entire file. Key changes:
- Add `darkMode: "class"` (for next-themes)
- Add `@tailwindcss/typography` plugin
- Replace career-specific bg/card/ring colors with simple accent-only map
- Add zinc-based neutral tokens that work in both modes

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "config: update tailwind for light/dark mode and typography plugin"
```

---

### Task 3: Update globals.css for light/dark mode

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Rewrite globals.css**

Replace entirely. Remove hardcoded dark colors. Use Tailwind's dark mode classes. Define CSS custom properties for theme-aware surfaces.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #18181b;
    --card: #f9fafb;
    --card-foreground: #18181b;
    --muted: #f4f4f5;
    --muted-foreground: #71717a;
    --border: #e4e4e7;
    --ring: #3b82f6;
  }

  .dark {
    --background: #09090b;
    --foreground: #fafafa;
    --card: #18181b;
    --card-foreground: #fafafa;
    --muted: #27272a;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --ring: #3b82f6;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans, "DM Sans", system-ui, sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .animate-fade-up {
    animation: fadeUp 0.4s ease forwards;
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease forwards;
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Prose (MDX content) customization */
.prose {
  --tw-prose-body: var(--foreground);
  --tw-prose-headings: var(--foreground);
  --tw-prose-links: var(--ring);
  --tw-prose-bold: var(--foreground);
  --tw-prose-counters: var(--muted-foreground);
  --tw-prose-bullets: var(--muted-foreground);
  --tw-prose-hr: var(--border);
  --tw-prose-quotes: var(--foreground);
  --tw-prose-code: var(--foreground);
  --tw-prose-pre-bg: var(--muted);
  --tw-prose-th-borders: var(--border);
  --tw-prose-td-borders: var(--border);
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "styles: rewrite globals.css for light/dark mode with CSS custom properties"
```

---

### Task 4: Update layout.tsx with ThemeProvider

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/ThemeProvider.tsx`

- [ ] **Step 1: Create ThemeProvider wrapper**

`src/components/ThemeProvider.tsx` — wraps next-themes provider as a client component:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create ThemeToggle component**

`src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
```

- [ ] **Step 3: Create Header component**

`src/components/Header.tsx`:

```tsx
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-sm font-bold text-[var(--foreground)]">PCM Career Map</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create Footer component**

`src/components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          PCM Career Map — Your complete guide from Class 10 to career
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 opacity-70">
          Data is indicative for 2026. Always verify deadlines and fees from official university websites before applying.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Update layout.tsx**

```tsx
import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PCM Career Map — Complete Career Guidance for Class 10-12",
  description:
    "Interactive career guidance for PCM students. Explore engineering, science, finance, architecture, design, defence, aviation & merchant navy across India, USA, Germany, UK, Canada & Australia.",
  keywords: [
    "career guidance", "PCM", "JEE", "SAT", "IELTS", "IIT",
    "engineering", "science", "finance", "architecture", "defence",
    "study abroad", "Germany university", "USA college", "UK university",
    "Canada college", "Australia university", "career map", "after 12th",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify build**

```bash
bun run build
```

Note: Build will fail because the old page.tsx references deleted data imports. This is expected — we'll fix the landing page in the next task.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/components/ThemeProvider.tsx src/components/ThemeToggle.tsx src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: add light/dark theme, header, footer, and layout shell"
```

---

## Chunk 2: Content Pipeline — Types, MDX Loader, Seed Content

### Task 5: Define TypeScript types for MDX frontmatter

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Rewrite types.ts**

Replace entirely with new types matching the MDX frontmatter schemas from the spec:

```ts
// ─── Career Types ───

export interface CareerMeta {
  title: string;
  slug: string;
  icon: string;           // Lucide icon name
  description: string;
  color: string;          // Hex accent color
  whyChoose: string;
  countries: string[];
  exams: Record<string, string[]>;  // country → exam slugs
}

// ─── Country Overview Types ───

export interface CountryOverview {
  country: string;
  countryCode: string;
  career: string;
  overview: string;
  budget: {
    tuition: string;
    living: string;
    total4yr: string;
    totalInr: string;
  };
  language: string;
  workWhileStudying: string;
  postStudyVisa: string;
  safety: string;
}

// ─── University Types ───

export interface UniversityMeta {
  name: string;
  slug: string;
  location: string;
  ranking: string;
  fees: {
    tuition: string;
    total: string;
    inr: string;
  };
  placements: {
    average: string;
    inr: string;
  };
  topRecruiters: string[];
  programs: string[];
  acceptance: string;
  requirements: {
    exam: string;
    grades: string;
    extras: string;
  };
  scholarships: string[];
  website: string;
  applyLink: string;
}

// ─── Exam Types ───

export interface ExamMeta {
  name: string;
  slug: string;
  when: string;
  registration: {
    website: string;
    fee: string;
    deadline: string;
  };
  eligibility: string;
  format: {
    questions: number;
    marks: number;
    duration: string;
    details: string;
  };
  syllabus: string;
  careers: string[];
}

// ─── Action Plan Types ───

export interface ActionPlanItem {
  text: string;
  countries: string[];  // ["all"] or ["india", "usa"] etc.
}

export interface ActionPhase {
  phase: string;
  items: ActionPlanItem[];
}

export interface ActionPlan {
  title: string;
  phases: ActionPhase[];
}

// ─── Theme ───

export interface CareerTheme {
  color: string;    // accent hex
  icon: string;     // lucide icon name
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/types.ts
git commit -m "types: rewrite TypeScript interfaces for MDX frontmatter schemas"
```

---

### Task 6: Update themes.ts with new career color map

**Files:**
- Modify: `src/lib/themes.ts`

- [ ] **Step 1: Rewrite themes.ts**

Simple map — just accent color and icon name per career. No more bg/card/ring/text/dim per career.

```ts
import type { CareerTheme } from "./types";

export const CAREER_THEMES: Record<string, CareerTheme> = {
  engineering:   { color: "#3B82F6", icon: "cpu" },
  science:       { color: "#8B5CF6", icon: "atom" },
  finance:       { color: "#F59E0B", icon: "trending-up" },
  architecture:  { color: "#F97316", icon: "building-2" },
  defence:       { color: "#10B981", icon: "shield" },
  design:        { color: "#EC4899", icon: "palette" },
  "merchant-navy": { color: "#06B6D4", icon: "ship" },
  aviation:      { color: "#6366F1", icon: "plane" },
};

export const COUNTRY_FLAGS: Record<string, string> = {
  india: "🇮🇳",
  usa: "🇺🇸",
  germany: "🇩🇪",
  uk: "🇬🇧",
  canada: "🇨🇦",
  australia: "🇦🇺",
};

export const COUNTRY_LABELS: Record<string, string> = {
  india: "India",
  usa: "USA",
  germany: "Germany",
  uk: "UK",
  canada: "Canada",
  australia: "Australia",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/themes.ts
git commit -m "themes: simplify to accent color + icon per career, add country maps"
```

---

### Task 7: Build MDX content loading library

**Files:**
- Create: `src/lib/content.ts`

- [ ] **Step 1: Create content.ts**

This is the core utility that reads MDX files from `content/` directory at build time. Uses `gray-matter` for frontmatter parsing and `fs` for file reading.

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CareerMeta, CountryOverview, UniversityMeta, ExamMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ─── Generic helpers ───

function readMdxFile<T>(filePath: string): { data: T; content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data: data as T, content };
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(".mdx", ""));
}

// ─── Career ───

export function getAllCareerSlugs(): string[] {
  const careersDir = path.join(CONTENT_DIR, "careers");
  if (!fs.existsSync(careersDir)) return [];
  return fs
    .readdirSync(careersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getCareerMeta(careerSlug: string): { data: CareerMeta; content: string } | null {
  return readMdxFile<CareerMeta>(
    path.join(CONTENT_DIR, "careers", careerSlug, "_meta.mdx")
  );
}

export function getAllCareerMetas(): { data: CareerMeta; content: string }[] {
  return getAllCareerSlugs()
    .map(getCareerMeta)
    .filter((c): c is NonNullable<typeof c> => c !== null);
}

// ─── Country Overview ───

export function getCountryOverview(
  careerSlug: string,
  countrySlug: string
): { data: CountryOverview; content: string } | null {
  return readMdxFile<CountryOverview>(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug, "_overview.mdx")
  );
}

export function getCountrySlugs(careerSlug: string): string[] {
  const careerDir = path.join(CONTENT_DIR, "careers", careerSlug);
  if (!fs.existsSync(careerDir)) return [];
  return fs
    .readdirSync(careerDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// ─── University ───

export function getUniversity(
  careerSlug: string,
  countrySlug: string,
  uniSlug: string
): { data: UniversityMeta; content: string } | null {
  return readMdxFile<UniversityMeta>(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug, `${uniSlug}.mdx`)
  );
}

export function listUniversities(
  careerSlug: string,
  countrySlug: string
): string[] {
  return listMdxFiles(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug)
  );
}

export function getAllUniversityMetas(
  careerSlug: string,
  countrySlug: string
): { data: UniversityMeta; content: string }[] {
  return listUniversities(careerSlug, countrySlug)
    .map((slug) => getUniversity(careerSlug, countrySlug, slug))
    .filter((u): u is NonNullable<typeof u> => u !== null);
}

// ─── Exams ───

export function getExam(examSlug: string): { data: ExamMeta; content: string } | null {
  return readMdxFile<ExamMeta>(
    path.join(CONTENT_DIR, "exams", `${examSlug}.mdx`)
  );
}

export function getAllExamSlugs(): string[] {
  return listMdxFiles(path.join(CONTENT_DIR, "exams"));
}

export function getExamsForCareerCountry(
  careerSlug: string,
  countrySlug: string
): { data: ExamMeta; content: string }[] {
  const meta = getCareerMeta(careerSlug);
  if (!meta) return [];
  const examSlugs = meta.data.exams[countrySlug] || [];
  return examSlugs
    .map(getExam)
    .filter((e): e is NonNullable<typeof e> => e !== null);
}

// ─── Action Plan ───

export function getActionPlan(
  careerSlug: string
): { data: { title: string }; content: string } | null {
  return readMdxFile<{ title: string }>(
    path.join(CONTENT_DIR, "careers", careerSlug, "_action-plan.mdx")
  );
}

// ─── Static Params Generators ───

export function generateAllCareerCountryParams(): { career: string; country: string }[] {
  const params: { career: string; country: string }[] = [];
  for (const careerSlug of getAllCareerSlugs()) {
    for (const countrySlug of getCountrySlugs(careerSlug)) {
      params.push({ career: careerSlug, country: countrySlug });
    }
  }
  return params;
}

export function generateAllUniversityParams(): { career: string; country: string; university: string }[] {
  const params: { career: string; country: string; university: string }[] = [];
  for (const careerSlug of getAllCareerSlugs()) {
    for (const countrySlug of getCountrySlugs(careerSlug)) {
      for (const uniSlug of listUniversities(careerSlug, countrySlug)) {
        params.push({ career: careerSlug, country: countrySlug, university: uniSlug });
      }
    }
  }
  return params;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add MDX content loading library with career, uni, exam readers"
```

---

### Task 8: Create seed content for engineering/india (one career, one country, 2 universities, 2 exams)

This creates minimal real content to develop and test the UI against.

**Files:**
- Create: `content/careers/engineering/_meta.mdx`
- Create: `content/careers/engineering/india/_overview.mdx`
- Create: `content/careers/engineering/india/iit-bombay.mdx`
- Create: `content/careers/engineering/india/iit-delhi.mdx`
- Create: `content/exams/jee-main.mdx`
- Create: `content/exams/jee-advanced.mdx`
- Create: `content/careers/engineering/_action-plan.mdx`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p content/careers/engineering/india content/exams
```

- [ ] **Step 2: Create engineering _meta.mdx**

Write to `content/careers/engineering/_meta.mdx` with full frontmatter as per spec. Include all 6 countries in the countries list and exam mappings. Body contains the career overview prose.

- [ ] **Step 3: Create india _overview.mdx**

Write to `content/careers/engineering/india/_overview.mdx` with CountryOverview frontmatter (budget, language, visa, safety) and prose body explaining the Indian engineering path.

- [ ] **Step 4: Create iit-bombay.mdx**

Write to `content/careers/engineering/india/iit-bombay.mdx` with full UniversityMeta frontmatter and rich MDX body with real links (iitb.ac.in, josaa.nic.in, etc.).

- [ ] **Step 5: Create iit-delhi.mdx**

Same as above for IIT Delhi.

- [ ] **Step 6: Create jee-main.mdx exam**

Write to `content/exams/jee-main.mdx` with ExamMeta frontmatter and rich body.

- [ ] **Step 7: Create jee-advanced.mdx exam**

Same for JEE Advanced.

- [ ] **Step 8: Create _action-plan.mdx**

Write to `content/careers/engineering/_action-plan.mdx` with action plan phases as MDX content.

- [ ] **Step 9: Verify content loads**

Create a quick test script or just ensure `bun run build` doesn't crash.

- [ ] **Step 10: Commit**

```bash
git add content/
git commit -m "content: add seed content — engineering/india with 2 unis, 2 exams, action plan"
```

---

## Chunk 3: Pages — Landing, Career, Country

### Task 9: Build the landing page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/CareerCard.tsx`

- [ ] **Step 1: Create CareerCard component**

`src/components/CareerCard.tsx` — Server Component, renders a link card for a career:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CAREER_THEMES } from "@/lib/themes";

interface CareerCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export function CareerCard({ slug, title, description, icon }: CareerCardProps) {
  const theme = CAREER_THEMES[slug];
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>>)[
    icon.split("-").map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1)).join("")
  ] || LucideIcons.Circle;

  return (
    <Link
      href={`/${slug}`}
      className="group block p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all duration-200 no-underline"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: theme?.color + "15" }}
          >
            <IconComponent size={20} style={{ color: theme?.color }} />
          </div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        </div>
        <ArrowRight
          size={16}
          className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-1"
        />
      </div>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Rewrite page.tsx (landing page)**

```tsx
import { getAllCareerMetas } from "@/lib/content";
import { CareerCard } from "@/components/CareerCard";

export default function Home() {
  const careers = getAllCareerMetas();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-[3px] uppercase mb-3">
          Career guidance system
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
          PCM Career Map
        </h1>
        <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Your complete guide from Class 10 to career. Choose a path, explore countries, and plan your future.
        </p>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careers.map((career) => (
          <CareerCard
            key={career.data.slug}
            slug={career.data.slug}
            title={career.data.title}
            description={career.data.description}
            icon={career.data.icon}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify with dev server**

```bash
bun dev
```

Visit http://localhost:3000 — should see the landing page with the engineering career card.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/CareerCard.tsx
git commit -m "feat: build landing page with career card grid"
```

---

### Task 10: Build the career overview page

**Files:**
- Create: `src/app/[career]/page.tsx`
- Create: `src/components/Breadcrumb.tsx`
- Create: `src/components/CountryCompare.tsx`

- [ ] **Step 1: Create Breadcrumb component**

`src/components/Breadcrumb.tsx`:

```tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--foreground)] transition-colors no-underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Create CountryCompare component**

`src/components/CountryCompare.tsx` — Server Component rendering comparison table from country overviews:

```tsx
import Link from "next/link";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import type { CountryOverview } from "@/lib/types";

interface CountryCompareProps {
  careerSlug: string;
  overviews: { slug: string; data: CountryOverview }[];
}

export function CountryCompare({ careerSlug, overviews }: CountryCompareProps) {
  if (overviews.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]" />
            {overviews.map((o) => (
              <th key={o.slug} className="text-center p-3 border-b border-[var(--border)]">
                <Link
                  href={`/${careerSlug}/${o.slug}`}
                  className="text-[var(--foreground)] font-semibold no-underline hover:underline"
                >
                  {COUNTRY_FLAGS[o.slug]} {COUNTRY_LABELS[o.slug]}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">4-year cost</td>
            {overviews.map((o) => (
              <td key={o.slug} className="p-3 text-center text-[var(--foreground)] border-b border-[var(--border)]">
                {o.data.budget.totalInr}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">Language</td>
            {overviews.map((o) => (
              <td key={o.slug} className="p-3 text-center text-[var(--foreground)] border-b border-[var(--border)]">
                {o.data.language}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">Work while studying</td>
            {overviews.map((o) => (
              <td key={o.slug} className="p-3 text-center text-[var(--foreground)] border-b border-[var(--border)]">
                {o.data.workWhileStudying}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">Post-study visa</td>
            {overviews.map((o) => (
              <td key={o.slug} className="p-3 text-center text-[var(--foreground)] border-b border-[var(--border)]">
                {o.data.postStudyVisa}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 text-[var(--muted-foreground)] font-medium">Safety</td>
            {overviews.map((o) => (
              <td key={o.slug} className="p-3 text-center text-[var(--foreground)]">
                {o.data.safety}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Create career page**

`src/app/[career]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCareerSlugs, getCareerMeta, getCountrySlugs, getCountryOverview } from "@/lib/content";
import { CAREER_THEMES, COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CountryCompare } from "@/components/CountryCompare";

export async function generateStaticParams() {
  return getAllCareerSlugs().map((career) => ({ career }));
}

export default async function CareerPage({ params }: { params: Promise<{ career: string }> }) {
  const { career: careerSlug } = await params;
  const careerData = getCareerMeta(careerSlug);
  if (!careerData) notFound();

  const { data: career } = careerData;
  const theme = CAREER_THEMES[careerSlug];
  const countrySlugs = getCountrySlugs(careerSlug);

  const overviews = countrySlugs
    .map((slug) => {
      const overview = getCountryOverview(careerSlug, slug);
      return overview ? { slug, data: overview.data } : null;
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title },
      ]} />

      {/* Career Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{career.title}</h1>
        <p className="text-base text-[var(--muted-foreground)] leading-relaxed mb-4">{career.description}</p>
        <div
          className="text-sm p-4 rounded-xl leading-relaxed"
          style={{
            backgroundColor: theme?.color + "10",
            border: `1px solid ${theme?.color}25`,
            color: "var(--foreground)",
          }}
        >
          <strong>Why choose this path?</strong> {career.whyChoose}
        </div>
      </div>

      {/* Country Pills */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          Choose a country
        </h2>
        <div className="flex flex-wrap gap-2">
          {countrySlugs.map((slug) => (
            <Link
              key={slug}
              href={`/${careerSlug}/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted-foreground)] transition-colors no-underline"
            >
              {COUNTRY_FLAGS[slug]} {COUNTRY_LABELS[slug]}
              <ArrowRight size={14} className="text-[var(--muted-foreground)]" />
            </Link>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {overviews.length > 1 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Compare at a glance
          </h2>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
            <CountryCompare careerSlug={careerSlug} overviews={overviews} />
          </div>
        </div>
      )}

      {/* Action Plan Link */}
      <Link
        href={`/${careerSlug}/action-plan`}
        className="group flex items-center justify-between p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-colors no-underline"
      >
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">Action Plan</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Step-by-step preparation roadmap from Class 9 to 12</p>
        </div>
        <ArrowRight size={18} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Verify with dev server**

```bash
bun dev
```

Visit http://localhost:3000/engineering — should show career page with breadcrumb, description, country pills.

- [ ] **Step 5: Commit**

```bash
git add src/app/[career]/page.tsx src/components/Breadcrumb.tsx src/components/CountryCompare.tsx
git commit -m "feat: build career overview page with country comparison table"
```

---

### Task 11: Build the country page

**Files:**
- Create: `src/app/[career]/[country]/page.tsx`
- Create: `src/components/ExamCard.tsx`
- Create: `src/components/UniCard.tsx`
- Create: `src/components/MDXContent.tsx`

- [ ] **Step 1: Create MDXContent component**

`src/components/MDXContent.tsx` — renders MDX string using next-mdx-remote:

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
      <MDXRemote source={source} />
    </div>
  );
}
```

- [ ] **Step 2: Create ExamCard component**

`src/components/ExamCard.tsx` — Client component, expandable:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { ExamMeta } from "@/lib/types";

interface ExamCardProps {
  exam: ExamMeta;
  content: string;
  accentColor: string;
}

export function ExamCard({ exam, content, accentColor }: ExamCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-[var(--muted)]/50 transition-colors"
      >
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{exam.name}</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{exam.when}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-[var(--muted-foreground)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] p-4 animate-fade-up">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Registration</div>
              <div className="text-xs text-[var(--foreground)]">{exam.registration.fee}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Deadline: {exam.registration.deadline}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Format</div>
              <div className="text-xs text-[var(--foreground)]">{exam.format.questions} Qs, {exam.format.marks} marks</div>
              <div className="text-xs text-[var(--muted-foreground)]">{exam.format.duration}</div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="mb-4">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Eligibility</div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">{exam.eligibility}</p>
          </div>

          {/* MDX Body content rendered as HTML */}
          <div
            className="prose prose-zinc dark:prose-invert prose-xs max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Register link */}
          {exam.registration.website && (
            <a
              href={exam.registration.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium no-underline transition-colors"
              style={{ color: accentColor }}
            >
              Register at {new URL(exam.registration.website).hostname}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
```

Note: The exam MDX content needs to be pre-rendered to HTML on the server side before passing to the client component. We'll handle this in the country page.

- [ ] **Step 3: Create UniCard component**

`src/components/UniCard.tsx` — Server Component, links to university detail page:

```tsx
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { UniversityMeta } from "@/lib/types";

interface UniCardProps {
  uni: UniversityMeta;
  href: string;
  accentColor: string;
}

export function UniCard({ uni, href, accentColor }: UniCardProps) {
  return (
    <Link
      href={href}
      className="group block p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all no-underline"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{uni.name}</h3>
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-2">
            <MapPin size={12} />
            {uni.location} · {uni.ranking}
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: accentColor + "15", color: accentColor }}
            >
              {uni.fees.inr}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
              {uni.acceptance}
            </span>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-1 flex-shrink-0 ml-3"
        />
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create country page**

`src/app/[career]/[country]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import {
  generateAllCareerCountryParams,
  getCareerMeta,
  getCountryOverview,
  getExamsForCareerCountry,
  getAllUniversityMetas,
} from "@/lib/content";
import { CAREER_THEMES, COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ExamCard } from "@/components/ExamCard";
import { UniCard } from "@/components/UniCard";

export async function generateStaticParams() {
  return generateAllCareerCountryParams();
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ career: string; country: string }>;
}) {
  const { career: careerSlug, country: countrySlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const overviewData = getCountryOverview(careerSlug, countrySlug);
  if (!careerData || !overviewData) notFound();

  const { data: career } = careerData;
  const { data: overview, content: overviewContent } = overviewData;
  const theme = CAREER_THEMES[careerSlug];

  const exams = getExamsForCareerCountry(careerSlug, countrySlug);
  const universities = getAllUniversityMetas(careerSlug, countrySlug);

  const countryLabel = `${COUNTRY_FLAGS[countrySlug]} ${COUNTRY_LABELS[countrySlug]}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: COUNTRY_LABELS[countrySlug] || countrySlug },
      ]} />

      {/* Country Header */}
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        {career.title} in {countryLabel}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
        {overview.overview}
      </p>

      {/* Budget Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 mb-8">
        <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          Budget breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Tuition/yr</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.tuition}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Living/yr</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.living}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Total 4 years</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.total4yr}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">In INR</div>
            <div className="text-sm font-bold" style={{ color: theme?.color }}>{overview.budget.totalInr}</div>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Language</div>
          <div className="text-xs text-[var(--foreground)]">{overview.language}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Work while studying</div>
          <div className="text-xs text-[var(--foreground)]">{overview.workWhileStudying}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Post-study visa</div>
          <div className="text-xs text-[var(--foreground)]">{overview.postStudyVisa}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Safety</div>
          <div className="text-xs text-[var(--foreground)]">{overview.safety}</div>
        </div>
      </div>

      {/* Exams */}
      {exams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Entrance exams
          </h2>
          <div className="flex flex-col gap-3">
            {exams.map((exam) => (
              <ExamCard
                key={exam.data.slug}
                exam={exam.data}
                content={exam.content}
                accentColor={theme?.color || "#3B82F6"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Universities */}
      {universities.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Universities & colleges ({universities.length})
          </h2>
          <div className="flex flex-col gap-3">
            {universities.map((uni) => (
              <UniCard
                key={uni.data.slug}
                uni={uni.data}
                href={`/${careerSlug}/${countrySlug}/${uni.data.slug}`}
                accentColor={theme?.color || "#3B82F6"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify with dev server**

```bash
bun dev
```

Visit http://localhost:3000/engineering/india — should show exams and universities.

- [ ] **Step 6: Commit**

```bash
git add src/app/[career]/[country]/page.tsx src/components/ExamCard.tsx src/components/UniCard.tsx src/components/MDXContent.tsx
git commit -m "feat: build country page with expandable exam cards and university list"
```

---

## Chunk 4: University Detail Page, Action Plan, Cleanup

### Task 12: Build the university detail page

**Files:**
- Create: `src/app/[career]/[country]/[university]/page.tsx`
- Create: `src/components/UniSidebar.tsx`

- [ ] **Step 1: Create UniSidebar component**

`src/components/UniSidebar.tsx`:

```tsx
import { ExternalLink } from "lucide-react";
import type { UniversityMeta } from "@/lib/types";

interface UniSidebarProps {
  uni: UniversityMeta;
  accentColor: string;
}

export function UniSidebar({ uni, accentColor }: UniSidebarProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sticky top-20">
      <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
        Quick facts
      </h3>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Ranking</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.ranking}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Annual fees</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.fees.tuition}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{uni.fees.inr}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Total cost/yr</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.fees.total}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Acceptance</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.acceptance}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Avg starting salary</div>
          <div className="text-sm font-medium" style={{ color: accentColor }}>{uni.placements.average}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{uni.placements.inr}</div>
        </div>

        {uni.programs.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Programs</div>
            <div className="flex flex-wrap gap-1">
              {uni.programs.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {uni.topRecruiters.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Top recruiters</div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {uni.topRecruiters.join(", ")}
            </p>
          </div>
        )}

        {uni.scholarships.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Scholarships</div>
            <ul className="text-xs text-[var(--foreground)] space-y-1">
              {uni.scholarships.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 space-y-2">
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-semibold no-underline transition-colors"
            style={{
              backgroundColor: accentColor + "15",
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            }}
          >
            Visit website <ExternalLink size={12} />
          </a>
        )}
        {uni.applyLink && (
          <a
            href={uni.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-white no-underline transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            Apply now <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create university page**

`src/app/[career]/[country]/[university]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { generateAllUniversityParams, getCareerMeta, getUniversity } from "@/lib/content";
import { CAREER_THEMES, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { UniSidebar } from "@/components/UniSidebar";
import { MDXContent } from "@/components/MDXContent";

export async function generateStaticParams() {
  return generateAllUniversityParams();
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ career: string; country: string; university: string }>;
}) {
  const { career: careerSlug, country: countrySlug, university: uniSlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const uniData = getUniversity(careerSlug, countrySlug, uniSlug);
  if (!careerData || !uniData) notFound();

  const { data: career } = careerData;
  const { data: uni, content } = uniData;
  const theme = CAREER_THEMES[careerSlug];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: COUNTRY_LABELS[countrySlug] || countrySlug, href: `/${careerSlug}/${countrySlug}` },
        { label: uni.name },
      ]} />

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">{uni.name}</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">{uni.location} · {uni.ranking}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <MDXContent source={content} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <UniSidebar uni={uni} accentColor={theme?.color || "#3B82F6"} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify with dev server**

```bash
bun dev
```

Visit http://localhost:3000/engineering/india/iit-bombay — should render full university page.

- [ ] **Step 4: Commit**

```bash
git add src/app/[career]/[country]/[university]/page.tsx src/components/UniSidebar.tsx
git commit -m "feat: build university detail page with sidebar and MDX content"
```

---

### Task 13: Build the action plan page

**Files:**
- Create: `src/app/[career]/action-plan/page.tsx`

- [ ] **Step 1: Create action plan page**

`src/app/[career]/action-plan/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getAllCareerSlugs, getCareerMeta, getActionPlan } from "@/lib/content";
import { CAREER_THEMES } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MDXContent } from "@/components/MDXContent";

export async function generateStaticParams() {
  return getAllCareerSlugs().map((career) => ({ career }));
}

export default async function ActionPlanPage({
  params,
}: {
  params: Promise<{ career: string }>;
}) {
  const { career: careerSlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const planData = getActionPlan(careerSlug);
  if (!careerData || !planData) notFound();

  const { data: career } = careerData;
  const { data: plan, content } = planData;
  const theme = CAREER_THEMES[careerSlug];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: "Action Plan" },
      ]} />

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        {plan.title || `${career.title} — Action Plan`}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">
        Step-by-step preparation roadmap from Class 9 to Class 12
      </p>

      <MDXContent source={content} />
    </div>
  );
}
```

- [ ] **Step 2: Verify with dev server**

Visit http://localhost:3000/engineering/action-plan

- [ ] **Step 3: Commit**

```bash
git add src/app/[career]/action-plan/page.tsx
git commit -m "feat: build action plan page with MDX content"
```

---

### Task 14: Clean up old files

**Files:**
- Delete: `src/data/engineering.ts`
- Delete: `src/data/science.ts`
- Delete: `src/data/finance.ts`
- Delete: `src/data/design.ts`
- Delete: `src/data/defence.ts`
- Delete: `src/data/index.ts`
- Delete: `src/components/SideSheet.tsx`
- Delete: `src/components/ExamSheet.tsx`
- Delete: `src/components/UniSheet.tsx`
- Modify: `src/components/ui.tsx` (keep, update for new theme vars)

- [ ] **Step 1: Remove old data files and v1 components**

```bash
rm -rf src/data/
rm src/components/SideSheet.tsx src/components/ExamSheet.tsx src/components/UniSheet.tsx
```

- [ ] **Step 2: Update ui.tsx for new theme system**

Rewrite `src/components/ui.tsx` to use CSS custom properties instead of hardcoded dark theme colors:

```tsx
interface InfoCardProps {
  label: string;
  value: string;
}

export function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="p-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg flex-1 min-w-[200px]">
      <div className="text-[10px] text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-[13px] text-[var(--foreground)] leading-relaxed">{value}</div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-[13px] font-semibold text-[var(--foreground)] mb-2.5 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[var(--muted-foreground)] leading-7 p-3 bg-[var(--muted)] rounded-lg">
      {children}
    </p>
  );
}
```

- [ ] **Step 3: Verify full build**

```bash
bun run build
```

Expected: Clean build with no errors. All pages generate statically.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "cleanup: remove v1 data files and components, update ui.tsx for theme vars"
```

---

### Task 15: Final verification

- [ ] **Step 1: Run full build**

```bash
bun run build
```

Expected: All pages build successfully.

- [ ] **Step 2: Test all routes with dev server**

```bash
bun dev
```

Verify:
- http://localhost:3000 — Landing page with career cards
- http://localhost:3000/engineering — Career page with country pills and comparison table
- http://localhost:3000/engineering/india — Country page with exams and universities
- http://localhost:3000/engineering/india/iit-bombay — University detail page
- http://localhost:3000/engineering/action-plan — Action plan page
- Light/dark mode toggle works on all pages
- Breadcrumbs navigate correctly
- All links work

- [ ] **Step 3: Run lint**

```bash
bun run lint
```

Fix any issues.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address lint issues and final polish"
```

---

## What's Next: Content Plan (separate plan)

This infrastructure plan builds the complete app shell. The next plan (Phase 2) covers writing all the MDX content:

- 8 career `_meta.mdx` files
- ~35 country `_overview.mdx` files
- ~120-150 university `.mdx` files (with verified 2026 data and real links)
- ~25-30 exam `.mdx` files (with verified 2026 deadlines and registration URLs)
- 8 action plan files

Content authoring is the bulk of the work and should be done career-by-career, starting with Engineering (6 countries), then Science, Finance, etc.
