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

      {/* Animated Background Elements - Red & Black Theme */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-gradient-to-b from-gray-950 via-black to-gray-900">
        {/* Red glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-600/40 via-red-600/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-700/30 via-red-600/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-red-600/20 to-black/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 via-transparent to-black/20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl animate-in fade-in duration-500">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.0] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Find Your Next
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 drop-shadow-lg"> Dream Car</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl leading-relaxed animate-in fade-in duration-500 font-light" style={{ animationDelay: "0.1s" }}>
              Discover premium vehicles from trusted sellers. Browse, compare, and find your perfect match with confidence.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl animate-in fade-in duration-500" style={{ animationDelay: "0.2s" }}>
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search make, model, or keyword..."
                  className="pl-12 h-16 bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 rounded-xl text-lg transition-all duration-300 focus:border-red-500/50 focus:shadow-lg focus:shadow-red-600/20 hover:border-white/20"
                />
              </div>
              <Button type="submit" className="h-16 px-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-red-600/50 transition-all duration-300 hover:-translate-y-1">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-none">
          {bodyTypes.map((type, idx) => (
            <Link
              key={type}
              to={`/browse?bodyType=${type}`}
              className="flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-white/10 hover:border-red-500/50 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-red-600/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-gray-700/90 hover:to-gray-800/70 backdrop-blur-md group"
              style={{
                animation: `slideUp 0.5s ease-out ${idx * 0.05}s both`,
              }}
            >
              <span className="group-hover:text-red-400 transition-colors">{type}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-end justify-between mb-16">
          <div className="animate-in slide-in-from-left duration-500">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Featured Listings
            </h2>
            <p className="text-gray-400 mt-3 text-lg font-light">Curated premium vehicles for you</p>
          </div>
            <Link to="/browse" className="hidden sm:flex items-center gap-2 text-lg font-bold text-red-500 hover:text-red-400 transition-colors group">
              View all <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="mt-12 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link to="/browse">View All Listings</Link>
          </Button>
        </div>
      </section>

      {/* Value Props */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-white/10 hover:border-red-500/50 backdrop-blur-lg hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-900/50 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-red-600/20"
                style={{
                  animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/5 rounded-2xl group-hover:from-red-600/5 group-hover:to-red-600/10 transition-all duration-300" />
                <div className="relative">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-600/30 to-red-700/20 text-red-400 mb-4 group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-red-600/40 group-hover:bg-gradient-to-br group-hover:from-red-600/50 group-hover:to-red-700/30 transition-all duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white group-hover:text-red-400 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

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
  );
};

export default Index;
