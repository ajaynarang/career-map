"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane,
  MapPin, DollarSign, Briefcase, GraduationCap, ExternalLink, Globe, X,
  ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Rocket, Star,
  Award, Zap, BookOpen, Users, Clock,
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

const GRADIENTS: Record<string, string> = {
  engineering: "from-blue-950/80 via-zinc-950 to-zinc-950",
  science: "from-purple-950/80 via-zinc-950 to-zinc-950",
  finance: "from-amber-950/80 via-zinc-950 to-zinc-950",
  architecture: "from-orange-950/80 via-zinc-950 to-zinc-950",
  defence: "from-emerald-950/80 via-zinc-950 to-zinc-950",
  design: "from-pink-950/80 via-zinc-950 to-zinc-950",
  "merchant-navy": "from-cyan-950/80 via-zinc-950 to-zinc-950",
  aviation: "from-indigo-950/80 via-zinc-950 to-zinc-950",
};

const TAGLINES: Record<string, string> = {
  engineering: "The path that opens every door",
  science: "For the deeply curious",
  finance: "Where numbers become power",
  architecture: "Shape the world we live in",
  defence: "Serve with honor and pride",
  design: "Make the world more beautiful",
  "merchant-navy": "The world is your office",
  aviation: "The office above the clouds",
};

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[min(600px,96vw)] bg-zinc-950 overflow-y-auto z-50 shadow-[-30px_0_80px_rgba(0,0,0,0.5)]"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-5 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all cursor-pointer hover:rotate-90 duration-300">
              <X size={16} className="text-zinc-400" />
            </button>
            <div className="p-8 pt-4 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── University Magazine Profile ───

function UniProfile({ uni, careerSlug, countrySlug, color }: { uni: UniData; careerSlug: string; countrySlug: string; color: string }) {
  return (
    <div>
      <div className="rounded-3xl p-8 mb-8 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${color}12 0%, rgba(9,9,11,1) 100%)` }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: color }} />
        <div className="relative">
          <div className="text-[10px] font-mono uppercase tracking-[4px] mb-3" style={{ color }}>{uni.ranking}</div>
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{uni.name}</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin size={14} /> {uni.location}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: DollarSign, label: "Cost per year", value: uni.feesInr, accent: color },
          { icon: Zap, label: "Starting salary", value: uni.salary, accent: "#10B981" },
          { icon: Award, label: "Getting in", value: uni.acceptance, accent: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 text-center">
            <s.icon size={18} style={{ color: s.accent }} className="mx-auto mb-2" />
            <div className="text-sm font-bold text-white leading-tight mb-1">{s.value}</div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {uni.programs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} style={{ color }} />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">What you&apos;ll study</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uni.programs.map((p) => <span key={p} className="text-[11px] px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300">{p}</span>)}
          </div>
        </div>
      )}

      {uni.recruiters.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} style={{ color }} />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Who hires from here</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uni.recruiters.map((r) => <span key={r} className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-400">{r}</span>)}
          </div>
        </div>
      )}

      {uni.scholarships.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Scholarships</span>
          </div>
          <ul className="space-y-2">
            {uni.scholarships.map((s) => <li key={s} className="text-xs text-zinc-300 leading-relaxed flex gap-2"><span className="text-emerald-400 flex-shrink-0">•</span>{s}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link href={`/${careerSlug}/${countrySlug}/${uni.slug}`} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold no-underline text-white hover:shadow-lg transition-all" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`, boxShadow: `0 8px 30px ${color}25` }}>
          Read Full Story <ArrowRight size={14} />
        </Link>
        {uni.website && (
          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-all no-underline">
            <Globe size={18} />
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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<"careers" | "countries" | "details">("careers");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<UniData | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const career = careers[currentIdx];
  const color = COLORS[career?.slug] || "#3B82F6";
  const gradient = GRADIENTS[career?.slug] || GRADIENTS.engineering;
  const tagline = TAGLINES[career?.slug] || "";
  const Icon = ICONS[career?.slug] || Cpu;
  const countries = career ? getCountries(career.slug) : [];
  const country = countries.find((c) => c.slug === selectedCountry);
  const exams = career && selectedCountry ? getExams(career.slug, selectedCountry) : [];
  const unis = career && selectedCountry ? getUnis(career.slug, selectedCountry) : [];

  const prev = useCallback(() => {
    if (phase === "details") { setPhase("countries"); setSelectedCountry(null); setExpandedExam(null); }
    else if (phase === "countries") { setPhase("careers"); }
    else { setCurrentIdx((i) => (i - 1 + careers.length) % careers.length); }
  }, [phase, careers.length]);

  const next = useCallback(() => {
    if (phase === "careers") { setCurrentIdx((i) => (i + 1) % careers.length); }
  }, [phase, careers.length]);

  const selectCareer = () => {
    setPhase("countries");
    setSelectedCountry(null);
  };

  const selectCountry = (slug: string) => {
    setSelectedCountry(slug);
    setPhase("details");
    setExpandedExam(null);
  };

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Enter" && phase === "careers") selectCareer();
      if (e.key === "Escape") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev, phase]);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradient} text-white transition-all duration-700 relative overflow-hidden`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07] transition-colors duration-700" style={{ background: color }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04] transition-colors duration-700" style={{ background: color }} />
      </div>

      {/* Nav dots (right side) */}
      {phase === "careers" && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          {careers.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: 8,
                height: i === currentIdx ? 28 : 8,
                background: i === currentIdx ? color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      )}

      {/* ═══ CAREER SPREAD ═══ */}
      <AnimatePresence mode="wait">
        {phase === "careers" && (
          <motion.div
            key={`career-${currentIdx}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen flex items-center relative z-10"
          >
            <div className="max-w-6xl mx-auto px-8 md:px-16 w-full">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[10px] font-mono uppercase tracking-[5px] mb-6"
                    style={{ color }}
                  >
                    {String(currentIdx + 1).padStart(2, "0")} / {String(careers.length).padStart(2, "0")}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] mb-4 tracking-tight"
                  >
                    {career.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl font-light mb-6"
                    style={{ color }}
                  >
                    {tagline}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-md"
                  >
                    {career.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={selectCareer}
                      className="px-8 py-4 rounded-2xl text-sm font-bold cursor-pointer transition-all hover:shadow-lg group flex items-center gap-2"
                      style={{ background: color, boxShadow: `0 10px 40px ${color}30` }}
                    >
                      Explore this path
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link
                      href={`/${career.slug}/action-plan`}
                      className="px-6 py-4 rounded-2xl text-sm font-medium border border-zinc-800 hover:border-zinc-600 transition-colors no-underline text-zinc-300 hover:text-white"
                    >
                      Action plan
                    </Link>
                  </motion.div>
                </div>

                {/* Right: Large icon + stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="hidden md:flex flex-col items-center justify-center"
                >
                  <div className="w-48 h-48 rounded-[40px] flex items-center justify-center mb-8" style={{ background: `${color}08`, border: `1px solid ${color}12`, boxShadow: `0 0 80px ${color}08` }}>
                    <Icon size={80} style={{ color, opacity: 0.6 }} />
                  </div>

                  {/* Quick stats */}
                  <div className="text-center space-y-2">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider">Available in</div>
                    <div className="text-sm text-zinc-400">{countries.length} countries</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ COUNTRY SELECTION ═══ */}
        {phase === "countries" && (
          <motion.div
            key="countries"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen flex items-center relative z-10"
          >
            <div className="max-w-6xl mx-auto px-8 md:px-16 w-full py-20">
              <button onClick={prev} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 cursor-pointer transition-colors">
                <ChevronLeft size={16} /> Back to careers
              </button>

              <div className="mb-10">
                <div className="text-[10px] font-mono uppercase tracking-[4px] mb-3" style={{ color }}>
                  {career.title}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">Where will you go?</h2>
                <p className="text-zinc-500 max-w-md">Each destination has a different cost, culture, and opportunity. Pick the one that fits your dream.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {countries.map((c, i) => (
                  <motion.button
                    key={c.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -6, boxShadow: `0 20px 40px ${color}12` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectCountry(c.slug)}
                    className="p-6 rounded-3xl text-left cursor-pointer relative overflow-hidden group bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-all"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 30% 30%, ${color}08 0%, transparent 70%)` }} />
                    <div className="relative">
                      <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500 inline-block">{c.flag}</div>
                      <h3 className="text-lg font-bold text-white mb-1">{c.label}</h3>
                      <div className="text-xl font-bold mb-4" style={{ color }}>{c.budget.totalInr}</div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                          <Globe size={11} className="flex-shrink-0" /> {c.language}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                          <Clock size={11} className="flex-shrink-0" /> {c.postStudyVisa}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ COUNTRY DETAILS (Exams + Universities) ═══ */}
        {phase === "details" && country && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-20">
              <button onClick={prev} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-8 cursor-pointer transition-colors">
                <ChevronLeft size={16} /> Back to countries
              </button>

              {/* Country header */}
              <div className="mb-12">
                <div className="text-[10px] font-mono uppercase tracking-[4px] mb-3" style={{ color }}>
                  {career.title} → {country.flag} {country.label}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Study in {country.label}
                </h2>

                {/* Budget bar */}
                <div className="flex items-center gap-6 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 mb-4">
                  <div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Total 4-year cost</div>
                    <div className="text-2xl font-bold" style={{ color }}>{country.budget.totalInr}</div>
                  </div>
                  <div className="w-px h-10 bg-zinc-800" />
                  <div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Language</div>
                    <div className="text-sm text-zinc-300">{country.language}</div>
                  </div>
                  <div className="w-px h-10 bg-zinc-800" />
                  <div>
                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Work visa after</div>
                    <div className="text-sm text-zinc-300">{country.postStudyVisa}</div>
                  </div>
                </div>
              </div>

              {/* Exams */}
              {exams.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <GraduationCap size={16} style={{ color }} />
                    </div>
                    <h3 className="text-lg font-bold">Entrance Exams</h3>
                  </div>
                  <div className="space-y-2">
                    {exams.map((exam) => (
                      <div key={exam.slug} className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden hover:border-zinc-700 transition-colors">
                        <button
                          onClick={() => setExpandedExam(expandedExam === exam.slug ? null : exam.slug)}
                          aria-expanded={expandedExam === exam.slug}
                          className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-bold text-white">{exam.name}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{exam.when}</div>
                          </div>
                          <motion.div animate={{ rotate: expandedExam === exam.slug ? 180 : 0 }}>
                            <ChevronDown size={16} className="text-zinc-600" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedExam === exam.slug && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-5 pb-5 border-t border-zinc-800/50 pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="p-3 rounded-xl bg-zinc-800/50">
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Fee</div>
                                    <div className="text-xs font-semibold text-zinc-200">{exam.fee}</div>
                                  </div>
                                  <div className="p-3 rounded-xl bg-zinc-800/50">
                                    <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Format</div>
                                    <div className="text-xs font-semibold text-zinc-200">{exam.format}</div>
                                  </div>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">{exam.eligibility}</p>
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
                </div>
              )}

              {/* Universities */}
              {unis.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Award size={16} style={{ color }} />
                    </div>
                    <h3 className="text-lg font-bold">Universities</h3>
                    <span className="text-xs text-zinc-600 bg-zinc-800/50 px-2.5 py-1 rounded-full">{unis.length}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {unis.map((uni, i) => (
                      <motion.button
                        key={uni.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedUni(uni)}
                        className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 cursor-pointer text-left group transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">{uni.name}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                              <MapPin size={11} /> {uni.location}
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all mt-0.5" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: `${color}12`, color }}>{uni.feesInr}</span>
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{uni.salary}</span>
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400">{uni.ranking}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Plan CTA */}
              <Link
                href={`/${career.slug}/action-plan`}
                className="group flex items-center gap-5 p-6 md:p-8 rounded-3xl no-underline transition-all hover:shadow-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
                  <Rocket size={24} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white mb-0.5">Your Action Plan</div>
                  <div className="text-sm text-zinc-500">Month-by-month roadmap from Class 9 to 12</div>
                </div>
                <ArrowRight size={20} style={{ color }} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      {phase === "careers" && (
        <div className="fixed bottom-8 left-8 right-20 flex justify-between items-center z-20">
          <button onClick={prev} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-white cursor-pointer transition-colors">
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="text-[10px] text-zinc-700 font-mono">
            Use arrow keys or swipe
          </div>
          <button onClick={next} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-white cursor-pointer transition-colors">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Side Sheet */}
      <SideSheet open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && career && selectedCountry && (
          <UniProfile uni={selectedUni} careerSlug={career.slug} countrySlug={selectedCountry} color={color} />
        )}
      </SideSheet>
    </div>
  );
}
