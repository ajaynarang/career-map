import { CareerPath } from "@/lib/types";

export const defence: CareerPath = {
  id: "def", title: "Defence / Armed Forces", icon: "🎖️", theme: "def",
  desc: "Army, Navy, Air Force officer. Disciplined life with purpose. Not a backup — a calling.",
  whyChoose: "Respect, adventure, pension, post-retirement opportunities. Starting: ₹56K/mo + allowances (effective ₹80K-1L/mo).",
  paths: {
    india: { label: "🇮🇳 India", id: "def-india", overview: "NDA is primary entry after 12th. Become military officer at 19. Physical fitness = academics.",
      exams: [
        { name: "NDA", when: "April & September (twice/year by UPSC)", reg: "upsc.gov.in | Fee ₹100 (Gen) | Free SC/ST/Women", elig: "12th pass/appearing. Age 16.5-19.5. Unmarried. Medical + physical fitness.", format: "Math (300 marks, 2.5 hrs) + GAT (600 marks, 2.5 hrs: English + GK + Science + History + Geography). Total 900 → SSB Interview (900) = 1800 total.", syllabus: "Math: Class 11-12. GAT: wide GK + English.", tip: "Written is moderate. REAL filter = SSB (5-day: personality, leadership, team spirit). 50% weightage is SSB.", prepStart: "Class 11. Physical fitness + academics. GDs, English communication." },
        { name: "CDS", when: "February & September", reg: "upsc.gov.in | Fee ₹200", elig: "After graduation (not after 12th).", format: "Similar to NDA but after degree.", syllabus: "Graduate level GK + English + Math.", tip: "Alternative if you miss NDA. Any bachelor's.", prepStart: "Final year of graduation." },
      ],
      universities: [
        { name: "NDA Pune", location: "Khadakwasla, Pune", ranking: "Premier military academy", fees: "FREE + stipend ~₹56K/mo", pkg: "Starting: ₹80K-1L/mo. Senior: ₹2-3L/mo.", recruiters: "Indian Army, Navy, Air Force", branches: "Army, Navy, Air Force wings", howToGetIn: "NDA written (UPSC) → SSB (5 days) → Medical.", curriculum: "3-yr: BA/BSc (JNU) + military training.", campus: "7000 acres. Lake, training grounds.", scholarships: "Everything free + stipend.", website: "nda.nic.in" },
      ],
    },
  },
  actionPlan: { title: "Defence — action plan",
    phases: [
      { phase: "Class 9-10", items: ["Physical fitness: running, swimming, sports", "Read about armed forces", "Join NCC at school", "Debates, GDs, public speaking", "Newspaper daily"] },
      { phase: "Class 11", items: ["Register for NDA (Apr/Sep)", "Physical: 5km < 25 min", "Math + GAT prep", "SSB-type activities"] },
      { phase: "Class 12", items: ["NDA written", "SSB interview prep", "Medical at military hospital"] },
      { phase: "Reality check", items: ["NOT a backup career.", "Physical fitness non-negotiable.", "Pension, healthcare, adventure", "Post-retirement: corporate, consulting, politics"] },
    ],
  },
};
