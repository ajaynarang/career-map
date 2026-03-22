"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, ArrowRight, ExternalLink, Globe, Rocket,
  BookOpen, Users, Star, Award, Zap, Sun, Moon,
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

function Bubble({ size, color, onClick, children, delay = 0, pulse }: {
  size: number; color: string; onClick: () => void; children: React.ReactNode; delay?: number; pulse?: boolean;
}) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22, delay }}
      whileHover={{ scale: 1.12, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="rounded-full flex flex-col items-center justify-center cursor-pointer relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: `radial-gradient(circle, ${color}30 0%, transparent 70%)` }}
        />
      )}

      {/* Glass body */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.35) 0%, ${color}60 30%, ${color}25 65%, rgba(0,0,0,0.15) 100%)`,
        border: `1.5px solid ${color}50`,
        boxShadow: `0 0 ${size * 0.3}px ${color}25, inset 0 -${size * 0.15}px ${size * 0.3}px rgba(0,0,0,0.2), inset 0 ${size * 0.05}px ${size * 0.1}px rgba(255,255,255,0.15)`,
      }} />

      {/* Glass highlight */}
      <div className="absolute rounded-full bg-white/30 blur-[1px]" style={{ top: "10%", left: "15%", width: "40%", height: "25%" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.button>
  );
}

// ─── Curved connector line ───

function Connector({ fromX, fromY, toX, toY, color }: { fromX: number; fromY: number; toX: number; toY: number; color: string }) {
  const midX = fromX + (toX - fromX) * 0.5;
  const d = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray="6 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.25 }}
      exit={{ pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
}

// ─── Sheet ───

function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[min(520px,94vw)] bg-[var(--background)] border-l border-[var(--border)] overflow-y-auto z-50"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-4 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--muted)] border border-[var(--border)] hover:bg-[var(--border)] cursor-pointer hover:rotate-90 transition-all duration-300">
              <X size={14} className="text-[var(--muted-foreground)]" />
            </button>
            <div className="p-7 pt-3 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Theme Toggle ───

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer" aria-label="Toggle theme">
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

// ─── Tree Layout Constants ───

const COL_GAP = 200;        // horizontal gap between tree levels
const ROW_GAP_CAREER = 85;  // vertical spacing between career bubbles
const ROW_GAP_COUNTRY = 75;
const ROW_GAP_UNI = 60;
const BUBBLE_ROOT = 90;
const BUBBLE_CAREER = 70;
const BUBBLE_COUNTRY = 60;
const BUBBLE_UNI = 50;

// ─── Main Journey ───

export interface JourneyProps {
  careers: CareerData[];
  getCountries: (slug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

export function Journey({ careers, getCountries, getExams, getUnis }: JourneyProps) {
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [sheetUni, setSheetUni] = useState<UniData | null>(null);
  const [sheetMeta, setSheetMeta] = useState<{ career: string; country: string } | null>(null);

  // Pan state
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const onPointerUp = useCallback(() => setDragging(false), []);

  const color = activeCareer ? COLORS[activeCareer] || "#3B82F6" : "#3B82F6";
  const countries = activeCareer ? getCountries(activeCareer) : [];
  const unis = activeCareer && activeCountry ? getUnis(activeCareer, activeCountry) : [];
  const exams = activeCareer && activeCountry ? getExams(activeCareer, activeCountry) : [];

  // Escape to collapse
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

  // Auto-pan when tree expands
  useEffect(() => {
    if (activeCareer && !activeCountry) setPan(p => ({ ...p, x: Math.min(p.x, -80) }));
    if (activeCountry) setPan(p => ({ ...p, x: Math.min(p.x, -250) }));
    if (!activeCareer) setPan({ x: 0, y: 0 });
  }, [activeCareer, activeCountry]);

  // ─── Calculate positions ───

  const rootX = 100;
  const rootY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

  // Career column
  const careerX = rootX + COL_GAP;
  const totalCareerH = (careers.length - 1) * ROW_GAP_CAREER;
  const careerStartY = rootY - totalCareerH / 2;

  const careerPositions = careers.map((_, i) => ({
    x: careerX,
    y: careerStartY + i * ROW_GAP_CAREER,
  }));

  // Country column
  const countryX = careerX + COL_GAP;
  const totalCountryH = (countries.length - 1) * ROW_GAP_COUNTRY;
  const activeCareerIdx = careers.findIndex(c => c.slug === activeCareer);
  const careerAnchorY = activeCareerIdx >= 0 ? careerPositions[activeCareerIdx].y : rootY;
  const countryStartY = careerAnchorY - totalCountryH / 2;

  const countryPositions = countries.map((_, i) => ({
    x: countryX,
    y: countryStartY + i * ROW_GAP_COUNTRY,
  }));

  // Uni column
  const uniX = countryX + COL_GAP;
  const totalUniH = (unis.length - 1) * ROW_GAP_UNI;
  const activeCountryIdx = countries.findIndex(c => c.slug === activeCountry);
  const countryAnchorY = activeCountryIdx >= 0 ? countryPositions[activeCountryIdx].y : careerAnchorY;
  const uniStartY = countryAnchorY - totalUniH / 2;

  const uniPositions = unis.map((_, i) => ({
    x: uniX,
    y: uniStartY + i * ROW_GAP_UNI,
  }));

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-screen overflow-hidden relative select-none"
        style={{ background: "var(--background)", cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--border) 0.8px, transparent 0.8px)", backgroundSize: "28px 28px" }} />

        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-30">
          <ThemeToggle />
        </div>

        {/* Hint */}
        <AnimatePresence>
          {!activeCareer && (
            <motion.div exit={{ opacity: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <p className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-[3px] opacity-50">
                tap the bubble to begin · drag to pan
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pannable canvas */}
        <motion.div
          animate={{ x: pan.x, y: pan.y }}
          transition={dragging ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-0"
        >
          {/* SVG connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: "visible" }}>
            <AnimatePresence>
              {/* Root → Careers */}
              {careers.map((c, i) => {
                const show = !activeCareer || activeCareer === c.slug;
                if (!show) return null;
                return (
                  <Connector key={`r-${c.slug}`} fromX={rootX + BUBBLE_ROOT / 2} fromY={rootY} toX={careerPositions[i].x - BUBBLE_CAREER / 2} toY={careerPositions[i].y} color={COLORS[c.slug]} />
                );
              })}

              {/* Career → Countries */}
              {activeCareer && countries.map((c, i) => (
                (!activeCountry || activeCountry === c.slug) && (
                  <Connector key={`c-${c.slug}`} fromX={careerX + BUBBLE_CAREER / 2} fromY={careerAnchorY} toX={countryPositions[i].x - BUBBLE_COUNTRY / 2} toY={countryPositions[i].y} color={color} />
                )
              ))}

              {/* Country → Unis */}
              {activeCountry && unis.map((u, i) => (
                <Connector key={`u-${u.slug}`} fromX={countryX + BUBBLE_COUNTRY / 2} fromY={countryAnchorY} toX={uniPositions[i].x - BUBBLE_UNI / 2} toY={uniPositions[i].y} color={color} />
              ))}
            </AnimatePresence>
          </svg>

          {/* ─── BUBBLES ─── */}
          <div className="absolute inset-0 z-20" style={{ overflow: "visible" }}>

            {/* Root bubble */}
            <div className="absolute" style={{ left: rootX, top: rootY, transform: "translate(-50%, -50%)" }}>
              <Bubble size={BUBBLE_ROOT} color="#3B82F6" pulse onClick={() => { setActiveCareer(null); setActiveCountry(null); }}>
                <span className="text-xs font-bold text-white drop-shadow-lg">PCM</span>
                <span className="text-[7px] text-white/70 mt-0.5">You are here</span>
              </Bubble>
            </div>

            {/* Career bubbles */}
            <AnimatePresence>
              {careers.map((c, i) => {
                const show = !activeCareer || activeCareer === c.slug;
                if (!show) return null;
                const pos = careerPositions[i];
                const isActive = activeCareer === c.slug;
                return (
                  <motion.div key={c.slug} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                    <Bubble
                      size={isActive ? BUBBLE_CAREER + 8 : BUBBLE_CAREER}
                      color={COLORS[c.slug]}
                      delay={i * 0.03}
                      pulse={isActive}
                      onClick={() => {
                        if (isActive) { setActiveCareer(null); setActiveCountry(null); }
                        else { setActiveCareer(c.slug); setActiveCountry(null); }
                      }}
                    >
                      <span className="text-base drop-shadow-lg">{EMOJIS[c.slug]}</span>
                      <span className="text-[7px] font-bold text-white drop-shadow-lg mt-0.5 text-center leading-tight px-1">
                        {c.title.split("/")[0].split("&")[0].trim()}
                      </span>
                    </Bubble>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Country bubbles */}
            <AnimatePresence>
              {activeCareer && countries.map((c, i) => {
                const show = !activeCountry || activeCountry === c.slug;
                if (!show) return null;
                const pos = countryPositions[i];
                const isActive = activeCountry === c.slug;
                return (
                  <motion.div key={`co-${c.slug}`} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                    <div className="relative">
                      <Bubble
                        size={isActive ? BUBBLE_COUNTRY + 6 : BUBBLE_COUNTRY}
                        color={color}
                        delay={i * 0.04}
                        pulse={isActive}
                        onClick={() => {
                          if (isActive) setActiveCountry(null);
                          else setActiveCountry(c.slug);
                        }}
                      >
                        <span className="text-lg drop-shadow-lg">{c.flag}</span>
                        <span className="text-[6px] font-bold text-white drop-shadow-lg mt-0.5">{c.label}</span>
                      </Bubble>

                      {/* Country info tooltip — always visible when active */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
                        >
                          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
                            <div className="text-[10px] font-bold text-[var(--foreground)]">{c.flag} {c.label}</div>
                            <div className="text-[9px] mt-1 space-y-0.5">
                              <div className="flex gap-2"><span className="text-[var(--muted-foreground)]">Cost:</span><span className="font-bold" style={{ color }}>{c.budget.totalInr}</span></div>
                              <div className="flex gap-2"><span className="text-[var(--muted-foreground)]">Lang:</span><span className="text-[var(--foreground)]">{c.language}</span></div>
                              <div className="flex gap-2"><span className="text-[var(--muted-foreground)]">Visa:</span><span className="text-[var(--foreground)]">{c.postStudyVisa}</span></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* University bubbles */}
            <AnimatePresence>
              {activeCountry && unis.map((u, i) => {
                const pos = uniPositions[i];
                const shortName = u.name
                  .replace(/University of |University |Institute of Technology |Institute of /g, "")
                  .replace(/Indian |National /g, "")
                  .substring(0, 10);
                return (
                  <motion.div key={`uni-${u.slug}`} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }} exit={{ scale: 0, opacity: 0 }}>
                    <div className="relative group">
                      <Bubble
                        size={BUBBLE_UNI}
                        color={color}
                        delay={i * 0.03}
                        onClick={() => { setSheetUni(u); setSheetMeta({ career: activeCareer!, country: activeCountry! }); }}
                      >
                        <span className="text-[7px] font-bold text-white drop-shadow-lg text-center px-0.5 leading-tight">{shortName}</span>
                      </Bubble>

                      {/* Hover tooltip */}
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
                          <div className="text-[10px] font-bold text-[var(--foreground)]">{u.name}</div>
                          <div className="text-[9px] text-[var(--muted-foreground)]">{u.location} · {u.ranking}</div>
                          <div className="text-[9px] mt-1 flex gap-3">
                            <span style={{ color }}>{u.feesInr}</span>
                            <span className="text-emerald-500">{u.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* University Sheet */}
      <Sheet open={!!sheetUni} onClose={() => setSheetUni(null)}>
        {sheetUni && sheetMeta && (
          <div>
            <div className="rounded-2xl p-6 mb-6" style={{ background: `linear-gradient(160deg, ${COLORS[sheetMeta.career]}12 0%, transparent 100%)`, border: `1px solid ${COLORS[sheetMeta.career]}15` }}>
              <div className="text-[9px] font-mono uppercase tracking-[4px] mb-2" style={{ color: COLORS[sheetMeta.career] }}>{sheetUni.ranking}</div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">{sheetUni.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]"><MapPin size={13} /> {sheetUni.location}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: Zap, label: "Cost/yr", value: sheetUni.feesInr, accent: COLORS[sheetMeta.career] },
                { icon: Award, label: "Salary", value: sheetUni.salary, accent: "#10B981" },
                { icon: Star, label: "Acceptance", value: sheetUni.acceptance, accent: "#F59E0B" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-center">
                  <s.icon size={14} style={{ color: s.accent }} className="mx-auto mb-1" />
                  <div className="text-xs font-bold text-[var(--foreground)] mb-0.5">{s.value}</div>
                  <div className="text-[8px] text-[var(--muted-foreground)] uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {sheetUni.programs.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2"><BookOpen size={12} style={{ color: COLORS[sheetMeta.career] }} /><span className="text-[9px] font-bold text-[var(--foreground)] uppercase tracking-wider">Programs</span></div>
                <div className="flex flex-wrap gap-1">{sheetUni.programs.map(p => <span key={p} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--foreground)]">{p}</span>)}</div>
              </div>
            )}

            {sheetUni.recruiters.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2"><Users size={12} style={{ color: COLORS[sheetMeta.career] }} /><span className="text-[9px] font-bold text-[var(--foreground)] uppercase tracking-wider">Recruiters</span></div>
                <div className="flex flex-wrap gap-1">{sheetUni.recruiters.map(r => <span key={r} className="text-[10px] px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">{r}</span>)}</div>
              </div>
            )}

            {sheetUni.scholarships.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-2"><Star size={12} className="text-emerald-500" /><span className="text-[9px] font-bold text-[var(--foreground)] uppercase tracking-wider">Scholarships</span></div>
                <ul className="space-y-1.5">{sheetUni.scholarships.map(s => <li key={s} className="text-[11px] text-[var(--foreground)] flex gap-2"><span className="text-emerald-500">•</span>{s}</li>)}</ul>
              </div>
            )}

            {exams.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2"><Rocket size={12} style={{ color: COLORS[sheetMeta.career] }} /><span className="text-[9px] font-bold text-[var(--foreground)] uppercase tracking-wider">Exams needed</span></div>
                <div className="space-y-1.5">
                  {exams.map(e => (
                    <div key={e.slug} className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--muted)]">
                      <div>
                        <div className="text-[11px] font-semibold text-[var(--foreground)]">{e.name}</div>
                        <div className="text-[9px] text-[var(--muted-foreground)]">{e.when}</div>
                      </div>
                      {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: COLORS[sheetMeta.career] }}><ExternalLink size={12} /></a>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/${sheetMeta.career}/${sheetMeta.country}/${sheetUni.slug}`} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold no-underline text-white" style={{ background: COLORS[sheetMeta.career] }}>
                Full Profile <ArrowRight size={14} />
              </Link>
              {sheetUni.website && (
                <a href={sheetUni.website} target="_blank" rel="noopener noreferrer" className="w-12 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline">
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
