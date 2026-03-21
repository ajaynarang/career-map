import Link from "next/link";
import { ArrowRight, Cpu, Atom, TrendingUp, Building2, Shield, Palette, Ship, Plane } from "lucide-react";
import { CAREER_THEMES } from "@/lib/themes";

const CAREER_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  engineering: Cpu,
  science: Atom,
  finance: TrendingUp,
  architecture: Building2,
  defence: Shield,
  design: Palette,
  "merchant-navy": Ship,
  aviation: Plane,
};

interface CareerCardProps {
  slug: string;
  title: string;
  description: string;
}

export function CareerCard({ slug, title, description }: CareerCardProps) {
  const theme = CAREER_THEMES[slug];
  const Icon = CAREER_ICONS[slug] || Cpu;

  return (
    <Link
      href={`/${slug}`}
      className="group block p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all duration-200 no-underline"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: (theme?.color || "#3B82F6") + "15" }}
        >
          <Icon size={20} style={{ color: theme?.color || "#3B82F6" }} />
        </div>
        <ArrowRight
          size={16}
          className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform mt-1"
        />
      </div>
      <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">{title}</h2>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </Link>
  );
}
