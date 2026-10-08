import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const DEFAULT_SITE_URL = "https://autoflexii.com";

/**
 * Rewrites the canonical domain in index.html, robots.txt and sitemap.xml
 * when VITE_SITE_URL is set (e.g. your custom domain or the Vercel URL).
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  const swap = (s: string) => (siteUrl === DEFAULT_SITE_URL ? s : s.split(DEFAULT_SITE_URL).join(siteUrl));
  let outDir = "dist";
  return {
    name: "autoflexii-site-url",
    configResolved(c) {
      outDir = path.resolve(c.root, c.build.outDir);
    },
    transformIndexHtml: (html) => swap(html),
    closeBundle() {
      for (const f of ["robots.txt", "sitemap.xml"]) {
        const p = path.join(outDir, f);
        if (fs.existsSync(p)) fs.writeFileSync(p, swap(fs.readFileSync(p, "utf8")));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    plugins: [react(), siteUrlPlugin(siteUrl), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "es2020",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            radix: [
              "@radix-ui/react-select",
              "@radix-ui/react-popover",
              "@radix-ui/react-label",
              "@radix-ui/react-slot",
              "@radix-ui/react-tooltip",
            ],
            data: ["@supabase/supabase-js", "@tanstack/react-query"],
            forms: ["react-hook-form", "@hookform/resolvers", "zod", "@emailjs/browser"],
            dates: ["date-fns", "react-day-picker"],
          },
        },
      },
    },
  };
});
