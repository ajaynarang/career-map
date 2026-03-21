# PCM Career Map

## Project Overview
Interactive career guidance app for PCM (Physics, Chemistry, Math) students exploring career paths across India, USA, and Germany. Built with Next.js 15, TypeScript, Tailwind CSS.

## Key Commands
- `bun dev` — start dev server
- `bun run build` — production build
- `bun run lint` — lint check

## Architecture
- `/src/data/` — Career data files (one per career path). Add new careers here.
- `/src/components/` — React components. SideSheet is the key pattern for deep info.
- `/src/lib/types.ts` — TypeScript interfaces. Extend when adding new fields.
- `/src/lib/themes.ts` — Color themes per career.

## Adding a New Career Path
1. Create `src/data/newcareer.ts` exporting a `CareerPath` object
2. Import and add to `src/data/index.ts`
3. Add theme colors to `src/lib/themes.ts`
4. It auto-appears in the mind map

## Adding a New University
Edit the relevant data file in `src/data/`. Add to the `universities` array in the correct geo path.

## Adding a New Country/Geography
Add a new key to the `paths` object in any career data file. Follow existing pattern (label, overview, exams, universities).

## Design Principles
- Dark theme with career-specific accent colors
- SideSheet (slide from right) for detailed info — don't navigate away
- Data-driven: all content comes from /src/data/ files
- Mobile-responsive
- Use Bun as package manager
