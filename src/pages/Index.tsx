import { Link } from "react-router-dom";
import { Search, ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarCard } from "@/components/CarCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cars as staticCars, bodyTypes } from "@/data/cars";
import { useDbCars } from "@/hooks/useCars";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: dbCars = [] } = useDbCars();
  const allCars = useMemo(() => [...dbCars, ...staticCars], [dbCars]);
  const featured = allCars.filter((c) => c.featured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(24_95%_53%/0.15),transparent_60%)]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Find Your Next
              <span className="text-accent"> Dream Car</span>
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-lg">
              Browse thousands of quality vehicles from trusted sellers. Buy, sell, and trade with confidence.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search make, model, or keyword..."
                  className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
              </div>
              <Button type="submit" className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {bodyTypes.map((type) => (
            <Link
              key={type}
              to={`/browse?bodyType=${type}`}
              className="flex-shrink-0 rounded-full bg-card border px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md hover:border-accent/40 transition-all"
            >
              {type}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Featured Listings</h2>
            <p className="text-muted-foreground mt-1">Hand-picked vehicles you don't want to miss</p>
          </div>
          <Link to="/browse" className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link to="/browse">View All Listings</Link>
          </Button>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Why AutoVault?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trusted Sellers", desc: "Every seller is verified with ratings and reviews from real buyers." },
              { icon: TrendingUp, title: "Market Pricing", desc: "Real-time market data ensures you get a fair deal every time." },
              { icon: Zap, title: "Fast & Simple", desc: "List your car in minutes. Find your next ride even faster." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Ready to Sell?</h2>
            <p className="opacity-80">List your car for free and reach thousands of potential buyers.</p>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            <Link to="/sell">Sell Your Car <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
