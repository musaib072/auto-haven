import { SiteLayout } from "@/components/layout/SiteLayout";
import { site } from "@/config/site";

const updated = "October 2026";

const privacy = [
  {
    h: "Information we collect",
    p: "When you submit a form on this website we collect the details you provide — such as your name, mobile number, email address, vehicle details, location and any photos you upload — so that we can respond to your request.",
  },
  {
    h: "How we use it",
    p: "We use your information only to contact you about your enquiry or booking, to provide the services you request (buying, selling, inspection, car spa, insurance assistance) and to keep records of our communication. We do not sell your personal information.",
  },
  {
    h: "Service providers",
    p: "Form submissions are delivered to our team by email through EmailJS and may be stored securely with Supabase (our database and file-storage provider). These providers process data on our behalf.",
  },
  {
    h: "Retention",
    p: "We keep enquiry records for as long as needed to provide our services and meet legal obligations. You may ask us to delete your information at any time.",
  },
  {
    h: "Your choices",
    p: `To access, correct or delete your information, contact us at ${site.email} or call +91 ${site.phones[0]}.`,
  },
];

const terms = [
  {
    h: "Use of this website",
    p: "This website provides information about AUTOFLEXII's services and lets you submit enquiries and booking requests. Submitting a form is a request — a booking is confirmed only when our team contacts you.",
  },
  {
    h: "Vehicle listings",
    p: "Vehicle details, prices and availability are provided in good faith and may change without notice. Please verify all details, documents and the vehicle's condition before purchase.",
  },
  {
    h: "Inspections & services",
    p: "Inspectify reports reflect the vehicle's condition at the time of inspection based on non-invasive checks. Car spa and other service pricing is confirmed for your vehicle before work begins.",
  },
  {
    h: "Liability",
    p: "To the extent permitted by law, AUTOFLEXII is not liable for indirect losses arising from the use of this website. Nothing in these terms limits rights you have under applicable consumer law.",
  },
  {
    h: "Contact",
    p: `Questions about these terms? Email ${site.email} or call +91 ${site.phones[0]}. These terms are governed by the laws of India, with courts at ${site.address.locality} having jurisdiction.`,
  },
];

export default function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const sections = isPrivacy ? privacy : terms;
  const title = isPrivacy ? "Privacy Policy" : "Terms & Conditions";
  return (
    <SiteLayout title={title}>
      <article className="container max-w-3xl py-14 md:py-20">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="font-display text-3xl font-bold text-gold-gradient sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-lg font-semibold text-gold-light">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-foreground/80">{s.p}</p>
            </section>
          ))}
        </div>
      </article>
    </SiteLayout>
  );
}
