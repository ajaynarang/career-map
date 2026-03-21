import { getAllCareerMetas } from "@/lib/content";
import { CareerCard } from "@/components/CareerCard";
import { MindMapWrapper } from "@/components/MindMapWrapper";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function Home() {
  const careers = getAllCareerMetas();

  const careerData = careers.map((c) => ({
    slug: c.data.slug,
    title: c.data.title,
    description: c.data.description,
  }));

  return (
    <div>
      {/* Hero */}
      <div className="text-center pt-16 pb-8 px-4">
        <ScrollReveal>
          <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-[3px] uppercase mb-3">
            Career guidance system
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            PCM Career Map
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Your complete guide from Class 10 to career. Click a path below to explore.
          </p>
        </ScrollReveal>
      </div>

      {/* Mind Map (desktop) */}
      <div className="hidden md:block px-4 pb-8">
        <ScrollReveal delay={0.3}>
          <MindMapWrapper careers={careerData} />
        </ScrollReveal>
      </div>

      {/* Card Grid (mobile fallback + below mind map on desktop) */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="md:hidden mb-4">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Choose a career path
          </h2>
        </div>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careers.map((career) => (
            <StaggerItem key={career.data.slug}>
              <CareerCard
                slug={career.data.slug}
                title={career.data.title}
                description={career.data.description}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
