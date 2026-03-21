# PCM Career Map — Full Project Spec for Claude Code

## What to Build
A Next.js 15 (App Router) + TypeScript + Tailwind CSS career guidance app for PCM (Physics, Chemistry, Math) students. Interactive mind map → drill-down career paths → entrance exams → universities → action plans.

## Tech Stack
- Next.js 15 with App Router (`src/` directory)
- TypeScript (strict)
- Tailwind CSS 3.4+
- Lucide React for icons
- Google Fonts: DM Sans (body) + Space Mono (mono accents)
- No additional UI library needed — custom components

## Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, metadata
│   ├── globals.css         # Tailwind + custom animations
│   └── page.tsx            # Main career map page (client component)
├── components/
│   ├── CareerCircles.tsx   # Mind map root — 6 clickable career circles
│   ├── CareerPanel.tsx     # Expanded career detail with geo selection
│   ├── GeoContent.tsx      # Exams list + universities list for selected geography
│   ├── ActionPlan.tsx      # Step-by-step preparation roadmap
│   ├── SideSheet.tsx       # Shadcn-style slide-in panel from right (reusable)
│   ├── ExamSheet.tsx       # Exam detail content inside SideSheet
│   ├── UniSheet.tsx        # University detail content inside SideSheet
│   └── ui/
│       ├── InfoCard.tsx    # Label + value card
│       ├── Section.tsx     # Section title + children wrapper
│       ├── TextBlock.tsx   # Styled paragraph block
│       └── Pill.tsx        # Rounded pill button
├── data/
│   ├── index.ts            # Exports combined CAREER_DATA map
│   ├── engineering.ts      # Engineering career: India/USA/Germany
│   ├── science.ts          # Pure Science career: India/USA/Germany
│   ├── finance.ts          # Finance/Quant: India/USA-UK
│   ├── design.ts           # Design: India/USA
│   └── defence.ts          # Defence: India
└── lib/
    ├── types.ts            # TypeScript interfaces for all data models
    └── themes.ts           # Color theme constants per career
```

## Design System

### Theme: Dark, immersive, career-specific colors
- Background: `#08090c` (near-black)
- Card surfaces: `#0d0f14`
- Each career has a unique color theme:
  - Engineering: Blue (#3B82F6)
  - Science: Purple (#8B5CF6)
  - Finance: Amber (#F59E0B)
  - Design: Pink (#EC4899)
  - Defence: Green (#10B981)
  - Economics: Orange (#F97316)

### Each theme has these stops:
```ts
interface ThemeColors {
  accent: string;  // Primary vibrant color
  bg: string;      // Dark background tint
  card: string;    // Card background
  ring: string;    // Circle border color (inactive)
  text: string;    // Light readable text in this theme
  dim: string;     // Dimmed/inactive text
}
```

### Typography
- Headings: DM Sans 700
- Body: DM Sans 400
- Mono accents: Space Mono (for "CAREER GUIDANCE SYSTEM" header label)
- No font below 10px

### Animations
- `fadeUp`: opacity 0→1, translateY 14px→0, 0.4s ease
- `slideIn`: translateX 100%→0, 0.3s ease (for SideSheet)

## Data Model (TypeScript Types)

```ts
type CareerThemeKey = "eng" | "sci" | "fin" | "des" | "def" | "eco";

interface Exam {
  name: string;       // "JEE Main"
  when: string;       // "January & April (2 sessions/year)"
  reg: string;        // Registration details + fee
  elig: string;       // Eligibility criteria
  format: string;     // Exam structure, marks, time
  syllabus: string;   // What to study
  tip: string;        // Strategy advice
  prepStart: string;  // When to start preparing
}

interface University {
  name: string;        // "IIT Bombay"
  location: string;    // "Mumbai"
  ranking: string;     // "#1 NIRF Engineering"
  fees: string;        // "₹2.2L/yr (₹10L total)"
  pkg?: string;        // Placement data
  recruiters?: string; // Top companies
  branches?: string;   // Available programs
  howToGetIn: string;  // Admission process
  curriculum?: string; // Course structure
  campus?: string;     // Campus life
  scholarships?: string;
  website?: string;
}

interface GeoPath {
  label: string;       // "🇮🇳 India"
  id: string;
  overview: string;    // Summary of this geo's approach
  exams: Exam[];
  universities?: University[];
}

interface ActionPhase {
  phase: string;       // "Class 9-10 (Foundation)"
  items: string[];     // Action items
}

interface CareerPath {
  id: CareerThemeKey;
  title: string;
  icon: string;        // Emoji
  theme: CareerThemeKey;
  desc: string;
  whyChoose: string;   // Why this career
  paths: Record<string, GeoPath>;  // "india" | "usa" | "germany"
  actionPlan: { title: string; phases: ActionPhase[] };
}
```

## Component Behavior

### 1. CareerCircles (Mind Map Root)
- 5-6 circles in a flex-wrap row, each ~110x110px, round
- Each has icon + short title
- Active state: scale(1.12), accent border, glow shadow, accent bg tint
- Click toggles selection (click again to deselect)
- When selected, CareerPanel appears below with fadeUp animation

### 2. CareerPanel
- Shows career title, description, whyChoose insight
- Row of Pill buttons for geography: "🇮🇳 India", "🇺🇸 USA", "🇩🇪 Germany", "📋 Action Plan"
- Selecting a geo shows GeoContent below
- Selecting "Action Plan" shows ActionPlan

### 3. GeoContent
- Overview paragraph
- **Exams section**: List of clickable exam cards. Click → opens SideSheet with ExamSheet
- **Universities section**: List of clickable university cards showing name, location, ranking, fees pill, pkg pill. Click → opens SideSheet with UniSheet
- Hover effect on cards: accent tint background

### 4. SideSheet
- Fixed overlay, slides in from right
- 540px max width (93vw on mobile)
- Dark background (#0d0f14)
- Backdrop: black/65% + blur
- Close button (sticky top-right)
- Escape key closes
- Body scroll locked when open

### 5. ExamSheet (inside SideSheet)
- Exam name (h2), when badge
- InfoCards: Registration, Eligibility
- Sections: Format, Syllabus, Strategy (highlighted), When to start

### 6. UniSheet (inside SideSheet)
- University name (h2), location, ranking
- InfoCards: Fees, Placement
- Sections: Branches, How to Get In (highlighted), Curriculum, Recruiters, Campus, Scholarships
- Link to official website

### 7. ActionPlan
- Phase cards with accent-colored phase title
- Bullet items with accent dot

## Complete Career Data to Include

### ENGINEERING (eng)
**India** — 5 exams: JEE Main, JEE Advanced, BITSAT, VITEEE, SRMJEEE
**India** — 10 universities: IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, BITS Pilani, IIIT Hyderabad, NIT Trichy, NIT Surathkal, DTU Delhi
**USA** — 3 exams: SAT, TOEFL/IELTS, AP Exams
**USA** — 9 universities: MIT, Stanford, Carnegie Mellon, UC Berkeley, Georgia Tech, Purdue, UIUC, UT Austin, U Michigan
**Germany** — 3 exams: No entrance exam (marks-based), TestAS, German Language (TestDaF/DSH)
**Germany** — 6 universities: TU Munich, RWTH Aachen, TU Berlin, KIT Karlsruhe, U Stuttgart, TU Darmstadt

### SCIENCE (sci)
**India** — 3 exams: IISER IAT, NEST, JEE Advanced (for IISc)
**India** — 4 universities: IISc Bangalore, IISER Pune, IISER Kolkata, IISER Mohali
**USA** — 2 exams: SAT, GRE (for PhD)
**USA** — 4 universities: MIT, Caltech, Princeton, U Chicago
**Germany** — 1 exam entry, 3 universities: LMU Munich, U Heidelberg, U Göttingen

### FINANCE (fin)
**India** — 4 exams: CUET, IPMAT, CA Foundation, ISI Admission Test
**India** — 5 universities: SRCC, ISI Kolkata, IIM Indore IPM, St. Stephen's, Ashoka
**USA/UK** — 2 exams: SAT, GMAT (for later MBA)
**USA/UK** — 4 universities: Wharton, LSE, NYU Stern, U Chicago

### DESIGN (des)
**India** — 2 exams: UCEED, NID DAT
**India** — 2 universities: NID Ahmedabad, IIT Bombay IDC
**USA** — 1 exam: SAT (optional)
**USA** — 2 universities: RISD, Parsons

### DEFENCE (def)
**India only** — 2 exams: NDA, CDS
**India** — 1 university: NDA Pune

### For EACH exam include:
- name, when (exact months), registration (website + fee), eligibility, format (questions/marks/time), syllabus, strategy tip, when to start prep

### For EACH university include:
- name, location, ranking, fees (in ₹ AND $ where applicable), average package/starting salary, top recruiters, branches/programs, how to get in (cutoff ranks/scores), curriculum highlights, campus life, scholarships, official website

### For EACH career include action plan with phases:
- Class 9-10 (Foundation)
- Class 11 (Critical Year)
- Class 12 (Execution)
- Smart Strategy / Reality Check

## IMPORTANT NOTES FOR DATA
- All exam dates, fees, and eligibility are approximate/indicative (add disclaimer in footer)
- Include SAT vs GMAT distinction clearly (SAT = after 12th, GMAT = after work experience for MBA)
- Germany path: emphasize German language as biggest bottleneck, recommend starting in Class 9-10
- For PCM students taking IISER IAT: explain Bio is included but PCM can compensate, study NCERT Bio selectively
- Include cost comparison context: India IIT ~₹2L/yr, USA ~₹50-70L/yr, Germany ~₹0-5L/yr
- BITS Pilani unique: no fixed branches, Practice School, can change branch via CGPA

## Getting Started Commands
```bash
bunx create-next-app@latest career-map --typescript --tailwind --src-dir --app --no-import-alias
cd career-map
bun add lucide-react
# Then scaffold the files per structure above
```

## Future Enhancement Ideas (don't build now, just keep structure extensible)
- Search/filter across all universities
- Compare universities side-by-side
- Save favorites (localStorage)
- PDF export of action plan
- Add more careers: Medicine (PCB crossover), Architecture, Merchant Navy
- Add more countries: Canada, Australia, Singapore
- Timeline visualization (Gantt-style prep calendar)
- Dark/light mode toggle
- Mobile-optimized bottom sheet instead of side sheet
