"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { ExamMeta } from "@/lib/types";

interface ExamCardProps {
  exam: ExamMeta;
  accentColor: string;
}

export function ExamCard({ exam, accentColor }: ExamCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-[var(--muted)]/50 transition-colors"
      >
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{exam.name}</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{exam.when}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-[var(--muted-foreground)] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-[var(--border)] p-4 animate-fade-up">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Registration</div>
              <div className="text-xs text-[var(--foreground)]">{exam.registration.fee}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Deadline: {exam.registration.deadline}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]">
              <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Format</div>
              <div className="text-xs text-[var(--foreground)]">{exam.format.questions} Qs, {exam.format.marks} marks</div>
              <div className="text-xs text-[var(--muted-foreground)]">{exam.format.duration}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Eligibility</div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">{exam.eligibility}</p>
          </div>

          <div className="mb-3">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Syllabus</div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed">{exam.syllabus}</p>
          </div>

          {exam.registration.website && (
            <a
              href={exam.registration.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium no-underline transition-colors"
              style={{ color: accentColor }}
            >
              Register now
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
