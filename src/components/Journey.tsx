"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane,
  MapPin, DollarSign, Briefcase, GraduationCap, ExternalLink, Globe, X,
  ChevronDown, Sparkles, ArrowRight, Trophy, Rocket, Star, Clock,
  Users, BookOpen, Award, Zap,
} from "lucide-react";
import Link from "next/link";

// ─── Types ───

interface CareerData { slug: string; title: string; description: string; whyChoose: string }
interface CountryData { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }
interface UniData { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }
interface ExamData { slug: string; name: string; when: string; fee: string; eligibility: string; format: string; website: string }

// ─── Constants ───

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  engineering: Cpu, science: Atom, finance: TrendingUp, architecture: Building2,
  defence: Shield, design: Palette, "merchant-navy": Ship, aviation: Plane,
};

const COLORS: Record<string, string> = {
  engineering: "#3B82F6", science: "#8B5CF6", finance: "#F59E0B", architecture: "#F97316",
  defence: "#10B981", design: "#EC4899", "merchant-navy": "#06B6D4", aviation: "#6366F1",
};

const CAREER_TAGLINES: Record<string, string> = {
  engineering: "Build the future",
  science: "Discover the unknown",
  finance: "Master the markets",
  architecture: "Shape the world",
  defence: "Serve the nation",
  design: "Create what's next",
  "merchant-navy": "Sail the oceans",
  aviation: "Touch the sky",
};

// ─── Animated helpers ───

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Side Sheet ───

function SideSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
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
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50" />
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[min(580px,96vw)] bg-[var(--background)] overflow-y-auto z-50 shadow-[-20px_0_60px_rgba(0,0,0,0.3)]"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-4 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-all cursor-pointer hover:rotate-90 duration-300">
              <X size={15} className="text-[var(--muted-foreground)]" />
            </button>
            <div className="p-8 pt-4 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── University Magazine Card (Side Sheet Content) ───

function UniMagazine({ uni, careerSlug, countrySlug, color }: { uni: UniData; careerSlug: string; countrySlug: string; color: string }) {
  return (
    <div>
      {/* Hero banner */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: color }} />
        <div className="relative">
          <div className="text-[10px] font-mono uppercase tracking-[3px] mb-2" style={{ color }}>{uni.ranking}</div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 leading-tight">{uni.name}</h2>
          <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
            <MapPin size={13} /> {uni.location}
          </div>
        </div>
      </div>

      {/* The 3 numbers that matter */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: DollarSign, label: "Annual cost", value: uni.feesInr, bg: `${color}08`, accent: color },
          { icon: Zap, label: "Starting salary", value: uni.salary, bg: "rgba(16,185,129,0.06)", accent: "#10B981" },
          { icon: Award, label: "Getting in", value: uni.acceptance, bg: "rgba(245,158,11,0.06)", accent: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="p-3.5 rounded-2xl text-center" style={{ background: s.bg }}>
            <s.icon size={16} style={{ color: s.accent }} className="mx-auto mb-1.5" />
            <div className="text-xs font-bold text-[var(--foreground)] leading-tight mb-0.5">{s.value}</div>
            <div className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* What you'll study */}
      {uni.programs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} style={{ color }} />
            <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">What you&apos;ll study</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uni.programs.map((p) => (
              <span key={p} className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--foreground)] font-medium">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Who hires from here */}
      {uni.recruiters.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} style={{ color }} />
            <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Who hires from here</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uni.recruiters.map((r) => (
              <span key={r} className="text-[11px] px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">{r}</span>
            ))}
          </div>
        </div>
      )}

      {/* Financial aid */}
      {uni.scholarships.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">Scholarships & aid</span>
          </div>
          <ul className="space-y-2">
            {uni.scholarships.map((s) => (
              <li key={s} className="text-xs text-[var(--foreground)] leading-relaxed flex gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-8">
        <Link
          href={`/${careerSlug}/${countrySlug}/${uni.slug}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold no-underline text-white transition-all hover:shadow-lg hover:shadow-blue-500/20"
          style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
        >
          Read Full Story <ArrowRight size={14} />
        </Link>
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all no-underline"
          >
            <Globe size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Journey ───

interface JourneyProps {
  careers: CareerData[];
  getCountries: (slug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

export function Journey({ careers, getCountries, getExams, getUnis }: JourneyProps) {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<UniData | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const countryRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const career = careers.find((c) => c.slug === selectedCareer);
  const color = selectedCareer ? COLORS[selectedCareer] || "#3B82F6" : "#3B82F6";
  const countries = selectedCareer ? getCountries(selectedCareer) : [];
  const country = countries.find((c) => c.slug === selectedCountry);
  const exams = selectedCareer && selectedCountry ? getExams(selectedCareer, selectedCountry) : [];
  const unis = selectedCareer && selectedCountry ? getUnis(selectedCareer, selectedCountry) : [];
  const currentStep = selectedCountry ? 3 : selectedCareer ? 2 : 1;

  const selectCareer = (slug: string) => {
    setSelectedCareer(slug);
    setSelectedCountry(null);
    setSelectedUni(null);
    setExpandedExam(null);
    setTimeout(() => countryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const selectCountry = (slug: string) => {
    setSelectedCountry(slug);
    setSelectedUni(null);
    setExpandedExam(null);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Progress */}
      <div className="fixed top-14 left-0 right-0 z-30 h-0.5 bg-[var(--border)]">
        <motion.div className="h-full rounded-r-full" animate={{ width: `${(currentStep / 3) * 100}%` }} transition={{ type: "spring", damping: 20 }} style={{ background: `linear-gradient(90deg, ${color}, ${COLORS.science}, ${COLORS.design})` }} />
      </div>

      {/* ═══ HERO ═══ */}
      <motion.section style={{ scale: heroScale, opacity: heroOpacity }} className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-xs font-medium text-[var(--muted-foreground)] mb-8">
            <Sparkles size={12} className="text-blue-500" /> For PCM students in Class 10-12
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.9]">
            <span className="text-[var(--foreground)]">Your Future</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Starts Here</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed mb-10 font-light">
            8 career paths. 6 countries. 100+ universities.
            <br className="hidden md:block" />
            All the answers in one place.
          </p>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={28} className="mx-auto text-[var(--muted-foreground)]/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ ACT 1: CHOOSE YOUR PATH ═══ */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--muted)] text-[10px] font-bold uppercase tracking-[3px] text-[var(--muted-foreground)] mb-4">
              Step 1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
              What excites you?
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
              Pick the path that speaks to you. Every choice leads somewhere great.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {careers.map((c, i) => {
            const Icon = ICONS[c.slug] || Cpu;
            const clr = COLORS[c.slug] || "#3B82F6";
            const tagline = CAREER_TAGLINES[c.slug] || "";
            const isSelected = selectedCareer === c.slug;
            const isOther = selectedCareer && !isSelected;

            return (
              <Reveal key={c.slug} delay={i * 0.04}>
                <motion.button
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ opacity: isOther ? 0.3 : 1, scale: isOther ? 0.96 : 1, filter: isOther ? "grayscale(1)" : "grayscale(0)" }}
                  transition={{ duration: 0.4 }}
                  onClick={() => selectCareer(c.slug)}
                  className="w-full p-5 md:p-6 rounded-3xl text-left cursor-pointer relative overflow-hidden group"
                  style={{
                    background: isSelected ? `linear-gradient(160deg, ${clr}18 0%, var(--card) 60%)` : "var(--card)",
                    border: isSelected ? `2px solid ${clr}40` : "2px solid var(--border)",
                    boxShadow: isSelected ? `0 20px 40px ${clr}15, 0 0 0 1px ${clr}10` : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Hover gradient reveal */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ background: `radial-gradient(circle at 30% 30%, ${clr}08 0%, transparent 70%)` }} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: clr + "12" }}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <Icon size={22} style={{ color: clr }} />
                      </motion.div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: clr }}>
                          <Star size={11} className="text-white" fill="white" />
                        </motion.div>
                      )}
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-[var(--foreground)] mb-1">{c.title}</h3>
                    <p className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: clr }}>{tagline}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{c.description}</p>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>

        {/* Why this path — editorial style */}
        <AnimatePresence>
          {career && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="mt-8 p-6 md:p-8 rounded-3xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`, border: `1px solid ${color}12` }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ background: color, opacity: 0.05 }} />
                <div className="relative flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                    <Zap size={18} style={{ color }} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--foreground)] mb-2">Why {career.title}?</h4>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{career.whyChoose}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ ACT 2: WHERE IN THE WORLD ═══ */}
      <AnimatePresence>
        {selectedCareer && countries.length > 0 && (
          <motion.section
            ref={countryRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 py-20 scroll-mt-20"
          >
            <Reveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--muted)] text-[10px] font-bold uppercase tracking-[3px] text-[var(--muted-foreground)] mb-4">
                  Step 2
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
                  Where will you go?
                </h2>
                <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                  Each destination offers a different experience, cost, and opportunity.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {countries.map((c, i) => {
                const isSelected = selectedCountry === c.slug;
                const isOther = selectedCountry && !isSelected;
                return (
                  <Reveal key={c.slug} delay={i * 0.05}>
                    <motion.button
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      animate={{ opacity: isOther ? 0.3 : 1, filter: isOther ? "grayscale(1)" : "grayscale(0)" }}
                      onClick={() => selectCountry(c.slug)}
                      className="w-full p-5 md:p-6 rounded-3xl text-left cursor-pointer relative overflow-hidden group"
                      style={{
                        background: isSelected ? `linear-gradient(160deg, ${color}12 0%, var(--card) 60%)` : "var(--card)",
                        border: isSelected ? `2px solid ${color}35` : "2px solid var(--border)",
                        boxShadow: isSelected ? `0 15px 35px ${color}10` : "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">{c.flag}</div>
                      <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] mb-1">{c.label}</h3>
                      <div className="text-lg md:text-xl font-bold mb-3" style={{ color }}>{c.budget.totalInr}</div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1.5">
                          <Globe size={10} className="flex-shrink-0" /> {c.language}
                        </div>
                        <div className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1.5">
                          <Clock size={10} className="flex-shrink-0" /> {c.postStudyVisa}
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: color }}>
                          <Star size={11} className="text-white" fill="white" />
                        </motion.div>
                      )}
                    </motion.button>
                  </Reveal>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ═══ ACT 3: YOUR OPTIONS ═══ */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.section
            ref={detailRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 py-20 scroll-mt-20"
          >
            <Reveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--muted)] text-[10px] font-bold uppercase tracking-[3px] text-[var(--muted-foreground)] mb-4">
                  Step 3
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
                  {career?.title} in {country?.flag} {country?.label}
                </h2>
              </div>
            </Reveal>

            {/* Exams */}
            {exams.length > 0 && (
              <Reveal className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                    <Trophy size={16} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Entrance Exams</h3>
                </div>
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <div key={exam.slug} className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--muted-foreground)]/20 transition-colors">
                      <button
                        onClick={() => setExpandedExam(expandedExam === exam.slug ? null : exam.slug)}
                        aria-expanded={expandedExam === exam.slug}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-bold text-[var(--foreground)]">{exam.name}</div>
                          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{exam.when}</div>
                        </div>
                        <motion.div animate={{ rotate: expandedExam === exam.slug ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedExam === exam.slug && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-4 md:px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-[var(--muted)]">
                                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Fee</div>
                                  <div className="text-xs font-semibold text-[var(--foreground)]">{exam.fee}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-[var(--muted)]">
                                  <div className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Format</div>
                                  <div className="text-xs font-semibold text-[var(--foreground)]">{exam.format}</div>
                                </div>
                              </div>
                              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{exam.eligibility}</p>
                              {exam.website && (
                                <a href={exam.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold no-underline hover:underline" style={{ color }}>
                                  Register now <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Universities */}
            {unis.length > 0 && (
              <Reveal>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                    <GraduationCap size={16} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Universities</h3>
                  <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">{unis.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unis.map((uni, i) => (
                    <motion.button
                      key={uni.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4, boxShadow: `0 12px 30px ${color}12` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedUni(uni)}
                      className="p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] cursor-pointer text-left group hover:border-[var(--muted-foreground)]/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--foreground)] mb-1">{uni.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <MapPin size={11} /> {uni.location}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-0.5" />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: `${color}10`, color }}>{uni.feesInr}</span>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 font-bold">{uni.salary}</span>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">{uni.ranking}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Action Plan CTA */}
                <Reveal className="mt-10">
                  <Link
                    href={`/${selectedCareer}/action-plan`}
                    className="group flex items-center gap-5 p-6 md:p-8 rounded-3xl no-underline transition-all hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`, border: `2px solid ${color}15` }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)` }}>
                      <Rocket size={24} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-[var(--foreground)] mb-0.5">Your Action Plan</div>
                      <div className="text-sm text-[var(--muted-foreground)]">Month-by-month roadmap from Class 9 to 12</div>
                    </div>
                    <ArrowRight size={20} style={{ color }} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Reveal>
              </Reveal>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Side Sheet */}
      <SideSheet open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && selectedCareer && selectedCountry && (
          <UniMagazine uni={selectedUni} careerSlug={selectedCareer} countrySlug={selectedCountry} color={color} />
        )}
      </SideSheet>
    </div>
  );
}
