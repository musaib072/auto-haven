import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "@/config/site";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Per-route <title>, description, canonical and social tags (client-side). */
export function Seo({ title, description = site.description, image = "/og-image.jpg", noindex }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — Buy. Sell. Inspect. Care.`;
    const url = `${site.url}${pathname === "/" ? "" : pathname}`;
    const img = image.startsWith("http") ? image : `${site.url}${image}`;
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, image, noindex, pathname]);

  return null;
}
