import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, Field, Honeypot, SubmitButton } from "@/components/forms/FormKit";
import { ariaFor } from "@/lib/a11y";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { mobileSchema, nameSchema, optionalEmailSchema, optionalText } from "@/lib/validation";
import { site, telHref, whatsappHref } from "@/config/site";

const schema = z.object({
  name: nameSchema,
  mobile: mobileSchema,
  email: optionalEmailSchema,
  subject: optionalText(120),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(4000),
});
type Values = z.input<typeof schema>;

const Contact = () => {
  const { submit, submitting, honeypotRef, markStarted } = useEnquirySubmit("contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: e },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", mobile: "", email: "", subject: "", message: "" } });

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    const res = await submit({
      kind: "contact",
      subject: v.subject || "Website enquiry",
      name: v.name,
      phone: v.mobile,
      email: v.email || undefined,
      message: v.message,
      details: [
        ["Name", v.name],
        ["Mobile", v.mobile],
        ["Email", v.email],
        ["Subject", v.subject],
      ],
    });
    if (res) reset();
  });

  const cards = [
    {
      icon: Phone,
      title: "Call us",
      body: (
        <div className="space-y-1">
          {site.phones.map((p) => (
            <a key={p} href={telHref(p)} className="block hover:text-gold">
              +91 {p}
            </a>
          ))}
        </div>
      ),
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      body: (
        <a href={whatsappHref(`Hi ${site.name}!`)} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
          Chat with us on WhatsApp
        </a>
      ),
    },
    { icon: Mail, title: "Email", body: <a href={`mailto:${site.email}`} className="break-all hover:text-gold">{site.email}</a> },
    {
      icon: Instagram,
      title: "Instagram",
      body: (
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
          {site.instagram.handle}
        </a>
      ),
    },
    { icon: MapPin, title: "Location", body: <span>{site.address.display}</span> },
    { icon: Clock, title: "Hours", body: <span>{site.hours}</span> },
  ];

  return (
    <SiteLayout title="Contact Us" description={`Get in touch with AUTOFLEXII in ${site.address.display}. Call ${site.phones.join(" / ")} or send us a message.`}>
      <PageHero eyebrow="Contact" title="We're here to help" subtitle="Questions about buying, selling, inspections or car spa? Reach out and our team will get back to you shortly." />
      <section className="container grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_1.3fr] lg:py-16">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 content-start">
          {cards.map(({ icon: Icon, title, body }) => (
            <li key={title} className="lux-card flex gap-4 p-5">
              <span className="gold-ring-icon h-10 w-10">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div className="min-w-0 text-sm text-foreground/80">
                <p className="mb-1 font-display text-xs font-semibold uppercase tracking-wide2 text-gold-light">{title}</p>
                {body}
              </div>
            </li>
          ))}
        </ul>

        <FormCard id="contact-form" icon={Send} title="Send us a message" subtitle="Fill in the form and our team will get back to you shortly.">
          <form noValidate onSubmit={onSubmit} onFocusCapture={markStarted} className="relative flex flex-col gap-4">
            <Honeypot ref={honeypotRef} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Your Name" htmlFor="c-name" error={e.name?.message} required>
                <Input id="c-name" placeholder="Full name" autoComplete="name" {...register("name")} {...ariaFor("c-name", e.name?.message)} />
              </Field>
              <Field label="Mobile Number" htmlFor="c-mobile" error={e.mobile?.message} required>
                <Input id="c-mobile" type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" {...register("mobile")} {...ariaFor("c-mobile", e.mobile?.message)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="c-email" error={e.email?.message}>
                <Input id="c-email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} {...ariaFor("c-email", e.email?.message)} />
              </Field>
              <Field label="Subject" htmlFor="c-subject">
                <Input id="c-subject" placeholder="What is this about?" {...register("subject")} />
              </Field>
            </div>
            <Field label="Message" htmlFor="c-message" error={e.message?.message} required>
              <Textarea id="c-message" rows={6} placeholder="Tell us how we can help…" className="resize-y" {...register("message")} {...ariaFor("c-message", e.message?.message)} />
            </Field>
            <SubmitButton submitting={submitting}>Send Message</SubmitButton>
          </form>
        </FormCard>
      </section>
    </SiteLayout>
  );
};

export default Contact;
