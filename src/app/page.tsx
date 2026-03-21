import { getAllCareerMetas } from "@/lib/content";
import { CareerCard } from "@/components/CareerCard";

export default function Home() {
  const careers = getAllCareerMetas();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-[3px] uppercase mb-3">
          Career guidance system
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
          PCM Career Map
        </h1>
        <p className="text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Your complete guide from Class 10 to career. Choose a path, explore countries, and plan your future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careers.map((career) => (
          <CareerCard
            key={career.data.slug}
            slug={career.data.slug}
            title={career.data.title}
            description={career.data.description}
          />
        ))}
      </div>
    </div>
  );
}
