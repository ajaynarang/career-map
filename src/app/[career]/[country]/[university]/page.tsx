import { notFound } from "next/navigation";
import { generateAllUniversityParams, getCareerMeta, getUniversity } from "@/lib/content";
import { CAREER_THEMES, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { UniSidebar } from "@/components/UniSidebar";
import { MDXContent } from "@/components/MDXContent";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ career: string; country: string; university: string }> }): Promise<Metadata> {
  const { career: careerSlug, country: countrySlug, university: uniSlug } = await params;
  const uniData = getUniversity(careerSlug, countrySlug, uniSlug);
  if (!uniData) return {};
  return {
    title: `${uniData.data.name} — Career Compass`,
    description: `${uniData.data.name} in ${uniData.data.location}. Fees: ${uniData.data.fees.inr}. ${uniData.data.ranking}. Admission guide for PCM students.`,
  };
}

export async function generateStaticParams() {
  return generateAllUniversityParams();
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ career: string; country: string; university: string }>;
}) {
  const { career: careerSlug, country: countrySlug, university: uniSlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const uniData = getUniversity(careerSlug, countrySlug, uniSlug);
  if (!careerData || !uniData) notFound();

  const { data: career } = careerData;
  const { data: uni, content } = uniData;
  const theme = CAREER_THEMES[careerSlug];
  const accentColor = theme?.color || "#3B82F6";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: COUNTRY_LABELS[countrySlug] || countrySlug, href: `/${careerSlug}/${countrySlug}` },
        { label: uni.name },
      ]} />

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">{uni.name}</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">{uni.location} &middot; {uni.ranking}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <MDXContent source={content} />
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <UniSidebar uni={uni} accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
}
