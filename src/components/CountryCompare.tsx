import Link from "next/link";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/themes";
import type { CountryOverview } from "@/lib/types";

interface CountryCompareProps {
  careerSlug: string;
  overviews: { slug: string; data: CountryOverview }[];
}

export function CountryCompare({ careerSlug, overviews }: CountryCompareProps) {
  if (overviews.length === 0) return null;

  const rows = [
    { label: "4-year cost", key: "totalInr" as const },
    { label: "Language", key: "language" as const },
    { label: "Work while studying", key: "workWhileStudying" as const },
    { label: "Post-study visa", key: "postStudyVisa" as const },
    { label: "Safety", key: "safety" as const },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">
              <span className="sr-only">Metric</span>
            </th>
            {overviews.map((o) => (
              <th key={o.slug} scope="col" className="text-center p-3 border-b border-[var(--border)]">
                <Link
                  href={`/${careerSlug}/${o.slug}`}
                  className="text-[var(--foreground)] font-semibold no-underline hover:underline"
                >
                  {COUNTRY_FLAGS[o.slug]} {COUNTRY_LABELS[o.slug]}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="p-3 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)] whitespace-nowrap">
                {row.label}
              </td>
              {overviews.map((o) => (
                <td key={o.slug} className="p-3 text-center text-[var(--foreground)] border-b border-[var(--border)] text-xs">
                  {row.key === "totalInr" ? o.data.budget.totalInr : o.data[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
