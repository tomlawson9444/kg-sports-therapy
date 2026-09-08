import type { Metadata } from "next";
import { Section } from "@/components/Section";

const QUALIFICATIONS = [
  "[BSc (Hons) Sports Therapy]",
  "[Sports Massage Therapy Diploma]",
  "[First Aid for Sport]",
  "[Member, Society of Sports Therapists]",
];

export const metadata: Metadata = {
  title: "About — KG Sports Therapy",
  description: "Meet your sports therapist at KG Sports Therapy.",
};

export default function AboutPage() {
  return (
    <Section className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="font-heading text-4xl uppercase tracking-[0.05em]">
          About
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-accent text-lg italic text-ink-muted">
          Move. Recover. Repeat.
        </p>
      </div>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
        <h2 className="font-heading text-xl uppercase tracking-[0.1em]">
          [Therapist Name]
        </h2>
        <p className="font-body text-ink-muted">
          [Add your bio here] A qualified sports therapist working with
          athletes and active people of all levels, from weekend runners to
          semi-professional teams — helping clients recover from injury and
          get back to doing what they love, faster and stronger.
        </p>
        <p className="font-body text-ink-muted">
          Every session is built around one idea: move well, recover
          properly, and repeat — so you can keep doing the sport or activity
          you love, injury-free.
        </p>
        <div>
          <h3 className="font-heading text-sm uppercase tracking-[0.15em]">
            Qualifications
          </h3>
          <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-ink-muted">
            {QUALIFICATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
