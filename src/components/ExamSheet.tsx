"use client";

import { Exam, ThemeColors } from "@/lib/types";
import { InfoCard, Section, TextBlock } from "./ui";

interface ExamSheetProps {
  exam: Exam;
  theme: ThemeColors;
}

export function ExamSheet({ exam, theme }: ExamSheetProps) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: theme.dim }}>
        Entrance exam details
      </div>
      <h2 className="text-[22px] font-bold text-white mb-1">{exam.name}</h2>
      <div className="text-xs mb-5" style={{ color: theme.text }}>📅 {exam.when}</div>

      <div className="flex flex-wrap gap-2 mb-6">
        <InfoCard label="Registration" value={exam.reg} color={theme.text} />
        <InfoCard label="Eligibility" value={exam.elig} />
      </div>

      {exam.format && (
        <Section title="Exam format" color={theme.text}>
          <TextBlock>{exam.format}</TextBlock>
        </Section>
      )}

      {exam.syllabus && (
        <Section title="Syllabus" color={theme.text}>
          <TextBlock>{exam.syllabus}</TextBlock>
        </Section>
      )}

      {exam.tip && (
        <Section title="Strategy & tips" color={theme.text}>
          <div
            className="text-[13px] text-white leading-7 p-3 rounded-lg"
            style={{ background: theme.accent + "12", border: `1px solid ${theme.accent}1a` }}
          >
            💡 {exam.tip}
          </div>
        </Section>
      )}

      {exam.prepStart && (
        <Section title="When to start" color={theme.text}>
          <TextBlock>🎯 {exam.prepStart}</TextBlock>
        </Section>
      )}
    </div>
  );
}
