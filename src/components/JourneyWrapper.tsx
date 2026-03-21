"use client";

import { Journey } from "./Journey";

interface Props {
  careers: { slug: string; title: string; description: string; whyChoose: string }[];
  countriesByCareer: Record<string, { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }[]>;
  examsByCareerCountry: Record<string, { slug: string; name: string; when: string; fee: string; eligibility: string; format: string; website: string }[]>;
  unisByCareerCountry: Record<string, { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }[]>;
}

export function JourneyWrapper({ careers, countriesByCareer, examsByCareerCountry, unisByCareerCountry }: Props) {
  return (
    <Journey
      careers={careers}
      getCountries={(slug) => countriesByCareer[slug] || []}
      getExams={(careerSlug, countrySlug) => examsByCareerCountry[`${careerSlug}/${countrySlug}`] || []}
      getUnis={(careerSlug, countrySlug) => unisByCareerCountry[`${careerSlug}/${countrySlug}`] || []}
    />
  );
}
