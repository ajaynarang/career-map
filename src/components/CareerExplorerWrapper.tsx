"use client";

import { CareerExplorer } from "./CareerExplorer";

interface SerializedData {
  careers: { slug: string; title: string; description: string; whyChoose: string }[];
  countriesByCareer: Record<string, { slug: string; label: string; flag: string; overview: string; budget: { tuition: string; living: string; total4yr: string; totalInr: string }; language: string; workWhileStudying: string; postStudyVisa: string }[]>;
  examsByCareerCountry: Record<string, { slug: string; name: string; when: string; fee: string; eligibility: string; format: string; website: string }[]>;
  unisByCareerCountry: Record<string, { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }[]>;
}

export function CareerExplorerWrapper({ data }: { data: SerializedData }) {
  return (
    <CareerExplorer
      careers={data.careers}
      getCountries={(careerSlug) => data.countriesByCareer[careerSlug] || []}
      getExams={(careerSlug, countrySlug) => data.examsByCareerCountry[`${careerSlug}/${countrySlug}`] || []}
      getUnis={(careerSlug, countrySlug) => data.unisByCareerCountry[`${careerSlug}/${countrySlug}`] || []}
    />
  );
}
