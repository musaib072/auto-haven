/** Option lists shared by the enquiry forms. */

export const budgetRanges = [
  "Under ₹3 Lakh",
  "₹3 – 5 Lakh",
  "₹5 – 8 Lakh",
  "₹8 – 12 Lakh",
  "₹12 – 20 Lakh",
  "₹20 – 35 Lakh",
  "Above ₹35 Lakh",
];

export const fuelOptions = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "Any"];

export const transmissionOptions = ["Manual", "Automatic", "Any"];

export const ownershipOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th Owner or more"];

export const vehicleTypes = ["Hatchback", "Sedan", "Compact SUV", "SUV", "MUV / MPV", "Luxury"];

export const spaPackages = [
  {
    id: "exterior-foam-wash",
    name: "Exterior Foam Wash",
    description: "pH-neutral snow-foam wash, wheel & tyre cleaning, hand dry and tyre dressing.",
  },
  {
    id: "interior-deep-clean",
    name: "Interior Deep Clean",
    description: "Vacuum, dashboard & panel detailing, upholstery shampoo and odour treatment.",
  },
  {
    id: "complete-car-spa",
    name: "Complete Car Spa",
    description: "Exterior foam wash plus full interior detailing — the complete reset for your car.",
  },
  {
    id: "polish-wax",
    name: "Machine Polish & Wax",
    description: "Removes light swirls and oxidation, finished with a protective wax layer for deep gloss.",
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    description: "Long-lasting hydrophobic paint protection with a mirror finish.",
  },
  {
    id: "engine-bay",
    name: "Engine Bay Cleaning",
    description: "Safe degreasing and dressing of the engine bay.",
  },
] as const;

/** Slots shown in the Car Spa / Inspection booking forms (24h values for comparisons). */
export const timeSlots = [
  { label: "09:00 AM", hour: 9 },
  { label: "11:00 AM", hour: 11 },
  { label: "01:00 PM", hour: 13 },
  { label: "03:00 PM", hour: 15 },
  { label: "05:00 PM", hour: 17 },
  { label: "07:00 PM", hour: 19 },
] as const;

const currentYear = new Date().getFullYear();
export const manufactureYears = Array.from({ length: 25 }, (_, i) => String(currentYear - i));
