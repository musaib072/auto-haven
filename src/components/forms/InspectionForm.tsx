import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ClipboardCheck, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { manufactureYears, timeSlots } from "@/data/options";
import { mobileSchema, nameSchema, optionalText, requiredText } from "@/lib/validation";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormCard, Field, Honeypot, SelectField, SubmitButton, } from "./FormKit";
import { ariaFor } from "@/lib/a11y";
import { DateField, TimeSlotField } from "./BookingFields";
import { isSlotUnavailable } from "@/lib/booking";

const sellerTypes = ["Individual seller", "Dealer / showroom", "My own car", "Not decided yet"];

const schema = z
  .object({
    brandModel: requiredText("Car brand / model", 100),
    year: optionalText(),
    sellerType: optionalText(),
    location: requiredText("Inspection location", 200),
    date: z.date({ required_error: "Please choose a date", invalid_type_error: "Please choose a date" }),
    slot: requiredText("Time slot"),
    name: nameSchema,
    mobile: mobileSchema,
    notes: optionalText(1000),
  })
  .refine((v) => !isSlotUnavailable(v.date, timeSlots.find((s) => s.label === v.slot)?.hour ?? 0), {
    path: ["slot"],
    message: "This slot has passed — please pick a later time",
  });
type Values = z.input<typeof schema>;

export function InspectionForm({ id = "inspection-form", className, defaultCar }: { id?: string; className?: string; defaultCar?: string }) {
  const { submit, submitting, honeypotRef, markStarted } = useEnquirySubmit("inspection");
  const empty = { brandModel: defaultCar ?? "", year: "", sellerType: "", location: "", slot: "", name: "", mobile: "", notes: "" };
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: empty });
  const date = watch("date");

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    const when = format(v.date, "EEEE, d MMMM yyyy");
    const res = await submit({
      kind: "inspection",
      serviceName: "299+ Point Car Inspection",
      date: when,
      time: v.slot,
      vehicle: [v.brandModel, v.year].filter(Boolean).join(" "),
      name: v.name,
      phone: v.mobile,
      message: v.notes,
      details: [
        ["Car", v.brandModel],
        ["Year", v.year],
        ["Bought from", v.sellerType],
        ["Inspection location", v.location],
        ["Date", when],
        ["Time slot", v.slot],
        ["Mobile", v.mobile],
      ],
    });
    if (res) reset({ ...empty, date: undefined });
  });

  const e = errors;
  return (
    <FormCard id={id} icon={ClipboardCheck} title="Book Car Inspection" subtitle="Our expert inspects the car wherever it is and shares a detailed report." className={className}>
      <form noValidate onSubmit={onSubmit} onFocusCapture={markStarted} className="relative flex flex-1 flex-col gap-3.5">
        <Honeypot ref={honeypotRef} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Car Brand / Model" htmlFor={`${id}-car`} error={e.brandModel?.message} className="sm:col-span-2">
            <Input id={`${id}-car`} placeholder="e.g. Maruti Swift VXi" autoComplete="off" {...register("brandModel")} {...ariaFor(`${id}-car`, e.brandModel?.message)} />
          </Field>
          <Field label="Year" htmlFor={`${id}-year`}>
            <SelectField control={control} name="year" id={`${id}-year`} placeholder="Year" options={manufactureYears} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Buying From" htmlFor={`${id}-seller`}>
            <SelectField control={control} name="sellerType" id={`${id}-seller`} placeholder="Select seller type" options={sellerTypes} />
          </Field>
          <Field label="Inspection Location" htmlFor={`${id}-loc`} error={e.location?.message}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" aria-hidden="true" />
              <Input id={`${id}-loc`} placeholder="Where is the car?" className="pl-9" {...register("location")} {...ariaFor(`${id}-loc`, e.location?.message)} />
            </div>
          </Field>
        </div>
        <Field label="Preferred Date" htmlFor={`${id}-date`} error={e.date?.message}>
          <Controller control={control} name="date" render={({ field }) => <DateField id={`${id}-date`} value={field.value} onChange={field.onChange} invalid={!!e.date} />} />
        </Field>
        <div className="space-y-1.5">
          <p id={`${id}-slot-label`} className="text-xs font-medium text-foreground/90">
            Preferred Time
          </p>
          <Controller
            control={control}
            name="slot"
            render={({ field }) => <TimeSlotField labelledBy={`${id}-slot-label`} date={date} value={field.value} onChange={field.onChange} invalid={!!e.slot} />}
          />
          {e.slot?.message && (
            <p role="alert" className="text-xs text-destructive">
              {e.slot.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Your Name" htmlFor={`${id}-name`} error={e.name?.message}>
            <Input id={`${id}-name`} placeholder="Full name" autoComplete="name" {...register("name")} {...ariaFor(`${id}-name`, e.name?.message)} />
          </Field>
          <Field label="Mobile Number" htmlFor={`${id}-mobile`} error={e.mobile?.message}>
            <Input id={`${id}-mobile`} type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" {...register("mobile")} {...ariaFor(`${id}-mobile`, e.mobile?.message)} />
          </Field>
        </div>
        <Field label="Anything we should know?" htmlFor={`${id}-notes`}>
          <Textarea id={`${id}-notes`} rows={3} placeholder="Seller contact, listing link, concerns…" {...register("notes")} />
        </Field>
        <div className="mt-auto pt-2">
          <SubmitButton submitting={submitting}>Book Car Inspection</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
