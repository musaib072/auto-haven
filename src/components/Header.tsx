import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, PhoneCall, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { navLinks, site, telHref } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-gold/15 bg-black/85 backdrop-blur-xl" : "border-white/5 bg-black/60 backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container flex h-[68px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:flex items-center gap-1 xl:gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-2.5 py-2 text-[13px] font-medium transition-colors",
                  "after:absolute after:inset-x-2.5 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-gold after:transition-transform after:duration-300",
                  isActive
                    ? "text-gold after:scale-x-100"
                    : "text-foreground/80 hover:text-gold-light after:scale-x-0 hover:after:scale-x-50",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={telHref(site.phones[0])}
            aria-label={`Call ${site.phones[0]}`}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-gold-light transition-colors hover:bg-gold/10 hover:text-gold"
          >
            <PhoneCall className="h-5 w-5" strokeWidth={1.6} />
          </a>
          <Button asChild variant="gold" className="hidden sm:inline-flex h-10 px-6 text-[13px]">
            <Link to="/car-spa#book">Book a Wash</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="lg:hidden h-[calc(100dvh-68px)] overflow-y-auto border-t border-gold/15 bg-black/95">
          <nav aria-label="Mobile" className="container flex flex-col py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "border-b border-white/5 py-4 font-display text-sm font-medium uppercase tracking-wide2",
                    isActive ? "text-gold" : "text-foreground/85",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button asChild variant="goldOutline" className="h-11">
                <a href={telHref(site.phones[0])}>
                  <PhoneCall /> Call Us
                </a>
              </Button>
              <Button asChild variant="gold" className="h-11">
                <Link to="/car-spa#book">Book a Wash</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
