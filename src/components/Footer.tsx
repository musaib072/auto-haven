import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Car className="h-4 w-4" />
              </div>
              autoflexii
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">The modern marketplace for buying and selling quality vehicles. Trusted by thousands of car enthusiasts.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/browse" className="block hover:text-foreground transition-colors">Browse Cars</Link>
              <Link to="/sell" className="block hover:text-foreground transition-colors">Sell Your Car</Link>
              <Link to="/how-it-works" className="block hover:text-foreground transition-colors">How It Works</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Categories</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/browse?bodyType=SUV" className="block hover:text-foreground transition-colors">SUVs</Link>
              <Link to="/browse?bodyType=Sedan" className="block hover:text-foreground transition-colors">Sedans</Link>
              <Link to="/browse?bodyType=Truck" className="block hover:text-foreground transition-colors">Trucks</Link>
              <Link to="/browse?fuelType=Electric" className="block hover:text-foreground transition-colors">Electric</Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} autoflexii. All rights reserved. Designed BY akamusaib
        </div>
      </div>
    </footer>
  );
}
