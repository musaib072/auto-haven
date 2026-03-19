export type ServiceType = {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
};

export const serviceTypes: ServiceType[] = [
  { id: "oil-change", name: "Oil Change", description: "Full synthetic or conventional oil change with filter replacement", duration: "30-45 min", icon: "droplets" },
  { id: "tire-rotation", name: "Tire Rotation & Balance", description: "Rotate and balance all four tires for even wear", duration: "30-45 min", icon: "circle-dot" },
  { id: "brake-service", name: "Brake Service", description: "Brake pad replacement, rotor inspection, and fluid check", duration: "1-2 hrs", icon: "octagon" },
  { id: "inspection", name: "Full Inspection", description: "Comprehensive multi-point vehicle inspection and diagnostic", duration: "1 hr", icon: "search" },
  { id: "battery", name: "Battery Service", description: "Battery test, replacement, and terminal cleaning", duration: "20-30 min", icon: "battery" },
  { id: "ac-service", name: "A/C Service", description: "Air conditioning recharge, leak check, and performance test", duration: "45-60 min", icon: "snowflake" },
  { id: "alignment", name: "Wheel Alignment", description: "Four-wheel alignment to factory specifications", duration: "45-60 min", icon: "move" },
  { id: "detailing", name: "Full Detailing", description: "Interior and exterior detailing, wax, and polish", duration: "2-4 hrs", icon: "sparkles" },
];

export const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];
