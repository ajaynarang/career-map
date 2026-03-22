"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Globe, MapPin } from "lucide-react";

// ─── Data ───

const CAREERS = [
  { id: "eng", label: "Engineering", emoji: "⚙️", color: "#3B82F6", salary: "₹6-55 LPA" },
  { id: "sci", label: "Science", emoji: "🔬", color: "#8B5CF6", salary: "₹5-40 LPA" },
  { id: "fin", label: "Finance", emoji: "📈", color: "#F59E0B", salary: "₹8-80 LPA" },
  { id: "arch", label: "Architecture", emoji: "🏛️", color: "#F97316", salary: "₹5-20 LPA" },
  { id: "def", label: "Defence", emoji: "🛡️", color: "#10B981", salary: "₹6-20 LPA" },
  { id: "des", label: "Design", emoji: "🎨", color: "#EC4899", salary: "₹4-30 LPA" },
  { id: "nav", label: "Merchant Navy", emoji: "🚢", color: "#06B6D4", salary: "₹8-40 LPA" },
  { id: "avi", label: "Aviation", emoji: "✈️", color: "#6366F1", salary: "₹12-50 LPA" },
];

const COUNTRIES: Record<string, { id: string; label: string; flag: string; cost: string; visa: string }[]> = {
  eng: [
    { id: "india", label: "India", flag: "🇮🇳", cost: "₹8-25L", visa: "Home" },
    { id: "usa", label: "USA", flag: "🇺🇸", cost: "₹2-3Cr", visa: "OPT 3yr" },
    { id: "germany", label: "Germany", flag: "🇩🇪", cost: "₹40-55L", visa: "18mo" },
    { id: "uk", label: "UK", flag: "🇬🇧", cost: "₹1.7-2.6Cr", visa: "2yr" },
    { id: "canada", label: "Canada", flag: "🇨🇦", cost: "₹1.2-1.8Cr", visa: "PGWP 3yr" },
    { id: "australia", label: "Australia", flag: "🇦🇺", cost: "₹1.3-1.6Cr", visa: "2-4yr" },
  ],
  sci: [
    { id: "india", label: "India", flag: "🇮🇳", cost: "₹8-15L", visa: "Home" },
    { id: "usa", label: "USA", flag: "🇺🇸", cost: "₹2.5-3.1Cr", visa: "OPT 3yr" },
    { id: "germany", label: "Germany", flag: "🇩🇪", cost: "₹40-50L", visa: "18mo" },
  ],
  fin: [
    { id: "india", label: "India", flag: "🇮🇳", cost: "₹5-20L", visa: "Home" },
    { id: "usa", label: "USA", flag: "🇺🇸", cost: "₹2.5-3Cr", visa: "OPT 3yr" },
    { id: "uk", label: "UK", flag: "🇬🇧", cost: "₹1.5-2.5Cr", visa: "2yr" },
  ],
};

const UNIS: Record<string, { id: string; name: string; location: string; ranking: string; fees: string; salary: string }[]> = {
  "eng-india": [
    { id: "iitb", name: "IIT Bombay", location: "Mumbai", ranking: "#1 India", fees: "₹3L/yr", salary: "₹40-55 LPA" },
    { id: "iitd", name: "IIT Delhi", location: "New Delhi", ranking: "#2 India", fees: "₹3L/yr", salary: "₹38-50 LPA" },
    { id: "bits", name: "BITS Pilani", location: "Pilani", ranking: "Top 10", fees: "₹6L/yr", salary: "₹22-30 LPA" },
  ],
  "eng-usa": [
    { id: "mit", name: "MIT", location: "Cambridge, MA", ranking: "#1 Global", fees: "₹72L/yr", salary: "$115K" },
    { id: "stanford", name: "Stanford", location: "Stanford, CA", ranking: "#2 Global", fees: "₹73L/yr", salary: "$120K" },
    { id: "cmu", name: "Carnegie Mellon", location: "Pittsburgh, PA", ranking: "#1 CS", fees: "₹68L/yr", salary: "$110K" },
    { id: "gatech", name: "Georgia Tech", location: "Atlanta, GA", ranking: "Top 5-10", fees: "₹47L/yr", salary: "$85K" },
  ],
  "eng-germany": [
    { id: "tum", name: "TU Munich", location: "Munich", ranking: "#1 Germany", fees: "Almost free", salary: "€50-65K" },
    { id: "rwth", name: "RWTH Aachen", location: "Aachen", ranking: "#1 Eng DE", fees: "Almost free", salary: "€48-60K" },
  ],
};

// ─── Marble Component ───

function Marble({
  x, y, size, color, emoji, label, sublabel, onClick, isActive, isCenter, delay = 0,
}: {
  x: number; y: number; size: number; color: string; emoji?: string; label: string;
  sublabel?: string; onClick: () => void; isActive?: boolean; isCenter?: boolean; delay?: number;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay }}
      whileHover={{ scale: 1.15, boxShadow: `0 0 40px ${color}50` }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="absolute cursor-pointer flex flex-col items-center justify-center rounded-full"
      style={{
        left: x, top: y,
        width: size, height: size,
        transform: "translate(-50%, -50%)",
        background: isCenter
          ? `radial-gradient(circle at 35% 35%, ${color}40 0%, ${color}15 50%, rgba(0,0,0,0.3) 100%)`
          : `radial-gradient(circle at 35% 35%, ${color}60 0%, ${color}20 50%, rgba(0,0,0,0.4) 100%)`,
        border: `2px solid ${isActive ? color : `${color}40`}`,
        boxShadow: isActive
          ? `0 0 30px ${color}40, inset 0 0 20px ${color}10`
          : `0 0 15px ${color}15, inset 0 0 10px ${color}05`,
      }}
    >
      {emoji && <span className="text-lg md:text-xl" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>{emoji}</span>}
      <span className="text-[9px] md:text-[10px] font-bold text-white mt-0.5 leading-tight text-center px-1 drop-shadow-lg">{label}</span>
      {sublabel && <span className="text-[8px] text-white/60 mt-0.5">{sublabel}</span>}

      {/* Glass highlight */}
      <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full bg-white/20 blur-[2px]" />
    </motion.button>
  );
}

// ─── Connection Line ───

function Connection({ x1, y1, x2, y2, color, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; color: string; delay?: number }) {
  return (
    <motion.line
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      exit={{ pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.5, delay }}
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray="6 4"
    />
  );
}

// ─── Popover (for quick info on hover/click) ───

function Popover({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-30 pointer-events-none"
      style={{ left: x, top: y + 50, transform: "translateX(-50%)" }}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl min-w-[180px]">
        {children}
      </div>
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-l border-t border-zinc-700 rotate-45" />
    </motion.div>
  );
}

// ─── Sheet ───

function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md z-40" />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-[min(480px,92vw)] bg-zinc-950 border-l border-zinc-800 overflow-y-auto z-50"
          >
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-4 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 cursor-pointer">
              <X size={14} className="text-zinc-400" />
            </button>
            <div className="p-6 pt-3 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main ───

export default function MarblesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ type: string; id: string; x: number; y: number } | null>(null);
  const [sheetUni, setSheetUni] = useState<typeof UNIS["eng-india"][0] | null>(null);
  const [sheetColor, setSheetColor] = useState("#3B82F6");

  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 600;
  const cy = typeof window !== "undefined" ? (window.innerHeight - 56) / 2 : 350;

  const activeCareerData = CAREERS.find(c => c.id === activeCareer);
  const activeColor = activeCareerData?.color || "#3B82F6";
  const countries = activeCareer ? (COUNTRIES[activeCareer] || []) : [];
  const unis = activeCareer && activeCountry ? (UNIS[`${activeCareer}-${activeCountry}`] || []) : [];

  const handleReset = useCallback(() => {
    setActiveCareer(null);
    setActiveCountry(null);
    setHoveredItem(null);
  }, []);

  const handleCareerClick = useCallback((id: string) => {
    setActiveCareer(id);
    setActiveCountry(null);
    setHoveredItem(null);
  }, []);

  const handleCountryClick = useCallback((id: string) => {
    setActiveCountry(id);
    setHoveredItem(null);
  }, []);

  // Positions
  const careerRadius = Math.min(cx, cy) * 0.65;
  const countryRadius = Math.min(cx, cy) * 0.45;
  const uniRadius = Math.min(cx, cy) * 0.35;

  const getCareerPos = (i: number) => ({
    x: cx + Math.cos((i / CAREERS.length) * Math.PI * 2 - Math.PI / 2) * careerRadius,
    y: cy + Math.sin((i / CAREERS.length) * Math.PI * 2 - Math.PI / 2) * careerRadius,
  });

  const getCountryPos = (i: number, total: number) => {
    const careerIdx = CAREERS.findIndex(c => c.id === activeCareer);
    const careerPos = getCareerPos(careerIdx);
    const spread = Math.min(Math.PI * 1.2, Math.PI * 2 * (total / 8));
    const startAngle = Math.atan2(careerPos.y - cy, careerPos.x - cx) - spread / 2;
    const angle = startAngle + (i / (total - 1 || 1)) * spread;
    return {
      x: careerPos.x + Math.cos(angle) * countryRadius,
      y: careerPos.y + Math.sin(angle) * countryRadius,
    };
  };

  const getUniPos = (i: number, total: number) => {
    const countryIdx = countries.findIndex(c => c.id === activeCountry);
    const countryPos = getCountryPos(countryIdx, countries.length);
    const spread = Math.min(Math.PI, Math.PI * 2 * (total / 6));
    const startAngle = Math.atan2(countryPos.y - cy, countryPos.x - cx) - spread / 2;
    const angle = startAngle + (i / (total - 1 || 1)) * spread;
    return {
      x: countryPos.x + Math.cos(angle) * uniRadius,
      y: countryPos.y + Math.sin(angle) * uniRadius,
    };
  };

  return (
    <div ref={containerRef} className="w-full bg-zinc-950 relative overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* Subtle grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <AnimatePresence>
          {/* Center → Career connections */}
          {!activeCareer && CAREERS.map((c, i) => {
            const pos = getCareerPos(i);
            return <Connection key={`c-${c.id}`} x1={cx} y1={cy} x2={pos.x} y2={pos.y} color={c.color} delay={i * 0.05} />;
          })}

          {/* Career → Country connections */}
          {activeCareer && !activeCountry && countries.map((c, i) => {
            const careerIdx = CAREERS.findIndex(cr => cr.id === activeCareer);
            const careerPos = getCareerPos(careerIdx);
            const countryPos = getCountryPos(i, countries.length);
            return <Connection key={`co-${c.id}`} x1={careerPos.x} y1={careerPos.y} x2={countryPos.x} y2={countryPos.y} color={activeColor} delay={i * 0.06} />;
          })}

          {/* Country → Uni connections */}
          {activeCountry && unis.map((u, i) => {
            const countryIdx = countries.findIndex(c => c.id === activeCountry);
            const countryPos = getCountryPos(countryIdx, countries.length);
            const uniPos = getUniPos(i, unis.length);
            return <Connection key={`u-${u.id}`} x1={countryPos.x} y1={countryPos.y} x2={uniPos.x} y2={uniPos.y} color={activeColor} delay={i * 0.05} />;
          })}
        </AnimatePresence>
      </svg>

      {/* Marbles layer */}
      <div className="absolute inset-0 z-20">
        {/* Center marble */}
        <Marble
          x={cx} y={cy} size={activeCareer ? 70 : 100}
          color="#3B82F6" label={activeCareer ? "Back" : "You"} isCenter
          onClick={handleReset}
        />

        <AnimatePresence>
          {/* Career marbles */}
          {!activeCareer && CAREERS.map((c, i) => {
            const pos = getCareerPos(i);
            return (
              <Marble
                key={c.id}
                x={pos.x} y={pos.y} size={80}
                color={c.color} emoji={c.emoji} label={c.label}
                onClick={() => handleCareerClick(c.id)}
                delay={i * 0.05}
              />
            );
          })}

          {/* Active career marble (stays) */}
          {activeCareer && (() => {
            const idx = CAREERS.findIndex(c => c.id === activeCareer);
            const c = CAREERS[idx];
            const pos = getCareerPos(idx);
            return (
              <Marble
                key={`active-${c.id}`}
                x={pos.x} y={pos.y} size={90}
                color={c.color} emoji={c.emoji} label={c.label}
                sublabel={c.salary}
                isActive
                onClick={() => { setActiveCountry(null); }}
              />
            );
          })()}

          {/* Country marbles */}
          {activeCareer && !activeCountry && countries.map((c, i) => {
            const pos = getCountryPos(i, countries.length);
            return (
              <Marble
                key={`co-${c.id}`}
                x={pos.x} y={pos.y} size={70}
                color={activeColor} emoji={c.flag} label={c.label}
                sublabel={c.cost}
                onClick={() => handleCountryClick(c.id)}
                delay={i * 0.06}
              />
            );
          })}

          {/* Active country (stays) */}
          {activeCountry && (() => {
            const idx = countries.findIndex(c => c.id === activeCountry);
            const c = countries[idx];
            const pos = getCountryPos(idx, countries.length);
            return (
              <Marble
                key={`active-co-${c.id}`}
                x={pos.x} y={pos.y} size={75}
                color={activeColor} emoji={c.flag} label={c.label}
                sublabel={c.cost}
                isActive
                onClick={() => setActiveCountry(null)}
              />
            );
          })()}

          {/* University marbles */}
          {activeCountry && unis.map((u, i) => {
            const pos = getUniPos(i, unis.length);
            return (
              <Marble
                key={`uni-${u.id}`}
                x={pos.x} y={pos.y} size={60}
                color={activeColor}
                label={u.name.length > 12 ? u.name.substring(0, 11) + "…" : u.name}
                sublabel={u.fees}
                onClick={() => { setSheetUni(u); setSheetColor(activeColor); }}
                delay={i * 0.05}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[3px]">
          {!activeCareer ? "Click a marble to explore" : activeCountry ? "Click a university for details" : "Choose a country"}
        </p>
      </div>

      {/* Sheet for university details */}
      <Sheet open={!!sheetUni} onClose={() => setSheetUni(null)}>
        {sheetUni && (
          <div>
            <div className="rounded-2xl p-6 mb-6" style={{ background: `linear-gradient(135deg, ${sheetColor}15 0%, transparent 100%)` }}>
              <div className="text-[10px] font-mono uppercase tracking-[4px] mb-2" style={{ color: sheetColor }}>{sheetUni.ranking}</div>
              <h2 className="text-2xl font-bold text-white mb-1">{sheetUni.name}</h2>
              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin size={13} /> {sheetUni.location}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Fees/yr</div>
                <div className="text-lg font-bold text-white">{sheetUni.fees}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Salary</div>
                <div className="text-lg font-bold text-emerald-400">{sheetUni.salary}</div>
              </div>
            </div>
            <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer" style={{ background: sheetColor }}>
              View Full Profile →
            </button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
