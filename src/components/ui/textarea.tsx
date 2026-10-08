import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-field-border bg-field px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground/70 hover:border-gold/40 focus-visible:border-gold/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 focus-visible:ring-offset-0 aria-[invalid=true]:border-destructive/80 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
