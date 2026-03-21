import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { UniversityMeta } from "@/lib/types";

interface UniCardProps {
  uni: UniversityMeta;
  href: string;
  accentColor: string;
}

export function UniCard({ uni, href, accentColor }: UniCardProps) {
  return (
    <Link
      href={href}
      className="group block p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all no-underline"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{uni.name}</h3>
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mb-2">
            <MapPin size={12} />
            {uni.location} · {uni.ranking}
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: accentColor + "15", color: accentColor }}
            >
              {uni.fees.inr}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
              {uni.acceptance}
            </span>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-1 flex-shrink-0 ml-3"
        />
      </div>
    </Link>
  );
}
