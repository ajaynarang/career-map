"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Globe = dynamic(() => import("@/components/3d/GlobeExplorer").then(mod => ({ default: mod.GlobeExplorer })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-[var(--border)] border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[var(--muted-foreground)]">Loading 3D Explorer...</p>
      </div>
    </div>
  ),
});

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link
          href="/engineering"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          Back to Engineering
        </Link>
      </div>
      <div className="text-center mb-4 px-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">Engineering — 3D Explorer</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Explore engineering universities around the world. Click a pin to learn more.
        </p>
      </div>
      <Globe />
    </div>
  );
}
