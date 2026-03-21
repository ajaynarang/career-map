import {
  getAllCareerMetas,
  getAllCareerSlugs,
  getCountrySlugs,
  getCountryOverview,
  getExamsForCareerCountry,
  getAllUniversityMetas,
} from "@/lib/content";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { JourneyWrapper } from "@/components/JourneyWrapper";

export default function Home() {
  const careers = getAllCareerMetas().map((c) => ({
    slug: c.data.slug,
    title: c.data.title,
    description: c.data.description,
    whyChoose: c.data.whyChoose,
  }));

  const countriesByCareer: Record<string, { slug: string; label: string; flag: string; budget: { totalInr: string }; language: string; postStudyVisa: string }[]> = {};
  const examsByCareerCountry: Record<string, { slug: string; name: string; when: string; fee: string; eligibility: string; format: string; website: string }[]> = {};
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
      const key = `${careerSlug}/${countrySlug}`;
      const exams = getExamsForCareerCountry(careerSlug, countrySlug);
      examsByCareerCountry[key] = exams.map((e) => ({
        slug: e.data.slug,
        name: e.data.name,
        when: e.data.when,
        fee: e.data.registration.fee,
        eligibility: e.data.eligibility,
        format: e.data.format.details || `${e.data.format.questions} Qs, ${e.data.format.marks} marks, ${e.data.format.duration}`,
        website: e.data.registration.website,
      }));

      const unis = getAllUniversityMetas(careerSlug, countrySlug);
      unisByCareerCountry[key] = unis.map((u) => ({
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
    <JourneyWrapper
      careers={careers}
      countriesByCareer={countriesByCareer}
      examsByCareerCountry={examsByCareerCountry}
      unisByCareerCountry={unisByCareerCountry}
    />
  );
}
