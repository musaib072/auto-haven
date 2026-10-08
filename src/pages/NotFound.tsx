import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <SiteLayout title="Page not found" noindex>
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-3">Error 404</p>
      <h1 className="font-display text-4xl font-bold text-gold-gradient sm:text-5xl">Wrong turn</h1>
      <p className="mt-4 max-w-md text-foreground/75">The page you're looking for doesn't exist or has moved.</p>
      <Button asChild variant="gold" className="mt-8 h-11 px-8">
        <Link to="/">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>
    </section>
  </SiteLayout>
);

export default NotFound;
