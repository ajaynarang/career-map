import { ExternalLink } from "lucide-react";
import type { UniversityMeta } from "@/lib/types";

interface UniSidebarProps {
  uni: UniversityMeta;
  accentColor: string;
}

export function UniSidebar({ uni, accentColor }: UniSidebarProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sticky top-20">
      <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">
        Quick facts
      </h3>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Ranking</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.ranking}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Annual fees</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.fees.tuition}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{uni.fees.inr}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Total cost/yr</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.fees.total}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Acceptance</div>
          <div className="text-sm font-medium text-[var(--foreground)]">{uni.acceptance}</div>
        </div>
        <div>
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Avg starting salary</div>
          <div className="text-sm font-medium" style={{ color: accentColor }}>{uni.placements.average}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{uni.placements.inr}</div>
        </div>

        {uni.programs.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Programs</div>
            <div className="flex flex-wrap gap-1">
              {uni.programs.map((p) => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {uni.topRecruiters.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Top recruiters</div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">
              {uni.topRecruiters.join(", ")}
            </p>
          </div>
        )}

        {uni.scholarships.length > 0 && (
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Scholarships</div>
            <ul className="text-xs text-[var(--foreground)] space-y-1 list-none p-0">
              {uni.scholarships.map((s) => (
                <li key={s}>&bull; {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-semibold no-underline transition-colors"
            style={{
              backgroundColor: accentColor + "15",
              border: `1px solid ${accentColor}30`,
              color: accentColor,
            }}
          >
            Visit website <ExternalLink size={12} />
          </a>
        )}
        {uni.applyLink && (
          <a
            href={uni.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-white no-underline transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            Apply now <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
