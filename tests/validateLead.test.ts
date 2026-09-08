import { describe, expect, it } from "vitest";
import { validateLead } from "@/lib/validateLead";

const VALID_INPUT = {
  name: "Jamie Smith",
  email: "jamie@example.com",
  phone: "07123 456789",
  serviceInterest: "Sports Massage",
  message: "Looking to book in for next week.",
};

describe("validateLead", () => {
  it("returns no errors for valid input", () => {
    expect(validateLead(VALID_INPUT)).toEqual({});
  });

  it("requires a name", () => {
    const errors = validateLead({ ...VALID_INPUT, name: "  " });
    expect(errors.name).toBe("Please enter your name.");
  });

  it("requires an email", () => {
    const errors = validateLead({ ...VALID_INPUT, email: "" });
    expect(errors.email).toBe("Please enter your email address.");
  });

  it("rejects a malformed email", () => {
    const errors = validateLead({ ...VALID_INPUT, email: "not-an-email" });
    expect(errors.email).toBe("Please enter a valid email address.");
  });

  it("requires a phone number", () => {
    const errors = validateLead({ ...VALID_INPUT, phone: "" });
    expect(errors.phone).toBe("Please enter your phone number.");
  });

  it("rejects a malformed phone number", () => {
    const errors = validateLead({ ...VALID_INPUT, phone: "abc" });
    expect(errors.phone).toBe("Please enter a valid phone number.");
  });
});
