import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, IndianRupee, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { manufactureYears, ownershipOptions } from "@/data/options";
import { mobileSchema, nameSchema, registrationSchema, requiredText } from "@/lib/validation";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { createReference } from "@/lib/emailService";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTOS, uploadSellPhotos, validatePhoto } from "@/lib/photoUpload";
import { cn } from "@/lib/utils";
import { FormCard, Field, Honeypot, SelectField, SubmitButton, } from "./FormKit";
import { ariaFor } from "@/lib/a11y";

const digits = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .transform((v) => v.replace(/[,\s₹]/g, ""))
    .refine((v) => /^\d+$/.test(v) && Number(v) > 0 && Number(v) <= max, `Enter a valid ${label.toLowerCase()}`);

const schema = z.object({
  registration: registrationSchema,
  brandModel: requiredText("Brand / model / variant", 100),
  year: requiredText("Year"),
  km: digits("KM driven", 1_000_000),
  ownership: requiredText("Ownership"),
  price: digits("Expected price", 100_000_000),
  name: nameSchema,
  mobile: mobileSchema,
});
type Values = z.input<typeof schema>;

const inr = (n: string | number) => Number(n).toLocaleString("en-IN");

export function SellCarForm({ id = "sell-form", className }: { id?: string; className?: string }) {
  const { submit, submitting, honeypotRef, markStarted } = useEnquirySubmit("sell");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { registration: "", brandModel: "", year: "", km: "", ownership: "", price: "", name: "", mobile: "" },
  });

  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [photos]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const errorsFound: string[] = [];
    const valid = incoming.filter((f) => {
      const err = validatePhoto(f);
      if (err) errorsFound.push(err);
      return !err;
    });
    if (errorsFound.length) toast.error(errorsFound.slice(0, 3).join("\n"));
    setPhotos((prev) => {
      const next = [...prev, ...valid];
      if (next.length > MAX_PHOTOS) toast.info(`Only the first ${MAX_PHOTOS} photos will be used.`);
      return next.slice(0, MAX_PHOTOS);
    });
  };

  const onSubmit = handleSubmit(async (raw) => {
    const v = schema.parse(raw);
    const reference = createReference("sell");
    let photoUrls: string[] = [];
    let failed = 0;
    if (photos.length) {
      setUploading(true);
      ({ urls: photoUrls, failed } = await uploadSellPhotos(photos, reference));
      setUploading(false);
    }
    const res = await submit({
      kind: "sell",
      reference,
      subject: `${v.brandModel} ${v.year} · ${v.registration}`,
      name: v.name,
      phone: v.mobile,
      photoUrls,
      details: [
        ["Registration number", v.registration],
        ["Brand / Model / Variant", v.brandModel],
        ["Year", v.year],
        ["KM driven", `${inr(v.km)} km`],
        ["Ownership", v.ownership],
        ["Expected price", `₹${inr(v.price)}`],
        ["Mobile", v.mobile],
        ["Photos", photos.length ? `${photoUrls.length} uploaded${failed ? `, ${failed} failed — request photos on WhatsApp` : ""}` : "None attached"],
      ],
    });
    if (res) {
      reset();
      setPhotos([]);
    }
  });

  const e = errors;
  const busy = submitting || uploading;
  return (
    <FormCard id={id} icon={IndianRupee} title="Sell Your Car" subtitle="Get a fair quote and a hassle-free selling experience." className={className}>
      <form noValidate onSubmit={onSubmit} onFocusCapture={markStarted} className="relative flex flex-1 flex-col gap-3.5">
        <Honeypot ref={honeypotRef} />
        <Field label="Registration Number" htmlFor={`${id}-reg`} error={e.registration?.message}>
          <Input id={`${id}-reg`} placeholder="e.g. MH27AB1234" autoComplete="off" className="uppercase placeholder:normal-case" {...register("registration")} {...ariaFor(`${id}-reg`, e.registration?.message)} />
        </Field>
        <Field label="Brand / Model / Variant" htmlFor={`${id}-model`} error={e.brandModel?.message}>
          <Input id={`${id}-model`} placeholder="e.g. Hyundai Verna 1.6 SX(O)" autoComplete="off" {...register("brandModel")} {...ariaFor(`${id}-model`, e.brandModel?.message)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Year" htmlFor={`${id}-year`} error={e.year?.message}>
            <SelectField control={control} name="year" id={`${id}-year`} placeholder="Select year" options={manufactureYears} invalid={!!e.year} />
          </Field>
          <Field label="KM Driven" htmlFor={`${id}-km`} error={e.km?.message}>
            <Input id={`${id}-km`} inputMode="numeric" placeholder="e.g. 50,000" {...register("km")} {...ariaFor(`${id}-km`, e.km?.message)} />
          </Field>
        </div>
        <Field label="Ownership" htmlFor={`${id}-owner`} error={e.ownership?.message}>
          <SelectField control={control} name="ownership" id={`${id}-owner`} placeholder="Select ownership type" options={ownershipOptions} invalid={!!e.ownership} />
        </Field>
        <Field label="Expected Price (₹)" htmlFor={`${id}-price`} error={e.price?.message}>
          <Input id={`${id}-price`} inputMode="numeric" placeholder="e.g. 6,00,000" {...register("price")} {...ariaFor(`${id}-price`, e.price?.message)} />
        </Field>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-foreground/90" id={`${id}-photos-label`}>
            Upload Photos (Max {MAX_PHOTOS})
          </p>
          <button
            type="button"
            aria-labelledby={`${id}-photos-label`}
            onClick={() => fileInput.current?.click()}
            onDragOver={(ev) => {
              ev.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(ev) => {
              ev.preventDefault();
              setDragging(false);
              addFiles(ev.dataTransfer.files);
            }}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-md border border-dashed bg-field px-4 py-5 text-left transition-colors",
              dragging ? "border-gold bg-gold/5" : "border-gold/40 hover:border-gold/70",
            )}
          >
            <ImagePlus className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <span>
              <span className="block text-xs text-foreground/90">Click to upload or drag &amp; drop</span>
              <span className="block text-[11px] text-muted-foreground">JPG, PNG, WEBP (Max 10MB each)</span>
            </span>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPTED_PHOTO_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={(ev) => {
              addFiles(ev.target.files);
              ev.target.value = "";
            }}
          />
          {previews.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Selected photos">
              {previews.map((src, i) => (
                <li key={src} className="group relative h-14 w-14 overflow-hidden rounded-md border border-gold/30">
                  <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white opacity-90 hover:text-gold"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
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
          <SubmitButton submitting={busy}>{uploading ? "Uploading photos" : "Get My Car Evaluated"}</SubmitButton>
        </div>
      </form>
    </FormCard>
  );
}
