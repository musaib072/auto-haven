import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Seo } from "./Seo";

interface SiteLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  noindex?: boolean;
}

export function SiteLayout({ children, title, description, noindex }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Seo title={title} description={description} noindex={noindex} />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** Compact page banner used on inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold/10">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-full object-cover object-right opacity-60 md:w-[65%] [mask-image:linear-gradient(to_right,transparent,black_45%)]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
      <div className="container relative py-14 md:py-20">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="max-w-2xl font-display text-3xl font-bold uppercase leading-tight tracking-tight text-gold-gradient sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-xl text-base text-foreground/80 md:text-lg">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
