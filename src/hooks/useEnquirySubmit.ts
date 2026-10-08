import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { EmailDeliveryError, submitEnquiry, type Enquiry, type EnquiryResult } from "@/lib/emailService";
import { site, telHref, whatsappHref } from "@/config/site";

const MIN_FILL_MS = 2500; // humans take longer than this to fill a form
const COOLDOWN_MS = 30_000; // one submission per form type every 30s per browser

function readCooldown(key: string): number {
  try {
    return Number(window.localStorage.getItem(key) || 0);
  } catch {
    return 0;
  }
}
function writeCooldown(key: string) {
  try {
    window.localStorage.setItem(key, String(Date.now()));
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Wraps submitEnquiry with spam protection (honeypot, minimum fill time,
 * per-form cooldown), loading state and user feedback.
 */
export function useEnquirySubmit(formId: string) {
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<EnquiryResult | null>(null);
  // Time of the user's first interaction with the form (0 = not started yet).
  const startedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const markStarted = useCallback(() => {
    if (!startedAt.current) startedAt.current = Date.now();
  }, []);

  const submit = useCallback(
    async (enquiry: Enquiry): Promise<EnquiryResult | null> => {
      if (submitting) return null;

      // Honeypot: real users never see or fill this field.
      if (honeypotRef.current?.value) {
        return { reference: "OK", emailed: false, recorded: false };
      }
      if (!startedAt.current || Date.now() - startedAt.current < MIN_FILL_MS) {
        startedAt.current = startedAt.current || Date.now();
        toast.error("That was quick! Please review your details and submit again.");
        return null;
      }
      const cooldownKey = `afx-cooldown-${formId}`;
      const since = Date.now() - readCooldown(cooldownKey);
      if (since < COOLDOWN_MS) {
        toast.info(`We've just received a request from you. Please wait ${Math.ceil((COOLDOWN_MS - since) / 1000)}s before sending another.`);
        return null;
      }

      setSubmitting(true);
      try {
        const result = await submitEnquiry(enquiry);
        writeCooldown(cooldownKey);
        setLastResult(result);
        toast.success("Request received!", {
          description: `Reference ${result.reference}. Our team will call you shortly on ${enquiry.phone}.`,
          duration: 8000,
        });
        return result;
      } catch (err) {
        const message =
          err instanceof EmailDeliveryError
            ? err.userMessage
            : "Something went wrong. Please call or WhatsApp us and we'll help you right away.";
        toast.error(message, {
          duration: 12000,
          action: {
            label: "WhatsApp",
            onClick: () => window.open(whatsappHref(`Hi ${site.name}, I tried to submit a request on your website.`), "_blank", "noopener"),
          },
          cancel: { label: "Call", onClick: () => (window.location.href = telHref(site.phones[0])) },
        });
        return null;
      } finally {
        setSubmitting(false);
        startedAt.current = 0;
      }
    },
    [formId, submitting],
  );

  return { submit, submitting, lastResult, honeypotRef, markStarted };
}
