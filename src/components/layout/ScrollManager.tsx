import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top on route change, or to #hash targets once they render. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (tries++ < 20) window.setTimeout(tick, 50);
    };
    tick();
  }, [pathname, hash]);

  return null;
}
