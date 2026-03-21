import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-[var(--foreground)] mb-4">404</h1>
      <p className="text-lg text-[var(--muted-foreground)] mb-8">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-semibold no-underline hover:opacity-90 transition-opacity"
      >
        Back to Career Map
      </Link>
    </div>
  );
}
