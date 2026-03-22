import { notFound } from "next/navigation";
import {
  generateAllCareerCountryParams,
  getCareerMeta,
  getCountryOverview,
  getExamsForCareerCountry,
  getAllUniversityMetas,
} from "@/lib/content";
import { CAREER_THEMES, COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ExamCard } from "@/components/ExamCard";
import { UniCard } from "@/components/UniCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ career: string; country: string }> }): Promise<Metadata> {
  const { career: careerSlug, country: countrySlug } = await params;
  const careerData = getCareerMeta(careerSlug);
  if (!careerData) return {};
  const countryLabel = COUNTRY_LABELS[countrySlug] || countrySlug;
  return {
    title: `${careerData.data.title} in ${countryLabel} — Career Compass`,
    description: `Explore ${careerData.data.title.toLowerCase()} careers in ${countryLabel}. Exams, universities, fees, and admission guidance.`,
  };
}

export async function generateStaticParams() {
  return generateAllCareerCountryParams();
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ career: string; country: string }>;
}) {
  const { career: careerSlug, country: countrySlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const overviewData = getCountryOverview(careerSlug, countrySlug);
  if (!careerData || !overviewData) notFound();

  const { data: career } = careerData;
  const { data: overview } = overviewData;
  const theme = CAREER_THEMES[careerSlug];
  const accentColor = theme?.color || "#3B82F6";

  const exams = getExamsForCareerCountry(careerSlug, countrySlug);
  const universities = getAllUniversityMetas(careerSlug, countrySlug);

  const countryLabel = `${COUNTRY_FLAGS[countrySlug] || ""} ${COUNTRY_LABELS[countrySlug] || countrySlug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: COUNTRY_LABELS[countrySlug] || countrySlug },
      ]} />

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        {career.title} in {countryLabel}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
        {overview.overview}
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 mb-8">
        <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          Budget breakdown
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Tuition/yr</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.tuition}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Living/yr</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.living}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">Total 4 years</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{overview.budget.total4yr}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">In INR</div>
            <div className="text-sm font-bold" style={{ color: accentColor }}>{overview.budget.totalInr}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Language", value: overview.language },
          { label: "Work while studying", value: overview.workWhileStudying },
          { label: "Post-study visa", value: overview.postStudyVisa },
          { label: "Safety", value: overview.safety },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-[var(--muted)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase mb-1">{item.label}</div>
            <div className="text-xs text-[var(--foreground)]">{item.value}</div>
          </div>
        ))}
      </div>

      {exams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Entrance exams
          </h2>
          <div className="flex flex-col gap-3">
            {exams.map((exam) => (
              <ExamCard
                key={exam.data.slug}
                exam={exam.data}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>
      )}

      {universities.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Universities & colleges ({universities.length})
          </h2>
          <div className="flex flex-col gap-3">
            {universities.map((uni) => (
              <UniCard
                key={uni.data.slug}
                uni={uni.data}
                href={`/${careerSlug}/${countrySlug}/${uni.data.slug}`}
                accentColor={accentColor}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
