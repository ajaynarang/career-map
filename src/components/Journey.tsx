"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, ArrowRight, ExternalLink, Globe,
  BookOpen, Users, Star, Award, Zap, Sun, Moon, GraduationCap,
  ChevronRight, ChevronDown, Clock, DollarSign, Briefcase, Shield,
  ArrowLeft, TrendingUp, Rocket,
} from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const ActionPlanMDX = dynamic(() => import("./ActionPlanRenderer").then(m => ({ default: m.ActionPlanRenderer })), {
  loading: () => <div className="text-sm text-[var(--muted-foreground)]">Loading...</div>,
});

// ─── Types ───

interface CareerData { slug: string; title: string; description: string; whyChoose: string }
interface CountryData { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }
interface UniData { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }
interface ExamData { slug: string; name: string; when: string; fee: string; eligibility: string; format: string; website: string }

const COLORS: Record<string, string> = {
  engineering: "#3B82F6", science: "#8B5CF6", finance: "#F59E0B", architecture: "#F97316",
  defence: "#10B981", design: "#EC4899", "merchant-navy": "#06B6D4", aviation: "#6366F1",
};

const EMOJIS: Record<string, string> = {
  engineering: "⚙️", science: "🔬", finance: "📈", architecture: "🏛️",
  defence: "🛡️", design: "🎨", "merchant-navy": "🚢", aviation: "✈️",
};

const CAREER_META: Record<string, { fit: string; salaryIndia: string; salaryAbroad: string; prepCost: string }> = {
  engineering: { fit: "Problem solver, builder, tech lover (incl. Space/Aerospace)", salaryIndia: "₹6-55 LPA", salaryAbroad: "$80-150K", prepCost: "₹1-3L/yr coaching" },
  science: { fit: "Deeply curious, loves experiments", salaryIndia: "₹5-40 LPA", salaryAbroad: "$60-130K", prepCost: "₹50K-2L/yr" },
  finance: { fit: "Sharp with numbers, strategic thinker", salaryIndia: "₹8-80 LPA", salaryAbroad: "$100-200K", prepCost: "₹30K-1.5L/yr" },
  architecture: { fit: "Creative + technical, visual thinker", salaryIndia: "₹5-20 LPA", salaryAbroad: "$60-110K", prepCost: "₹50K-1L/yr" },
  defence: { fit: "Disciplined, patriotic, physically fit", salaryIndia: "₹6-20 LPA + benefits", salaryAbroad: "N/A", prepCost: "₹30K-1L (SSB coaching)" },
  design: { fit: "Artistic, empathetic, detail-oriented", salaryIndia: "₹4-30 LPA", salaryAbroad: "$50-120K", prepCost: "₹50K-2L/yr" },
  "merchant-navy": { fit: "Adventurous, independent, loves sea", salaryIndia: "₹8-40 LPA (tax-free)", salaryAbroad: "Similar globally", prepCost: "₹5-15L total training" },
  aviation: { fit: "Loves flying, disciplined, sharp reflexes", salaryIndia: "₹12-50 LPA", salaryAbroad: "$80-200K", prepCost: "₹25-50L (CPL training)" },
};

// ─── Founder Track Data ───

const FOUNDER_CAREERS = ["engineering", "science", "finance", "architecture", "defence", "design", "merchant-navy", "aviation"];

const STARTUP_ECOSYSTEMS: Record<string, { rating: string; score: number; visa: string; hubs: string; funding: string }> = {
  india: { rating: "🔥 3rd largest globally", score: 5, visa: "No visa needed (Indian citizens)", hubs: "Bangalore (IT), Delhi NCR (B2B), Mumbai (FinTech), Hyderabad (AI)", funding: "Seed: ₹25L-2Cr via Y Combinator India, Sequoia Surge, 100X.VC" },
  usa: { rating: "🏆 #1 global ecosystem", score: 5, visa: "O-1A (extraordinary ability) or EB-2 NIW for founders", hubs: "Bay Area, NYC, Austin, Boston, Miami", funding: "Seed: $500K-$3M via YC, a16z, Sequoia, First Round" },
  germany: { rating: "📈 Europe's fastest growing", score: 3, visa: "§21 Residence Permit for self-employment (freelance visa)", hubs: "Berlin (#1 in EU for startups), Munich (deep tech), Hamburg (logistics)", funding: "Seed: €100K-€1M via EXIST grant, High-Tech Gründerfonds" },
  uk: { rating: "⭐ Europe's #1 for VC funding", score: 4, visa: "Innovator Founder visa (endorsed by approved body)", hubs: "London (global hub), Cambridge (biotech), Manchester (FinTech)", funding: "Seed: £150K-£1.5M via Seedcamp, Entrepreneur First, SFC Capital" },
};

const FOUNDER_TIPS: Record<string, string[]> = {
  engineering: [
    "60%+ of Indian unicorn founders are engineers (Flipkart, Ola, Zerodha, Freshworks). Your tech skills = unfair advantage",
    "Build a real product in college — launch on Product Hunt, get 100 users. IIT Bombay e-Cell, BITS Conquest are launchpads",
    "Top incubators: IIT Bombay SINE, IIT Madras IITM-IC, Stanford StartX, MIT delta v, Y Combinator (accepts students)",
    "Learn: Product management + sales alongside coding. A founder who can build AND sell is unstoppable",
  ],
  finance: [
    "FinTech is India's #1 funded startup sector (Paytm, Razorpay, Zerodha). Your CA/CFA skills = regulatory moat",
    "Best path: Work 2-3 years at a Goldman Sachs/McKinsey → build network → launch. 80% of FinTech founders did this",
    "Key universities for founder networks: IIM Ahmedabad (CIIE incubator), Wharton (Penn Wharton Innovation Fund), LSE",
    "India's UPI revolution created $50B+ in FinTech value. Next wave: InsurTech, WealthTech, cross-border payments",
  ],
  design: [
    "Design-led companies are valued 2x higher (Figma: $20B, Canva: $40B, Notion: $10B). Visual thinkers build better products",
    "Your superpower: You can prototype in hours what others take weeks. Use Figma → ship fast → get user feedback",
    "Best incubators for designers: NID Ahmedabad (startup studio), RCA InnovationRCA, Parsons ELab, MIT Media Lab",
    "Build a portfolio of working products (not just mockups). Show 'I designed AND shipped this' to investors",
  ],
  science: [
    "Deep tech startups have 10x higher valuations than software (biotech, quantum, materials). Your research IS your moat",
    "PhD-to-startup path works: 40% of YC biotech founders have PhDs. Universities like IISc, MIT, Cambridge have tech transfer offices",
    "Look for: BIRAC BIG grants (India), NSF I-Corps (USA), EIC Pathfinder (EU) — government funding for science startups",
    "Dual degree (BSc/MSc + MBA) keeps both doors open. IISc has a startup cell, IIT Madras has the #1 research park in India",
  ],
  architecture: [
    "PropTech & ConTech are $30B+ markets — architects who code are building the future of how we design and construct",
    "Successful arch-founders: WeWork (co-working), Planner 5D (3D design), Houzz ($4B home renovation platform)",
    "Your 3D modeling + spatial thinking = unfair advantage in AR/VR, metaverse, and digital twin startups",
    "Start with: A design tool, a sustainability audit service, or a modular housing concept. Solve real builder/homeowner pain",
  ],
  defence: [
    "India's defence startup ecosystem is booming — iDEX (Innovations for Defence Excellence) funds 100+ startups/year",
    "Drone tech, cyber security, defence electronics — ₹100Cr+ government contracts available for Indian defence startups",
    "After military service (5-14 yrs), you gain discipline + clearance + network that no MBA can teach",
    "Key programs: iDEX DISC challenges, DRDO Technology Development Fund, Make in India defence corridor (UP & TN)",
  ],
  "merchant-navy": [
    "Maritime logistics is a $14 trillion industry ripe for disruption — most still run on paper and phone calls",
    "Successful maritime startups: Flexport ($8B), Freightos, MarineTraffic, Windward — all founded by industry insiders",
    "Your at-sea experience gives you deep domain knowledge that tech founders lack — that's your moat",
    "Start with: Crew management software, vessel tracking tools, or maritime training platforms. Solve problems you've lived",
  ],
  aviation: [
    "Aviation tech is exploding: drone delivery, eVTOL (flying taxis), aviation SaaS — $1T+ market by 2030",
    "Your pilot license + aviation knowledge = unfair advantage. Founders like those at Joby Aviation changed the industry",
    "Drone startups in India: Garuda Aerospace, IdeaForge (₹2,000Cr IPO). DGCA drone regulations opening new opportunities",
    "Start with: Flight training platforms, aviation maintenance SaaS, or drone services. Lower capital than airline startup",
  ],
};

type Tier = "dream" | "target" | "safety";

const TIER_INFO: Record<Tier, { emoji: string; label: string; color: string; desc: string }> = {
  dream: { emoji: "🏆", label: "Dream", color: "#F59E0B", desc: "Hardest to get in — best outcomes" },
  target: { emoji: "🎯", label: "Target", color: "#3B82F6", desc: "Realistic with strong preparation" },
  safety: { emoji: "✅", label: "Safety", color: "#10B981", desc: "Good backup — easier admission" },
};

function classifyTier(uni: UniData): Tier {
  const n = uni.name.toLowerCase();
  const r = uni.ranking.toLowerCase();
  if (n.includes("iit bombay") || n.includes("iit delhi") || n.includes("iit madras") || n.includes("iit kanpur") || n.includes("iit kharagpur") ||
      n.includes("mit") || n.includes("stanford") || n.includes("cambridge") || n.includes("oxford") || n.includes("imperial") || n.includes("caltech") ||
      n.includes("tu munich") || n.includes("carnegie mellon") || n.includes("uc berkeley") || n.includes("princeton") || n.includes("iisc") ||
      n.includes("iiser pune") || n.includes("wharton") || n.includes("lse") || n.includes("nid ahmedabad") || n.includes("nda") ||
      r.includes("#1") || r.includes("#2") || r.includes("#3")) return "dream";
  if (n.includes("bits") || n.includes("iiit") || n.includes("nit trichy") || n.includes("nit tiruchirappalli") ||
      n.includes("georgia") || n.includes("purdue") || n.includes("uiuc") || n.includes("illinois") || n.includes("cornell") ||
      n.includes("rwth") || n.includes("kit") || n.includes("ucl") || n.includes("edinburgh") || n.includes("michigan") ||
      n.includes("ucla") || n.includes("iim") || n.includes("srcc") || n.includes("isi ") ||
      r.includes("#4") || r.includes("#5") || r.includes("top 3") || r.includes("top 5") || r.includes("top 10")) return "target";
  return "safety";
}

function groupByTier(unis: UniData[]): Record<Tier, UniData[]> {
  const g: Record<Tier, UniData[]> = { dream: [], target: [], safety: [] };
  unis.forEach(u => g[classifyTier(u)].push(u));
  return g;
}

// ─── Overlay ───

function Overlay({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", h);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
    }
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 z-50 bg-[var(--background)] overflow-y-auto">
          <button onClick={onClose} className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center cursor-pointer hover:bg-[var(--border)] transition-colors shadow-lg">
            <X size={18} className="text-[var(--foreground)]" />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Theme toggle ───

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  if (!m) return null;
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="Toggle theme">
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

// ─── Back Button ───

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors mb-6">
      <ArrowLeft size={16} /> {label}
    </button>
  );
}

// ─── Main ───

export interface JourneyProps {
  careers: CareerData[];
  getCountries: (slug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
  actionPlans: Record<string, string>;
}

export function Journey({ careers, getCountries, getExams, getUnis, actionPlans }: JourneyProps) {
  const [step, setStep] = useState<"career" | "country" | "detail">("career");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<UniData | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [founderMode, setFounderMode] = useState(false);
  const [showFounderTrack, setShowFounderTrack] = useState(false);
  const isFounderRelevant = selectedCareer ? FOUNDER_CAREERS.includes(selectedCareer) : false;

  const career = careers.find(c => c.slug === selectedCareer);
  const color = selectedCareer ? COLORS[selectedCareer] || "#3B82F6" : "#3B82F6";
  const countries = selectedCareer ? getCountries(selectedCareer) : [];
  const country = countries.find(c => c.slug === selectedCountry);
  const exams = selectedCareer && selectedCountry ? getExams(selectedCareer, selectedCountry) : [];
  const unis = selectedCareer && selectedCountry ? getUnis(selectedCareer, selectedCountry) : [];
  const tiers = groupByTier(unis);

  // Popular careers first (most searched)
  const popular = careers.filter(c => ["engineering", "science", "finance"].includes(c.slug));
  const specialized = careers.filter(c => !["engineering", "science", "finance"].includes(c.slug));

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <div className="fixed top-4 right-4 z-30"><ThemeToggle /></div>

        <AnimatePresence mode="wait">
          {/* ═══════════════ STEP 1: CHOOSE CAREER ═══════════════ */}
          {step === "career" && (
            <motion.div key="careers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto px-5 pt-16 pb-16">
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                  What do you want to become?
                </h1>
                <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
                  You have PCM. That opens every door below. Pick what excites you — or scroll down to explore all options.
                </p>
              </div>

              {/* Popular paths */}
              <div className="mb-6">
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Most popular</div>
                <div className="space-y-2">
                  {popular.map((c, i) => {
                    const meta = CAREER_META[c.slug];
                    const clr = COLORS[c.slug];
                    return (
                      <motion.button key={c.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                        onClick={() => { setSelectedCareer(c.slug); setSelectedCountry(null); setStep("country"); }}
                        className="w-full p-4 md:p-5 rounded-2xl text-left cursor-pointer border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${clr}12` }}>{EMOJIS[c.slug]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-bold text-[var(--foreground)]">{c.title}</h3>
                              <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                            <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{meta?.fit}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <span className="text-[10px] flex items-center gap-1"><TrendingUp size={10} className="text-emerald-500" /><span className="font-bold text-emerald-600 dark:text-emerald-400">{meta?.salaryIndia}</span> <span className="text-[var(--muted-foreground)]">India</span></span>
                              {meta?.salaryAbroad !== "N/A" && <span className="text-[10px] flex items-center gap-1"><Globe size={10} className="text-blue-500" /><span className="font-bold text-blue-600 dark:text-blue-400">{meta?.salaryAbroad}</span> <span className="text-[var(--muted-foreground)]">abroad</span></span>}
                              <span className="text-[10px] text-[var(--muted-foreground)]">Prep: {meta?.prepCost}</span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Specialized paths */}
              <div>
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Specialized paths</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specialized.map((c, i) => {
                    const meta = CAREER_META[c.slug];
                    const clr = COLORS[c.slug];
                    return (
                      <motion.button key={c.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                        onClick={() => { setSelectedCareer(c.slug); setSelectedCountry(null); setStep("country"); }}
                        className="p-4 rounded-2xl text-left cursor-pointer border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${clr}12` }}>{EMOJIS[c.slug]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-[var(--foreground)]">{c.title}</h3>
                              <ArrowRight size={12} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </div>
                            <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{meta?.fit}</p>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">{meta?.salaryIndia}</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Not sure? */}
              <div className="mt-8 p-4 rounded-2xl bg-[var(--muted)] text-center">
                <p className="text-sm font-bold text-[var(--foreground)] mb-1">Not sure which path?</p>
                <p className="text-[11px] text-[var(--muted-foreground)] mb-3">Most PCM students start with Engineering — it keeps the most doors open. You can always explore other paths later.</p>
                <button onClick={() => { setSelectedCareer("engineering"); setStep("country"); }} className="text-xs font-bold cursor-pointer px-4 py-2 rounded-xl text-white" style={{ background: COLORS.engineering }}>
                  Start with Engineering →
                </button>
              </div>

              <p className="text-center text-[10px] text-[var(--muted-foreground)] mt-6 opacity-40">
                Every path here leads to a great career. There are no wrong choices.
              </p>
            </motion.div>
          )}

          {/* ═══════════════ STEP 2: CHOOSE COUNTRY ═══════════════ */}
          {step === "country" && career && (
            <motion.div key="countries" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto px-5 pt-16 pb-16">
              <BackButton onClick={() => { setSelectedCareer(null); setStep("career"); }} label="All careers" />

              {/* Career summary — compact */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}12` }}>{EMOJIS[career.slug]}</div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">{career.title}</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">{CAREER_META[career.slug]?.fit}</p>
                </div>
              </div>

              <h3 className="text-base font-bold text-[var(--foreground)] mb-1">Where do you want to study?</h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-5">Each country has different costs, exams, and opportunities.</p>

              {/* Founder Mode Toggle */}
              {isFounderRelevant && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                  <button
                    onClick={() => setFounderMode(!founderMode)}
                    className={`w-full p-3 rounded-xl text-left cursor-pointer border-2 transition-all flex items-center gap-3 ${
                      founderMode
                        ? "border-orange-500/40 bg-orange-500/5"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20"
                    }`}
                  >
                    <Rocket size={18} className={founderMode ? "text-orange-500" : "text-[var(--muted-foreground)]"} />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[var(--foreground)]">I might start my own company</div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">See startup ecosystems, founder visas & incubators</div>
                    </div>
                    <div className={`w-9 h-5 rounded-full transition-colors flex items-center ${founderMode ? "bg-orange-500 justify-end" : "bg-[var(--muted)] justify-start"}`}>
                      <div className="w-4 h-4 rounded-full bg-white mx-0.5 shadow-sm" />
                    </div>
                  </button>
                </motion.div>
              )}

              <div className="space-y-2">
                {countries.map((c, i) => {
                  const countryUnis = getUnis(career.slug, c.slug);
                  const startup = STARTUP_ECOSYSTEMS[c.slug];
                  return (
                    <motion.button key={c.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                      onClick={() => { setSelectedCountry(c.slug); setStep("detail"); }}
                      className="w-full p-4 rounded-2xl text-left cursor-pointer border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[var(--foreground)]">{c.label}</h4>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">{countryUnis.length} universities</span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                              <span className="text-[11px]"><span className="font-bold" style={{ color }}>{c.budget.totalInr}</span> <span className="text-[var(--muted-foreground)]">4yr total</span></span>
                              <span className="text-[11px] text-[var(--muted-foreground)]">{c.language}</span>
                              <span className="text-[11px] text-[var(--muted-foreground)]">{c.postStudyVisa} work visa</span>
                            </div>
                            {/* Founder mode extra info */}
                            {founderMode && startup && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 pt-2 border-t border-[var(--border)]">
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{startup.rating}</span>
                                  <span className="text-[10px] text-[var(--muted-foreground)]">{startup.visa}</span>
                                </div>
                                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Hubs: {startup.hubs}</div>
                                <div className="text-[10px] text-[var(--muted-foreground)]">{startup.funding}</div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action plan + Founder track */}
              <div className="space-y-2 mt-6">
                <button onClick={() => setShowActionPlan(true)} className="w-full p-4 rounded-2xl text-left cursor-pointer border-2 border-dashed border-[var(--border)] hover:border-[var(--muted-foreground)]/20 transition-colors flex items-center gap-3 group">
                  <span className="text-xl">📋</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[var(--foreground)]">Step-by-step action plan</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">What to do from Class 9 to 12 — month by month</div>
                  </div>
                  <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Founder Track Card — only when toggle is on */}
                {isFounderRelevant && founderMode && (
                  <button onClick={() => setShowFounderTrack(true)} className="w-full p-4 rounded-2xl text-left cursor-pointer border-2 border-dashed border-orange-500/20 hover:border-orange-500/40 bg-orange-500/[0.02] transition-colors flex items-center gap-3 group">
                    <span className="text-xl">🚀</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[var(--foreground)]">Founder track</div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">Extra skills, resources & mindset for aspiring entrepreneurs</div>
                    </div>
                    <ArrowRight size={14} className="text-orange-500/60 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ STEP 3: EXAMS + UNIVERSITIES ═══════════════ */}
          {step === "detail" && career && country && (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-5 pt-16 pb-16">
              <BackButton onClick={() => { setSelectedCountry(null); setStep("country"); }} label={`Back to countries`} />

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{EMOJIS[career.slug]}</span>
                <h2 className="text-lg font-bold text-[var(--foreground)]">{career.title} in {country.flag} {country.label}</h2>
              </div>

              {/* Quick facts strip */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-6 text-[11px]">
                <span><span className="font-bold" style={{ color }}>{country.budget.totalInr}</span> total cost</span>
                <span className="text-[var(--muted-foreground)]">{country.language}</span>
                <span className="text-[var(--muted-foreground)]">{country.postStudyVisa} work visa</span>
                <span className="text-[var(--muted-foreground)]">{exams.length} exams · {unis.length} universities</span>
              </div>

              {/* EXAMS */}
              {exams.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap size={14} className="text-amber-500" /> Entrance exams ({exams.length})
                  </h3>
                  <div className="space-y-2">
                    {exams.map(e => (
                      <div key={e.slug} className="rounded-xl border-2 border-[var(--border)] bg-[var(--card)] overflow-hidden">
                        <button onClick={() => setSelectedExam(selectedExam?.slug === e.slug ? null : e)}
                          className="w-full text-left p-4 cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-bold text-[var(--foreground)]">{e.name}</div>
                            <ChevronDown size={14} className={`text-[var(--muted-foreground)] transition-transform ${selectedExam?.slug === e.slug ? "rotate-180" : ""}`} />
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
                            <span className="text-[var(--muted-foreground)]">📅 {e.when.substring(0, 40)}</span>
                            <span className="text-[var(--muted-foreground)]">💰 {e.fee}</span>
                          </div>
                        </button>
                        <AnimatePresence>
                          {selectedExam?.slug === e.slug && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
                                <div className="p-2.5 rounded-lg bg-[var(--muted)] mb-3">
                                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Exam format</div>
                                  <div className="text-xs text-[var(--foreground)] leading-relaxed">{e.format}</div>
                                </div>
                                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mb-2">{e.eligibility}</p>
                                {e.website && (
                                  <a href={e.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold no-underline text-amber-500 hover:underline">
                                    Official website & registration <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UNIVERSITIES BY TIER */}
              {unis.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Award size={14} style={{ color }} /> Universities ({unis.length})
                  </h3>

                  {(["dream", "target", "safety"] as Tier[]).map(tier => {
                    const tierUnis = tiers[tier];
                    if (tierUnis.length === 0) return null;
                    const info = TIER_INFO[tier];
                    return (
                      <div key={tier} className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{info.emoji}</span>
                          <span className="text-xs font-bold" style={{ color: info.color }}>{info.label}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">{info.desc}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">{tierUnis.length}</span>
                        </div>
                        <div className="space-y-1.5">
                          {tierUnis.map(u => (
                            <button key={u.slug} onClick={() => setSelectedUni(u)}
                              className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all cursor-pointer text-left group">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-[var(--foreground)]">{u.name}</div>
                                  <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5"><MapPin size={9} />{u.location} · {u.ranking}</div>
                                  <div className="flex flex-wrap gap-2 mt-1.5">
                                    <span className="text-[10px] font-bold" style={{ color }}>{u.feesInr}</span>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{u.salary}</span>
                                  </div>
                                </div>
                                <ArrowRight size={12} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action plan */}
              <button onClick={() => setShowActionPlan(true)} className="w-full mt-8 p-4 rounded-2xl text-left cursor-pointer bg-[var(--muted)] hover:bg-[var(--border)] transition-colors flex items-center gap-3 group">
                <span className="text-xl">📋</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--foreground)]">Your step-by-step plan</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Month-by-month prep from Class 9 to 12</div>
                </div>
                <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ UNIVERSITY OVERLAY ═══ */}
      <Overlay open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && selectedCareer && selectedCountry && (() => {
          const c = color;
          const countryExams = getExams(selectedCareer, selectedCountry);
          return (
            <div className="max-w-xl mx-auto px-6 py-14">
              <div className="text-[9px] font-mono uppercase tracking-[4px] mb-2" style={{ color: c }}>{selectedUni.ranking}</div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">{selectedUni.name}</h1>
              <div className="text-sm text-[var(--muted-foreground)] flex items-center gap-1 mb-8"><MapPin size={13} />{selectedUni.location}</div>

              {/* 3 key numbers */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-4 rounded-2xl bg-[var(--muted)] text-center">
                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Cost/yr</div>
                  <div className="text-base font-bold" style={{ color: c }}>{selectedUni.feesInr}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--muted)] text-center">
                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Salary</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{selectedUni.salary}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--muted)] text-center">
                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Getting in</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{selectedUni.acceptance.substring(0, 30)}</div>
                </div>
              </div>

              {/* Scholarships */}
              {selectedUni.scholarships.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-2">🎓 Scholarships available</div>
                  <ul className="space-y-1">{selectedUni.scholarships.map(s => <li key={s} className="text-[11px] text-[var(--foreground)] flex gap-1.5"><span className="text-emerald-500">•</span>{s}</li>)}</ul>
                </div>
              )}

              {/* Programs */}
              {selectedUni.programs.length > 0 && (
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Programs offered</div>
                  <div className="flex flex-wrap gap-1.5">{selectedUni.programs.map(p => <span key={p} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--foreground)]">{p}</span>)}</div>
                </div>
              )}

              {/* Recruiters */}
              {selectedUni.recruiters.length > 0 && (
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Who hires from here</div>
                  <div className="flex flex-wrap gap-1.5">{selectedUni.recruiters.map(r => <span key={r} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{r}</span>)}</div>
                </div>
              )}

              {/* Exams needed */}
              {countryExams.length > 0 && (
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Exams required</div>
                  {countryExams.map(e => (
                    <div key={e.slug} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--muted)] mb-1.5">
                      <div className="text-xs font-semibold text-[var(--foreground)]">{e.name}</div>
                      {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold no-underline text-amber-500">Register</a>}
                    </div>
                  ))}
                </div>
              )}

              {/* Country context */}
              {country && (
                <div className="mb-8 p-3 rounded-xl bg-[var(--muted)] text-[11px] text-[var(--muted-foreground)]">
                  After graduating in {country.flag} {country.label}: <span className="font-bold text-[var(--foreground)]">{country.postStudyVisa}</span> work visa
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedUni.website && <a href={selectedUni.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[var(--border)] text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"><Globe size={15} /> Website</a>}
                {selectedUni.applyLink && <a href={selectedUni.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white no-underline" style={{ background: c }}>How to apply <ArrowRight size={14} /></a>}
              </div>
            </div>
          );
        })()}
      </Overlay>

      {/* ═══ ACTION PLAN OVERLAY ═══ */}
      <Overlay open={showActionPlan} onClose={() => setShowActionPlan(false)}>
        {selectedCareer && (
          <div className="max-w-2xl mx-auto px-6 py-14">
            <div className="text-[9px] font-mono uppercase tracking-[4px] mb-2" style={{ color }}>{career?.title}</div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Your Action Plan</h1>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">What to do from Class 9 to Class 12 — step by step</p>
            {actionPlans[selectedCareer] ? <ActionPlanMDX content={actionPlans[selectedCareer]} /> : <p className="text-sm text-[var(--muted-foreground)]">Coming soon.</p>}
          </div>
        )}
      </Overlay>

      {/* ═══ FOUNDER TRACK OVERLAY ═══ */}
      <Overlay open={showFounderTrack} onClose={() => setShowFounderTrack(false)}>
        {selectedCareer && isFounderRelevant && (
          <div className="max-w-2xl mx-auto px-6 py-14">
            <div className="text-[9px] font-mono uppercase tracking-[4px] text-orange-500 mb-2">FOUNDER TRACK</div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {career?.title} + Entrepreneurship
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">
              How to prepare for building your own company while studying {career?.title.toLowerCase()}
            </p>

            {/* Career-specific founder tips */}
            {FOUNDER_TIPS[selectedCareer] && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-orange-500" /> Why {career?.title.toLowerCase()} founders win
                </h3>
                <div className="space-y-2">
                  {FOUNDER_TIPS[selectedCareer].map((tip, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[var(--muted)] text-sm text-[var(--foreground)] flex gap-3">
                      <span className="text-orange-500 font-bold mt-0.5">{i + 1}.</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Startup ecosystem comparison */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe size={14} className="text-orange-500" /> Startup ecosystem by country
              </h3>
              <div className="space-y-2">
                {Object.entries(STARTUP_ECOSYSTEMS).map(([slug, eco]) => (
                  <div key={slug} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{slug === "india" ? "🇮🇳" : slug === "usa" ? "🇺🇸" : slug === "germany" ? "🇩🇪" : "🇬🇧"}</span>
                        <span className="text-sm font-bold text-[var(--foreground)]">{slug === "india" ? "India" : slug === "usa" ? "USA" : slug === "germany" ? "Germany" : "UK"}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{eco.rating}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-[var(--muted-foreground)]">
                      <div><span className="font-semibold text-[var(--foreground)]">Founder visa:</span> {eco.visa}</div>
                      <div><span className="font-semibold text-[var(--foreground)]">Startup hubs:</span> {eco.hubs}</div>
                      <div><span className="font-semibold text-[var(--foreground)]">Typical funding:</span> {eco.funding}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={14} className="text-orange-500" /> Founder preparation timeline
              </h3>
              <div className="space-y-0">
                {[
                  { phase: "Class 11-12", action: "Read 'Zero to One'. Follow founders on Twitter/LinkedIn. Try building something small — a website, app, or solving a problem you see around you. Join your school's entrepreneurship or innovation club." },
                  { phase: "College Year 1-2", action: "Join your college E-Cell or startup club. Attend hackathons (Smart India Hackathon, MLH). Take entrepreneurship electives. Start reading YC essays and Startup School. Find people who think like you." },
                  { phase: "College Year 3-4", action: "Build a real product with real users (even 10 is great). Apply to college incubators. Enter competitions (Hult Prize, BITS Conquest, IIT Bombay E-Summit). Consider summer internship at a startup." },
                  { phase: "After graduation", action: "Two paths work: (A) Launch directly — apply to YC/Antler/Sequoia Surge with your college project, or (B) Work 2-3 years at a high-growth startup (learn operations, fundraising, culture) then launch with experience + savings." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                      {i < 3 && <div className="w-0.5 flex-1 bg-orange-500/20 mt-1" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-orange-600 dark:text-orange-400">{item.phase}</div>
                      <div className="text-sm text-[var(--foreground)] mt-0.5 leading-relaxed">{item.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key resources — all clickable */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-orange-500" /> Resources & programs
              </h3>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { label: "Y Combinator Startup School", desc: "Free online course — best startup education globally", url: "https://www.startupschool.org/" },
                  { label: "Apply to Y Combinator", desc: "$500K funding, accepts students & non-US founders", url: "https://www.ycombinator.com/apply" },
                  { label: "Startup India (DPIIT)", desc: "Register your startup, ₹10Cr fund, 3-year tax holiday", url: "https://www.startupindia.gov.in/" },
                  { label: "iDEX — Defence Innovation", desc: "Grants up to ₹1.5Cr for defence/security startups", url: "https://idex.gov.in/" },
                  { label: "BIRAC BIG Grant", desc: "Up to ₹50L for biotech & life science startups", url: "https://birac.nic.in/" },
                  { label: "Atal Innovation Mission", desc: "Government incubators, tinkering labs, and seed funding", url: "https://aim.gov.in/" },
                  { label: "Sequoia Surge (India/SEA)", desc: "$1-2M seed for early-stage startups", url: "https://www.surgeahead.com/" },
                  { label: "Entrepreneur First", desc: "Build a startup from scratch with a co-founder (London, Bangalore)", url: "https://www.joinef.com/" },
                  { label: "Antler India", desc: "Pre-seed VC, build from Day 0 with mentors", url: "https://www.antler.co/location/india" },
                  { label: "100X.VC", desc: "India's first CCD-based VC, ₹25L for idea-stage startups", url: "https://www.100x.vc/" },
                ].map(r => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--muted)] no-underline group hover:bg-[var(--border)] transition-colors">
                    <div>
                      <span className="font-semibold text-[var(--foreground)]">{r.label}</span>
                      <span className="text-[var(--muted-foreground)]"> — {r.desc}</span>
                    </div>
                    <ExternalLink size={10} className="text-[var(--muted-foreground)] group-hover:text-orange-500 flex-shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>

            {/* Must-read */}
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">📚 Must-read for aspiring founders</div>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { title: "Zero to One", author: "Peter Thiel", desc: "How to think about building something truly new" },
                  { title: "The Lean Startup", author: "Eric Ries", desc: "Build → Measure → Learn — the methodology every founder uses" },
                  { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", desc: "Real talk about what running a startup actually feels like" },
                  { title: "Shoe Dog", author: "Phil Knight (Nike)", desc: "One of the greatest founder stories ever written" },
                ].map(b => (
                  <div key={b.title} className="text-[var(--foreground)]">
                    <span className="font-semibold">{b.title}</span> <span className="text-[var(--muted-foreground)]">({b.author})</span> — <span className="text-[var(--muted-foreground)]">{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}
