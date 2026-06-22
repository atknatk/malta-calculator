import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Lead capture endpoint. Disabled unless NEXT_PUBLIC_LEADGEN_ENABLED=true.
 * Inserts via the service-role admin client (RLS-protected table).
 */

const schema = z.object({
  purpose: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  consent: z.literal(true),
  sourcePage: z.string().max(300).optional(),
  // Honeypot: real users leave this empty; bots tend to fill it.
  company: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_LEADGEN_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Lead capture is not enabled" },
      { status: 404 },
    );
  }

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Honeypot tripped — silently accept without storing.
  if (data.company) return NextResponse.json({ ok: true });

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").insert({
      purpose: data.purpose,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      consent: data.consent,
      source_page: data.sourcePage || null,
    });
    if (error) throw error;
  } catch (e) {
    console.error("Lead insert failed:", e);
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
