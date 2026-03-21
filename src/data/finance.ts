import { CareerPath } from "@/lib/types";

export const finance: CareerPath = {
  id: "fin", title: "Finance / Quant / Economics", icon: "📈", theme: "fin",
  desc: "Investment banking, quant trading, economics, chartered accountancy — where math meets money.",
  whyChoose: "Highest-paying careers globally. Quant traders: $200-500K+. Multiple entry routes from PCM.",
  paths: {
    india: { label: "🇮🇳 India", id: "fin-india", overview: "Two routes: Direct (CUET → DU Economics) or Indirect (Engineering → MBA/CFA). Indirect often more powerful.",
      exams: [
        { name: "CUET", when: "May-June", reg: "cuet.samarth.ac.in | Fee ₹650-1200", elig: "12th pass. Any stream.", format: "Domain subjects + Language + General Test. MCQ.", syllabus: "Class 12 NCERT.", tip: "Gateway to DU, JNU, BHU. Score well in Math/Economics.", prepStart: "3-4 months. NCERT + practice." },
        { name: "IPMAT (IIM Integrated)", when: "May", reg: "iimindore.ac.in | Fee ₹4-6K", elig: "12th 60%+. Age < 20.", format: "Quant (MCQ + SA) + Verbal. 120 min.", syllabus: "Aptitude: arithmetic, algebra, geometry, English.", tip: "IIM Indore/Rohtak 5-yr IPM. Direct IIM without CAT!", prepStart: "Class 11. Quant aptitude daily." },
        { name: "CA Foundation", when: "June & December", reg: "icai.org | Fee ~₹11,400", elig: "12th pass.", format: "4 papers: Accounting, Business Laws, Maths/LR/Stats, Economics.", syllabus: "Foundation accounting, law, economics.", tip: "4.5-yr journey. Very respected. ₹7-12 LPA start, ₹20-50 LPA with exp.", prepStart: "After 12th. Self-study or coaching." },
        { name: "ISI Admission Test", when: "May", reg: "isical.ac.in | Fee ₹600-1200", elig: "12th pass.", format: "Extremely tough math. Olympiad-level.", syllabus: "Advanced math, probability, combinatorics.", tip: "B.Stat/B.Math → gateway to quant finance. India's best quant minds.", prepStart: "Olympiad-level math from Class 10." },
      ],
      universities: [
        { name: "SRCC Delhi", location: "Delhi University", ranking: "#1 Commerce/Economics", fees: "₹30-50K/yr", pkg: "Avg: ₹12-18 LPA | Top: ₹30-50 LPA", recruiters: "Goldman Sachs, JP Morgan, McKinsey, BCG, Deloitte", branches: "B.Com (Hons), BA Economics (Hons)", howToGetIn: "CUET. 99+ percentile.", curriculum: "3-yr UG. Legendary placement cell.", campus: "DU North Campus.", scholarships: "DU merit.", website: "srcc.edu" },
        { name: "ISI Kolkata", location: "Kolkata", ranking: "#1 Statistics/Quant", fees: "₹5-10K/yr (almost free!)", pkg: "Quant: ₹25-50+ LPA", recruiters: "Tower Research, Optiver, Jane Street, Google, RBI", branches: "B.Stat, B.Math", howToGetIn: "ISI Admission Test. Olympiad level.", curriculum: "3-yr. Rigorous math. India's best quant minds.", campus: "Historic. Small batch (50-60).", scholarships: "Almost everyone gets support.", website: "isical.ac.in" },
        { name: "IIM Indore (IPM)", location: "Indore, MP", ranking: "IIM brand", fees: "₹5-6L/yr (₹25-30L total)", pkg: "After 5 yrs: ₹25-40 LPA", recruiters: "McKinsey, BCG, Goldman Sachs, Amazon", branches: "5-yr Integrated Program in Management", howToGetIn: "IPMAT. Top 200-300 ranks.", curriculum: "3 yrs foundation + 2 yrs MBA.", campus: "IIM Indore.", scholarships: "Merit-cum-means.", website: "iimidr.ac.in" },
        { name: "St. Stephen's", location: "Delhi University", ranking: "Top 2-3 Economics", fees: "₹40-60K/yr", pkg: "Avg: ₹10-15 LPA", recruiters: "Civil services, consulting, banking, media", branches: "BA Economics (Hons)", howToGetIn: "CUET + interview.", curriculum: "3-yr BA. Intellectual rigor.", campus: "DU North Campus. Historic.", scholarships: "College + DU.", website: "ststephens.edu" },
        { name: "Ashoka University", location: "Sonipat, Haryana", ranking: "#1 Liberal Arts", fees: "₹6-9L/yr", pkg: "Avg: ₹8-15 LPA", recruiters: "McKinsey, BCG, Bain, think tanks", branches: "Economics, Political Sci, Psychology, CS, Math", howToGetIn: "Ashoka entrance + interview.", curriculum: "4-yr UG. Major + minor.", campus: "Modern. 1 hr from Delhi.", scholarships: "Up to 100% fee waiver. 50% get aid.", website: "ashoka.edu.in" },
      ],
    },
    usa: { label: "🇺🇸 USA/UK", id: "fin-usa", overview: "Top US/UK universities → Wall Street, consulting, quant. LSE = European powerhouse.",
      exams: [
        { name: "SAT (for UG)", when: "7 times/yr", reg: "Same", elig: "Same", format: "400-1600", syllabus: "Same", tip: "Strong math essential. 1500+ for top schools.", prepStart: "Class 11." },
        { name: "GMAT (MBA — AFTER work)", when: "Year-round", reg: "mba.com ~$275", elig: "After 3-5 yrs work.", format: "Quant + Verbal + Data + Writing. 205-805.", syllabus: "Graduate aptitude.", tip: "NOT after 12th! MBA 5-8 years later. 730+ for top.", prepStart: "After 3-5 yrs work." },
      ],
      universities: [
        { name: "Wharton (UPenn)", location: "Philadelphia, PA", ranking: "#1 Finance globally", fees: "$63K/yr = ₹53L/yr", pkg: "Starting: $90-120K | Quant: $150K+", recruiters: "Goldman, JP Morgan, McKinsey, Citadel", branches: "BSc Economics (Finance/Accounting)", howToGetIn: "SAT 1530+. ~5% acceptance.", curriculum: "4-yr. Can take MBA courses. Wall Street pipeline.", campus: "Ivy League.", scholarships: "Need-blind domestic. Generous intl.", website: "wharton.upenn.edu" },
        { name: "LSE", location: "London, UK", ranking: "#1 Economics Europe", fees: "£27K/yr = ₹28L/yr", pkg: "Starting: £40-70K", recruiters: "Goldman, HSBC, McKinsey, Bank of England", branches: "BSc Economics, Finance, Econometrics", howToGetIn: "UCAS. 95%+ in 12th.", curriculum: "3-yr BSc. London = finance hub.", campus: "Central London.", scholarships: "Various. Some full rides.", website: "lse.ac.uk" },
        { name: "NYU Stern", location: "New York City", ranking: "Top 5 Finance", fees: "$58K/yr = ₹48L/yr", pkg: "Starting: $85-120K", recruiters: "Every major bank, hedge fund, PE firm", branches: "BS Business (Finance concentrations)", howToGetIn: "SAT 1500+. ~8% acceptance.", curriculum: "Wall Street from freshman year.", campus: "Manhattan.", scholarships: "Merit + need. Full-tuition possible.", website: "stern.nyu.edu" },
        { name: "U Chicago", location: "Chicago", ranking: "#1 Economics theory", fees: "$62K/yr = ₹52L/yr", pkg: "Starting: $80-110K", recruiters: "Citadel, Jump Trading, McKinsey", branches: "BA Economics, BS Math with Econ", howToGetIn: "SAT 1530+.", curriculum: "Most rigorous econ. Chicago School.", campus: "Hyde Park.", scholarships: "100% need met.", website: "uchicago.edu" },
      ],
    },
  },
  actionPlan: { title: "Finance/Quant — action plan",
    phases: [
      { phase: "Class 9-10", items: ["Strengthen mathematics", "Zerodha Varsity (free), Economic Times", "Excel deeply", "Competitive math (RMO, AMC)", "Read: The Intelligent Investor"] },
      { phase: "Class 11", items: ["CUET prep for DU Economics", "IPMAT prep for IIM", "CA Foundation registration", "USA: SAT + economics profile", "POWER MOVE: Engineering → quant finance later"] },
      { phase: "Class 12", items: ["CUET + IPMAT + ISI Test", "USA: Common App econ focus", "UK: UCAS for LSE"] },
      { phase: "Smart combos", items: ["QUANT PATH: Math/CS → Python/R → CFA → ₹30-60 LPA India, $150-500K USA", "SAFEST: CA → ₹7-15 LPA guaranteed", "HIGHEST: Wharton/LSE → Wall Street → $200K+", "ISI B.Stat → elite quant"] },
    ],
  },
};
