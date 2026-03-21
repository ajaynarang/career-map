# 🎯 PCM Career Map

Interactive career guidance app for Class 12 PCM students. Explore career paths across India, USA, and Germany with detailed exam info, university data, fees, and step-by-step action plans.

## Career Paths Covered
- ⚙️ **Engineering / Tech** — JEE, SAT, German universities
- 🔬 **Pure Science / Research** — IISER, IISc, MIT, Max Planck
- 📈 **Finance / Quant / Economics** — CUET, ISI, Wharton, LSE
- 🎨 **Design / Product** — UCEED, NID, RISD, Parsons
- 🎖️ **Defence / Armed Forces** — NDA, CDS

## Features
- 🗺️ Interactive mind map with clickable career circles
- 🌍 India / USA / Germany paths for each career
- 📋 Entrance exam details: dates, fees, format, strategy tips
- 🏫 University profiles: fees, placements, curriculum, how to get in
- 📅 Class 9→12 action plans with month-by-month guidance
- 📱 Side sheet pattern for deep drill-down (mobile-friendly)

## Tech Stack
- [Next.js 15](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- Lucide React icons

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/pcm-career-map.git
cd pcm-career-map

# Install (using Bun)
bun install

# Dev server
bun dev

# Open http://localhost:3000
```

## Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (SideSheet, ExamSheet, etc.)
├── data/          # Career data files (one per career path)
└── lib/           # Types, themes, utilities
```

## Adding Content

### New University
Edit the relevant file in `src/data/` and add to the `universities` array.

### New Career Path
1. Create `src/data/yourcareer.ts`
2. Export a `CareerPath` object
3. Import in `src/data/index.ts`
4. Add colors to `src/lib/themes.ts`

### New Country
Add a new key to `paths` in any career data file.

## Disclaimer
All exam dates, fees, eligibility criteria, and placement data are approximate and indicative. Always verify from official sources before making decisions.

## License
MIT
