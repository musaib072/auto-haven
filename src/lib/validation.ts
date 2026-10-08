import { z } from "zod";

/** Indian mobile numbers: optional +91 / 0 prefix, 10 digits starting 6–9. */
export const normalizeIndianMobile = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
};

export const mobileSchema = z
  .string()
  .trim()
  .min(1, "Mobile number is required")
  .transform(normalizeIndianMobile)
  .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(80, "Name is too long")
  .regex(/^[\p{L}\p{M} .'-]+$/u, "Name can only contain letters");

export const optionalEmailSchema = z
  .string()
  .trim()
  .max(120)
  .email("Enter a valid email address")
  .or(z.literal(""))
  .optional();

/** Indian vehicle registration, e.g. MH27AB1234, MH 27 AB 1234, 22BH1234AA. */
export const registrationSchema = z
  .string()
  .trim()
  .min(1, "Registration number is required")
  .transform((v) => v.toUpperCase().replace(/[\s-]/g, ""))
  .refine(
    (v) => /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(v) || /^\d{2}BH\d{4}[A-Z]{1,2}$/.test(v),
    "Enter a valid registration number (e.g. MH27AB1234)",
  );

export const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

export const optionalText = (max = 120) => z.string().trim().max(max).optional().or(z.literal(""));
