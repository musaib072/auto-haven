/**
 * Email delivery for every enquiry form on the site.
 *
 * Delivery is handled by EmailJS (https://www.emailjs.com) using the two
 * templates already configured for this project:
 *
 *   - BOOKING template  → Car Spa and Inspectify bookings (has date + time slot)
 *   - CONTACT template  → Contact, Buy-a-car and Sell-your-car enquiries
 *
 * No template changes are required: new forms reuse the existing template
 * variables and put the extra fields into `message` / `notes`.
 *
 * Every submission is also recorded in the Supabase `enquiries` table (when the
 * migration has been applied) so a lead is never lost if an email bounces.
 */
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { site } from "@/config/site";

const env = import.meta.env;

const EMAILJS_PUBLIC_KEY = (env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim() || "";
const EMAILJS_SERVICE_ID = (env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim() || "service_autoflexxii";
const EMAILJS_BOOKING_TEMPLATE_ID =
  (env.VITE_EMAILJS_BOOKING_TEMPLATE_ID as string | undefined)?.trim() || "template_booking";
const EMAILJS_CONTACT_TEMPLATE_ID =
  (env.VITE_EMAILJS_CONTACT_TEMPLATE_ID as string | undefined)?.trim() || "template_contact";
const RECIPIENT = (env.VITE_ENQUIRY_RECIPIENT as string | undefined)?.trim() || site.email;

export const isEmailConfigured = EMAILJS_PUBLIC_KEY.length > 0;

if (isEmailConfigured) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    // Drop submissions from headless browsers (most form-spam bots).
    blockHeadless: true,
    // EmailJS-side throttle: one email per 8s per browser.
    limitRate: { id: "autoflexii-forms", throttle: 8000 },
  });
} else if (env.DEV) {
  console.warn(
    "[email] VITE_EMAILJS_PUBLIC_KEY is not set — form submissions will NOT be emailed. See EMAIL_SETUP.md.",
  );
}

export type EnquiryKind = "buy" | "sell" | "car-spa" | "inspection" | "contact";

const KIND_LABEL: Record<EnquiryKind, string> = {
  buy: "Buy a Car",
  sell: "Sell Your Car",
  "car-spa": "Car Spa Booking",
  inspection: "Inspectify Booking",
  contact: "Contact Form",
};

const KIND_CODE: Record<EnquiryKind, string> = {
  buy: "BUY",
  sell: "SEL",
  "car-spa": "SPA",
  inspection: "INS",
  contact: "CON",
};

export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly recorded: boolean,
  ) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

/** Human-friendly reference shown to the customer and used in the email subject. */
export function createReference(kind: EnquiryKind, now = new Date()): string {
  const d = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AFX-${KIND_CODE[kind]}-${d}-${rand}`;
}

export type Detail = [label: string, value: string | number | undefined | null];

/** Formats label/value pairs as readable plain text for the email body. */
export function formatDetails(details: Detail[]): string {
  return details
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v).trim()}`)
    .join("\n");
}

const clean = (v: string | undefined | null, max = 2000) => (v ?? "").toString().trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** HTML version of a plain-text body (for templates that use {{{message_html}}}). */
const toHtml = (text: string) => escapeHtml(text).replace(/\n/g, "<br>");

function describeEmailJsError(err: unknown): string {
  if (err instanceof EmailJSResponseStatus) return `EmailJS ${err.status}: ${err.text}`;
  if (err instanceof Error) return err.message;
  return String(err);
}

async function recordEnquiry(row: {
  reference: string;
  kind: EnquiryKind;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  details: Record<string, string>;
  photoUrls?: string[];
  emailStatus: "sent" | "failed" | "not_configured";
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from("enquiries").insert({
      reference: row.reference,
      kind: row.kind,
      name: row.name,
      phone: row.phone,
      email: row.email || null,
      subject: row.subject,
      details: row.details,
      photo_urls: row.photoUrls?.length ? row.photoUrls : null,
      email_status: row.emailStatus,
    });
    if (error) {
      // Table not migrated yet, or RLS rejected the row — email is still the primary channel.
      if (env.DEV) console.warn("[enquiries] not recorded:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

interface BaseEnquiry {
  kind: EnquiryKind;
  name: string;
  phone: string;
  email?: string;
  /** Extra label/value pairs specific to the form. */
  details: Detail[];
  message?: string;
  photoUrls?: string[];
  /** Pre-generated reference (e.g. when photos were uploaded under it first). */
  reference?: string;
}

export interface BookingEnquiry extends BaseEnquiry {
  kind: "car-spa" | "inspection";
  serviceName: string;
  date: string;
  time: string;
  vehicle: string;
}

export interface GeneralEnquiry extends BaseEnquiry {
  kind: "buy" | "sell" | "contact";
  subject: string;
}

export type Enquiry = BookingEnquiry | GeneralEnquiry;

const isBooking = (e: Enquiry): e is BookingEnquiry => e.kind === "car-spa" || e.kind === "inspection";

export interface EnquiryResult {
  reference: string;
  emailed: boolean;
  recorded: boolean;
}

/**
 * Sends an enquiry email and records it. Resolves when at least one channel
 * (email or database) captured the lead; otherwise throws EmailDeliveryError.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<EnquiryResult> {
  const reference = enquiry.reference || createReference(enquiry.kind);
  const name = clean(enquiry.name, 80);
  const phone = clean(enquiry.phone, 20);
  const email = clean(enquiry.email, 120);
  const kindLabel = KIND_LABEL[enquiry.kind];

  const photoLines = enquiry.photoUrls?.length
    ? `\n\nPhotos (${enquiry.photoUrls.length}):\n${enquiry.photoUrls.join("\n")}`
    : "";
  const detailText = formatDetails(enquiry.details);
  const freeText = clean(enquiry.message, 4000);
  const body = [`Reference: ${reference}`, `Type: ${kindLabel}`, detailText, freeText && `Message:\n${freeText}`]
    .filter(Boolean)
    .join("\n\n") + photoLines;

  let templateId: string;
  let params: Record<string, string>;
  let subject: string;

  if (isBooking(enquiry)) {
    subject = `${kindLabel} – ${enquiry.serviceName} [${reference}]`;
    templateId = EMAILJS_BOOKING_TEMPLATE_ID;
    params = {
      to_email: RECIPIENT,
      reply_to: email || RECIPIENT,
      reference,
      subject,
      customer_name: name,
      customer_email: email || "Not provided",
      customer_phone: phone,
      service_name: `${enquiry.serviceName} (${kindLabel})`,
      booking_date: clean(enquiry.date, 60),
      booking_time: clean(enquiry.time, 30),
      vehicle_info: clean(enquiry.vehicle, 200),
      notes: body,
      notes_html: toHtml(body),
    };
  } else {
    subject = `${kindLabel} – ${clean(enquiry.subject, 120)} [${reference}]`;
    templateId = EMAILJS_CONTACT_TEMPLATE_ID;
    params = {
      to_email: RECIPIENT,
      reply_to: email || RECIPIENT,
      reference,
      from_name: name,
      from_email: email || "Not provided",
      phone,
      subject,
      message: body,
      message_html: toHtml(body),
    };
  }

  let emailStatus: "sent" | "failed" | "not_configured" = "not_configured";
  let emailError = "EmailJS public key missing";

  if (isEmailConfigured) {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
      emailStatus = "sent";
    } catch (err) {
      emailStatus = "failed";
      emailError = describeEmailJsError(err);
      console.error(`[email] ${kindLabel} failed (${reference}):`, emailError);
    }
  }

  const detailRecord = Object.fromEntries(
    enquiry.details
      .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
      .map(([k, v]) => [k, String(v)]),
  );
  if (freeText) detailRecord.Message = freeText;

  const recorded = await recordEnquiry({
    reference,
    kind: enquiry.kind,
    name,
    phone,
    email,
    subject,
    details: detailRecord,
    photoUrls: enquiry.photoUrls,
    emailStatus,
  });

  if (emailStatus === "sent" || recorded) {
    return { reference, emailed: emailStatus === "sent", recorded };
  }

  throw new EmailDeliveryError(
    emailError,
    "We couldn't send your request right now. Please call or WhatsApp us and we'll help you immediately.",
    recorded,
  );
}
