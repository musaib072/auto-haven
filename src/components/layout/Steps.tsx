import type { LucideIcon } from "lucide-react";

export function Steps({ title, steps }: { title: string; steps: { icon: LucideIcon; title: string; desc: string }[] }) {
  return (
    <div>
      <h2 className="section-title">{title}</h2>
      <ol className="mt-6 space-y-5">
        {steps.map(({ icon: Icon, title: t, desc }, i) => (
          <li key={t} className="flex gap-4">
            <span className="relative">
              <span className="gold-ring-icon h-11 w-11">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-light">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/75">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
