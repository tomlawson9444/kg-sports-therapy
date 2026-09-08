import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { NAV_LINKS } from "@/components/navLinks";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12 text-center">
        <LogoBadge size="sm" />
        <nav className="flex flex-wrap justify-center gap-6">
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
        <div className="flex gap-4 font-body text-sm uppercase tracking-[0.15em] text-ink-muted">
          <span>[Facebook]</span>
          <span>[Instagram]</span>
        </div>
        <p className="font-body text-xs text-ink-muted">
          © {new Date().getFullYear()} KG Sports Therapy. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
