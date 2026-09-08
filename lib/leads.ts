import { supabase } from "@/lib/supabaseClient";
import type { LeadFormInput } from "@/lib/validateLead";

export async function submitLead(input: LeadFormInput): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    service_interest: input.serviceInterest || null,
    message: input.message.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
