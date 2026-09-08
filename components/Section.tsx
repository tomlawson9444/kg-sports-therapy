import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`mx-auto max-w-5xl px-6 py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}
