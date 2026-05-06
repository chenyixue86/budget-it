import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { naam, email, bericht, token } = await req.json();

  if (!bericht?.trim()) {
    return NextResponse.json({ error: "Bericht is verplicht." }, { status: 400 });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (secretKey) {
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const result = await verify.json();
    if (!result.success || result.score < 0.5) {
      return NextResponse.json({ error: "Bot verificatie mislukt." }, { status: 403 });
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("bug_reports").insert({
    naam: naam?.trim() || null,
    email: email?.trim() || null,
    bericht: bericht.trim(),
  });

  if (error) {
    return NextResponse.json({ error: "Opslaan mislukt." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
