/** aria props for an input bound to react-hook-form errors. */
export const ariaFor = (id: string, error?: string) =>
  error ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};
