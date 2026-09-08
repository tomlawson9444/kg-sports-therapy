export interface LeadFormInput {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
}

export type LeadFormErrors = Partial<Record<"name" | "email" | "phone", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s-]{7,20}$/;

export function validateLead(input: LeadFormInput): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!input.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!input.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!input.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}
