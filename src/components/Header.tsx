import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-sm font-bold text-[var(--foreground)]">Career Compass</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
