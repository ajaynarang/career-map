"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, ArrowRight, ExternalLink, Globe,
  BookOpen, Users, Star, Award, Zap, Sun, Moon, GraduationCap,
  ChevronRight, Clock, DollarSign, Briefcase, Shield,
} from "lucide-react";
import Link from "next/link";
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

const CAREER_FITS: Record<string, string> = {
  engineering: "You love solving problems, building things, and technology",
  science: "You're deeply curious about how the universe works",
  finance: "You're sharp with numbers and want to understand markets",
  architecture: "You blend creativity with technical precision",
  defence: "You want to serve your country with discipline and pride",
  design: "You see beauty in everything and want to create it",
  "merchant-navy": "You want adventure, travel, and the open sea",
  aviation: "You dream of flying and commanding the skies",
};

type Tier = "dream" | "target" | "safety";

const TIER_INFO: Record<Tier, { emoji: string; label: string; color: string; desc: string }> = {
  dream: { emoji: "🏆", label: "Dream", color: "#F59E0B", desc: "Hardest to get in — best outcomes" },
  target: { emoji: "🎯", label: "Target", color: "#3B82F6", desc: "Realistic with strong preparation" },
  safety: { emoji: "✅", label: "Safety", color: "#10B981", desc: "Good options with easier admission" },
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

// ─── Full-screen overlay ───

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
  const detailRef = useRef<HTMLDivElement>(null);

  const career = careers.find(c => c.slug === selectedCareer);
  const color = selectedCareer ? COLORS[selectedCareer] || "#3B82F6" : "#3B82F6";
  const countries = selectedCareer ? getCountries(selectedCareer) : [];
  const country = countries.find(c => c.slug === selectedCountry);
  const exams = selectedCareer && selectedCountry ? getExams(selectedCareer, selectedCountry) : [];
  const unis = selectedCareer && selectedCountry ? getUnis(selectedCareer, selectedCountry) : [];
  const tiers = groupByTier(unis);

  const selectCareer = (slug: string) => {
    setSelectedCareer(slug);
    setSelectedCountry(null);
    setStep("country");
  };

  const selectCountry = (slug: string) => {
    setSelectedCountry(slug);
    setStep("detail");
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const goBack = () => {
    if (step === "detail") { setSelectedCountry(null); setStep("country"); }
    else if (step === "country") { setSelectedCareer(null); setStep("career"); }
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        {/* Theme toggle */}
        <div className="fixed top-4 right-4 z-30"><ThemeToggle /></div>

        {/* Progress breadcrumb */}
        {selectedCareer && (
          <div className="fixed top-4 left-4 z-30 flex items-center gap-1 text-xs">
            <button onClick={() => { setSelectedCareer(null); setSelectedCountry(null); setStep("career"); }} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors">PCM</button>
            <ChevronRight size={12} className="text-[var(--border)]" />
            <button onClick={() => { setSelectedCountry(null); setStep("country"); }} className="cursor-pointer transition-colors" style={{ color }}>{career?.title}</button>
            {selectedCountry && (
              <>
                <ChevronRight size={12} className="text-[var(--border)]" />
                <span style={{ color }}>{country?.flag} {country?.label}</span>
              </>
            )}
          </div>
        )}

        {/* ═══ STEP 1: Choose career ═══ */}
        <AnimatePresence mode="wait">
          {step === "career" && (
            <motion.div key="careers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="max-w-4xl mx-auto px-5 pt-20 pb-16">
              {/* Hero */}
              <div className="text-center mb-12">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
                  What do you want to become?
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[var(--muted-foreground)] max-w-md mx-auto">
                  You have PCM — that opens doors to all of these. Pick what excites you most.
                </motion.p>
              </div>

              {/* Career cards — 2 columns with personality fit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {careers.map((c, i) => {
                  const clr = COLORS[c.slug];
                  const fit = CAREER_FITS[c.slug] || "";
                  return (
                    <motion.button
                      key={c.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -3, boxShadow: `0 12px 30px ${clr}15` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectCareer(c.slug)}
                      className="p-5 rounded-2xl text-left cursor-pointer border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: `${clr}12` }}>
                          {EMOJIS[c.slug]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-[var(--foreground)]">{c.title}</h3>
                            <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          </div>
                          <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mb-2">{c.description}</p>
                          <p className="text-[10px] italic" style={{ color: clr }}>Best if: {fit}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-[10px] text-[var(--muted-foreground)] mt-8 opacity-50">
                Every path here leads to a great career. There are no wrong choices.
              </motion.p>
            </motion.div>
          )}

          {/* ═══ STEP 2: Choose country ═══ */}
          {step === "country" && career && (
            <motion.div key="countries" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-4xl mx-auto px-5 pt-20 pb-16">
              {/* Career summary */}
              <div className="mb-8 p-5 rounded-2xl" style={{ background: `${color}06`, border: `1px solid ${color}12` }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{EMOJIS[career.slug]}</span>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">{career.title}</h2>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{career.whyChoose}</p>
              </div>

              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Where do you want to study?</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">Compare costs, visa options, and opportunities across countries.</p>

              {/* Country comparison cards */}
              <div className="space-y-3">
                {countries.map((c, i) => (
                  <motion.button
                    key={c.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectCountry(c.slug)}
                    className="w-full p-5 rounded-2xl text-left cursor-pointer border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{c.flag}</span>
                        <div>
                          <h4 className="text-base font-bold text-[var(--foreground)]">{c.label}</h4>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="text-xs flex items-center gap-1"><DollarSign size={11} style={{ color }} /><span className="font-bold" style={{ color }}>{c.budget.totalInr}</span> <span className="text-[var(--muted-foreground)]">4yr total</span></span>
                            <span className="text-xs flex items-center gap-1 text-[var(--muted-foreground)]"><Globe size={11} />{c.language}</span>
                            <span className="text-xs flex items-center gap-1 text-[var(--muted-foreground)]"><Briefcase size={11} />{c.postStudyVisa}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Action plan link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowActionPlan(true)}
                className="w-full mt-6 p-4 rounded-2xl text-left cursor-pointer border-2 border-dashed border-[var(--border)] hover:border-[var(--muted-foreground)]/20 transition-colors flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
                  <Clock size={18} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--foreground)]">📋 Step-by-step action plan</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">Month-by-month roadmap from Class 9 to 12</div>
                </div>
                <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {/* ═══ STEP 3: Country detail — Exams + Universities ═══ */}
          {step === "detail" && career && country && (
            <motion.div ref={detailRef} key="detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-5 pt-20 pb-16">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                {career.title} in {country.flag} {country.label}
              </h2>

              {/* Country quick facts */}
              <div className="grid grid-cols-4 gap-2 mt-4 mb-8">
                {[
                  { icon: DollarSign, label: "4yr total", value: country.budget.totalInr, accent: color },
                  { icon: Globe, label: "Language", value: country.language, accent: "var(--foreground)" },
                  { icon: Briefcase, label: "Work visa", value: country.postStudyVisa, accent: "var(--foreground)" },
                  { icon: Shield, label: "Exams", value: `${exams.length} required`, accent: "#F59E0B" },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded-xl bg-[var(--muted)] text-center">
                    <f.icon size={14} style={{ color: f.accent }} className="mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-[var(--foreground)]" style={{ color: f.accent }}>{f.value}</div>
                    <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider mt-0.5">{f.label}</div>
                  </div>
                ))}
              </div>

              {/* Entrance exams */}
              {exams.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap size={15} className="text-amber-500" /> Entrance exams
                  </h3>
                  <div className="space-y-2">
                    {exams.map(e => (
                      <button
                        key={e.slug}
                        onClick={() => setSelectedExam(selectedExam?.slug === e.slug ? null : e)}
                        className="w-full text-left p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] hover:border-amber-500/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-[var(--foreground)]">{e.name}</div>
                            <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{e.when}</div>
                          </div>
                          <ChevronRight size={14} className={`text-[var(--muted-foreground)] transition-transform ${selectedExam?.slug === e.slug ? "rotate-90" : ""}`} />
                        </div>
                        <AnimatePresence>
                          {selectedExam?.slug === e.slug && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                                <div className="p-2.5 rounded-lg bg-[var(--muted)]">
                                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Fee</div>
                                  <div className="text-xs font-bold text-[var(--foreground)]">{e.fee}</div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-[var(--muted)]">
                                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase">Format</div>
                                  <div className="text-xs text-[var(--foreground)]">{e.format.substring(0, 50)}</div>
                                </div>
                              </div>
                              <p className="text-[11px] text-[var(--muted-foreground)] mt-2 leading-relaxed">{e.eligibility}</p>
                              {e.website && (
                                <a href={e.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 no-underline text-amber-500">
                                  Register now <ExternalLink size={10} />
                                </a>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Universities by tier */}
              {unis.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award size={15} style={{ color }} /> Universities ({unis.length})
                  </h3>

                  {(["dream", "target", "safety"] as Tier[]).map(tier => {
                    const tierUnis = tiers[tier];
                    if (tierUnis.length === 0) return null;
                    const info = TIER_INFO[tier];
                    return (
                      <div key={tier} className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span>{info.emoji}</span>
                          <span className="text-xs font-bold" style={{ color: info.color }}>{info.label}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">— {info.desc}</span>
                          <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">{tierUnis.length}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {tierUnis.map(u => (
                            <button
                              key={u.slug}
                              onClick={() => setSelectedUni(u)}
                              className="p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/20 transition-all cursor-pointer text-left group"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-sm font-bold text-[var(--foreground)]">{u.name}</div>
                                  <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5"><MapPin size={10} />{u.location}</div>
                                </div>
                                <ArrowRight size={12} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-0.5 flex-shrink-0" />
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${color}10`, color }}>{u.feesInr}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">{u.salary}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{u.ranking}</span>
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
              <button onClick={() => setShowActionPlan(true)} className="w-full mt-8 p-5 rounded-2xl text-left cursor-pointer border-2 border-dashed border-[var(--border)] hover:border-[var(--muted-foreground)]/20 transition-colors flex items-center gap-4 group">
                <span className="text-2xl">📋</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[var(--foreground)]">Your action plan</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">Step-by-step prep guide from Class 9 to 12</div>
                </div>
                <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ UNIVERSITY DETAIL OVERLAY ═══ */}
      <Overlay open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && selectedCareer && selectedCountry && (() => {
          const c = color;
          const countryExams = getExams(selectedCareer, selectedCountry);
          return (
            <div className="max-w-xl mx-auto px-6 py-14">
              {/* Hero */}
              <div className="mb-8">
                <div className="text-[9px] font-mono uppercase tracking-[4px] mb-2" style={{ color: c }}>{selectedUni.ranking}</div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">{selectedUni.name}</h1>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><MapPin size={13} />{selectedUni.location}</div>
              </div>

              {/* Q1: Cost */}
              <section className="mb-8">
                <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">💰 What will it cost?</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[var(--muted)]">
                    <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Per year</div>
                    <div className="text-lg font-bold" style={{ color: c }}>{selectedUni.feesInr}</div>
                  </div>
                  {country && (
                    <div className="p-4 rounded-2xl bg-[var(--muted)]">
                      <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">4 year total</div>
                      <div className="text-lg font-bold text-[var(--foreground)]">{country.budget.totalInr}</div>
                    </div>
                  )}
                </div>
                {selectedUni.scholarships.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">🎓 Scholarships</div>
                    <ul className="space-y-1">{selectedUni.scholarships.map(s => <li key={s} className="text-[11px] text-[var(--foreground)] flex gap-1.5"><span className="text-emerald-500">•</span>{s}</li>)}</ul>
                  </div>
                )}
              </section>

              {/* Q2: Can I get in? */}
              <section className="mb-8">
                <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">🎯 Can my child get in?</h2>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-3">
                  <div className="text-sm font-bold text-[var(--foreground)]">{selectedUni.acceptance}</div>
                </div>
                {countryExams.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Exams required</div>
                    {countryExams.map(e => (
                      <div key={e.slug} className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]">
                        <div><div className="text-xs font-bold text-[var(--foreground)]">{e.name}</div><div className="text-[10px] text-[var(--muted-foreground)]">{e.when.substring(0, 40)}</div></div>
                        {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-bold no-underline">Register</a>}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Q3: Career outcomes */}
              <section className="mb-8">
                <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">🚀 After graduation</h2>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-3">
                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Starting salary</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedUni.salary}</div>
                </div>
                {selectedUni.recruiters.length > 0 && (
                  <div><div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-2">Companies hiring</div><div className="flex flex-wrap gap-1.5">{selectedUni.recruiters.map(r => <span key={r} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{r}</span>)}</div></div>
                )}
                {country && <div className="mt-3 p-3 rounded-xl bg-[var(--muted)] text-[10px] text-[var(--muted-foreground)]"><span className="font-bold text-[var(--foreground)]">After graduating:</span> {country.postStudyVisa} work visa</div>}
              </section>

              {/* Programs */}
              {selectedUni.programs.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">📚 Programs</h2>
                  <div className="flex flex-wrap gap-1.5">{selectedUni.programs.map(p => <span key={p} className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--foreground)]">{p}</span>)}</div>
                </section>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-10">
                {selectedUni.website && <a href={selectedUni.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-[var(--border)] text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline"><Globe size={15} /> Website</a>}
                {selectedUni.applyLink && <a href={selectedUni.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white no-underline" style={{ background: c }}>Apply <ArrowRight size={14} /></a>}
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
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Step-by-step from Class 9 to 12</p>
            {actionPlans[selectedCareer] ? <ActionPlanMDX content={actionPlans[selectedCareer]} /> : <p className="text-sm text-[var(--muted-foreground)]">Coming soon.</p>}
          </div>
        )}
      </Overlay>
    </>
  );
}
