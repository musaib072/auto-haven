// OPTIONAL server-side email sender (Supabase Edge Function + Resend).
//
// The website sends emails through EmailJS from the browser (see
// src/lib/emailService.ts) and does NOT call this function. It is kept as an
// alternative if you later move email delivery server-side.
//
// Required secrets:  supabase secrets set RESEND_API_KEY=... RESEND_FROM="AUTOFLEXII <noreply@yourdomain.com>"
// Optional:          ENQUIRY_RECIPIENT, ALLOWED_ORIGIN (e.g. https://autoflexii.com)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("RESEND_FROM") ?? "AUTOFLEXII <onboarding@resend.dev>";
const TO = Deno.env.get("ENQUIRY_RECIPIENT") ?? "Autoflexiiii@gmail.com";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

interface BookingDetails {
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  carInfo: string;
  notes?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const esc = (v: unknown) =>
  String(v ?? "")
    .slice(0, 2000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const row = (label: string, value: unknown) =>
  `<tr><td style="padding:8px 12px;color:#9a8f7a;width:140px;border-bottom:1px solid #2a2620">${label}</td><td style="padding:8px 12px;color:#f2ede4;border-bottom:1px solid #2a2620">${esc(value)}</td></tr>`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);
  if (!RESEND_API_KEY) return json({ success: false, error: "RESEND_API_KEY is not configured" }, 500);

  try {
    const b = (await req.json()) as BookingDetails;
    if (!b?.name || !b?.phone || !b?.serviceName) return json({ success: false, error: "Missing required fields" }, 400);

    const html = `<!doctype html><html><body style="margin:0;background:#0a0a0b;font-family:Arial,sans-serif">
      <div style="max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#c9a467;font-size:20px;letter-spacing:2px">AUTOFLEXII — New Booking</h1>
        <table style="width:100%;border-collapse:collapse;background:#111113;border:1px solid #3a3122">
          ${row("Service", b.serviceName)}${row("Date", b.date)}${row("Time", b.time)}
          ${row("Name", b.name)}${row("Phone", b.phone)}${row("Email", b.email || "Not provided")}
          ${row("Vehicle", b.carInfo)}${b.notes ? row("Notes", b.notes) : ""}
        </table>
      </div></body></html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        subject: `New Service Booking - ${String(b.serviceName).slice(0, 120)}`,
        html,
        ...(b.email ? { reply_to: b.email } : {}),
      }),
    });

    if (!response.ok) throw new Error(`Resend API error: ${await response.text()}`);
    const data = await response.json();
    return json({ success: true, emailId: data.id });
  } catch (error) {
    console.error("Error sending email:", error);
    return json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
