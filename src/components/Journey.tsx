"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane,
  MapPin, DollarSign, Briefcase, GraduationCap, ExternalLink, Globe, X,
  ChevronDown, Sparkles, ArrowRight, Trophy, Target, Rocket, Star,
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

const EMOJIS: Record<string, string> = {
  engineering: "⚙️", science: "🔬", finance: "📈", architecture: "🏛️",
  defence: "🛡️", design: "🎨", "merchant-navy": "🚢", aviation: "✈️",
};

// ─── Animated Section ───

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Side Sheet ───

function SideSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleKey);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-[min(540px,94vw)] bg-[var(--background)] border-l border-[var(--border)] overflow-y-auto z-50 shadow-2xl"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors cursor-pointer">
              <X size={14} className="text-[var(--muted-foreground)]" />
            </button>
            <div className="p-6 pt-3 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Progress Bar ───

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="fixed top-14 left-0 right-0 z-30 h-1 bg-[var(--border)]">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-r-full"
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ type: "spring", damping: 20 }}
      />
    </div>
  );
}

// ─── Step Indicator ───

function StepBadge({ number, label, active }: { number: number; label: string; active: boolean }) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.95 }}
      className="flex items-center gap-2 mb-6"
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-blue-500 text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
        {number}
      </div>
      <span className={`text-xs font-medium uppercase tracking-wider ${active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main Journey Component ───

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
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const career = careers.find((c) => c.slug === selectedCareer);
  const color = selectedCareer ? COLORS[selectedCareer] || "#3B82F6" : "#3B82F6";
  const countries = selectedCareer ? getCountries(selectedCareer) : [];
  const country = countries.find((c) => c.slug === selectedCountry);
  const exams = selectedCareer && selectedCountry ? getExams(selectedCareer, selectedCountry) : [];
  const unis = selectedCareer && selectedCountry ? getUnis(selectedCareer, selectedCountry) : [];

  const currentStep = selectedCountry ? 3 : selectedCareer ? 2 : 1;

  const handleCareerSelect = (slug: string) => {
    setSelectedCareer(slug);
    setSelectedCountry(null);
    setSelectedUni(null);
    setExpandedExam(null);
    setTimeout(() => countryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleCountrySelect = (slug: string) => {
    setSelectedCountry(slug);
    setSelectedUni(null);
    setExpandedExam(null);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <div className="min-h-screen">
      <ProgressBar step={currentStep} total={4} />

      {/* ── ACT 1: The Opening ── */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-500/20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: headerOpacity }} className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium mb-6"
          >
            <Sparkles size={12} /> Career Guidance System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-4 tracking-tight"
          >
            Your Future
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Starts Here
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-[var(--muted-foreground)] max-w-lg mx-auto mb-8"
          >
            You&apos;re in Class 10 with PCM. Let&apos;s explore every path open to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[var(--muted-foreground)]"
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── ACT 2: Choose Your Path ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <Section>
          <StepBadge number={1} label="What excites you?" active={currentStep >= 1} />
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
            Choose your path
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-lg">
            Each path leads to different careers, exams, and universities. Pick the one that feels right — you can always come back and explore others.
          </p>
        </Section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {careers.map((c, i) => {
            const Icon = ICONS[c.slug] || Cpu;
            const clr = COLORS[c.slug] || "#3B82F6";
            const isSelected = selectedCareer === c.slug;
            const isOther = selectedCareer && !isSelected;

            return (
              <Section key={c.slug}>
                <motion.button
                  layout
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    opacity: isOther ? 0.35 : 1,
                    scale: isOther ? 0.95 : 1,
                  }}
                  onClick={() => handleCareerSelect(c.slug)}
                  className="w-full p-4 md:p-5 rounded-2xl text-left cursor-pointer relative overflow-hidden group transition-shadow"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${clr}12 0%, var(--card) 100%)`
                      : "var(--card)",
                    border: isSelected
                      ? `2px solid ${clr}50`
                      : "2px solid var(--border)",
                    boxShadow: isSelected ? `0 8px 30px ${clr}20` : "none",
                  }}
                >
                  {/* Glow effect */}
                  {isSelected && (
                    <motion.div
                      layoutId="career-glow"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${clr}15 0%, transparent 70%)` }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: clr + "15" }}
                      >
                        <Icon size={20} style={{ color: clr }} />
                      </div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: clr }}>
                          <Star size={10} className="text-white" fill="white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{c.title}</div>
                    <div className="text-[11px] text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{c.description}</div>
                  </div>
                </motion.button>
              </Section>
            );
          })}
        </div>

        {/* Why choose this path */}
        <AnimatePresence>
          {career && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-5 rounded-2xl" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                <div className="flex items-start gap-3">
                  <Target size={18} style={{ color }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)] mb-1">Why {career.title}?</div>
                    <div className="text-xs text-[var(--muted-foreground)] leading-relaxed">{career.whyChoose}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── ACT 3: Where in the World ── */}
      <AnimatePresence>
        {selectedCareer && countries.length > 0 && (
          <motion.section
            ref={countryRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-4 py-16 border-t border-[var(--border)]"
          >
            <Section>
              <StepBadge number={2} label="Where do you want to study?" active={currentStep >= 2} />
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                Pick your destination
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-8 max-w-lg">
                Each country has different costs, exams, and opportunities. Compare and choose.
              </p>
            </Section>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {countries.map((c, i) => {
                const isSelected = selectedCountry === c.slug;
                return (
                  <Section key={c.slug}>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        opacity: selectedCountry && !isSelected ? 0.4 : 1,
                      }}
                      onClick={() => handleCountrySelect(c.slug)}
                      className="w-full p-5 rounded-2xl text-left cursor-pointer relative overflow-hidden"
                      style={{
                        background: isSelected ? `${color}08` : "var(--card)",
                        border: isSelected ? `2px solid ${color}40` : "2px solid var(--border)",
                        boxShadow: isSelected ? `0 6px 25px ${color}15` : "none",
                      }}
                    >
                      <div className="text-3xl mb-3">{c.flag}</div>
                      <div className="text-base font-semibold text-[var(--foreground)] mb-1">{c.label}</div>
                      <div className="text-sm font-bold mb-3" style={{ color }}>{c.budget.totalInr}</div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">
                          {c.language}
                        </span>
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">
                          {c.postStudyVisa}
                        </span>
                      </div>

                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                          <Star size={10} className="text-white" fill="white" />
                        </motion.div>
                      )}
                    </motion.button>
                  </Section>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── ACT 4: Your Options ── */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.section
            ref={detailRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto px-4 py-16 border-t border-[var(--border)]"
          >
            <Section>
              <StepBadge number={3} label="Explore your options" active={currentStep >= 3} />
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                {career?.title} in {country?.flag} {country?.label}
              </h2>
            </Section>

            {/* Exams */}
            {exams.length > 0 && (
              <Section className="mb-10">
                <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Trophy size={14} style={{ color }} /> Entrance Exams
                </h3>
                <div className="space-y-2">
                  {exams.map((exam) => (
                    <motion.div
                      key={exam.slug}
                      layout
                      className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedExam(expandedExam === exam.slug ? null : exam.slug)}
                        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[var(--foreground)]">{exam.name}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">{exam.when}</div>
                        </div>
                        <motion.div animate={{ rotate: expandedExam === exam.slug ? 180 : 0 }}>
                          <ChevronDown size={16} className="text-[var(--muted-foreground)]" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedExam === exam.slug && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-[var(--border)] pt-3 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2.5 rounded-xl bg-[var(--muted)]">
                                  <div className="text-[10px] text-[var(--muted-foreground)]">Fee</div>
                                  <div className="text-xs font-medium text-[var(--foreground)]">{exam.fee}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-[var(--muted)]">
                                  <div className="text-[10px] text-[var(--muted-foreground)]">Format</div>
                                  <div className="text-xs font-medium text-[var(--foreground)]">{exam.format}</div>
                                </div>
                              </div>
                              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{exam.eligibility}</p>
                              {exam.website && (
                                <a href={exam.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold no-underline" style={{ color }}>
                                  Register now <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </Section>
            )}

            {/* Universities */}
            {unis.length > 0 && (
              <Section>
                <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <GraduationCap size={14} style={{ color }} /> Universities ({unis.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unis.map((uni, i) => (
                    <motion.button
                      key={uni.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedUni(uni)}
                      className="p-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all cursor-pointer text-left"
                    >
                      <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{uni.name}</div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-3">
                        <MapPin size={11} /> {uni.location}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-1 rounded-lg font-semibold" style={{ backgroundColor: color + "12", color }}>{uni.feesInr}</span>
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-semibold">{uni.salary}</span>
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">{uni.ranking}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Section>
            )}

            {/* Action Plan CTA */}
            <Section className="mt-10">
              <Link
                href={`/${selectedCareer}/action-plan`}
                className="group flex items-center gap-4 p-6 rounded-2xl no-underline transition-all"
                style={{ background: `${color}08`, border: `2px solid ${color}20` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                  <Rocket size={22} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-[var(--foreground)]">Ready? See your Action Plan</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Step-by-step roadmap from Class 9 to 12 — what to do, when to do it</div>
                </div>
                <ArrowRight size={18} style={{ color }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Section>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Side Sheet for university detail */}
      <SideSheet open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && selectedCareer && selectedCountry && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-1">University Profile</div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">{selectedUni.name}</h2>
            <div className="text-xs text-[var(--muted-foreground)] mb-5 flex items-center gap-1">
              <MapPin size={12} /> {selectedUni.location} · {selectedUni.ranking}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: DollarSign, label: "Fees/yr", value: selectedUni.feesInr, valueColor: "var(--foreground)" },
                { icon: Briefcase, label: "Salary", value: selectedUni.salary, valueColor: "#10B981" },
                { icon: GraduationCap, label: "Acceptance", value: selectedUni.acceptance, valueColor: "#F59E0B" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-[var(--muted)]">
                  <stat.icon size={14} style={{ color: stat.valueColor }} className="mb-1" />
                  <div className="text-[10px] text-[var(--muted-foreground)]">{stat.label}</div>
                  <div className="text-sm font-semibold" style={{ color: stat.valueColor }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {selectedUni.programs.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Programs</div>
                <div className="flex flex-wrap gap-1.5">{selectedUni.programs.map((p) => <span key={p} className="text-[10px] px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">{p}</span>)}</div>
              </div>
            )}

            {selectedUni.recruiters.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Top Recruiters</div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">{selectedUni.recruiters.join(", ")}</p>
              </div>
            )}

            {selectedUni.scholarships.length > 0 && (
              <div className="mb-6">
                <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Scholarships</div>
                <ul className="text-xs text-[var(--foreground)] space-y-1.5 list-none p-0">{selectedUni.scholarships.map((s) => <li key={s}>• {s}</li>)}</ul>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/${selectedCareer}/${selectedCountry}/${selectedUni.slug}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold no-underline text-white" style={{ backgroundColor: color }}>
                Full Profile <ExternalLink size={14} />
              </Link>
              {selectedUni.website && (
                <a href={selectedUni.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold no-underline border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                  <Globe size={14} />
                </a>
              )}
            </div>
          </div>
        )}
      </SideSheet>
    </div>
  );
}
