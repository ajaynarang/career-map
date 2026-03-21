"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import { motion } from "framer-motion";
import { Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane } from "lucide-react";
import "@xyflow/react/dist/style.css";

const CAREER_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  engineering: Cpu,
  science: Atom,
  finance: TrendingUp,
  architecture: Building2,
  defence: Shield,
  design: Palette,
  "merchant-navy": Ship,
  aviation: Plane,
};

const CAREER_COLORS: Record<string, string> = {
  engineering: "#3B82F6",
  science: "#8B5CF6",
  finance: "#F59E0B",
  architecture: "#F97316",
  defence: "#10B981",
  design: "#EC4899",
  "merchant-navy": "#06B6D4",
  aviation: "#6366F1",
};

interface CareerData {
  slug: string;
  title: string;
  description: string;
}

function CenterNode() {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 30px rgba(59, 130, 246, 0.15), 0 0 60px rgba(59, 130, 246, 0.05)",
          "0 0 50px rgba(59, 130, 246, 0.3), 0 0 100px rgba(59, 130, 246, 0.1)",
          "0 0 30px rgba(59, 130, 246, 0.15), 0 0 60px rgba(59, 130, 246, 0.05)",
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-40 h-40 rounded-full flex flex-col items-center justify-center text-center backdrop-blur-sm"
      style={{
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(15, 15, 20, 0.95) 70%)",
        border: "1.5px solid rgba(59, 130, 246, 0.25)",
      }}
    >
      <div className="text-xl font-bold text-white leading-tight">Your</div>
      <div className="text-xl font-bold text-white leading-tight">Career</div>
      <div className="text-[10px] text-zinc-500 mt-1.5 tracking-wider uppercase">Click a path</div>
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </motion.div>
  );
}

function CareerNode({ data }: NodeProps) {
  const router = useRouter();
  const { slug, title, description } = data as unknown as CareerData;
  const color = CAREER_COLORS[slug] || "#3B82F6";
  const Icon = CAREER_ICONS[slug] || Cpu;

  const handleClick = useCallback(() => {
    router.push(`/${slug}`);
  }, [router, slug]);

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{
        scale: 1.1,
        y: -6,
        boxShadow: `0 8px 40px ${color}40, 0 0 80px ${color}15`,
      }}
      onClick={handleClick}
      className="cursor-pointer px-5 py-4 rounded-xl min-w-[170px] max-w-[185px] text-center backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, rgba(20, 20, 28, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)`,
        border: `1.5px solid ${color}35`,
        boxShadow: `0 4px 25px ${color}20, inset 0 1px 0 ${color}10`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mx-auto mb-2.5"
        style={{
          backgroundColor: color + "15",
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="text-[13px] font-semibold text-white mb-1">{title}</div>
      <div className="text-[10px] text-zinc-500 leading-snug line-clamp-2">{description}</div>
    </motion.div>
  );
}

const nodeTypes = {
  center: CenterNode,
  career: CareerNode,
};

interface MindMapProps {
  careers: CareerData[];
}

export function MindMap({ careers }: MindMapProps) {
  const { nodes, edges } = useMemo(() => {
    const centerX = 0;
    const centerY = 0;
    const radius = 320;

    const nodeList: Node[] = [
      {
        id: "center",
        type: "center",
        position: { x: centerX - 80, y: centerY - 80 },
        data: {},
        draggable: false,
      },
    ];

    const edgeList: Edge[] = [];

    careers.forEach((career, i) => {
      const angle = (i / careers.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius - 90;
      const y = centerY + Math.sin(angle) * radius - 45;

      nodeList.push({
        id: career.slug,
        type: "career",
        position: { x, y },
        data: career as unknown as Record<string, unknown>,
        draggable: false,
      });

      const color = CAREER_COLORS[career.slug] || "#3B82F6";

      edgeList.push({
        id: `center-${career.slug}`,
        source: "center",
        target: career.slug,
        animated: true,
        style: {
          stroke: color,
          strokeWidth: 1.5,
          opacity: 0.35,
          strokeDasharray: "6 4",
        },
      });
    });

    return { nodes: nodeList, edges: edgeList };
  }, [careers]);

  return (
    <div
      className="w-full h-[70vh] rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #08090c 0%, #0d0f14 50%, #08090c 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 0 80px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.3)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        panOnDrag
        zoomOnScroll={false}
        panOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={0.8}
          color="rgba(255,255,255,0.04)"
        />
      </ReactFlow>
    </div>
  );
}
