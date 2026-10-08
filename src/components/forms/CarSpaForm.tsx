import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Droplet, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { spaPackages, vehicleTypes } from "@/data/options";
import { mobileSchema, nameSchema, requiredText } from "@/lib/validation";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormCard, Field, Honeypot, SelectField, SubmitButton, } from "./FormKit";
import { ariaFor } from "@/lib/a11y";
import { DateField, TimeSlotField } from "./BookingFields";
import { isSlotUnavailable } from "@/lib/booking";
import { timeSlots } from "@/data/options";

const schema = z
  .object({
    vehicleType: requiredText("Vehicle type"),
    packageName: requiredText("Service package"),
    location: requiredText("Address or pin code", 200).refine((v) => v.length >= 4, "Please enter your full address or pin code"),
    date: z.date({ required_error: "Please choose a date", invalid_type_error: "Please choose a date" }),
    slot: requiredText("Time slot"),
    name: nameSchema,
    mobile: mobileSchema,
  })
  .refine((v) => !isSlotUnavailable(v.date, timeSlots.find((s) => s.label === v.slot)?.hour ?? 0), {
    path: ["slot"],
    message: "This slot has passed — please pick a later time",
  });
type Values = z.input<typeof schema>;

export function CarSpaForm({
  id = "spa-form",
  className,
  defaultPackage,
}: {
  id?: string;
  className?: string;
  defaultPackage?: string;
}) {
  const { submit, submitting, honeypotRef, markStarted } = useEnquirySubmit("car-spa");
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleType: "", packageName: defaultPackage ?? "", location: "", slot: "", name: "", mobile: "" },
  });
  const date = watch("date");

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    const res = await submit({
      kind: "car-spa",
      serviceName: v.packageName,
      date: format(v.date, "EEEE, d MMMM yyyy"),
      time: v.slot,
      vehicle: v.vehicleType,
      name: v.name,
      phone: v.mobile,
      details: [
        ["Package", v.packageName],
        ["Vehicle type", v.vehicleType],
        ["Date", format(v.date, "EEEE, d MMMM yyyy")],
        ["Time slot", v.slot],
        ["Service address", v.location],
        ["Mobile", v.mobile],
      ],
    });
    if (res) reset({ vehicleType: "", packageName: defaultPackage ?? "", location: "", slot: "", name: "", mobile: "", date: undefined });
  });

  const e = errors;
  return (
    <FormCard
      id={id}
      icon={Droplet}
      title="Door-to-Door Car Spa"
      subtitle="Select your service, choose a time and we'll come to you."
      className={className}
    >
      <form noValidate onSubmit={onSubmit} onFocusCapture={markStarted} className="relative flex flex-1 flex-col gap-3.5">
        <Honeypot ref={honeypotRef} />
        <Field label="Vehicle Type" htmlFor={`${id}-vehicle`} error={e.vehicleType?.message}>
          <SelectField control={control} name="vehicleType" id={`${id}-vehicle`} placeholder="Select vehicle type" options={vehicleTypes} invalid={!!e.vehicleType} />
        </Field>
        <Field label="Service / Package" htmlFor={`${id}-package`} error={e.packageName?.message}>
          <SelectField control={control} name="packageName" id={`${id}-package`} placeholder="Select package" options={spaPackages.map((p) => p.name)} invalid={!!e.packageName} />
        </Field>
        <Field label="Location" htmlFor={`${id}-loc`} error={e.location?.message}>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" aria-hidden="true" />
            <Input id={`${id}-loc`} placeholder="Enter your address or pin code" autoComplete="street-address" className="pl-9" {...register("location")} {...ariaFor(`${id}-loc`, e.location?.message)} />
          </div>
        </Field>
        <Field label="Select Date" htmlFor={`${id}-date`} error={e.date?.message}>
          <Controller control={control} name="date" render={({ field }) => <DateField id={`${id}-date`} value={field.value} onChange={field.onChange} invalid={!!e.date} />} />
        </Field>
        <div className="space-y-1.5">
          <p id={`${id}-slot-label`} className="text-xs font-medium text-foreground/90">
            Available Time Slots
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
        <div className="mt-auto pt-3">
          <SubmitButton submitting={submitting}>Book My Slot</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
