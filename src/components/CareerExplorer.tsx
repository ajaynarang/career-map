"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane,
  ArrowLeft, MapPin, GraduationCap, DollarSign, Briefcase, ExternalLink,
  ChevronDown, X, Globe, Calendar, BookOpen,
} from "lucide-react";
import Link from "next/link";

// ─── Types ───

interface CareerData {
  slug: string;
  title: string;
  description: string;
  whyChoose: string;
}

interface CountryData {
  slug: string;
  label: string;
  flag: string;
  overview: string;
  budget: { tuition: string; living: string; total4yr: string; totalInr: string };
  language: string;
  workWhileStudying: string;
  postStudyVisa: string;
}

interface ExamData {
  slug: string;
  name: string;
  when: string;
  fee: string;
  eligibility: string;
  format: string;
  website: string;
}

interface UniData {
  slug: string;
  name: string;
  location: string;
  ranking: string;
  feesInr: string;
  salary: string;
  acceptance: string;
  programs: string[];
  recruiters: string[];
  scholarships: string[];
  website: string;
  applyLink: string;
}

// ─── Constants ───

const CAREER_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  engineering: Cpu, science: Atom, finance: TrendingUp, architecture: Building2,
  defence: Shield, design: Palette, "merchant-navy": Ship, aviation: Plane,
};

const CAREER_COLORS: Record<string, string> = {
  engineering: "#3B82F6", science: "#8B5CF6", finance: "#F59E0B", architecture: "#F97316",
  defence: "#10B981", design: "#EC4899", "merchant-navy": "#06B6D4", aviation: "#6366F1",
};

// ─── Side Sheet ───

function SideSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[min(520px,93vw)] bg-[var(--background)] border-l border-[var(--border)] overflow-y-auto z-50"
          >
            <button
              onClick={onClose}
              className="sticky top-0 right-0 z-10 float-right m-3 p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] transition-colors cursor-pointer"
            >
              <X size={16} className="text-[var(--muted-foreground)]" />
            </button>
            <div className="p-6 pt-4 clear-both">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── University Detail in Side Sheet ───

function UniDetail({ uni, careerSlug, countrySlug, accentColor }: { uni: UniData; careerSlug: string; countrySlug: string; accentColor: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-1">University Profile</div>
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">{uni.name}</h2>
      <div className="text-xs text-[var(--muted-foreground)] mb-5 flex items-center gap-1">
        <MapPin size={12} /> {uni.location} · {uni.ranking}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <DollarSign size={14} className="text-emerald-500 mb-1" />
          <div className="text-[10px] text-[var(--muted-foreground)]">Fees/yr</div>
          <div className="text-sm font-semibold text-[var(--foreground)]">{uni.feesInr}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <Briefcase size={14} className="text-blue-500 mb-1" />
          <div className="text-[10px] text-[var(--muted-foreground)]">Salary</div>
          <div className="text-sm font-semibold text-emerald-500">{uni.salary}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <GraduationCap size={14} className="text-amber-500 mb-1" />
          <div className="text-[10px] text-[var(--muted-foreground)]">Acceptance</div>
          <div className="text-sm font-semibold text-amber-500">{uni.acceptance}</div>
        </div>
      </div>

      {uni.programs.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Programs</div>
          <div className="flex flex-wrap gap-1.5">
            {uni.programs.map((p) => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{p}</span>
            ))}
          </div>
        </div>
      )}

      {uni.recruiters.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Top Recruiters</div>
          <p className="text-xs text-[var(--foreground)] leading-relaxed">{uni.recruiters.join(", ")}</p>
        </div>
      )}

      {uni.scholarships.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Scholarships</div>
          <ul className="text-xs text-[var(--foreground)] space-y-1 list-none p-0">
            {uni.scholarships.map((s) => <li key={s}>• {s}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Link
          href={`/${careerSlug}/${countrySlug}/${uni.slug}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold no-underline transition-colors text-white"
          style={{ backgroundColor: accentColor }}
        >
          Full Profile <ExternalLink size={14} />
        </Link>
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold no-underline border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <Globe size={14} /> Website
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Explorer ───

interface CareerExplorerProps {
  careers: CareerData[];
  getCountries: (careerSlug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

export function CareerExplorer({ careers, getCountries, getExams, getUnis }: CareerExplorerProps) {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<UniData | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const career = careers.find((c) => c.slug === selectedCareer);
  const color = selectedCareer ? CAREER_COLORS[selectedCareer] || "#3B82F6" : "#3B82F6";
  const countries = selectedCareer ? getCountries(selectedCareer) : [];
  const country = countries.find((c) => c.slug === selectedCountry);
  const exams = selectedCareer && selectedCountry ? getExams(selectedCareer, selectedCountry) : [];
  const unis = selectedCareer && selectedCountry ? getUnis(selectedCareer, selectedCountry) : [];

  const goBack = () => {
    if (selectedCountry) {
      setSelectedCountry(null);
      setExpandedExam(null);
    } else if (selectedCareer) {
      setSelectedCareer(null);
    }
  };

  // ─── Step 1: Choose career ───
  if (!selectedCareer) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {careers.map((c, i) => {
            const Icon = CAREER_ICONS[c.slug] || Cpu;
            const clr = CAREER_COLORS[c.slug] || "#3B82F6";
            return (
              <motion.button
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => setSelectedCareer(c.slug)}
                className="p-5 rounded-xl text-left cursor-pointer transition-shadow"
                style={{
                  background: "var(--card)",
                  border: `1.5px solid ${clr}20`,
                  boxShadow: `0 2px 15px ${clr}10`,
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: clr + "15" }}>
                  <Icon size={20} style={{ color: clr }} />
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{c.title}</div>
                <div className="text-[11px] text-[var(--muted-foreground)] leading-snug line-clamp-2">{c.description}</div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 2: Choose country ───
  if (!selectedCountry) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Back + career header */}
          <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 cursor-pointer">
            <ArrowLeft size={14} /> Back to all careers
          </button>

          <div className="mb-6 p-5 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">{career?.title}</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-2">{career?.description}</p>
            <p className="text-xs leading-relaxed" style={{ color }}>{career?.whyChoose}</p>
          </div>

          <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Where do you want to study?
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {countries.map((c, i) => (
              <motion.button
                key={c.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCountry(c.slug)}
                className="p-4 rounded-xl text-left cursor-pointer border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-colors"
              >
                <div className="text-2xl mb-2">{c.flag}</div>
                <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{c.label}</div>
                <div className="text-xs text-[var(--muted-foreground)] mb-2">{c.budget.totalInr} total</div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">{c.language}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">{c.postStudyVisa}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Action plan link */}
          <Link
            href={`/${selectedCareer}/action-plan`}
            className="group flex items-center justify-between mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] no-underline hover:border-[var(--muted-foreground)]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color }} />
              <div>
                <div className="text-sm font-semibold text-[var(--foreground)]">Action Plan</div>
                <div className="text-xs text-[var(--muted-foreground)]">Step-by-step prep from Class 9 to 12</div>
              </div>
            </div>
            <ChevronDown size={16} className="text-[var(--muted-foreground)] -rotate-90" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Step 3: Exams + Universities ───
  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Back + header */}
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Back to countries
        </button>

        <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
          {career?.title} in {country?.flag} {country?.label}
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">{country?.overview}</p>

        {/* Budget overview */}
        {country && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Tuition/yr</div>
              <div className="text-sm font-semibold text-[var(--foreground)]">{country.budget.tuition}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Living/yr</div>
              <div className="text-sm font-semibold text-[var(--foreground)]">{country.budget.living}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Total 4 years</div>
              <div className="text-sm font-bold" style={{ color }}>{country.budget.totalInr}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Work visa after</div>
              <div className="text-sm font-semibold text-[var(--foreground)]">{country.postStudyVisa}</div>
            </div>
          </div>
        )}

        {/* Exams */}
        {exams.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen size={14} /> Entrance Exams
            </h3>
            <div className="space-y-2">
              {exams.map((exam) => (
                <div key={exam.slug} className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                  <button
                    onClick={() => setExpandedExam(expandedExam === exam.slug ? null : exam.slug)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)]">{exam.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{exam.when}</div>
                    </div>
                    <ChevronDown size={16} className={`text-[var(--muted-foreground)] transition-transform ${expandedExam === exam.slug ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedExam === exam.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="p-2 rounded bg-[var(--muted)]">
                              <div className="text-[10px] text-[var(--muted-foreground)]">Fee</div>
                              <div className="text-xs text-[var(--foreground)]">{exam.fee}</div>
                            </div>
                            <div className="p-2 rounded bg-[var(--muted)]">
                              <div className="text-[10px] text-[var(--muted-foreground)]">Format</div>
                              <div className="text-xs text-[var(--foreground)]">{exam.format}</div>
                            </div>
                          </div>
                          <div className="text-xs text-[var(--muted-foreground)] mb-3">{exam.eligibility}</div>
                          {exam.website && (
                            <a href={exam.website} target="_blank" rel="noopener noreferrer" className="text-xs font-medium no-underline flex items-center gap-1" style={{ color }}>
                              Register <ExternalLink size={10} />
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
          <div>
            <h3 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
              <GraduationCap size={14} /> Universities ({unis.length})
            </h3>
            <div className="space-y-2">
              {unis.map((uni, i) => (
                <motion.button
                  key={uni.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedUni(uni)}
                  className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{uni.name}</div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-2">
                        <MapPin size={11} /> {uni.location} · {uni.ranking}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + "15", color }}>{uni.feesInr}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">{uni.salary}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{uni.acceptance}</span>
                      </div>
                    </div>
                    <ChevronDown size={14} className="text-[var(--muted-foreground)] -rotate-90 mt-1 flex-shrink-0 ml-2" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Side Sheet for university detail */}
      <SideSheet open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && selectedCareer && selectedCountry && (
          <UniDetail uni={selectedUni} careerSlug={selectedCareer} countrySlug={selectedCountry} accentColor={color} />
        )}
      </SideSheet>
    </div>
  );
}
