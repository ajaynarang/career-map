"use client";

import dynamic from "next/dynamic";

const MindMapExplorer = dynamic(
  () => import("./MindMapExplorer").then((mod) => ({ default: mod.MindMapExplorer })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-500">Loading mind map...</p>
        </div>
      </div>
    ),
  }
);

interface Props {
  careers: { slug: string; title: string; description: string; whyChoose: string }[];
  countriesByCareer: Record<string, { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }[]>;
  unisByCareerCountry: Record<string, { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }[]>;
}

export function MindMapExplorerWrapper({ careers, countriesByCareer, unisByCareerCountry }: Props) {
  return (
    <MindMapExplorer
      careers={careers}
      getCountries={(slug) => countriesByCareer[slug] || []}
      getUnis={(careerSlug, countrySlug) => unisByCareerCountry[`${careerSlug}/${countrySlug}`] || []}
    />
  );
}
