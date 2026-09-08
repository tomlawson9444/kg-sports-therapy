import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { MobileNav } from "@/components/MobileNav";
import { NAV_LINKS } from "@/components/navLinks";

export function Header() {
  return (
    <header className="relative z-50 border-b border-line bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoBadge size="sm" />
          <span className="font-heading text-sm uppercase tracking-[0.2em]">
            KG Sports Therapy
          </span>
        </Link>
        <nav className="hidden gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink hover:text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
