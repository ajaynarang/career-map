# PCM Career Map v2 — Design Spec

## Vision

Transform the existing PCM Career Map into a comprehensive, self-contained career counselor app for 10th-grade PCM students and their parents. Apple-level simplicity. No need to look beyond this app for career guidance across India and 5 international destinations.

## Scope

### Career Paths (8)

1. **Engineering & Tech** — CS, AI/ML, Electronics, Mechanical, Civil, Chemical
2. **Pure Science & Research** — Physics, Chemistry, Math, Data Science
3. **Finance & Economics** — CA, Actuarial, Quant, Investment Banking
4. **Architecture** — Building design, urban planning
5. **Defence** — NDA, CDS, Indian Navy, Air Force
6. **Design & UX** — Product Design, Industrial Design
7. **Merchant Navy** — Marine engineering, navigation
8. **Aviation** — Commercial pilot, aerospace

### Countries (6, full coverage each)

- India (primary, deepest coverage)
- USA
- Germany
- UK
- Canada
- Australia

### Per Country Coverage

- Country overview (why study here, culture, safety)
- Total 4-year budget breakdown (tuition + living + flights + visa) in INR and local currency
- Language requirements
- Work-while-studying rules
- Post-study work visa / PR pathway
- All relevant entrance exams with deadlines
- 6-15 universities with full details and real links

## Information Architecture

### URL Structure

```
/                              → Landing (hero + 8 career cards)
/[career]                      → Career overview + 6 country comparison table
/[career]/[country]            → Country page (exams + university list)
/[career]/[country]/[uni]      → University full detail (MDX rendered)
/[career]/action-plan          → Step-by-step preparation timeline
```

### Content Directory

```
content/
├── careers/
│   ├── engineering/
│   │   ├── _meta.mdx              # Career overview, icon, description, country list
│   │   ├── india/
│   │   │   ├── _overview.mdx      # Country-specific overview
│   │   │   ├── iit-bombay.mdx     # One file per university
│   │   │   ├── iit-delhi.mdx
│   │   │   └── ...
│   │   ├── usa/
│   │   │   ├── _overview.mdx
│   │   │   ├── mit.mdx
│   │   │   └── ...
│   │   ├── germany/
│   │   ├── uk/
│   │   ├── canada/
│   │   └── australia/
│   ├── science/
│   ├── finance/
│   ├── architecture/
│   ├── defence/
│   ├── design/
│   ├── merchant-navy/
│   └── aviation/
└── exams/
    ├── jee-main.mdx               # Shared across careers (Engineering + Architecture)
    ├── jee-advanced.mdx
    ├── sat.mdx                    # Shared across multiple abroad careers
    ├── ielts.mdx                  # Shared across all abroad countries
    └── ...
```

Exams are separate from careers because many exams serve multiple career paths (JEE Main → Engineering + Architecture, SAT → all USA paths).

## MDX File Formats

### University File Frontmatter

```yaml
name: string                    # Full official name
slug: string                    # URL slug
location: string                # City, State/Region
ranking: string                 # e.g. "#1 NIRF Engineering 2026"
fees:
  tuition: string               # Annual tuition in local currency
  total: string                 # Total annual cost (tuition + living)
  inr: string                   # Same in INR
placements:
  average: string               # Average starting salary
  inr: string                   # In INR
topRecruiters: string[]         # Company names
programs: string[]              # Available programs/branches
acceptance: string              # Acceptance rate or cutoff
requirements:
  exam: string                  # Required exam + score
  grades: string                # Grade requirements
  extras: string                # Other requirements
scholarships: string[]          # Available scholarships
website: string                 # Official URL (full https://)
applyLink: string               # Direct application URL
```

### University MDX Body Sections

1. Why [University]?
2. How to Get In
3. Curriculum & Structure
4. Campus Life
5. Important Links (all real, verified URLs)

### Exam File Frontmatter

```yaml
name: string
slug: string
when: string                    # Specific months/dates
registration:
  website: string               # Full URL
  fee: string
  deadline: string              # Specific date
eligibility: string
format:
  questions: number
  marks: number
  duration: string
  details: string
syllabus: string
careers: string[]               # Which career paths use this exam
```

### Exam MDX Body Sections

1. What is [Exam]?
2. Scoring & What It Means
3. How to Prepare
4. Important Links

### Career Meta Frontmatter

```yaml
title: string
slug: string
icon: string                    # Lucide icon name
description: string
color: string                   # Accent hex color
whyChoose: string
countries: string[]
exams:
  india: string[]               # Exam slugs
  usa: string[]
  germany: string[]
  uk: string[]
  canada: string[]
  australia: string[]
```

### Country Overview Frontmatter

```yaml
country: string
countryCode: string             # For flag emoji/icon
career: string
overview: string
budget:
  tuition: string
  living: string
  total4yr: string
  totalInr: string
language: string
workWhileStudying: string
postStudyVisa: string
safety: string
```

## UI Design

### Design System

- **Base:** Neutral zinc/slate palette
- **Mode:** System preference default + manual toggle (top-right sun/moon icon)
- **Career colors:** Subtle accents only (icon tints, section borders, badges) — not backgrounds
- **Typography:** DM Sans (body) + Space Mono (labels, tags)
- **Icons:** Lucide React (replacing emoji)
- **Radius:** 12px cards, 8px buttons, full-round pills
- **Spacing:** 4px grid

### Light Mode

- Background: white (`#ffffff`)
- Card surface: `#f9fafb` (zinc-50)
- Text: `#18181b` (zinc-900)
- Muted text: `#71717a` (zinc-500)
- Borders: `#e4e4e7` (zinc-200)

### Dark Mode

- Background: `#09090b` (zinc-950)
- Card surface: `#18181b` (zinc-900)
- Text: `#fafafa` (zinc-50)
- Muted text: `#a1a1aa` (zinc-400)
- Borders: `#27272a` (zinc-800)

### Career Accent Colors

Same 8 colors used sparingly (icon fills, badges, active states):

| Career | Color |
|--------|-------|
| Engineering | #3B82F6 (blue) |
| Science | #8B5CF6 (purple) |
| Finance | #F59E0B (amber) |
| Architecture | #F97316 (orange) |
| Defence | #10B981 (green) |
| Design | #EC4899 (pink) |
| Merchant Navy | #06B6D4 (cyan) |
| Aviation | #6366F1 (indigo) |

### Page Layouts

#### Landing Page (`/`)

```
[Header: "PCM Career Map" + theme toggle]
[Hero: "Your complete guide from Class 10 to career"]
[Subtitle: "Choose a path. Explore countries. Plan your future."]

[8 career cards in 2x4 grid (1-col mobile)]
  Each card:
  - Lucide icon (career color tinted)
  - Title
  - One-line description
  - → arrow

[Footer: disclaimer]
```

#### Career Page (`/engineering`)

```
[Breadcrumb: Home > Engineering]
[Career hero: icon + title + description + whyChoose]

[6 country pills: India | USA | Germany | UK | Canada | Australia]

[Comparison table]
| | India | USA | Germany | UK | Canada | Australia |
| 4-year cost | ... | ... | ... | ... | ... | ... |
| Language | ... | ... | ... | ... | ... | ... |
| Work while studying | ... | ... | ... | ... | ... | ... |
| Post-study visa | ... | ... | ... | ... | ... | ... |
| Entry difficulty | ... | ... | ... | ... | ... | ... |

[Action Plan link → /engineering/action-plan]
```

#### Country Page (`/engineering/usa`)

```
[Breadcrumb: Home > Engineering > USA]
[Country overview paragraph]
[Budget breakdown card]

[Exams section — expandable cards, inline]
  Click exam → expands to show details + links

[Universities section — preview cards]
  Each card: name, location, ranking, fees badge, acceptance badge
  Click → navigates to /engineering/usa/mit
```

#### University Page (`/engineering/usa/mit`)

```
[Breadcrumb: Home > Engineering > USA > MIT]

[Two-column layout (single on mobile)]

[Main column: MDX content rendered with typography]
  - Why MIT?
  - How to Get In
  - Curriculum & Structure
  - Campus Life
  - Important Links (real clickable URLs)

[Sidebar: Quick Facts card]
  - Ranking
  - Fees (₹ and $)
  - Acceptance rate
  - Average salary
  - Top recruiters (list)
  - [Visit Website] button
  - [Apply Now] button
```

#### Action Plan Page (`/engineering/action-plan`)

```
[Breadcrumb: Home > Engineering > Action Plan]

[Country filter pills: All | India | USA | Germany | UK | Canada | Australia]

[Timeline]
  Phase 1: Class 9-10 (Foundation)
    - Item tagged [All] / [India] / [USA] etc.
  Phase 2: Class 11 (Critical Year)
    - ...
  Phase 3: Class 12 (Execution)
    - ...
  Phase 4: Smart Strategy
    - ...
```

## Tech Stack

- Next.js 15 App Router
- TypeScript (strict)
- Tailwind CSS 3.4 + @tailwindcss/typography
- Lucide React (icons)
- next-mdx-remote (MDX loading)
- gray-matter (frontmatter parsing)
- next-themes (light/dark mode)
- DM Sans + Space Mono (Google Fonts via next/font)

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx                    # Root: fonts, ThemeProvider, Header, Footer
│   ├── page.tsx                      # Landing: career grid (Server Component)
│   ├── [career]/
│   │   ├── page.tsx                  # Career overview + comparison table
│   │   ├── action-plan/
│   │   │   └── page.tsx              # Timeline action plan
│   │   └── [country]/
│   │       ├── page.tsx              # Country: exams + university list
│   │       └── [university]/
│   │           └── page.tsx          # University detail (MDX rendered)
│   └── globals.css
├── components/
│   ├── Header.tsx                    # Logo + breadcrumb + theme toggle
│   ├── Footer.tsx                    # Disclaimer
│   ├── ThemeToggle.tsx               # Sun/moon toggle (client component)
│   ├── CareerCard.tsx                # Landing page card
│   ├── CountryPills.tsx              # Country selector pills
│   ├── CountryCompare.tsx            # Comparison table
│   ├── ExamCard.tsx                  # Expandable exam (client component)
│   ├── UniCard.tsx                   # University preview card
│   ├── UniSidebar.tsx                # Quick facts sidebar
│   ├── ActionTimeline.tsx            # Phase timeline with country filter
│   ├── Breadcrumb.tsx                # Navigation breadcrumbs
│   ├── MDXContent.tsx                # MDX renderer
│   └── ui.tsx                        # Shared primitives
├── lib/
│   ├── content.ts                    # MDX loading: getCareer, getUni, getExam, listUnis, etc.
│   ├── types.ts                      # Frontmatter TypeScript interfaces
│   └── themes.ts                     # Career color map
```

### Server vs Client Components

| Component | Rendering | Why |
|-----------|-----------|-----|
| All pages | Server | Static content, read MDX at build time |
| Header, Footer, Breadcrumb | Server | No interactivity |
| CareerCard, UniCard | Server | Just links, no state |
| ThemeToggle | Client | Needs localStorage + DOM |
| ExamCard | Client | Expandable/collapsible |
| CountryPills | Client | Interactive selection |
| ActionTimeline | Client | Country filter state |

### Static Generation

All pages use `generateStaticParams` for full SSG:

```ts
// app/[career]/[country]/[university]/page.tsx
export async function generateStaticParams() {
  // Returns all career/country/university combinations
  // Built at deploy time, zero runtime cost
}
```

## Content Voice

### Principles

1. Write for a parent who hasn't been to college abroad
2. No acronyms without first-use explanation
3. Fees always in both ₹ and local currency
4. "Your child" not "the student"
5. Deadlines as specific dates: "Apply by January 15, 2026"
6. Every claim backed by a link
7. Honest about difficulty — no sugar-coating acceptance rates
8. Comparisons parents care about: "IIT Bombay 4 years = one year at MIT"

### Every university answers these questions (in order)

1. "What is this?" — One line a 10th grader understands
2. "Is this for my child?" — Who should consider it, who shouldn't
3. "What does it cost?" — Total real cost in ₹
4. "How hard is it to get in?" — Honest reality
5. "What will my child become?" — Jobs, salaries, trajectory
6. "What do we do right now?" — Exact next steps with deadlines

### Every country overview answers

- "Why should my child study here?"
- "What's the total budget for 4 years?"
- "Can they work while studying?"
- "Can they stay after graduating?"
- "What language do they need?"
- "Is it safe?"

## Data Accuracy Requirements

- All information must be accurate as of 2026
- All university links must be verified working URLs
- All exam dates, fees, and deadlines must reflect 2026 schedules
- All fee figures must use current exchange rates
- Rankings must cite source (QS 2026, NIRF 2025, THE 2026, etc.)

## Content Inventory (estimated)

| Content Type | Count |
|-------------|-------|
| Career meta files | 8 |
| Country overviews | ~40 (8 careers x ~5 countries each — not all careers in all countries) |
| University files | ~120-150 |
| Exam files | ~25-30 (shared across careers) |
| Action plans | 8 |

Note: Not all careers exist in all countries. Defence is India-only. Merchant Navy may cover India + UK + Australia. Aviation may cover India + USA + Australia.

## Career x Country Matrix

| Career | India | USA | Germany | UK | Canada | Australia |
|--------|-------|-----|---------|-----|--------|-----------|
| Engineering | Yes | Yes | Yes | Yes | Yes | Yes |
| Science | Yes | Yes | Yes | Yes | Yes | Yes |
| Finance | Yes | Yes | No | Yes | Yes | Yes |
| Architecture | Yes | Yes | Yes | Yes | Yes | Yes |
| Defence | Yes | No | No | No | No | No |
| Design | Yes | Yes | Yes | Yes | Yes | Yes |
| Merchant Navy | Yes | No | No | Yes | No | Yes |
| Aviation | Yes | Yes | No | Yes | Yes | Yes |
