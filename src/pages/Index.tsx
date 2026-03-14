import { Link } from "react-router-dom";
import { Search, ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CarCard } from "@/components/CarCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { bodyTypes } from "@/data/cars";
import { useDbCars } from "@/hooks/useCars";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: dbCars = [] } = useDbCars();
  const allCars = dbCars;
  const featured = allCars.filter((c) => c.featured).slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl animate-in fade-in duration-500">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Find Your Next
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-red-500 to-accent animate-shimmer"> Dream Car</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed animate-in fade-in duration-500" style={{ animationDelay: "0.1s" }}>
              Discover premium vehicles from trusted sellers. Browse, compare, and find your perfect match with confidence.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg animate-in fade-in duration-500" style={{ animationDelay: "0.2s" }}>
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search make, model, or keyword..."
                  className="pl-12 h-14 bg-card/50 backdrop-blur-sm border-2 border-border/50 text-foreground placeholder:text-muted-foreground/50 transition-all duration-300 focus:border-accent/50 focus:shadow-lg focus:shadow-accent/20"
                />
              </div>
              <Button type="submit" className="h-14 px-8 bg-gradient-to-r from-accent to-red-500 text-accent-foreground font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 hover:-translate-y-1">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-4 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {bodyTypes.map((type, idx) => (
            <Link
              key={type}
              to={`/browse?bodyType=${type}`}
              className="flex-shrink-0 rounded-full bg-gradient-to-r from-card to-card/50 border border-border/50 px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm group"
              style={{
                animation: `slideUp 0.5s ease-out ${idx * 0.05}s both`,
              }}
            >
              <span className="group-hover:text-accent transition-colors">{type}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div className="animate-in slide-in-from-left duration-500">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Featured Listings
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">Curated premium vehicles for you</p>
          </div>
            <Link to="/browse" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group">
              View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car, idx) => (
            <div
              key={car.id}
              style={{
                animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
              }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button asChild relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Why Choose autoflexii?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trusted Sellers", desc: "Every seller is verified with ratings and reviews from real buyers." },
              { icon: TrendingUp, title: "Market Pricing", desc: "Real-time market data ensures you get a fair deal every time." },
              { icon: Zap, title: "Fast & Simple", desc: "List your car in minutes. Find your next ride even faster." },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/50 to-card/25 border border-border/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 rounded-2xl group-hover:from-accent/10 group-hover:to-accent/5 transition-all duration-300" />
                <div className="relative">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 transition-all duration-300">
                    <item.icon className="h-7 w-7" />
      
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-in-from-left {
          animation: slideInLeft 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </divr next ride even faster." },
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
