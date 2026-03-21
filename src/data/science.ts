import { CareerPath } from "@/lib/types";

export const science: CareerPath = {
  id: "sci", title: "Pure Science / Research", icon: "🔬", theme: "sci",
  desc: "Physics, Mathematics, Chemistry research — for the genuinely curious. Scientist, professor, researcher.",
  whyChoose: "If you love understanding 'why' more than 'how to use'. India has IISc/IISERs. PhD funded in USA. Passion required.",
  paths: {
    india: { label: "🇮🇳 India", id: "sci-india", overview: "IISERs and IISc are world-class. Scholarships cover costs. 5-year integrated programs.",
      exams: [
        { name: "IISER IAT", when: "May-June", reg: "iiseradmission.in | Fee ~₹2000", elig: "12th with PCM. 60%+. Bio NOT mandatory.", format: "4 sections: Physics, Chemistry, Maths, Biology. ~60 Qs, 3 hrs.", syllabus: "Class 11-12 NCERT all 4 subjects including Bio.", tip: "PCM students: NCERT Bio selectively — Genetics, Ecology, Cell Bio. Strong PCM (80-90%) + decent Bio (30-40%) = can clear.", prepStart: "JEE prep covers PCM. Add 1-2 months NCERT Bio." },
        { name: "NEST", when: "June", reg: "nestexam.in | Fee ₹1000-1200", elig: "12th pass, age < 23.", format: "General (compulsory) + choose 2 of 4 subjects. 200 marks, 3 hrs.", syllabus: "Higher than NCERT. Olympiad-adjacent.", tip: "Can choose Physics + Maths (skip Bio entirely!). Easier for PCM students.", prepStart: "Olympiad-level helps. 3-4 months." },
        { name: "JEE Advanced (for IISc)", when: "May-June", reg: "Same as IIT JEE", elig: "JEE Advanced qualifier.", format: "Same as JEE Advanced.", syllabus: "Same.", tip: "IISc BS = fantastic research option. Rank < 5000 helps.", prepStart: "Same as JEE." },
      ],
      universities: [
        { name: "IISc Bangalore", location: "Bangalore", ranking: "#1 Research in India", fees: "₹35K/yr + scholarships", pkg: "Mostly PhD (₹35-50K/mo stipend). Industry: ₹12-20 LPA", recruiters: "ISRO, DRDO, Samsung R&D, Intel, Microsoft Research", branches: "Physics, Chemistry, Mathematics, Biology, Materials", howToGetIn: "JEE Advanced (top 5000) OR KVPY/INSPIRE.", curriculum: "Research from year 1. World-class faculty.", campus: "100 acres greenery in Bangalore.", scholarships: "INSPIRE ₹80K/yr. Institute fellowships.", website: "iisc.ac.in" },
        { name: "IISER Pune", location: "Pune", ranking: "#1 IISER, top 10 research", fees: "~₹1.2L/year", pkg: "Most → PhD. Industry: ₹8-15 LPA", recruiters: "TIFR, NCBS, intl PhD (MIT, Cambridge, Max Planck)", branches: "Physics, Chemistry, Mathematics, Biology, Earth Science", howToGetIn: "IAT OR NEST OR JEE Advanced.", curriculum: "5-yr BS-MS. First 2 yrs all sciences. Year 3 major.", campus: "Beautiful campus near Pune.", scholarships: "INSPIRE ₹80K/yr.", website: "iiserpune.ac.in" },
        { name: "IISER Kolkata", location: "Mohanpur, near Kolkata", ranking: "Top 3 IISER", fees: "~₹1L/yr", pkg: "Strong intl PhD placement.", recruiters: "International PhD programs, national labs", branches: "Physics, Chemistry, Maths, Biology, Earth Science", howToGetIn: "IAT / NEST / JEE Advanced.", curriculum: "5-yr BS-MS. Strong in theoretical physics.", campus: "Good facilities.", scholarships: "INSPIRE + institute.", website: "iiserkol.ac.in" },
        { name: "IISER Mohali", location: "Mohali, Punjab", ranking: "Top 4-5 IISER", fees: "~₹1L/yr", pkg: "Strong PhD placements.", recruiters: "Research institutes, intl PhD", branches: "Physics, Chemistry, Maths, Biology, Earth & Environmental", howToGetIn: "IAT / NEST / JEE Advanced.", curriculum: "5-yr BS-MS. Strong biological sciences.", campus: "Chandigarh region.", scholarships: "INSPIRE + IISER fellowships.", website: "iisermohali.ac.in" },
      ],
    },
    usa: { label: "🇺🇸 USA", id: "sci-usa", overview: "Best research ecosystem globally. PhD fully funded.",
      exams: [
        { name: "SAT (for UG)", when: "7 times/year", reg: "Same as Eng USA", elig: "Same", format: "400-1600", syllabus: "Same", tip: "Research experience > perfect score for science.", prepStart: "Same." },
        { name: "GRE (for PhD after UG)", when: "Year-round", reg: "ets.org/gre ~$220", elig: "Graduate school", format: "Verbal + Quant + Writing. 260-340.", syllabus: "Graduate reasoning", tip: "Many top programs dropping GRE. Publications matter more.", prepStart: "Final year UG." },
      ],
      universities: [
        { name: "MIT", location: "Cambridge, MA", ranking: "#1 Science globally", fees: "$61K/yr", pkg: "PhD: $38-45K/yr stipend", recruiters: "National labs, academia, DeepMind, OpenAI", branches: "Physics, Math, Chemistry, Brain & Cognitive, Earth", howToGetIn: "SAT 1550+, exceptional research/olympiad.", curriculum: "UROP. Work alongside Nobel laureates.", campus: "Cambridge. Unmatched.", scholarships: "100% need for UG. PhD funded.", website: "mit.edu" },
        { name: "Caltech", location: "Pasadena, CA", ranking: "#1-3 for physics", fees: "$63K/yr", pkg: "PhD fully funded", recruiters: "JPL/NASA, national labs, top universities", branches: "Physics, Chemistry, Biology, Geological Sci", howToGetIn: "Tiny class (~230). Olympiad medals, publications.", curriculum: "Everyone takes quantum mechanics. Extremely rigorous.", campus: "124 acres. Manages JPL.", scholarships: "Generous. PhD funded.", website: "caltech.edu" },
        { name: "Princeton", location: "Princeton, NJ", ranking: "#1 US, top 3 physics", fees: "$59K/yr", pkg: "PhD: $40K/yr stipend", recruiters: "IAS Princeton, national labs, Goldman (quant)", branches: "Physics, Math, Chemistry, Astrophysics", howToGetIn: "SAT 1540+. Strong theoretical background.", curriculum: "Senior thesis. Close faculty interaction.", campus: "600 acres. IAS nearby (Einstein).", scholarships: "Need-blind for all. No loans.", website: "princeton.edu" },
        { name: "U Chicago", location: "Chicago, IL", ranking: "Top 5 physics and math", fees: "$62K/yr", pkg: "PhD funded", recruiters: "Fermilab, Argonne, academia, quant finance", branches: "Physics, Math, Chemistry, Astronomy, Statistics", howToGetIn: "SAT 1530+. Intellectual curiosity.", curriculum: "Intense core. Theory-heavy.", campus: "Hyde Park. Gothic.", scholarships: "100% need met.", website: "uchicago.edu" },
      ],
    },
    germany: { label: "🇩🇪 Germany", id: "sci-germany", overview: "Strong physics/math tradition. Max Planck system. Free tuition.",
      exams: [
        { name: "No entrance exam", when: "Marks-based", reg: "uni-assist.de", elig: "12th 85%+ | German B2 | APS", format: "Marks-based.", syllabus: "N/A", tip: "German physics programs extremely rigorous.", prepStart: "German from Class 9-10." },
      ],
      universities: [
        { name: "LMU Munich", location: "Munich", ranking: "Top 3 Germany, Top 50 Physics", fees: "€0 tuition + €150/semester", pkg: "PhD: €2000-3000/mo", recruiters: "Max Planck, ESO, CERN, BMW R&D", branches: "Physics, Math, Chemistry, Biology", howToGetIn: "12th 85%+. German B2.", curriculum: "3-yr BSc → 2-yr MSc → PhD. Near Max Planck.", campus: "Munich. World-class.", scholarships: "DAAD, Deutschlandstipendium.", website: "lmu.de" },
        { name: "U Heidelberg", location: "Heidelberg", ranking: "#1-2 Germany. Oldest (1386!)", fees: "€1500/semester non-EU", pkg: "PhD: €2000-3000/mo", recruiters: "EMBL, DKFZ, Max Planck", branches: "Physics, Math, Chemistry, Molecular Bio", howToGetIn: "12th 85%+. German B2.", curriculum: "Research-intensive. Famous for theoretical physics.", campus: "Beautiful old town. 'City of Science'.", scholarships: "DAAD. University fellowships.", website: "uni-heidelberg.de" },
        { name: "U Göttingen", location: "Göttingen", ranking: "Historic (Heisenberg, Born, Planck)", fees: "€0 tuition + €400/semester", pkg: "PhD: €2000-3000/mo", recruiters: "Max Planck, DLR, intl research", branches: "Physics, Mathematics, Chemistry", howToGetIn: "12th 85%+. German B2.", curriculum: "Strong theoretical physics and math.", campus: "Small. Very affordable €400-600/mo.", scholarships: "DAAD, Studienstiftung.", website: "uni-goettingen.de" },
      ],
    },
  },
  actionPlan: { title: "Pure Science — action plan",
    phases: [
      { phase: "Class 9-10", items: ["Fall in love with a subject — Feynman, Ramanujan biographies", "Olympiad prep (Physics/Math/Chemistry)", "Read: Brief History of Time, Surely You're Joking Mr. Feynman", "Small experiments/projects. Document them.", "Germany: start German."] },
      { phase: "Class 11", items: ["IISER: Master NCERT PCM. Add selective NCERT Bio.", "JEE (for IISc): Full JEE preparation.", "Olympiads: NSEP, NSEC, NSEA, RMO.", "Start a research project.", "USA: SAT + research profile."] },
      { phase: "Class 12", items: ["IISER IAT + NEST + JEE Advanced", "Apply IISc through JEE", "USA: Common App with research focus", "Germany: 85%+ boards. German B1.", "Research experience > marks for this path."] },
      { phase: "Reality check", items: ["Path leads to PhD (5-7 years). Be financially prepared.", "Skills transfer to AI/ML/quant finance.", "India IISERs/IISc: good stipends during PhD.", "USA PhD fully funded — tuition + $30-45K/yr.", "Passion non-negotiable."] },
    ],
  },
};
