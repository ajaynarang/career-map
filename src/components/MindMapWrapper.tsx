"use client";

import dynamic from "next/dynamic";

const MindMap = dynamic(
  () => import("./MindMap").then((mod) => ({ default: mod.MindMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[65vh] rounded-2xl border border-[var(--border)] flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm text-[var(--muted-foreground)]">Loading mind map...</p>
      </div>
    ),
  }
);

interface MindMapWrapperProps {
  careers: { slug: string; title: string; description: string }[];
}

export function MindMapWrapper({ careers }: MindMapWrapperProps) {
  return <MindMap careers={careers} />;
}
