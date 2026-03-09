export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  engine: string;
  color: string;
  location: string;
  image: string;
  images: string[];
  features: string[];
  description: string;
  seller: { name: string; phone: string; rating: number; memberSince: string };
  featured: boolean;
  createdAt: string;
};

const unsplashCar = (id: number) => `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop`;

export const cars: Car[] = [
  {
    id: "1", make: "BMW", model: "M4 Competition", year: 2024, price: 78900, mileage: 1200,
    bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", engine: "3.0L Twin-Turbo I6",
    color: "Isle of Man Green", location: "Los Angeles, CA",
    image: unsplashCar(1544636331-e26879cd4d9b), images: [unsplashCar(1544636331-e26879cd4d9b), unsplashCar(1555215695-3004980ad54e)],
    features: ["M Sport Exhaust", "Carbon Fiber Roof", "Head-Up Display", "Harman Kardon Audio", "Adaptive Suspension"],
    description: "Stunning BMW M4 Competition in rare Isle of Man Green. Low miles, fully loaded with every option available.",
    seller: { name: "Alex M.", phone: "(310) 555-0142", rating: 4.9, memberSince: "2021" }, featured: true, createdAt: "2025-03-01"
  },
  {
    id: "2", make: "Porsche", model: "911 Carrera S", year: 2023, price: 129500, mileage: 5400,
    bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", engine: "3.0L Twin-Turbo Flat-6",
    color: "Guards Red", location: "Miami, FL",
    image: unsplashCar(1503376780353-7e6692767b70), images: [unsplashCar(1503376780353-7e6692767b70)],
    features: ["Sport Chrono Package", "PASM", "Bose Surround Sound", "Sport Exhaust", "20-inch Wheels"],
    description: "Iconic Porsche 911 Carrera S in classic Guards Red. PDK transmission, sport chrono, and every driver-focused option.",
    seller: { name: "James R.", phone: "(305) 555-0198", rating: 5.0, memberSince: "2019" }, featured: true, createdAt: "2025-02-28"
  },
  {
    id: "3", make: "Mercedes-Benz", model: "G 63 AMG", year: 2024, price: 185000, mileage: 800,
    bodyType: "SUV", fuelType: "Gasoline", transmission: "Automatic", engine: "4.0L Twin-Turbo V8",
    color: "Obsidian Black", location: "New York, NY",
    image: unsplashCar(1606016159991-dfe4f2746db5), images: [unsplashCar(1606016159991-dfe4f2746db5)],
    features: ["AMG Performance Exhaust", "Burmester Sound", "360 Camera", "Night Package", "Heated/Ventilated Seats"],
    description: "Brand new G 63 AMG with the full Night Package. Commanding presence with unmatched luxury.",
    seller: { name: "Sarah K.", phone: "(212) 555-0167", rating: 4.8, memberSince: "2020" }, featured: true, createdAt: "2025-03-05"
  },
  {
    id: "4", make: "Toyota", model: "Camry XSE", year: 2024, price: 32500, mileage: 3200,
    bodyType: "Sedan", fuelType: "Gasoline", transmission: "Automatic", engine: "2.5L I4",
    color: "Celestial Silver", location: "Chicago, IL",
    image: unsplashCar(1621007947382-bb3c3994e3fb), images: [unsplashCar(1621007947382-bb3c3994e3fb)],
    features: ["JBL Audio", "Panoramic Roof", "Wireless CarPlay", "Blind Spot Monitor", "LED Headlights"],
    description: "Reliable and sporty Camry XSE with the sport-tuned suspension and aggressive styling.",
    seller: { name: "Mike T.", phone: "(312) 555-0134", rating: 4.6, memberSince: "2022" }, featured: false, createdAt: "2025-02-20"
  },
  {
    id: "5", make: "Ford", model: "F-150 Raptor", year: 2024, price: 76800, mileage: 4100,
    bodyType: "Truck", fuelType: "Gasoline", transmission: "Automatic", engine: "3.5L Twin-Turbo V6",
    color: "Code Orange", location: "Houston, TX",
    image: unsplashCar(1558618666-fcd25c85f82e), images: [unsplashCar(1558618666-fcd25c85f82e)],
    features: ["Fox Racing Shocks", "Terrain Management", "360 Camera", "B&O Sound", "Tailgate Step"],
    description: "The ultimate off-road truck. Ford F-150 Raptor in stunning Code Orange with low miles.",
    seller: { name: "Chris W.", phone: "(713) 555-0156", rating: 4.7, memberSince: "2021" }, featured: true, createdAt: "2025-03-02"
  },
  {
    id: "6", make: "Tesla", model: "Model 3 Performance", year: 2024, price: 52990, mileage: 2800,
    bodyType: "Sedan", fuelType: "Electric", transmission: "Automatic", engine: "Dual Motor AWD",
    color: "Ultra White", location: "San Francisco, CA",
    image: unsplashCar(1560958209-b0a7fd46dbf7), images: [unsplashCar(1560958209-b0a7fd46dbf7)],
    features: ["Full Self-Driving", "Premium Interior", "20-inch Wheels", "Carbon Fiber Spoiler", "Glass Roof"],
    description: "Tesla Model 3 Performance with FSD capability. The quickest sedan in its class.",
    seller: { name: "David L.", phone: "(415) 555-0189", rating: 4.5, memberSince: "2023" }, featured: false, createdAt: "2025-02-15"
  },
  {
    id: "7", make: "Jeep", model: "Wrangler Rubicon", year: 2023, price: 54600, mileage: 12000,
    bodyType: "SUV", fuelType: "Gasoline", transmission: "Manual", engine: "3.6L V6",
    color: "Sarge Green", location: "Denver, CO",
    image: unsplashCar(1519245681939-d02f78ee5a69), images: [unsplashCar(1519245681939-d02f78ee5a69)],
    features: ["Locking Differentials", "Rock Rails", "35-inch Tires", "Winch", "LED Light Bar"],
    description: "Trail-ready Rubicon with aftermarket upgrades. Ready for any adventure.",
    seller: { name: "Emma S.", phone: "(720) 555-0145", rating: 4.8, memberSince: "2020" }, featured: false, createdAt: "2025-01-28"
  },
  {
    id: "8", make: "Audi", model: "RS 6 Avant", year: 2024, price: 125000, mileage: 3500,
    bodyType: "Wagon", fuelType: "Gasoline", transmission: "Automatic", engine: "4.0L Twin-Turbo V8",
    color: "Nardo Gray", location: "Seattle, WA",
    image: unsplashCar(1614162692292-7ac56d7f7f1e), images: [unsplashCar(1614162692292-7ac56d7f7f1e)],
    features: ["Carbon Ceramic Brakes", "Sport Differential", "Matrix LED", "Bang & Olufsen", "Air Suspension"],
    description: "The ultimate family hauler. Audi RS 6 Avant in iconic Nardo Gray.",
    seller: { name: "Olivia P.", phone: "(206) 555-0178", rating: 4.9, memberSince: "2019" }, featured: true, createdAt: "2025-03-04"
  },
  {
    id: "9", make: "Honda", model: "Civic Type R", year: 2024, price: 44500, mileage: 6200,
    bodyType: "Hatchback", fuelType: "Gasoline", transmission: "Manual", engine: "2.0L Turbo I4",
    color: "Championship White", location: "Atlanta, GA",
    image: unsplashCar(1583267746897-2cf415887172), images: [unsplashCar(1583267746897-2cf415887172)],
    features: ["Limited Slip Differential", "Brembo Brakes", "Adaptive Dampers", "Rev Match", "Alcantara Seats"],
    description: "The benchmark for hot hatches. Honda Civic Type R in its signature Championship White.",
    seller: { name: "Ryan J.", phone: "(404) 555-0123", rating: 4.7, memberSince: "2022" }, featured: false, createdAt: "2025-02-10"
  },
  {
    id: "10", make: "Range Rover", model: "Sport SVR", year: 2023, price: 115000, mileage: 8900,
    bodyType: "SUV", fuelType: "Gasoline", transmission: "Automatic", engine: "5.0L Supercharged V8",
    color: "Santorini Black", location: "Dallas, TX",
    image: unsplashCar(1606664515524-ed2f786a0bd6), images: [unsplashCar(1606664515524-ed2f786a0bd6)],
    features: ["SVR Seats", "Meridian Sound", "Pixel LED", "Adaptive Cruise", "Terrain Response 2"],
    description: "Range Rover Sport SVR — raw power meets refined luxury. Supercharged V8 performance.",
    seller: { name: "Taylor H.", phone: "(214) 555-0190", rating: 4.6, memberSince: "2021" }, featured: false, createdAt: "2025-01-15"
  },
  {
    id: "11", make: "Chevrolet", model: "Corvette Z06", year: 2024, price: 115600, mileage: 1800,
    bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", engine: "5.5L Flat-Plane V8",
    color: "Torch Red", location: "Phoenix, AZ",
    image: unsplashCar(1552519507-da3b142c6e3d), images: [unsplashCar(1552519507-da3b142c6e3d)],
    features: ["Z07 Package", "Carbon Fiber Aero", "Magnetic Ride", "Performance Data Recorder", "Bose Audio"],
    description: "The all-new C8 Z06 with the screaming flat-plane crank V8. Track-ready supercar performance.",
    seller: { name: "Daniel B.", phone: "(602) 555-0167", rating: 5.0, memberSince: "2018" }, featured: true, createdAt: "2025-03-06"
  },
  {
    id: "12", make: "Mazda", model: "MX-5 Miata RF", year: 2024, price: 38900, mileage: 4500,
    bodyType: "Convertible", fuelType: "Gasoline", transmission: "Manual", engine: "2.0L I4",
    color: "Soul Red Crystal", location: "Portland, OR",
    image: unsplashCar(1544829099-b9a0c07fad1a), images: [unsplashCar(1544829099-b9a0c07fad1a)],
    features: ["Retractable Fastback", "Bose Audio", "Bilstein Dampers", "BBS Wheels", "Recaro Seats"],
    description: "Pure driving joy. Mazda MX-5 Miata RF in gorgeous Soul Red Crystal metallic.",
    seller: { name: "Nina C.", phone: "(503) 555-0134", rating: 4.8, memberSince: "2022" }, featured: false, createdAt: "2025-02-25"
  },
  {
    id: "13", make: "Rivian", model: "R1T Adventure", year: 2024, price: 79500, mileage: 5600,
    bodyType: "Truck", fuelType: "Electric", transmission: "Automatic", engine: "Quad Motor AWD",
    color: "Forest Green", location: "Austin, TX",
    image: unsplashCar(1612825173281-9a193378527e), images: [unsplashCar(1612825173281-9a193378527e)],
    features: ["Camp Kitchen", "Tonneau Cover", "Air Compressor", "Gear Tunnel", "Max Pack Battery"],
    description: "Adventure-ready electric truck. Rivian R1T with the full Adventure package and camp kitchen.",
    seller: { name: "Lucas F.", phone: "(512) 555-0112", rating: 4.4, memberSince: "2023" }, featured: false, createdAt: "2025-02-18"
  },
  {
    id: "14", make: "Lexus", model: "LC 500", year: 2023, price: 98700, mileage: 7200,
    bodyType: "Coupe", fuelType: "Gasoline", transmission: "Automatic", engine: "5.0L V8",
    color: "Structural Blue", location: "San Diego, CA",
    image: unsplashCar(1618843479313-40f8afb4b4d8), images: [unsplashCar(1618843479313-40f8afb4b4d8)],
    features: ["Mark Levinson Audio", "Carbon Fiber Roof", "Active Rear Spoiler", "LDH", "Adaptive Variable Suspension"],
    description: "Rolling art. The Lexus LC 500 in ultra-rare Structural Blue — only 100 made worldwide.",
    seller: { name: "Sophia A.", phone: "(619) 555-0156", rating: 4.9, memberSince: "2020" }, featured: true, createdAt: "2025-03-03"
  },
  {
    id: "15", make: "Volkswagen", model: "Golf R", year: 2024, price: 46500, mileage: 3800,
    bodyType: "Hatchback", fuelType: "Gasoline", transmission: "Automatic", engine: "2.0L Turbo I4",
    color: "Lapiz Blue", location: "Minneapolis, MN",
    image: unsplashCar(1609521263047-f8f205293f24), images: [unsplashCar(1609521263047-f8f205293f24)],
    features: ["Drift Mode", "DCC Adaptive Chassis", "Akrapovič Exhaust", "Digital Cockpit Pro", "Harman Kardon"],
    description: "The sleeper of all sleepers. VW Golf R with the Akrapovič exhaust and drift mode unlocked.",
    seller: { name: "Marcus D.", phone: "(612) 555-0178", rating: 4.5, memberSince: "2021" }, featured: false, createdAt: "2025-02-08"
  },
  {
    id: "16", make: "Hyundai", model: "Ioniq 5 N", year: 2025, price: 67500, mileage: 900,
    bodyType: "SUV", fuelType: "Electric", transmission: "Automatic", engine: "Dual Motor AWD",
    color: "Performance Blue", location: "Nashville, TN",
    image: unsplashCar(1619767886558-efdc259cde1a), images: [unsplashCar(1619767886558-efdc259cde1a)],
    features: ["N e-shift", "Virtual Gearbox", "N Active Sound+", "Electronic LSD", "Drift Optimizer"],
    description: "The electric hot rod. Hyundai Ioniq 5 N redefines what an EV performance car can be.",
    seller: { name: "Grace M.", phone: "(615) 555-0145", rating: 4.7, memberSince: "2023" }, featured: true, createdAt: "2025-03-07"
  },
];

export const bodyTypes = ["Sedan", "SUV", "Coupe", "Truck", "Hatchback", "Wagon", "Convertible"];
export const fuelTypes = ["Gasoline", "Electric", "Hybrid", "Diesel"];
export const transmissionTypes = ["Automatic", "Manual"];
export const makes = [...new Set(cars.map(c => c.make))].sort();
