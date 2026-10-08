import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { budgetRanges, fuelOptions, transmissionOptions } from "@/data/options";
import { mobileSchema, nameSchema, optionalText, requiredText } from "@/lib/validation";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormCard, Field, Honeypot, SelectField, SubmitButton, } from "./FormKit";
import { ariaFor } from "@/lib/a11y";

const schema = z.object({
  budget: requiredText("Budget range"),
  brandModel: optionalText(80),
  fuel: optionalText(),
  transmission: optionalText(),
  location: requiredText("Preferred location", 80),
  name: nameSchema,
  mobile: mobileSchema,
});
type Values = z.input<typeof schema>;

export function BuyCarForm({ id = "buy-form", className }: { id?: string; className?: string }) {
  const { submit, submitting, honeypotRef, markStarted } = useEnquirySubmit("buy");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { budget: "", brandModel: "", fuel: "", transmission: "", location: "", name: "", mobile: "" },
  });

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    const res = await submit({
      kind: "buy",
      subject: `${v.brandModel || "Car"} · ${v.budget}`,
      name: v.name,
      phone: v.mobile,
      details: [
        ["Budget range", v.budget],
        ["Brand / Model", v.brandModel || "Open to suggestions"],
        ["Fuel type", v.fuel],
        ["Transmission", v.transmission],
        ["Preferred location", v.location],
        ["Mobile", v.mobile],
      ],
    });
    if (res) reset();
  });

  const e = errors;
  return (
    <FormCard id={id} icon={Car} title="Buy a Car" subtitle="Tell us what you're looking for and we'll help you find it." className={className}>
      <form noValidate onSubmit={onSubmit} onFocusCapture={markStarted} className="relative flex flex-1 flex-col gap-3.5">
        <Honeypot ref={honeypotRef} />
        <Field label="Budget Range" htmlFor={`${id}-budget`} error={e.budget?.message}>
          <SelectField control={control} name="budget" id={`${id}-budget`} placeholder="Select budget range" options={budgetRanges} invalid={!!e.budget} />
        </Field>
        <Field label="Brand / Model" htmlFor={`${id}-brand`} error={e.brandModel?.message}>
          <div className="relative">
            <Input id={`${id}-brand`} placeholder="e.g. BMW 3 Series" autoComplete="off" className="pr-9" {...register("brandModel")} {...ariaFor(`${id}-brand`, e.brandModel?.message)} />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" aria-hidden="true" />
          </div>
        </Field>
        <Field label="Fuel Type" htmlFor={`${id}-fuel`}>
          <SelectField control={control} name="fuel" id={`${id}-fuel`} placeholder="Select fuel type" options={fuelOptions} />
        </Field>
        <Field label="Transmission" htmlFor={`${id}-trans`}>
          <SelectField control={control} name="transmission" id={`${id}-trans`} placeholder="Select transmission" options={transmissionOptions} />
        </Field>
        <Field label="Preferred Location" htmlFor={`${id}-loc`} error={e.location?.message}>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" aria-hidden="true" />
            <Input id={`${id}-loc`} placeholder="e.g. Amravati" autoComplete="address-level2" className="pl-9" {...register("location")} {...ariaFor(`${id}-loc`, e.location?.message)} />
          </div>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Your Name" htmlFor={`${id}-name`} error={e.name?.message}>
            <Input id={`${id}-name`} placeholder="Full name" autoComplete="name" {...register("name")} {...ariaFor(`${id}-name`, e.name?.message)} />
          </Field>
          <Field label="Mobile Number" htmlFor={`${id}-mobile`} error={e.mobile?.message}>
            <Input id={`${id}-mobile`} type="tel" inputMode="tel" placeholder="+91 98765 43210" autoComplete="tel" {...register("mobile")} {...ariaFor(`${id}-mobile`, e.mobile?.message)} />
          </Field>
        </div>
        <div className="mt-auto pt-3">
          <SubmitButton submitting={submitting}>Find My Car</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
