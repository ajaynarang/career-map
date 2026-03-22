"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowRight, ChevronRight, ExternalLink, Globe, Rocket } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

function ThemeToggleInline() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

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

// ─── Marble ───

function Marble({ size, color, children, onClick, active, glow, delay = 0, className = "" }: {
  size: number; color: string; children: React.ReactNode; onClick: () => void;
  active?: boolean; glow?: boolean; delay?: number; className?: string;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 22, delay }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-full flex flex-col items-center justify-center cursor-pointer relative ${className}`}
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 30%, ${color}90 0%, ${color}40 40%, ${color}15 70%, rgba(0,0,0,0.3) 100%)`,
        border: `2px solid ${active ? color : `${color}50`}`,
        boxShadow: glow || active
          ? `0 0 ${size * 0.4}px ${color}40, 0 0 ${size * 0.8}px ${color}15, inset 0 -${size * 0.1}px ${size * 0.3}px rgba(0,0,0,0.3)`
          : `0 0 ${size * 0.2}px ${color}20, inset 0 -${size * 0.1}px ${size * 0.3}px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Glass highlight */}
      <div className="absolute rounded-full bg-white/25 blur-[1px]" style={{ top: "12%", left: "18%", width: "35%", height: "22%" }} />
      {children}
    </motion.button>
  );
}

// ─── Popover ───

function InfoPopover({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      className="absolute z-40 mt-2"
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      <div className="bg-[var(--card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4 shadow-2xl min-w-[220px] max-w-[280px]">
        {children}
      </div>
      <button onClick={onClose} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700">
        <X size={10} className="text-[var(--muted-foreground)]" />
      </button>
    </motion.div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[min(520px,94vw)] bg-[var(--background)] overflow-y-auto z-50 shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-4 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--muted)] border border-[var(--border)] hover:bg-zinc-800 cursor-pointer hover:rotate-90 transition-all duration-300">
              <X size={14} className="text-[var(--muted-foreground)]" />
            </button>
            <div className="p-7 pt-3 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Canvas Layout Engine ───

function useCanvasLayout(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [dims, setDims] = useState({ w: 1200, h: 700 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [containerRef]);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const r = Math.min(cx, cy);

  return {
    cx, cy,
    careerOrbit: r * 0.6,
    countryOrbit: r * 0.42,
    uniOrbit: r * 0.32,
    centerSize: Math.max(80, r * 0.14),
    careerSize: Math.max(65, r * 0.11),
    countrySize: Math.max(55, r * 0.09),
    uniSize: Math.max(45, r * 0.075),
  };
}

function radialPos(cx: number, cy: number, radius: number, index: number, total: number, offsetAngle = -Math.PI / 2) {
  const angle = offsetAngle + (index / total) * Math.PI * 2;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle };
}

function fanPos(anchorX: number, anchorY: number, awayAngle: number, radius: number, index: number, total: number, spread = Math.PI * 0.8) {
  const startAngle = awayAngle - spread / 2;
  const angle = total === 1 ? awayAngle : startAngle + (index / (total - 1)) * spread;
  return { x: anchorX + Math.cos(angle) * radius, y: anchorY + Math.sin(angle) * radius, angle };
}

// ─── Main Journey ───

export interface JourneyProps {
  careers: CareerData[];
  getCountries: (slug: string) => CountryData[];
  getExams: (careerSlug: string, countrySlug: string) => ExamData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

export function Journey({ careers, getCountries, getExams, getUnis }: JourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = useCanvasLayout(containerRef);

  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [popover, setPopover] = useState<{ type: "career" | "country"; data: CareerData | CountryData } | null>(null);
  const [sheetUni, setSheetUni] = useState<UniData | null>(null);
  const [sheetCareer, setSheetCareer] = useState<string | null>(null);
  const [sheetCountry, setSheetCountry] = useState<string | null>(null);

  const color = activeCareer ? COLORS[activeCareer] || "#3B82F6" : "#3B82F6";
  const countries = activeCareer ? getCountries(activeCareer) : [];
  const unis = activeCareer && activeCountry ? getUnis(activeCareer, activeCountry) : [];
  const exams = activeCareer && activeCountry ? getExams(activeCareer, activeCountry) : [];

  const handleReset = useCallback(() => {
    setActiveCareer(null);
    setActiveCountry(null);
    setPopover(null);
  }, []);

  const handleCareerClick = useCallback((slug: string) => {
    if (activeCareer === slug) {
      // Show popover with career info
      const career = careers.find(c => c.slug === slug);
      if (career) setPopover({ type: "career", data: career });
    } else {
      setActiveCareer(slug);
      setActiveCountry(null);
      setPopover(null);
    }
  }, [activeCareer, careers]);

  const handleCountryClick = useCallback((slug: string) => {
    if (activeCountry === slug) {
      const country = countries.find(c => c.slug === slug);
      if (country) setPopover({ type: "country", data: country });
    } else {
      setActiveCountry(slug);
      setPopover(null);
    }
  }, [activeCountry, countries]);

  const handleUniClick = useCallback((uni: UniData) => {
    setSheetUni(uni);
    setSheetCareer(activeCareer);
    setSheetCountry(activeCountry);
  }, [activeCareer, activeCountry]);

  // Escape to go back
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (popover) setPopover(null);
        else if (activeCountry) setActiveCountry(null);
        else if (activeCareer) setActiveCareer(null);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [popover, activeCareer, activeCountry]);

  // Career positions
  const careerPositions = careers.map((_, i) => radialPos(layout.cx, layout.cy, layout.careerOrbit, i, careers.length));

  // Active career index & position
  const activeCareerIdx = careers.findIndex(c => c.slug === activeCareer);
  const activeCareerPos = activeCareerIdx >= 0 ? careerPositions[activeCareerIdx] : null;

  // Country positions (fan out from active career)
  const countryPositions = activeCareerPos
    ? countries.map((_, i) => fanPos(activeCareerPos.x, activeCareerPos.y, activeCareerPos.angle, layout.countryOrbit, i, countries.length))
    : [];

  // Active country index & position
  const activeCountryIdx = countries.findIndex(c => c.slug === activeCountry);
  const activeCountryPos = activeCountryIdx >= 0 ? countryPositions[activeCountryIdx] : null;

  // Uni positions
  const uniPositions = activeCountryPos
    ? unis.map((_, i) => fanPos(activeCountryPos.x, activeCountryPos.y, activeCountryPos.angle, layout.uniOrbit, i, unis.length, Math.PI * 1.2))
    : [];

  return (
    <>
      <div ref={containerRef} className="w-full relative overflow-hidden" style={{ height: "100vh", background: "var(--background)" }}>
        {/* Dot grid */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ background: `radial-gradient(circle at ${layout.cx}px ${layout.cy}px, ${color}08 0%, transparent 50%)` }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          />
        </div>

        {/* SVG connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <AnimatePresence>
            {/* Center → Careers */}
            {!activeCareer && careers.map((c, i) => {
              const pos = careerPositions[i];
              return (
                <motion.line key={`cc-${c.slug}`} x1={layout.cx} y1={layout.cy} x2={pos.x} y2={pos.y}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.2 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  stroke={COLORS[c.slug]} strokeWidth={1.5} strokeDasharray="5 4" filter="url(#glow)" />
              );
            })}

            {/* Active career → center */}
            {activeCareer && activeCareerPos && (
              <motion.line key="active-center" x1={layout.cx} y1={layout.cy} x2={activeCareerPos.x} y2={activeCareerPos.y}
                initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }}
                stroke={color} strokeWidth={2} strokeDasharray="6 4" filter="url(#glow)" />
            )}

            {/* Career → Countries */}
            {activeCareer && !activeCountry && countries.map((c, i) => {
              const pos = countryPositions[i];
              return activeCareerPos ? (
                <motion.line key={`co-${c.slug}`} x1={activeCareerPos.x} y1={activeCareerPos.y} x2={pos.x} y2={pos.y}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.2 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  stroke={color} strokeWidth={1} strokeDasharray="4 3" filter="url(#glow)" />
              ) : null;
            })}

            {/* Active country → career */}
            {activeCountry && activeCareerPos && activeCountryPos && (
              <motion.line key="active-country-line" x1={activeCareerPos.x} y1={activeCareerPos.y} x2={activeCountryPos.x} y2={activeCountryPos.y}
                initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
                stroke={color} strokeWidth={1.5} strokeDasharray="5 3" filter="url(#glow)" />
            )}

            {/* Country → Unis */}
            {activeCountry && unis.map((u, i) => {
              const pos = uniPositions[i];
              return activeCountryPos ? (
                <motion.line key={`u-${u.slug}`} x1={activeCountryPos.x} y1={activeCountryPos.y} x2={pos.x} y2={pos.y}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.15 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  stroke={color} strokeWidth={1} strokeDasharray="3 3" />
              ) : null;
            })}
          </AnimatePresence>
        </svg>

        {/* Marble layer */}
        <div className="absolute inset-0 z-20">
          {/* Center "You" */}
          <div className="absolute" style={{ left: layout.cx, top: layout.cy, transform: "translate(-50%, -50%)" }}>
            <Marble size={layout.centerSize} color="#3B82F6" glow onClick={handleReset}>
              <span className="text-xs font-bold text-[var(--foreground)] drop-shadow-lg">{activeCareer ? "↩" : "You"}</span>
            </Marble>
          </div>

          <AnimatePresence>
            {/* Career marbles */}
            {!activeCareer && careers.map((c, i) => {
              const pos = careerPositions[i];
              return (
                <div key={c.slug} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}>
                  <Marble size={layout.careerSize} color={COLORS[c.slug]} onClick={() => handleCareerClick(c.slug)} delay={i * 0.04}>
                    <span className="text-base drop-shadow-lg">{EMOJIS[c.slug]}</span>
                    <span className="text-[8px] font-bold text-[var(--foreground)] mt-0.5 drop-shadow-lg leading-tight text-center px-1">{c.title.split(" ")[0]}</span>
                  </Marble>
                </div>
              );
            })}

            {/* Active career marble */}
            {activeCareer && activeCareerPos && (
              <div key={`active-${activeCareer}`} className="absolute" style={{ left: activeCareerPos.x, top: activeCareerPos.y, transform: "translate(-50%, -50%)" }}>
                <div className="relative">
                  <Marble size={layout.careerSize + 10} color={color} active onClick={() => handleCareerClick(activeCareer)}>
                    <span className="text-lg drop-shadow-lg">{EMOJIS[activeCareer]}</span>
                    <span className="text-[8px] font-bold text-[var(--foreground)] mt-0.5 drop-shadow-lg">{careers[activeCareerIdx]?.title.split(" ")[0]}</span>
                  </Marble>

                  {/* Career popover */}
                  <AnimatePresence>
                    {popover?.type === "career" && (
                      <InfoPopover onClose={() => setPopover(null)}>
                        <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">{(popover.data as CareerData).title}</h3>
                        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mb-3">{(popover.data as CareerData).whyChoose}</p>
                        <Link href={`/${activeCareer}/action-plan`} className="flex items-center gap-1.5 text-[11px] font-bold no-underline" style={{ color }}>
                          <Rocket size={12} /> Action Plan <ChevronRight size={12} />
                        </Link>
                      </InfoPopover>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Country marbles */}
            {activeCareer && !activeCountry && countries.map((c, i) => {
              const pos = countryPositions[i];
              return (
                <div key={`co-${c.slug}`} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}>
                  <Marble size={layout.countrySize} color={color} onClick={() => handleCountryClick(c.slug)} delay={i * 0.05}>
                    <span className="text-lg drop-shadow-lg">{c.flag}</span>
                    <span className="text-[7px] font-bold text-[var(--foreground)] mt-0.5 drop-shadow-lg">{c.label}</span>
                  </Marble>
                </div>
              );
            })}

            {/* Active country marble */}
            {activeCountry && activeCountryPos && (
              <div key={`active-co-${activeCountry}`} className="absolute" style={{ left: activeCountryPos.x, top: activeCountryPos.y, transform: "translate(-50%, -50%)" }}>
                <div className="relative">
                  <Marble size={layout.countrySize + 8} color={color} active onClick={() => handleCountryClick(activeCountry)}>
                    <span className="text-lg drop-shadow-lg">{countries[activeCountryIdx]?.flag}</span>
                    <span className="text-[7px] font-bold text-[var(--foreground)] mt-0.5 drop-shadow-lg">{countries[activeCountryIdx]?.label}</span>
                  </Marble>

                  {/* Country popover */}
                  <AnimatePresence>
                    {popover?.type === "country" && (
                      <InfoPopover onClose={() => setPopover(null)}>
                        <div className="text-lg mb-1">{(popover.data as CountryData).flag}</div>
                        <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">{(popover.data as CountryData).label}</h3>
                        <div className="space-y-1.5 mb-3">
                          <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Total cost</span><span className="font-bold" style={{ color }}>{(popover.data as CountryData).budget.totalInr}</span></div>
                          <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Language</span><span className="text-[var(--foreground)]">{(popover.data as CountryData).language}</span></div>
                          <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Work visa</span><span className="text-[var(--foreground)]">{(popover.data as CountryData).postStudyVisa}</span></div>
                        </div>
                        {exams.length > 0 && (
                          <div className="border-t border-zinc-800 pt-2 mt-2">
                            <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Exams needed</div>
                            {exams.map(e => (
                              <div key={e.slug} className="flex items-center justify-between text-[11px] py-0.5">
                                <span className="text-[var(--foreground)]">{e.name}</span>
                                {e.website && <a href={e.website} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color }}><ExternalLink size={10} /></a>}
                              </div>
                            ))}
                          </div>
                        )}
                      </InfoPopover>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* University marbles */}
            {activeCountry && unis.map((u, i) => {
              const pos = uniPositions[i];
              const shortName = u.name.length > 10 ? u.name.replace(/University of |University |Institute of /g, "").substring(0, 10) : u.name;
              return (
                <div key={`uni-${u.slug}`} className="absolute" style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}>
                  <Marble size={layout.uniSize} color={color} onClick={() => handleUniClick(u)} delay={i * 0.04}>
                    <span className="text-[7px] font-bold text-[var(--foreground)] drop-shadow-lg text-center px-1 leading-tight">{shortName}</span>
                    <span className="text-[6px] text-[var(--foreground)]/60 mt-0.5">{u.feesInr}</span>
                  </Marble>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-30">
          <ThemeToggleInline />
        </div>

        {/* Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[9px] text-zinc-700 font-mono uppercase tracking-[3px]">
            {!activeCareer ? "tap a marble to begin" : !activeCountry ? "choose a country · tap career marble for info" : "tap university for details · tap country for info"}
          </p>
        </div>
      </div>

      {/* University Sheet */}
      <Sheet open={!!sheetUni} onClose={() => setSheetUni(null)}>
        {sheetUni && sheetCareer && sheetCountry && (
          <div>
            <div className="rounded-2xl p-6 mb-6" style={{ background: `linear-gradient(160deg, ${COLORS[sheetCareer]}15 0%, transparent 100%)` }}>
              <div className="text-[9px] font-mono uppercase tracking-[4px] mb-2" style={{ color: COLORS[sheetCareer] }}>{sheetUni.ranking}</div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">{sheetUni.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]"><MapPin size={13} /> {sheetUni.location}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { label: "Cost/yr", value: sheetUni.feesInr, color: COLORS[sheetCareer] },
                { label: "Salary", value: sheetUni.salary, color: "#10B981" },
                { label: "Acceptance", value: sheetUni.acceptance, color: "#F59E0B" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-center">
                  <div className="text-sm font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[8px] text-zinc-600 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {sheetUni.programs.length > 0 && (
              <div className="mb-5">
                <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Programs</div>
                <div className="flex flex-wrap gap-1">{sheetUni.programs.map(p => <span key={p} className="text-[10px] px-2.5 py-1 rounded-full border border-zinc-800 text-[var(--foreground)]">{p}</span>)}</div>
              </div>
            )}

            {sheetUni.recruiters.length > 0 && (
              <div className="mb-5">
                <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Recruiters</div>
                <div className="flex flex-wrap gap-1">{sheetUni.recruiters.map(r => <span key={r} className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-900 text-[var(--muted-foreground)]">{r}</span>)}</div>
              </div>
            )}

            {sheetUni.scholarships.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-2">Scholarships</div>
                <ul className="space-y-1.5">{sheetUni.scholarships.map(s => <li key={s} className="text-[11px] text-[var(--foreground)] flex gap-2"><span className="text-emerald-400">•</span>{s}</li>)}</ul>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/${sheetCareer}/${sheetCountry}/${sheetUni.slug}`} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold no-underline text-[var(--foreground)]" style={{ background: COLORS[sheetCareer] }}>
                Full Profile <ArrowRight size={14} />
              </Link>
              {sheetUni.website && (
                <a href={sheetUni.website} target="_blank" rel="noopener noreferrer" className="w-12 rounded-xl border border-zinc-800 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline">
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
