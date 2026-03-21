import {
  getAllCareerMetas,
  getAllCareerSlugs,
  getCountrySlugs,
  getCountryOverview,
  getAllUniversityMetas,
} from "@/lib/content";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { MindMapExplorerWrapper } from "@/components/MindMapExplorerWrapper";

export default function Home() {
  const careers = getAllCareerMetas().map((c) => ({
    slug: c.data.slug,
    title: c.data.title,
    description: c.data.description,
    whyChoose: c.data.whyChoose,
  }));

  const countriesByCareer: Record<string, { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }[]> = {};
  const unisByCareerCountry: Record<string, { slug: string; name: string; location: string; ranking: string; feesInr: string; salary: string; acceptance: string; programs: string[]; recruiters: string[]; scholarships: string[]; website: string; applyLink: string }[]> = {};

  for (const careerSlug of getAllCareerSlugs()) {
    const countrySlugs = getCountrySlugs(careerSlug);
    countriesByCareer[careerSlug] = countrySlugs
      .map((slug) => {
        const data = getCountryOverview(careerSlug, slug);
        if (!data) return null;
        return {
          slug,
          label: COUNTRY_LABELS[slug] || slug,
          flag: COUNTRY_FLAGS[slug] || "",
          budget: { totalInr: data.data.budget.totalInr },
          language: data.data.language,
          postStudyVisa: data.data.postStudyVisa,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    for (const countrySlug of countrySlugs) {
      const unis = getAllUniversityMetas(careerSlug, countrySlug);
      unisByCareerCountry[`${careerSlug}/${countrySlug}`] = unis.map((u) => ({
        slug: u.data.slug,
        name: u.data.name,
        location: u.data.location,
        ranking: u.data.ranking,
        feesInr: u.data.fees.inr,
        salary: u.data.placements.average,
        acceptance: u.data.acceptance,
        programs: u.data.programs || [],
        recruiters: u.data.topRecruiters || [],
        scholarships: u.data.scholarships || [],
        website: u.data.website || "",
        applyLink: u.data.applyLink || "",
      }));
    }
  }

  return (
    <div
      className="w-full"
      style={{
        height: "calc(100vh - 56px)",
        background: "linear-gradient(180deg, #08090c 0%, #0d0f14 50%, #08090c 100%)",
      }}
    >
      {/* Title overlay */}
      <div className="absolute top-16 left-0 right-0 z-10 text-center pointer-events-none pt-4">
        <p className="text-[10px] font-mono text-zinc-600 tracking-[4px] uppercase mb-1">
          Career guidance system
        </p>
        <h1 className="text-2xl font-bold text-white/90 mb-1">
          PCM Career Map
        </h1>
        <p className="text-xs text-zinc-500">
          Click a career to explore → countries → universities
        </p>
      </div>

      <MindMapExplorerWrapper
        careers={careers}
        countriesByCareer={countriesByCareer}
        unisByCareerCountry={unisByCareerCountry}
      />
    </div>
  );
}
