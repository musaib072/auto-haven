import { forwardRef, type ReactNode, type RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FormCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className,
  id,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("lux-card form-compact flex flex-col p-5 sm:p-6 scroll-mt-24", className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="mb-6 flex items-start gap-4">
        <span className="gold-ring-icon h-12 w-12">
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <div className="pt-0.5">
          <h2 id={id ? `${id}-title` : undefined} className="font-display text-lg font-semibold uppercase tracking-wide text-gold-light">
            {title}
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-foreground/75">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
  required,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground/90">
        {label}
        {required && <span className="ml-0.5 text-gold" aria-hidden="true">*</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  id,
  placeholder,
  options,
  invalid,
}: {
  control: Control<T>;
  name: Path<T>;
  id: string;
  placeholder: string;
  options: readonly string[];
  invalid?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value || ""} onValueChange={field.onChange}>
          <SelectTrigger
            id={id}
            ref={field.ref}
            onBlur={field.onBlur}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-error` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

/** Off-screen field that only bots fill in. */
export const Honeypot = forwardRef<HTMLInputElement>((_, ref) => (
  <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
    <label>
      Leave this field empty
      <input ref={ref} type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
));
Honeypot.displayName = "Honeypot";

export function SubmitButton({ submitting, children, className }: { submitting: boolean; children: ReactNode; className?: string }) {
  return (
    <Button type="submit" disabled={submitting} className={cn("h-11 w-full rounded-md text-sm", className)}>
      {submitting ? (
        <>
          <Loader2 className="animate-spin" /> Sending…
        </>
      ) : (
        <>
          {children} <ArrowRight />
        </>
      )}
    </Button>
  );
}

export type HoneypotRef = RefObject<HTMLInputElement>;
