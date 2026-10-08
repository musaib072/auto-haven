import { useState } from "react";
import { format, startOfDay, addDays } from "date-fns";
import { isSlotUnavailable } from "@/lib/booking";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { timeSlots } from "@/data/options";
import { cn } from "@/lib/utils";

const MAX_DAYS_AHEAD = 60;

export function DateField({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value?: Date;
  onChange: (d: Date | undefined) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className={cn(
            "flex h-10 w-full items-center gap-2.5 rounded-md border border-field-border bg-field px-3 text-left text-sm transition-colors hover:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/60 aria-[invalid=true]:border-destructive/80",
            !value && "text-muted-foreground/80",
          )}
        >
          <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
          {value ? format(value, "EEE, d MMM yyyy") : "Choose date"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          disabled={(d) => d < today || d > addDays(today, MAX_DAYS_AHEAD)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimeSlotField({
  labelledBy,
  date,
  value,
  onChange,
  invalid,
}: {
  labelledBy: string;
  date?: Date;
  value?: string;
  onChange: (slot: string) => void;
  invalid?: boolean;
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} aria-invalid={invalid || undefined} className="grid grid-cols-3 gap-2.5">
      {timeSlots.map((s) => {
        const disabled = isSlotUnavailable(date, s.hour);
        const selected = value === s.label;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(s.label)}
            className={cn(
              "h-10 rounded-md border text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/70",
              selected
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-field-border bg-field text-foreground/85 hover:border-gold/50",
              disabled && "cursor-not-allowed opacity-35 hover:border-field-border",
              invalid && !selected && "border-destructive/50",
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
