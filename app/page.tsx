import Link from "next/link";
import { LogoBadge } from "@/components/LogoBadge";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/content/services";

const VALUE_PROPS = [
  {
    title: "Sports-specific expertise",
    body: "Treatment built around the demands of your sport, not a generic routine.",
  },
  {
    title: "Hands-on rehabilitation",
    body: "A clear, structured plan to get you from injury back to full training.",
  },
  {
    title: "Flexible appointments",
    body: "Evening and weekend slots to fit around training and match schedules.",
  },
];

export default function HomePage() {
  return (
    <>
      <Section className="flex flex-col items-center gap-8 text-center">
        <LogoBadge size="lg" />
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl uppercase leading-tight sm:text-5xl">
            Move. Recover. Repeat.
          </h1>
          <p className="mx-auto max-w-xl font-accent text-lg italic text-ink-muted">
            Sports therapy built around getting you back to what you love.
          </p>
        </div>
        <Link
          href="/contact/"
          className="rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-cream hover:bg-ink-muted"
        >
          Get in Touch
        </Link>
      </Section>

      <Section className="grid gap-10 border-t border-line sm:grid-cols-3">
        {VALUE_PROPS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 text-center sm:text-left"
          >
            <h2 className="font-heading text-sm uppercase tracking-[0.15em]">
              {item.title}
            </h2>
            <p className="font-body text-sm text-ink-muted">{item.body}</p>
          </div>
        ))}
      </Section>

      <Section className="border-t border-line">
        <h2 className="mb-10 text-center font-heading text-2xl uppercase tracking-[0.1em]">
          Services
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services/"
            className="font-body text-sm font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
          >
            View all services
          </Link>
        </div>
      </Section>
    </>
  );
}
