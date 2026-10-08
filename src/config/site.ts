/**
 * Single source of truth for business details shown across the site
 * (header, footer, contact page, SEO structured data, emails).
 */
export const site = {
  name: "AUTOFLEXII",
  tagline: "Perfection Delivered.",
  description:
    "Buy, sell, inspect and care for your car with AUTOFLEXII — trusted pre-owned car transactions, 299+ point Inspectify inspections, doorstep car spa and insurance assistance in Amravati, Maharashtra.",
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://autoflexii.com",
  email: "Autoflexiiii@gmail.com",
  phones: ["8956967660", "9527806955"],
  whatsapp: "918956967660",
  instagram: { handle: "@autoflexii", url: "https://instagram.com/autoflexii" },
  address: {
    locality: "Amravati",
    region: "Maharashtra",
    country: "IN",
    display: "Amravati, Maharashtra",
  },
  hours: "9:00 AM – 6:00 PM IST",
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy" },
  { to: "/sell", label: "Sell" },
  { to: "/car-spa", label: "Car Spa" },
  { to: "/inspectify", label: "Inspectify" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export const telHref = (n: string) => `tel:+91${n}`;
export const whatsappHref = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
