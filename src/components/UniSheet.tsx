"use client";

import { University, ThemeColors } from "@/lib/types";
import { InfoCard, Section, TextBlock } from "./ui";

interface UniSheetProps {
  uni: University;
  theme: ThemeColors;
}

export function UniSheet({ uni, theme }: UniSheetProps) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: theme.dim }}>
        University details
      </div>
      <h2 className="text-[22px] font-bold text-white mb-1">{uni.name}</h2>
      <div className="text-xs text-gray-500 mb-1">📍 {uni.location}</div>
      <div className="text-xs mb-5" style={{ color: theme.text }}>🏆 {uni.ranking}</div>

      <div className="flex flex-wrap gap-2 mb-6">
        <InfoCard label="Fees" value={uni.fees} color={theme.text} />
        {uni.pkg && <InfoCard label="Placement / salary" value={uni.pkg} />}
      </div>

      {uni.branches && (
        <Section title="Programs / branches" color={theme.text}>
          <TextBlock>{uni.branches}</TextBlock>
        </Section>
      )}

      <Section title="How to get in" color={theme.text}>
        <div
          className="text-[13px] text-white leading-7 p-3 rounded-lg"
          style={{ background: theme.accent + "12", border: `1px solid ${theme.accent}1a` }}
        >
          🎯 {uni.howToGetIn}
        </div>
      </Section>

      {uni.curriculum && (
        <Section title="Curriculum & structure" color={theme.text}>
          <TextBlock>{uni.curriculum}</TextBlock>
        </Section>
      )}

      {uni.recruiters && (
        <Section title="Top recruiters" color={theme.text}>
          <TextBlock>🏢 {uni.recruiters}</TextBlock>
        </Section>
      )}

      {uni.campus && (
        <Section title="Campus & life" color={theme.text}>
          <TextBlock>🏫 {uni.campus}</TextBlock>
        </Section>
      )}

      {uni.scholarships && (
        <Section title="Scholarships & aid" color={theme.text}>
          <TextBlock>🎓 {uni.scholarships}</TextBlock>
        </Section>
      )}

      {uni.website && (
        <div className="mt-4">
          <a
            href={`https://${uni.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold no-underline transition-colors"
            style={{
              background: theme.accent + "1a",
              border: `1px solid ${theme.accent}33`,
              color: theme.accent,
            }}
          >
            🌐 Visit {uni.website}
          </a>
        </div>
      )}
    </div>
  );
}
