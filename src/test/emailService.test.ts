import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const insert = vi.fn();

vi.mock("@emailjs/browser", () => {
  class EmailJSResponseStatus {
    constructor(public status = 0, public text = "") {}
  }
  return { default: { init: vi.fn(), send: (...a: unknown[]) => send(...a) }, EmailJSResponseStatus };
});
vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: true,
  supabase: { from: () => ({ insert: (...a: unknown[]) => insert(...a) }) },
}));

async function load(env: Record<string, string>) {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import("@/lib/emailService");
}

beforeEach(() => {
  send.mockReset();
  insert.mockReset();
});

describe("formatDetails / createReference", () => {
  it("drops empty values and formats lines", async () => {
    const { formatDetails } = await load({});
    expect(formatDetails([["A", "1"], ["B", ""], ["C", undefined], ["D", 0]])).toBe("A: 1\nD: 0");
  });
  it("creates readable references", async () => {
    const { createReference } = await load({});
    expect(createReference("car-spa", new Date(2026, 9, 8))).toMatch(/^AFX-SPA-261008-[A-Z0-9]{4}$/);
  });
});

describe("submitEnquiry", () => {
  const booking = {
    kind: "car-spa" as const,
    serviceName: "Complete Car Spa",
    date: "Sunday, 11 October 2026",
    time: "05:00 PM",
    vehicle: "SUV",
    name: "Priya <b>Deshmukh</b>",
    phone: "9527806955",
    details: [["Service address", "Rajapeth <b>Road</b>"]] as [string, string][],
  };

  it("sends bookings with the booking template and escapes HTML", async () => {
    send.mockResolvedValue({ status: 200, text: "OK" });
    insert.mockResolvedValue({ error: null });
    const { submitEnquiry } = await load({
      VITE_EMAILJS_PUBLIC_KEY: "pk",
      VITE_EMAILJS_SERVICE_ID: "svc",
      VITE_EMAILJS_BOOKING_TEMPLATE_ID: "tb",
      VITE_EMAILJS_CONTACT_TEMPLATE_ID: "tc",
    });
    const res = await submitEnquiry(booking);
    expect(res).toMatchObject({ emailed: true, recorded: true });
    const [svc, tpl, params] = send.mock.calls[0];
    expect(svc).toBe("svc");
    expect(tpl).toBe("tb");
    expect(params).toMatchObject({
      to_email: "Autoflexiiii@gmail.com",
      customer_phone: "9527806955",
      booking_time: "05:00 PM",
      vehicle_info: "SUV",
    });
    expect(params.notes).toContain("Service address: Rajapeth");
    expect(params.notes_html).toContain("&lt;b&gt;");
    expect(params.notes_html).not.toContain("<b>");
    expect(insert.mock.calls[0][0]).toMatchObject({ kind: "car-spa", email_status: "sent", reference: res.reference });
  });

  it("uses the contact template for buy/sell/contact", async () => {
    send.mockResolvedValue({ status: 200, text: "OK" });
    insert.mockResolvedValue({ error: null });
    const { submitEnquiry } = await load({ VITE_EMAILJS_PUBLIC_KEY: "pk", VITE_EMAILJS_CONTACT_TEMPLATE_ID: "tc" });
    await submitEnquiry({ kind: "sell", subject: "Verna 2019", name: "Amit", phone: "8956967660", details: [["Year", "2019"]] });
    const [, tpl, params] = send.mock.calls[0];
    expect(tpl).toBe("tc");
    expect(params.subject).toMatch(/^Sell Your Car – Verna 2019 \[AFX-SEL-/);
    expect(params.message).toContain("Year: 2019");
  });

  it("still succeeds when email fails but the enquiry is recorded", async () => {
    send.mockRejectedValue(new Error("network"));
    insert.mockResolvedValue({ error: null });
    const { submitEnquiry } = await load({ VITE_EMAILJS_PUBLIC_KEY: "pk" });
    await expect(submitEnquiry(booking)).resolves.toMatchObject({ emailed: false, recorded: true });
    expect(insert.mock.calls[0][0].email_status).toBe("failed");
  });

  it("throws a friendly error when nothing captured the lead", async () => {
    send.mockRejectedValue(new Error("network"));
    insert.mockResolvedValue({ error: { message: "relation does not exist" } });
    const { submitEnquiry, EmailDeliveryError } = await load({ VITE_EMAILJS_PUBLIC_KEY: "pk" });
    await expect(submitEnquiry(booking)).rejects.toBeInstanceOf(EmailDeliveryError);
  });

  it("does not call EmailJS when the public key is missing", async () => {
    insert.mockResolvedValue({ error: null });
    const { submitEnquiry, isEmailConfigured } = await load({ VITE_EMAILJS_PUBLIC_KEY: "" });
    expect(isEmailConfigured).toBe(false);
    await expect(submitEnquiry(booking)).resolves.toMatchObject({ emailed: false, recorded: true });
    expect(send).not.toHaveBeenCalled();
    expect(insert.mock.calls[0][0].email_status).toBe("not_configured");
  });
});
