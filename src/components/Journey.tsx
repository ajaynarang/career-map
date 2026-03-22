"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, ArrowRight, ExternalLink, Globe,
  BookOpen, Users, Star, Award, Zap, Sun, Moon, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

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

// ─── Glassy Bubble ───

function Bubble({ size, color, onClick, children, delay = 0, pulse, active }: {
  size: number; color: string; onClick: () => void; children: React.ReactNode; delay?: number; pulse?: boolean; active?: boolean;
}) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22, delay }}
      whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="rounded-full flex flex-col items-center justify-center cursor-pointer relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {pulse && (
        <motion.div className="absolute inset-0 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity }} style={{ background: `radial-gradient(circle, ${color}30 0%, transparent 70%)` }} />
      )}
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.4) 0%, ${color}80 25%, ${color}45 55%, ${color}20 80%, rgba(0,0,0,0.1) 100%)`,
        border: `2px solid ${active ? `${color}` : `${color}60`}`,
        boxShadow: `0 0 ${size * 0.35}px ${color}${active ? "50" : "25"}, inset 0 -${size * 0.12}px ${size * 0.25}px rgba(0,0,0,0.25), inset 0 ${size * 0.04}px ${size * 0.08}px rgba(255,255,255,0.2)`,
      }} />
      <div className="absolute rounded-full bg-white/35 blur-[1px]" style={{ top: "10%", left: "15%", width: "38%", height: "22%" }} />
      <div className="relative z-10 flex flex-col items-center justify-center">{children}</div>
    </motion.button>
  );
}

// ─── Tooltip (appears on hover, positioned to the right of bubble) ───

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 shadow-2xl min-w-[200px] max-w-[300px]" style={{ backdropFilter: "none" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Bezier connector ───

function Line({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const mx = x1 + (x2 - x1) * 0.5;
  return (
    <motion.path
      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
      fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.2 }}
      exit={{ pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
}

// Sheet removed — using inline detail card instead

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

// ─── Layout constants ───

const COL = 200;
const ROW_CAREER = 80;
const ROW_COUNTRY = 72;
const ROW_UNI = 55;
const SZ_ROOT = 90;
const SZ_CAREER = 68;
const SZ_COUNTRY = 58;
const SZ_UNI = 46;
const SZ_EXAM = 42;

// ─── Main ───

export interface JourneyProps {
  careers: CareerData[];
  getCountries: (slug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

export function Journey({ careers, getCountries, getExams, getUnis }: JourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<{ uni: UniData; career: string; country: string } | null>(null);
  const [examDetail, setExamDetail] = useState<ExamData | null>(null);
  const [fullProfile, setFullProfile] = useState<{ uni: UniData; career: string; country: string } | null>(null);

  // Pan
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const onDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }, [pan]);
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setPan({ x: dragStart.current.px + (e.clientX - dragStart.current.x), y: dragStart.current.py + (e.clientY - dragStart.current.y) });
  }, [dragging]);
  const onUp = useCallback(() => setDragging(false), []);

  const color = activeCareer ? COLORS[activeCareer] || "#3B82F6" : "#3B82F6";
  const countries = activeCareer ? getCountries(activeCareer) : [];
  const exams = activeCareer && activeCountry ? getExams(activeCareer, activeCountry) : [];
  const unis = activeCareer && activeCountry ? getUnis(activeCareer, activeCountry) : [];

  // Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeCountry) setActiveCountry(null);
        else if (activeCareer) setActiveCareer(null);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeCareer, activeCountry]);

  // Auto-pan
  useEffect(() => {
    if (!activeCareer) setPan({ x: 0, y: 0 });
    else if (!activeCountry) setPan(p => ({ x: Math.min(p.x, -100), y: p.y }));
    else setPan(p => ({ x: Math.min(p.x, -280), y: p.y }));
  }, [activeCareer, activeCountry]);

  // ─── Positions ───

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const rootX = 120;
  const rootY = vh / 2;

  // Careers — always visible (just dim inactive ones)
  const careerX = rootX + COL;
  const totalCH = (careers.length - 1) * ROW_CAREER;
  const careerY0 = rootY - totalCH / 2;
  const careerPos = careers.map((_, i) => ({ x: careerX, y: careerY0 + i * ROW_CAREER }));

  // Countries
  const aci = careers.findIndex(c => c.slug === activeCareer);
  const cAnchorY = aci >= 0 ? careerPos[aci].y : rootY;
  const countryX = careerX + COL;
  const totalCoH = (countries.length - 1) * ROW_COUNTRY;
  const countryY0 = cAnchorY - totalCoH / 2;
  const countryPos = countries.map((_, i) => ({ x: countryX, y: countryY0 + i * ROW_COUNTRY }));

  // Exams + Unis (side by side — exams on top half, unis on bottom half)
  const coi = countries.findIndex(c => c.slug === activeCountry);
  const coAnchorY = coi >= 0 ? countryPos[coi].y : cAnchorY;
  const detailX = countryX + COL;

  // Exams above, unis below
  const examY0 = coAnchorY - (exams.length * ROW_UNI) / 2 - 20;
  const examPos = exams.map((_, i) => ({ x: detailX, y: examY0 + i * (ROW_UNI - 5) }));

  const uniY0 = (examPos.length > 0 ? examPos[examPos.length - 1].y + ROW_UNI + 20 : coAnchorY - (unis.length - 1) * ROW_UNI / 2);
  const uniPos = unis.map((_, i) => ({ x: detailX, y: uniY0 + i * ROW_UNI }));

  const shortName = (name: string) => name.replace(/University of |University |Institute of Technology |Institute of |Indian |National |School of /g, "").substring(0, 9);

  return (
    <>
      <div ref={containerRef} className="w-full h-screen overflow-hidden relative select-none" style={{ background: "var(--background)", cursor: dragging ? "grabbing" : "grab" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--border) 0.6px, transparent 0.6px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-4 right-4 z-30"><ThemeToggle /></div>

        <AnimatePresence>
          {!activeCareer && (
            <motion.div exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
              <p className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-[3px] opacity-40">tap a bubble · drag to pan</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div animate={{ x: pan.x, y: pan.y }} transition={dragging ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0" style={{ overflow: "visible" }}>

          {/* SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
            <AnimatePresence>
              {/* Root → Careers */}
              {careers.map((c, i) => {
                if (activeCareer && activeCareer !== c.slug) return null;
                return <Line key={`r-${c.slug}`} x1={rootX + SZ_ROOT / 2} y1={rootY} x2={careerPos[i].x - SZ_CAREER / 2} y2={careerPos[i].y} color={COLORS[c.slug]} />;
              })}
              {/* Career → Countries */}
              {activeCareer && countries.map((c, i) => (
                (!activeCountry || activeCountry === c.slug) && <Line key={`c-${c.slug}`} x1={careerX + SZ_CAREER / 2} y1={cAnchorY} x2={countryPos[i].x - SZ_COUNTRY / 2} y2={countryPos[i].y} color={color} />
              ))}
              {/* Country → Exams */}
              {activeCountry && exams.map((e, i) => (
                <Line key={`e-${e.slug}`} x1={countryX + SZ_COUNTRY / 2} y1={coAnchorY} x2={examPos[i].x - SZ_EXAM / 2} y2={examPos[i].y} color="#F59E0B" />
              ))}
              {/* Country → Unis */}
              {activeCountry && unis.map((u, i) => (
                <Line key={`u-${u.slug}`} x1={countryX + SZ_COUNTRY / 2} y1={coAnchorY} x2={uniPos[i].x - SZ_UNI / 2} y2={uniPos[i].y} color={color} />
              ))}
            </AnimatePresence>
          </svg>

          {/* Bubbles */}
          <div className="absolute inset-0 z-20" style={{ overflow: "visible" }}>

            {/* Root */}
            <div className="absolute group" style={{ left: rootX, top: rootY, transform: "translate(-50%, -50%)" }}>
              <Bubble size={SZ_ROOT} color="#3B82F6" pulse onClick={() => { setActiveCareer(null); setActiveCountry(null); }}>
                <span className="text-sm font-bold text-white drop-shadow-lg">PCM</span>
              </Bubble>
              <Tooltip>
                <div className="text-xs font-bold text-[var(--foreground)]">Physics · Chemistry · Math</div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-1">8 career paths · 6 countries · 100+ universities</div>
              </Tooltip>
            </div>

            {/* Careers — always show all, dim inactive */}
            <AnimatePresence>
              {careers.map((c, i) => {
                if (activeCareer && activeCareer !== c.slug) return null;
                const isActive = activeCareer === c.slug;
                return (
                  <motion.div key={c.slug} className="absolute group" style={{ left: careerPos[i].x, top: careerPos[i].y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                    <Bubble size={isActive ? SZ_CAREER + 6 : SZ_CAREER} color={COLORS[c.slug]} active={isActive} pulse={isActive} delay={i * 0.03}
                      onClick={() => { setActiveCareer(c.slug); setActiveCountry(null); }}>
                      <span className="text-sm drop-shadow-lg">{EMOJIS[c.slug]}</span>
                      <span className="text-[7px] font-bold text-white drop-shadow-lg mt-0.5 text-center px-1 leading-tight">{c.title.split("/")[0].split("&")[0].trim()}</span>
                    </Bubble>
                    <Tooltip>
                      <div className="text-xs font-bold text-[var(--foreground)] mb-1">{c.title}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)] leading-relaxed mb-2">{c.description}</div>
                      <div className="text-[10px] leading-relaxed pt-2 border-t border-[var(--border)]" style={{ color: COLORS[c.slug] }}>{c.whyChoose.substring(0, 120)}...</div>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Countries */}
            <AnimatePresence>
              {activeCareer && countries.map((c, i) => {
                if (activeCountry && activeCountry !== c.slug) return null;
                const isActive = activeCountry === c.slug;
                return (
                  <motion.div key={`co-${c.slug}`} className="absolute group" style={{ left: countryPos[i].x, top: countryPos[i].y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                    <Bubble size={isActive ? SZ_COUNTRY + 5 : SZ_COUNTRY} color={color} active={isActive} pulse={isActive} delay={i * 0.04}
                      onClick={() => setActiveCountry(c.slug)}>
                      <span className="text-base drop-shadow-lg">{c.flag}</span>
                      <span className="text-[6px] font-bold text-white drop-shadow-lg mt-0.5">{c.label}</span>
                    </Bubble>
                    <Tooltip>
                      <div className="text-xs font-bold text-[var(--foreground)] mb-2">{c.flag} {c.label}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]"><span className="text-[var(--muted-foreground)]">4yr total</span><span className="font-bold" style={{ color }}>{c.budget.totalInr}</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-[var(--muted-foreground)]">Language</span><span className="text-[var(--foreground)]">{c.language}</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-[var(--muted-foreground)]">Work visa</span><span className="text-[var(--foreground)]">{c.postStudyVisa}</span></div>
                      </div>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Exams (amber colored, smaller) */}
            <AnimatePresence>
              {activeCountry && exams.map((e, i) => (
                <motion.div key={`ex-${e.slug}`} className="absolute group" style={{ left: examPos[i].x, top: examPos[i].y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                  <Bubble size={SZ_EXAM} color="#F59E0B" delay={i * 0.03}
                    onClick={() => { setExamDetail(examDetail?.slug === e.slug ? null : e); setSheetData(null); }}>
                    <GraduationCap size={12} className="text-white drop-shadow-lg" />
                    <span className="text-[6px] font-bold text-white drop-shadow-lg mt-0.5 text-center px-0.5 leading-tight">{e.name.substring(0, 8)}</span>
                  </Bubble>
                  <Tooltip>
                    <div className="text-xs font-bold text-[var(--foreground)] mb-1">{e.name}</div>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">When</span><span className="text-[var(--foreground)]">{e.when.substring(0, 40)}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Fee</span><span className="text-[var(--foreground)]">{e.fee}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Format</span><span className="text-[var(--foreground)]">{e.format.substring(0, 40)}</span></div>
                    </div>
                    <div className="text-[9px] text-[var(--muted-foreground)] mt-2 leading-relaxed">{e.eligibility.substring(0, 80)}...</div>
                    {e.website && (
                      <a href={e.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold mt-2 no-underline text-amber-500">
                        Register <ExternalLink size={9} />
                      </a>
                    )}
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Universities */}
            <AnimatePresence>
              {activeCountry && unis.map((u, i) => (
                <motion.div key={`uni-${u.slug}`} className="absolute group" style={{ left: uniPos[i].x, top: uniPos[i].y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                  <Bubble size={SZ_UNI} color={color} delay={i * 0.03}
                    onClick={() => { setSheetData(sheetData?.uni.slug === u.slug ? null : { uni: u, career: activeCareer!, country: activeCountry! }); setExamDetail(null); }}>
                    <span className="text-[6px] font-bold text-white drop-shadow-lg text-center px-0.5 leading-tight">{shortName(u.name)}</span>
                  </Bubble>
                  <Tooltip>
                    <div className="text-xs font-bold text-[var(--foreground)] mb-0.5">{u.name}</div>
                    <div className="text-[10px] text-[var(--muted-foreground)] mb-2">{u.location} · {u.ranking}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><div className="text-[10px] font-bold" style={{ color }}>{u.feesInr}</div><div className="text-[8px] text-[var(--muted-foreground)]">Cost/yr</div></div>
                      <div><div className="text-[10px] font-bold text-emerald-500">{u.salary}</div><div className="text-[8px] text-[var(--muted-foreground)]">Salary</div></div>
                      <div><div className="text-[10px] font-bold text-amber-500">{u.acceptance}</div><div className="text-[8px] text-[var(--muted-foreground)]">Accept</div></div>
                    </div>
                    <div className="text-[9px] text-[var(--muted-foreground)] mt-2 pt-2 border-t border-[var(--border)]">Tap for full details</div>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Label for exams vs unis */}
            <AnimatePresence>
              {activeCountry && exams.length > 0 && (
                <motion.div key="label-exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute text-[8px] font-mono uppercase tracking-[3px] text-amber-500/50" style={{ left: detailX - 15, top: examY0 - 25, transform: "translateX(-50%)" }}>
                  Exams
                </motion.div>
              )}
              {activeCountry && unis.length > 0 && (
                <motion.div key="label-unis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute text-[8px] font-mono uppercase tracking-[3px]" style={{ left: detailX - 15, top: uniY0 - 25, transform: "translateX(-50%)", color: `${color}60` }}>
                  Universities
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Exam Detail Card — fixed bottom panel */}
      <AnimatePresence>
        {examDetail && (
          <motion.div
            key={`exam-${examDetail.slug}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pt-0"
          >
            <div className="max-w-lg mx-auto bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden">
              <button onClick={() => setExamDetail(null)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--muted)] flex items-center justify-center cursor-pointer hover:bg-[var(--border)] transition-colors z-10">
                <X size={12} className="text-[var(--muted-foreground)]" />
              </button>

              <div className="p-4 pb-3">
                <div className="text-[9px] font-mono uppercase tracking-[3px] text-amber-500 mb-1">Entrance Exam</div>
                <h3 className="text-base font-bold text-[var(--foreground)] pr-8">{examDetail.name}</h3>
                <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{examDetail.when}</div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                <div className="bg-[var(--background)] p-3">
                  <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">Fee</div>
                  <div className="text-[11px] font-bold text-[var(--foreground)]">{examDetail.fee}</div>
                </div>
                <div className="bg-[var(--background)] p-3">
                  <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">Format</div>
                  <div className="text-[11px] font-semibold text-[var(--foreground)]">{examDetail.format.substring(0, 50)}</div>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Eligibility</div>
                <div className="text-[11px] text-[var(--foreground)] leading-relaxed">{examDetail.eligibility.substring(0, 120)}</div>
              </div>

              {examDetail.website && (
                <div className="px-4 pb-4 pt-1">
                  <a href={examDetail.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold no-underline">
                    Register now <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* University Detail Card — fixed bottom panel */}
      <AnimatePresence>
        {sheetData && (() => {
          const { uni, career, country } = sheetData;
          const c = COLORS[career];
          return (
            <motion.div
              key={uni.slug}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 z-40 p-4 pt-0"
            >
              <div className="max-w-2xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] overflow-hidden">
                {/* Close */}
                <button onClick={() => setSheetData(null)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--muted)] flex items-center justify-center cursor-pointer hover:bg-[var(--border)] transition-colors z-10">
                  <X size={12} className="text-[var(--muted-foreground)]" />
                </button>

                {/* Header row */}
                <div className="p-4 pb-3">
                  <div className="text-[9px] font-mono uppercase tracking-[3px] mb-1" style={{ color: c }}>{uni.ranking}</div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-0.5 pr-8">{uni.name}</h3>
                  <div className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1"><MapPin size={10} />{uni.location}</div>
                </div>

                {/* Key numbers */}
                <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
                  {[
                    { label: "Cost/yr", value: uni.feesInr, accent: c },
                    { label: "Salary", value: uni.salary.substring(0, 25), accent: "#10B981" },
                    { label: "Acceptance", value: uni.acceptance.substring(0, 20), accent: "#F59E0B" },
                  ].map(s => (
                    <div key={s.label} className="bg-[var(--card)] p-3 text-center">
                      <div className="text-[11px] font-bold" style={{ color: s.accent }}>{s.value}</div>
                      <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Programs (compact) */}
                {uni.programs.length > 0 && (
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex flex-wrap gap-1">
                      {uni.programs.slice(0, 5).map(p => (
                        <span key={p} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{p}</span>
                      ))}
                      {uni.programs.length > 5 && <span className="text-[9px] px-2 py-0.5 text-[var(--muted-foreground)]">+{uni.programs.length - 5}</span>}
                    </div>
                  </div>
                )}

                {/* Top recruiters (one line) */}
                {uni.recruiters.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="text-[9px] text-[var(--muted-foreground)] truncate">
                      <span className="font-bold">Hires: </span>{uni.recruiters.slice(0, 6).join(", ")}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 p-4 pt-2">
                  <button onClick={() => setFullProfile({ uni, career, country })} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer" style={{ background: c }}>
                    Read more <ArrowRight size={12} />
                  </button>
                  {uni.website && (
                    <a href={uni.website} target="_blank" rel="noopener noreferrer" className="w-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline">
                      <Globe size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      {/* Full-screen profile overlay */}
      <AnimatePresence>
        {fullProfile && (() => {
          const { uni, career, country } = fullProfile;
          const c = COLORS[career];
          const countryExams = getExams(career, country);
          const countryData = getCountries(career).find(co => co.slug === country);
          return (
            <motion.div
              key={`full-${uni.slug}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[var(--background)] overflow-y-auto"
            >
              {/* Close button */}
              <button onClick={() => setFullProfile(null)} className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center cursor-pointer hover:bg-[var(--border)] transition-colors">
                <X size={18} className="text-[var(--foreground)]" />
              </button>

              {/* Hero */}
              <div className="relative pt-16 pb-10 px-6" style={{ background: `linear-gradient(180deg, ${c}08 0%, transparent 100%)` }}>
                <div className="max-w-2xl mx-auto">
                  <div className="text-[10px] font-mono uppercase tracking-[4px] mb-2" style={{ color: c }}>{uni.ranking}</div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">{uni.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <MapPin size={14} /> {uni.location}
                    {countryData && <span>· {countryData.flag} {countryData.label}</span>}
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto px-6 pb-20">
                {/* The 3 numbers */}
                <div className="grid grid-cols-3 gap-3 mb-10">
                  {[
                    { label: "Annual cost", value: uni.feesInr, accent: c },
                    { label: "Starting salary", value: uni.salary, accent: "#10B981" },
                    { label: "Acceptance", value: uni.acceptance, accent: "#F59E0B" },
                  ].map(s => (
                    <div key={s.label} className="p-4 rounded-2xl bg-[var(--muted)] text-center">
                      <div className="text-base font-bold mb-1" style={{ color: s.accent }}>{s.value}</div>
                      <div className="text-[9px] text-[var(--muted-foreground)] uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Programs */}
                {uni.programs.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={15} style={{ color: c }} />
                      <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">What you&apos;ll study</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uni.programs.map(p => <span key={p} className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--foreground)]">{p}</span>)}
                    </div>
                  </div>
                )}

                {/* Recruiters */}
                {uni.recruiters.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={15} style={{ color: c }} />
                      <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Who hires from here</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uni.recruiters.map(r => <span key={r} className="text-xs px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{r}</span>)}
                    </div>
                  </div>
                )}

                {/* Scholarships */}
                {uni.scholarships.length > 0 && (
                  <div className="mb-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={15} className="text-emerald-500" />
                      <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Scholarships & financial aid</h2>
                    </div>
                    <ul className="space-y-2">
                      {uni.scholarships.map(s => <li key={s} className="text-sm text-[var(--foreground)] leading-relaxed flex gap-2"><span className="text-emerald-500 flex-shrink-0">•</span>{s}</li>)}
                    </ul>
                  </div>
                )}

                {/* Exams needed */}
                {countryExams.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap size={15} className="text-amber-500" />
                      <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">Exams you need</h2>
                    </div>
                    <div className="space-y-2">
                      {countryExams.map(e => (
                        <div key={e.slug} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]">
                          <div>
                            <div className="text-sm font-bold text-[var(--foreground)]">{e.name}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">{e.when.substring(0, 50)}</div>
                            <div className="text-xs text-[var(--muted-foreground)] mt-1">Fee: {e.fee}</div>
                          </div>
                          {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold no-underline flex items-center gap-1">Register <ExternalLink size={10} /></a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Country info */}
                {countryData && (
                  <div className="mb-8 p-5 rounded-2xl bg-[var(--muted)]">
                    <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-3">
                      Studying in {countryData.flag} {countryData.label}
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Total 4yr cost</div>
                        <div className="text-sm font-bold" style={{ color: c }}>{countryData.budget.totalInr}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Language</div>
                        <div className="text-sm text-[var(--foreground)]">{countryData.language}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted-foreground)] uppercase mb-1">Work visa after</div>
                        <div className="text-sm text-[var(--foreground)]">{countryData.postStudyVisa}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3">
                  {uni.website && (
                    <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[var(--border)] text-sm font-bold text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors no-underline">
                      <Globe size={16} /> Visit website
                    </a>
                  )}
                  {uni.applyLink && (
                    <a href={uni.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white no-underline" style={{ background: c }}>
                      Apply now <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
