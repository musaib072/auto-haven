import { Search, ClipboardList, Handshake, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const buyerSteps = [
  { icon: Search, title: "Browse & Search", desc: "Use our powerful filters to find exactly what you're looking for — by make, model, price, and more." },
  { icon: Car, title: "View Details", desc: "Get full specs, photos, and seller info. Everything you need to make a confident decision." },
  { icon: Handshake, title: "Contact & Buy", desc: "Reach out to the seller directly. Negotiate, arrange a test drive, and close the deal." },
];

const sellerSteps = [
  { icon: ClipboardList, title: "List Your Car", desc: "Fill out a quick form with your car's details, upload photos, and set your asking price." },
  { icon: Search, title: "Get Discovered", desc: "Your listing appears in search results and gets seen by thousands of active buyers." },
  { icon: Handshake, title: "Close the Deal", desc: "Connect with interested buyers, negotiate offers, and complete the sale on your terms." },
];

const HowItWorks = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="container mx-auto px-4 py-16 flex-1">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How autoflexii Works</h1>
        <p className="text-muted-foreground">Whether you're buying or selling, we make the process simple, transparent, and fast.</p>
      </div>

      {[{ title: "Buying a Car", steps: buyerSteps }, { title: "Selling a Car", steps: sellerSteps }].map((section) => (
        <div key={section.title} className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {section.steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4 relative">
                  <s.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-8 space-x-4">
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/browse">Browse Cars</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
    <Footer />
  </div>
);

export default HowItWorks;
