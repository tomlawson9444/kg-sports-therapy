import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Contact — KG Sports Therapy",
  description:
    "Get in touch with KG Sports Therapy to book an appointment or ask a question.",
};

export default function ContactPage() {
  return (
    <Section className="grid gap-12 sm:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
            Contact
          </h1>
          <p className="mt-4 font-accent text-lg italic text-ink-muted">
            Get in touch to book your appointment.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-body text-sm text-ink-muted">
          <p>[Clinic Address], [Town], [Postcode]</p>
          <p>Phone: [01234 567890]</p>
          <p>Email: [hello@kgsportstherapy.co.uk]</p>
          <p>Mon–Fri: 09:00–18:00 · Sat: 09:00–13:00</p>
        </div>
      </div>
      <ContactForm />
    </Section>
  );
}
