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
          "0 0 20px rgba(59, 130, 246, 0.2)",
          "0 0 40px rgba(59, 130, 246, 0.4)",
          "0 0 20px rgba(59, 130, 246, 0.2)",
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-center"
      style={{
        background: "var(--card)",
        border: "2px solid var(--border)",
      }}
    >
      <div className="text-lg font-bold text-[var(--foreground)] leading-tight">Your</div>
      <div className="text-lg font-bold text-[var(--foreground)] leading-tight">Career</div>
      <div className="text-[10px] text-[var(--muted-foreground)] mt-1">Click a path</div>
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
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.08, y: -5 }}
      onClick={handleClick}
      className="cursor-pointer px-5 py-4 rounded-xl min-w-[160px] max-w-[180px] text-center"
      style={{
        background: "var(--card)",
        border: `1.5px solid ${color}30`,
        boxShadow: `0 4px 20px ${color}15`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-sm font-semibold text-[var(--foreground)] mb-0.5">{title}</div>
      <div className="text-[10px] text-[var(--muted-foreground)] leading-snug line-clamp-2">{description}</div>
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
    const radius = 300;

    const nodeList: Node[] = [
      {
        id: "center",
        type: "center",
        position: { x: centerX - 70, y: centerY - 70 },
        data: {},
        draggable: false,
      },
    ];

    const edgeList: Edge[] = [];

    careers.forEach((career, i) => {
      const angle = (i / careers.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius - 85;
      const y = centerY + Math.sin(angle) * radius - 40;

      nodeList.push({
        id: career.slug,
        type: "career",
        position: { x, y },
        data: career as unknown as Record<string, unknown>,
        draggable: false,
      });

      edgeList.push({
        id: `center-${career.slug}`,
        source: "center",
        target: career.slug,
        animated: true,
        style: {
          stroke: CAREER_COLORS[career.slug] || "#3B82F6",
          strokeWidth: 1.5,
          opacity: 0.4,
        },
      });
    });

    return { nodes: nodeList, edges: edgeList };
  }, [careers]);

  return (
    <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-[var(--border)]" style={{ background: "var(--background)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        panOnDrag
        zoomOnScroll={false}
        panOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
