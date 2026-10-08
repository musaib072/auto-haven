import { Component, type ErrorInfo, type ReactNode } from "react";
import { site, telHref } from "@/config/site";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[app] Unhandled error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    // A failed lazy chunk usually means a new deploy went out — a reload fixes it.
    const isChunkError = /Loading chunk|dynamically imported module|Importing a module script failed/i.test(
      this.state.error.message,
    );
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md">
          <p className="eyebrow mb-3">{site.name}</p>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {isChunkError ? "A new version is available" : "Something went wrong"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {isChunkError
              ? "Please reload the page to get the latest version of the site."
              : `Please reload the page. If the problem continues, call us on ${site.phones[0]}.`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="h-10 rounded-full bg-gold-gradient px-6 text-sm font-semibold text-primary-foreground"
            >
              Reload page
            </button>
            <a href={telHref(site.phones[0])} className="inline-flex h-10 items-center rounded-full border border-gold/70 px-6 text-sm text-gold-light">
              Call us
            </a>
          </div>
        </div>
      </div>
    );
  }
}
