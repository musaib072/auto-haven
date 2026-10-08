import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { navLinks, site, telHref } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/15 bg-black">
      <div className="container py-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <Logo size="md" />

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-xs text-foreground/75 transition-colors hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-xs text-foreground/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
              {site.phones.map((p, i) => (
                <span key={p} className="flex items-center gap-2">
                  {i > 0 && <span className="text-foreground/30">|</span>}
                  <a href={telHref(p)} className="hover:text-gold transition-colors">
                    {p}
                  </a>
                </span>
              ))}
            </span>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Instagram className="h-4 w-4 text-gold" aria-hidden="true" />
              {site.instagram.handle}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              {site.address.display}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AUTOFLEXII. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gold transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
