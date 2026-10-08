import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Inbox, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { telHref } from "@/config/site";

const KIND_LABEL: Record<string, string> = {
  buy: "Buy",
  sell: "Sell",
  "car-spa": "Car Spa",
  inspection: "Inspection",
  contact: "Contact",
};

/** Read-only list of recent website enquiries (requires the enquiries migration + admin role). */
export function EnquiriesPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center gap-3">
        <Inbox className="h-5 w-5 text-gold" />
        <h2 className="font-display text-xl font-semibold">Recent enquiries</h2>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="rounded-lg border border-white/10 p-4 text-sm text-muted-foreground">
          Enquiries are not available yet. Apply the latest Supabase migration and make sure your account is listed in
          <code className="mx-1 rounded bg-white/10 px-1">admin_users</code>(see EMAIL_SETUP.md).
        </p>
      ) : !data?.length ? (
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((q) => (
            <li key={q.id} className="lux-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide2 text-gold">
                    {KIND_LABEL[q.kind] ?? q.kind}
                  </span>
                  <span className="text-sm font-medium">{q.name}</span>
                  <a href={telHref(q.phone)} className="flex items-center gap-1 text-sm text-gold-light hover:underline">
                    <Phone className="h-3.5 w-3.5" /> {q.phone}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {q.reference} · {format(new Date(q.created_at), "d MMM yyyy, h:mm a")} ·{" "}
                  <span className={q.email_status === "sent" ? "text-emerald-400" : "text-amber-400"}>email {q.email_status}</span>
                </span>
              </div>
              {q.subject && <p className="mt-2 text-sm text-foreground/85">{q.subject}</p>}
              {q.details && typeof q.details === "object" && !Array.isArray(q.details) && (
                <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-foreground/70 sm:grid-cols-2">
                  {Object.entries(q.details as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="text-muted-foreground">{k}:</dt>
                      <dd className="min-w-0 break-words">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {q.photo_urls && q.photo_urls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.photo_urls.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                      <img src={u} alt="" className="h-14 w-14 rounded object-cover" loading="lazy" />
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
