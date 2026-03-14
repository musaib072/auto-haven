import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-red-600/20 bg-gradient-to-br from-gray-950 to-black mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 font-bold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg">
                <Car className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">autoflexii</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">The modern marketplace for buying and selling quality vehicles. Trusted by thousands of car enthusiasts.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/browse" className="block hover:text-red-500 transition-colors font-medium">Browse Cars</Link>
              <Link to="/contact" className="block hover:text-red-500 transition-colors font-medium">Contact</Link>
              <Link to="/how-it-works" className="block hover:text-red-500 transition-colors font-medium">How It Works</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Categories</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/browse?bodyType=SUV" className="block hover:text-red-500 transition-colors font-medium">SUVs</Link>
              <Link to="/browse?bodyType=Sedan" className="block hover:text-red-500 transition-colors font-medium">Sedans</Link>
              <Link to="/browse?bodyType=Truck" className="block hover:text-red-500 transition-colors font-medium">Trucks</Link>
              <Link to="/browse?fuelType=Electric" className="block hover:text-red-500 transition-colors font-medium">Electric</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-red-600/20 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} autoflexii. All rights reserved. Designed by akamusaib
        </div>
      </div>
    </footer>
  );
}
