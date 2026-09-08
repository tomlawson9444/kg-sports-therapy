"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/content/services";
import { submitLead } from "@/lib/leads";
import {
  validateLead,
  type LeadFormErrors,
  type LeadFormInput,
} from "@/lib/validateLead";

const INITIAL_INPUT: LeadFormInput = {
  name: "",
  email: "",
  phone: "",
  serviceInterest: "",
  message: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [input, setInput] = useState<LeadFormInput>(INITIAL_INPUT);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (honeypot.trim() !== "") {
      // Likely a bot — pretend it worked without actually submitting anything.
      setStatus("success");
      setInput(INITIAL_INPUT);
      return;
    }

    const validationErrors = validateLead(input);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");

    try {
      await submitLead(input);
      setStatus("success");
      setInput(INITIAL_INPUT);
    } catch (error) {
      console.error("Failed to submit lead:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="font-body text-ink" role="status">
          Thanks for getting in touch — we&apos;ll reply as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-body text-sm font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="companyWebsite">Leave this field empty</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoComplete="name"
          value={input.name}
          onChange={(event) =>
            setInput({ ...input, name: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.name ? (
          <p id="name-error" className="text-sm text-red-700">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          value={input.email}
          onChange={(event) =>
            setInput({ ...input, email: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-red-700">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="phone"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          autoComplete="tel"
          value={input.phone}
          onChange={(event) =>
            setInput({ ...input, phone: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
        {errors.phone ? (
          <p id="phone-error" className="text-sm text-red-700">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="serviceInterest"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Service you&apos;re interested in
        </label>
        <select
          id="serviceInterest"
          value={input.serviceInterest}
          onChange={(event) =>
            setInput({ ...input, serviceInterest: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        >
          <option value="">Not sure yet</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="message"
          className="font-body text-sm font-semibold uppercase tracking-[0.1em]"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={input.message}
          onChange={(event) =>
            setInput({ ...input, message: event.target.value })
          }
          className="border border-line bg-cream px-4 py-2 font-body text-ink"
        />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong sending your message. Please try again or
          call us directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-ink px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.15em] text-cream hover:bg-ink-muted disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
