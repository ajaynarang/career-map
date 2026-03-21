import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] flex-wrap list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="flex-shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--foreground)] transition-colors no-underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--foreground)] font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
