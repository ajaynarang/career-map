import { notFound } from "next/navigation";
import { getAllCareerSlugs, getCareerMeta, getActionPlan } from "@/lib/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MDXContent } from "@/components/MDXContent";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ career: string }> }): Promise<Metadata> {
  const { career: careerSlug } = await params;
  const careerData = getCareerMeta(careerSlug);
  if (!careerData) return {};
  return {
    title: `${careerData.data.title} Action Plan — Career Compass`,
    description: `Step-by-step preparation roadmap for ${careerData.data.title.toLowerCase()} from Class 9 to 12.`,
  };
}

export async function generateStaticParams() {
  return getAllCareerSlugs().map((career) => ({ career }));
}

export default async function ActionPlanPage({
  params,
}: {
  params: Promise<{ career: string }>;
}) {
  const { career: careerSlug } = await params;

  const careerData = getCareerMeta(careerSlug);
  const planData = getActionPlan(careerSlug);
  if (!careerData || !planData) notFound();

  const { data: career } = careerData;
  const { data: plan, content } = planData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: career.title, href: `/${careerSlug}` },
        { label: "Action Plan" },
      ]} />

      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        {plan.title || `${career.title} — Action Plan`}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">
        Step-by-step preparation roadmap from Class 9 to Class 12
      </p>

      <MDXContent source={content} />
    </div>
  );
}
