import { CareerPath } from "@/lib/types";

export const design: CareerPath = {
  id: "des", title: "Design / Product", icon: "🎨", theme: "des",
  desc: "UI/UX, product design, animation, game design, industrial design — creativity meets technology.",
  whyChoose: "Massive demand from SaaS/startup boom. UX designers: ₹15-40 LPA India, $100-150K USA. Portfolio > marks.",
  paths: {
    india: { label: "🇮🇳 India", id: "des-india", overview: "Portfolio-driven. Design work > marks. NID and IIT IDC are gold standard.",
      exams: [
        { name: "UCEED", when: "January", reg: "uceed.iitb.ac.in | Fee ₹3-4K", elig: "12th pass/appearing. Age < 24.", format: "3 hrs. NAT, MCQ, MSQ. Visualization, observation, creativity.", syllabus: "No fixed syllabus! Creative aptitude, spatial reasoning.", tip: "Tests how you SEE and THINK. Sketch daily, observe, spatial puzzles.", prepStart: "Sketch from Class 9. Formal prep 6-8 months before." },
        { name: "NID DAT", when: "January-February", reg: "nid.edu | Fee ₹3-4K", elig: "12th pass/appearing.", format: "Prelims: 3 hrs written. Mains: Studio test + interview at NID.", syllabus: "Design aptitude, drawing, creativity, communication.", tip: "NID wants original thinking. Don't copy. Interview is crucial.", prepStart: "6-12 months dedicated design practice." },
      ],
      universities: [
        { name: "NID Ahmedabad", location: "Ahmedabad", ranking: "#1 Design India", fees: "₹3.5-7L/yr", pkg: "Avg: ₹12-20 LPA | Top: ₹30-50 LPA", recruiters: "Google, Microsoft, Flipkart, Ola, Samsung, Titan", branches: "Product, Communication, Animation, Exhibition, Furniture", howToGetIn: "NID DAT Prelims → Mains. Portfolio + interview.", curriculum: "4-yr BDes. Hands-on. Studio-based.", campus: "Iconic. Creative atmosphere.", scholarships: "Need-based. Merit.", website: "nid.edu" },
        { name: "IIT Bombay IDC", location: "Mumbai", ranking: "#1 Product/Interaction Design", fees: "₹2L/yr", pkg: "Avg: ₹15-25 LPA | Top: ₹40-60 LPA", recruiters: "Google, Microsoft, Adobe, Samsung, Uber", branches: "BDes (4-year via UCEED)", howToGetIn: "UCEED. Rank < 100.", curriculum: "Design + tech integration. UX, product innovation.", campus: "IIT Bombay campus.", scholarships: "IIT scholarships + MCM.", website: "idc.iitb.ac.in" },
      ],
    },
    usa: { label: "🇺🇸 USA", id: "des-usa", overview: "Portfolio is everything. SAT less important. World's best design schools.",
      exams: [{ name: "SAT (often optional)", when: "Multiple times/yr", reg: "Same", elig: "Same", format: "Same", syllabus: "Same", tip: "Many design schools SAT-optional. Portfolio: 60-70% of decision.", prepStart: "Build portfolio from Class 10." }],
      universities: [
        { name: "RISD", location: "Providence, RI", ranking: "#1 Design globally", fees: "$60K/yr = ₹50L/yr", pkg: "Starting: $55-85K", recruiters: "Apple, Google, Nike, IDEO, Pentagram", branches: "Industrial, Graphic, Illustration, Animation, Architecture", howToGetIn: "Portfolio (12-20 pieces). SAT optional.", curriculum: "4-yr BFA. Foundation year. Studio-intensive.", campus: "Next to Brown (cross-register).", scholarships: "Need-based. ~45% get aid.", website: "risd.edu" },
        { name: "Parsons", location: "New York City", ranking: "Top 3 globally", fees: "$55K/yr = ₹46L/yr", pkg: "Starting: $50-80K", recruiters: "Fashion houses, tech, studios", branches: "Communication, Product, Fashion, Design & Tech", howToGetIn: "Portfolio + Parsons Challenge. SAT optional.", curriculum: "4-yr BFA. NYC = internship goldmine.", campus: "Manhattan.", scholarships: "Merit + need.", website: "newschool.edu/parsons" },
      ],
    },
  },
  actionPlan: { title: "Design — action plan",
    phases: [
      { phase: "Class 9-10", items: ["Sketch DAILY", "Learn Figma (free)", "Online courses: Coursera Design Thinking", "Observe everything: packaging, apps, signage", "Photography trains your eye."] },
      { phase: "Class 11", items: ["Portfolio: 10-15 pieces", "Prepare UCEED/NID DAT", "USA: SAT + portfolio", "Design competitions", "Adobe Suite"] },
      { phase: "Class 12", items: ["UCEED (Jan) + NID DAT (Jan-Feb)", "USA design schools with portfolio", "Portfolio > marks > SAT"] },
      { phase: "Key insight", items: ["Design + coding = UX Engineering = most in-demand", "If unsure: engineering, learn design on side", "NID/IDC alumni strong in Indian startups"] },
    ],
  },
};
