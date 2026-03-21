import {
  getAllCareerMetas,
  getAllCareerSlugs,
  getCountrySlugs,
  getCountryOverview,
  getExamsForCareerCountry,
  getAllUniversityMetas,
} from "@/lib/content";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { CareerExplorerWrapper } from "@/components/CareerExplorerWrapper";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  const careers = getAllCareerMetas().map((c) => ({
    slug: c.data.slug,
    title: c.data.title,
    description: c.data.description,
    whyChoose: c.data.whyChoose,
  }));

  // Pre-load all countries for each career
  const countriesByCareer: Record<string, { slug: string; label: string; flag: string; overview: string; budget: { tuition: string; living: string; total4yr: string; totalInr: string }; language: string; workWhileStudying: string; postStudyVisa: string }[]> = {};

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
          overview: data.data.overview,
          budget: data.data.budget,
          language: data.data.language,
          workWhileStudying: data.data.workWhileStudying,
          postStudyVisa: data.data.postStudyVisa,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    for (const countrySlug of countrySlugs) {
      const key = `${careerSlug}/${countrySlug}`;

      // Exams
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

      // Universities
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

  const data = { careers, countriesByCareer, examsByCareerCountry, unisByCareerCountry };

  return (
    <div>
      {/* Hero */}
      <div className="text-center pt-12 pb-8 px-4">
        <ScrollReveal>
          <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-[3px] uppercase mb-3">
            Career guidance system
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-3">
            PCM Career Map
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
            Your complete guide from Class 10 to career. Explore step by step.
          </p>
        </ScrollReveal>
      </div>

      {/* Interactive Explorer */}
      <div className="pb-16">
        <CareerExplorerWrapper data={data} />
      </div>
    </div>
  );
}
