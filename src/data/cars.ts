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

export const cars: Car[] = [];

export const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Wagon", "Convertible", "Truck"];
export const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
export const transmissionTypes = ["Automatic", "Manual"];
export const makes = [...new Set(cars.map(c => c.make))].sort();
