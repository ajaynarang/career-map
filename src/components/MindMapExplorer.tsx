"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane,
  MapPin, DollarSign, Briefcase, GraduationCap, ExternalLink, Globe, X,
} from "lucide-react";
import Link from "next/link";
import "@xyflow/react/dist/style.css";

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
  budget: { totalInr: string };
  language: string;
  postStudyVisa: string;
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

// ─── Icon + Color Maps ───

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
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[min(520px,93vw)] bg-zinc-950 border-l border-zinc-800 overflow-y-auto z-50">
            <button onClick={onClose} className="sticky top-0 right-0 z-10 float-right m-3 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer">
              <X size={16} className="text-zinc-400" />
            </button>
            <div className="p-6 pt-4 clear-both">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function UniDetail({ uni, careerSlug, countrySlug, color }: { uni: UniData; careerSlug: string; countrySlug: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">University Profile</div>
      <h2 className="text-xl font-bold text-white mb-1">{uni.name}</h2>
      <div className="text-xs text-zinc-400 mb-5 flex items-center gap-1"><MapPin size={12} /> {uni.location} · {uni.ranking}</div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <DollarSign size={14} className="text-emerald-400 mb-1" />
          <div className="text-[10px] text-zinc-500">Fees/yr</div>
          <div className="text-sm font-semibold text-white">{uni.feesInr}</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <Briefcase size={14} className="text-blue-400 mb-1" />
          <div className="text-[10px] text-zinc-500">Salary</div>
          <div className="text-sm font-semibold text-emerald-400">{uni.salary}</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <GraduationCap size={14} className="text-amber-400 mb-1" />
          <div className="text-[10px] text-zinc-500">Acceptance</div>
          <div className="text-sm font-semibold text-amber-400">{uni.acceptance}</div>
        </div>
      </div>
      {uni.programs.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Programs</div>
          <div className="flex flex-wrap gap-1.5">{uni.programs.map((p) => <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{p}</span>)}</div>
        </div>
      )}
      {uni.recruiters.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Top Recruiters</div>
          <p className="text-xs text-zinc-300 leading-relaxed">{uni.recruiters.join(", ")}</p>
        </div>
      )}
      {uni.scholarships.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Scholarships</div>
          <ul className="text-xs text-zinc-300 space-y-1 list-none p-0">{uni.scholarships.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
      )}
      <div className="flex gap-2 mt-6">
        <Link href={`/${careerSlug}/${countrySlug}/${uni.slug}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold no-underline text-white" style={{ backgroundColor: color }}>
          Full Profile <ExternalLink size={14} />
        </Link>
        {uni.website && (
          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold no-underline border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">
            <Globe size={14} /> Website
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Custom Nodes ───

function CenterNode({ data }: NodeProps) {
  return (
    <motion.div
      animate={{ boxShadow: ["0 0 30px rgba(59,130,246,0.15)", "0 0 60px rgba(59,130,246,0.3)", "0 0 30px rgba(59,130,246,0.15)"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-center cursor-pointer"
      style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(12,12,18,0.98) 70%)", border: "1.5px solid rgba(59,130,246,0.3)" }}
      onClick={() => (data as { onReset?: () => void }).onReset?.()}
    >
      <div className="text-base font-bold text-white leading-tight">Your</div>
      <div className="text-base font-bold text-white leading-tight">Career</div>
      <div className="text-[9px] text-zinc-500 mt-1 tracking-wider uppercase">Start here</div>
      {[Position.Top, Position.Bottom, Position.Left, Position.Right].map((p) => (
        <Handle key={p} type="source" position={p} style={{ opacity: 0 }} />
      ))}
    </motion.div>
  );
}

function CareerNodeComponent({ data }: NodeProps) {
  const d = data as unknown as CareerData & { onClick: () => void; isActive: boolean; isHidden: boolean };
  const color = CAREER_COLORS[d.slug] || "#3B82F6";
  const Icon = CAREER_ICONS[d.slug] || Cpu;

  if (d.isHidden) return null;

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.08, boxShadow: `0 8px 40px ${color}40` }}
      onClick={d.onClick}
      className="cursor-pointer px-4 py-3 rounded-xl min-w-[140px] max-w-[160px] text-center"
      style={{
        background: d.isActive ? `linear-gradient(135deg, ${color}20 0%, rgba(12,12,18,0.98) 100%)` : "linear-gradient(135deg, rgba(18,18,25,0.95) 0%, rgba(10,10,15,0.98) 100%)",
        border: `1.5px solid ${d.isActive ? color + "60" : color + "25"}`,
        boxShadow: `0 4px 20px ${color}${d.isActive ? "30" : "15"}`,
      }}
    >
      {[Position.Top, Position.Bottom, Position.Left, Position.Right].map((p) => (
        <Handle key={p} type="target" position={p} style={{ opacity: 0 }} />
      ))}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: color + "18", boxShadow: `0 0 15px ${color}20` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-xs font-semibold text-white mb-0.5">{d.title}</div>
      <div className="text-[9px] text-zinc-500 leading-snug line-clamp-2">{d.description}</div>
    </motion.div>
  );
}

function CountryNodeComponent({ data }: NodeProps) {
  const d = data as unknown as CountryData & { onClick: () => void; isActive: boolean; color: string };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
      whileHover={{ scale: 1.06, boxShadow: `0 6px 30px ${d.color}30` }}
      onClick={d.onClick}
      className="cursor-pointer px-4 py-3 rounded-xl min-w-[130px] text-center"
      style={{
        background: d.isActive ? `rgba(255,255,255,0.06)` : "rgba(18,18,25,0.95)",
        border: `1.5px solid ${d.isActive ? d.color + "50" : "rgba(255,255,255,0.08)"}`,
        boxShadow: d.isActive ? `0 4px 20px ${d.color}25` : "none",
      }}
    >
      {[Position.Top, Position.Bottom, Position.Left, Position.Right].map((p) => (
        <Handle key={p} type="target" position={p} style={{ opacity: 0 }} />
      ))}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="text-xl mb-1">{d.flag}</div>
      <div className="text-xs font-semibold text-white">{d.label}</div>
      <div className="text-[9px] text-zinc-500">{d.budget.totalInr}</div>
      <div className="flex gap-1 justify-center mt-1.5 flex-wrap">
        <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">{d.language}</span>
      </div>
    </motion.div>
  );
}

function UniNodeComponent({ data }: NodeProps) {
  const d = data as unknown as UniData & { onClick: () => void; color: string };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05, boxShadow: `0 6px 25px ${d.color}25` }}
      onClick={d.onClick}
      className="cursor-pointer px-3 py-2.5 rounded-lg min-w-[120px] max-w-[150px] text-left"
      style={{
        background: "rgba(18,18,25,0.95)",
        border: `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      {[Position.Top, Position.Bottom, Position.Left, Position.Right].map((p) => (
        <Handle key={p} type="target" position={p} style={{ opacity: 0 }} />
      ))}
      <div className="text-[11px] font-semibold text-white mb-0.5 line-clamp-1">{d.name}</div>
      <div className="text-[9px] text-zinc-500 mb-1">{d.ranking}</div>
      <div className="flex gap-1 flex-wrap">
        <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: d.color + "15", color: d.color }}>{d.feesInr}</span>
      </div>
    </motion.div>
  );
}

const nodeTypes = {
  center: CenterNode,
  career: CareerNodeComponent,
  country: CountryNodeComponent,
  university: UniNodeComponent,
};

// ─── Main Mind Map Explorer ───

interface MindMapExplorerProps {
  careers: CareerData[];
  getCountries: (careerSlug: string) => CountryData[];
  getUnis: (careerSlug: string, countrySlug: string) => UniData[];
}

function MindMapFlow({ careers, getCountries, getUnis }: MindMapExplorerProps) {
  const [activeCareer, setActiveCareer] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [selectedUni, setSelectedUni] = useState<UniData | null>(null);
  const { fitView } = useReactFlow();

  const handleReset = useCallback(() => {
    setActiveCareer(null);
    setActiveCountry(null);
    setSelectedUni(null);
  }, []);

  const handleCareerClick = useCallback((slug: string) => {
    setActiveCareer(slug);
    setActiveCountry(null);
    setSelectedUni(null);
  }, []);

  const handleCountryClick = useCallback((slug: string) => {
    setActiveCountry(slug);
    setSelectedUni(null);
  }, []);

  // Refit view when state changes
  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 100);
    return () => clearTimeout(timer);
  }, [activeCareer, activeCountry, fitView]);

  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];

    // Center node
    nodeList.push({
      id: "center",
      type: "center",
      position: { x: 0, y: 0 },
      data: { onReset: handleReset },
      draggable: false,
    });

    const careerRadius = 280;
    careers.forEach((career, i) => {
      const angle = (i / careers.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * careerRadius;
      const y = Math.sin(angle) * careerRadius;

      const isActive = activeCareer === career.slug;
      const isHidden = activeCareer !== null && !isActive;

      nodeList.push({
        id: `career-${career.slug}`,
        type: "career",
        position: { x: x - 70, y: y - 40 },
        data: {
          ...career,
          onClick: () => handleCareerClick(career.slug),
          isActive,
          isHidden,
        } as unknown as Record<string, unknown>,
        draggable: false,
        hidden: isHidden,
      });

      if (!isHidden) {
        const color = CAREER_COLORS[career.slug] || "#3B82F6";
        edgeList.push({
          id: `center-${career.slug}`,
          source: "center",
          target: `career-${career.slug}`,
          animated: true,
          style: { stroke: color, strokeWidth: 1.5, opacity: isActive ? 0.6 : 0.25, strokeDasharray: "6 4" },
        });
      }

      // Country nodes (only for active career)
      if (isActive) {
        const countries = getCountries(career.slug);
        const countryRadius = 220;
        const color = CAREER_COLORS[career.slug] || "#3B82F6";

        countries.forEach((country, ci) => {
          const cAngle = (ci / countries.length) * Math.PI * 2 - Math.PI / 2;
          const cx = x + Math.cos(cAngle) * countryRadius;
          const cy = y + Math.sin(cAngle) * countryRadius;
          const isCountryActive = activeCountry === country.slug;

          nodeList.push({
            id: `country-${country.slug}`,
            type: "country",
            position: { x: cx - 65, y: cy - 40 },
            data: {
              ...country,
              onClick: () => handleCountryClick(country.slug),
              isActive: isCountryActive,
              color,
            } as unknown as Record<string, unknown>,
            draggable: false,
          });

          edgeList.push({
            id: `career-${career.slug}-country-${country.slug}`,
            source: `career-${career.slug}`,
            target: `country-${country.slug}`,
            animated: true,
            style: { stroke: color, strokeWidth: 1, opacity: isCountryActive ? 0.5 : 0.2, strokeDasharray: "4 3" },
          });

          // University nodes (only for active country)
          if (isCountryActive) {
            const unis = getUnis(career.slug, country.slug);
            const uniRadius = 180;

            unis.forEach((uni, ui) => {
              const uAngle = (ui / unis.length) * Math.PI * 2 - Math.PI / 2;
              const ux = cx + Math.cos(uAngle) * uniRadius;
              const uy = cy + Math.sin(uAngle) * uniRadius;

              nodeList.push({
                id: `uni-${uni.slug}`,
                type: "university",
                position: { x: ux - 60, y: uy - 25 },
                data: {
                  ...uni,
                  onClick: () => setSelectedUni(uni),
                  color,
                } as unknown as Record<string, unknown>,
                draggable: false,
              });

              edgeList.push({
                id: `country-${country.slug}-uni-${uni.slug}`,
                source: `country-${country.slug}`,
                target: `uni-${uni.slug}`,
                style: { stroke: color, strokeWidth: 0.8, opacity: 0.15 },
              });
            });
          }
        });
      }
    });

    return { nodes: nodeList, edges: edgeList };
  }, [careers, activeCareer, activeCountry, getCountries, getUnis, handleReset, handleCareerClick, handleCountryClick]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        panOnDrag
        zoomOnScroll
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={0.8} color="rgba(255,255,255,0.04)" />
      </ReactFlow>

      <SideSheet open={!!selectedUni} onClose={() => setSelectedUni(null)}>
        {selectedUni && activeCareer && activeCountry && (
          <UniDetail uni={selectedUni} careerSlug={activeCareer} countrySlug={activeCountry} color={CAREER_COLORS[activeCareer] || "#3B82F6"} />
        )}
      </SideSheet>
    </>
  );
}

export function MindMapExplorer(props: MindMapExplorerProps) {
  return (
    <ReactFlowProvider>
      <MindMapFlow {...props} />
    </ReactFlowProvider>
  );
}
