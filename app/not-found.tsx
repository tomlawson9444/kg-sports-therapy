import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center gap-8 text-center">
      <LogoBadge size="sm" />
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
          Page not found
        </h1>
        <p className="mx-auto max-w-md font-accent text-lg italic text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-cream hover:bg-ink-muted"
      >
        Back to Home
      </Link>
    </Section>
  );
}
