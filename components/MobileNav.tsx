"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/components/navLinks";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label="Toggle navigation menu"
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-6 bg-ink" />
        <span className="h-0.5 w-6 bg-ink" />
        <span className="h-0.5 w-6 bg-ink" />
      </button>
      {isOpen ? (
        <nav
          id="mobile-nav-menu"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-line bg-cream px-6 py-4"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-2 font-body text-sm font-semibold uppercase tracking-[0.15em] text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
