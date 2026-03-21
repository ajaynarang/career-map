import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllCareerSlugs, getCareerMeta, getCountrySlugs, getCountryOverview } from "@/lib/content";
import { CAREER_THEMES, COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CountryCompare } from "@/components/CountryCompare";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ career: string }> }): Promise<Metadata> {
  const { career: careerSlug } = await params;
  const careerData = getCareerMeta(careerSlug);
  if (!careerData) return {};
  return {
    title: `${careerData.data.title} — PCM Career Map`,
    description: careerData.data.description,
  };
}

export async function generateStaticParams() {
  return getAllCareerSlugs().map((career) => ({ career }));
}

export default async function CareerPage({ params }: { params: Promise<{ career: string }> }) {
  const { career: careerSlug } = await params;
  const careerData = getCareerMeta(careerSlug);
  if (!careerData) notFound();

  const { data: career } = careerData;
  const theme = CAREER_THEMES[careerSlug];
  const countrySlugs = getCountrySlugs(careerSlug);

  const overviews = countrySlugs
    .map((slug) => {
      const overview = getCountryOverview(careerSlug, slug);
      return overview ? { slug, data: overview.data } : null;
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title },
      ]} />

      {/* Hero */}
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{career.title}</h1>
          <p className="text-base text-[var(--muted-foreground)] leading-relaxed mb-4">{career.description}</p>
          <div
            className="text-sm p-4 rounded-xl leading-relaxed"
            style={{
              backgroundColor: (theme?.color || "#3B82F6") + "10",
              border: `1px solid ${theme?.color || "#3B82F6"}25`,
              color: "var(--foreground)",
            }}
          >
            <strong>Why choose this path?</strong> {career.whyChoose}
          </div>
        </div>
      </ScrollReveal>

      {/* Country Pills */}
      <ScrollReveal delay={0.1}>
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Choose a country
          </h2>
          <StaggerContainer className="flex flex-wrap gap-2">
            {countrySlugs.map((slug) => (
              <StaggerItem key={slug}>
                <Link
                  href={`/${careerSlug}/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted-foreground)] hover:scale-105 transition-all no-underline"
                >
                  {COUNTRY_FLAGS[slug]} {COUNTRY_LABELS[slug]}
                  <ArrowRight size={14} className="text-[var(--muted-foreground)]" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ScrollReveal>

      {/* Comparison Table */}
      {overviews.length > 1 && (
        <ScrollReveal delay={0.2}>
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
              Compare at a glance
            </h2>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
              <CountryCompare careerSlug={careerSlug} overviews={overviews} />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 3D Explorer link (engineering only) */}
      {careerSlug === "engineering" && (
        <ScrollReveal delay={0.25}>
          <Link
            href="/explore/engineering"
            className="group flex items-center justify-between p-5 mb-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors no-underline"
          >
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">3D Globe Explorer</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Explore engineering universities on an interactive 3D globe</p>
            </div>
            <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      )}

      {/* Action Plan */}
      <ScrollReveal delay={0.3}>
        <Link
          href={`/${careerSlug}/action-plan`}
          className="group flex items-center justify-between p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-colors no-underline"
        >
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">Action Plan</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Step-by-step preparation roadmap from Class 9 to 12</p>
          </div>
          <ArrowRight size={18} className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
        </Link>
      </ScrollReveal>
    </div>
  );
}
