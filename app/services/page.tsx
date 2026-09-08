import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services — KG Sports Therapy",
  description:
    "Sports massage, injury assessment, and rehabilitation programmes at KG Sports Therapy.",
};

export default function ServicesPage() {
  return (
    <Section className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
          Services
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-lg italic text-ink-muted">
          Treatment plans built around your recovery.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </Section>
  );
}
