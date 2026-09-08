import type { Service } from "@/content/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="flex flex-col gap-3 border border-line p-6">
      <h3 className="font-heading text-lg uppercase tracking-[0.05em]">
        {service.name}
      </h3>
      <p className="font-body text-sm text-ink-muted">
        {service.description}
      </p>
      <p className="font-body text-sm font-semibold uppercase tracking-[0.1em]">
        {service.price} · {service.duration}
      </p>
    </div>
  );
}
