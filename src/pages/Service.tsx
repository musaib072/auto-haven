import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Droplets, CircleDot, Octagon, Search, Battery, Snowflake, Move, Sparkles, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { serviceTypes, timeSlots } from "@/data/services";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets, "circle-dot": CircleDot, octagon: Octagon, search: Search,
  battery: Battery, snowflake: Snowflake, move: Move, sparkles: Sparkles,
};

const steps = ["Select Service", "Pick Date & Time", "Your Details", "Confirm"];

const Service = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", carInfo: "", notes: "" });

  const service = serviceTypes.find((s) => s.id === selectedService);
  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!date && !!time;
    if (step === 2) return form.name && form.phone && form.carInfo;
    return true;
  };

  const next = () => { if (canNext() && step < 3) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const submit = () => {
    toast.success("Service appointment booked! (Demo only — no data saved)");
    setStep(0); setSelectedService(null); setDate(undefined); setTime(null);
    setForm({ name: "", phone: "", email: "", carInfo: "", notes: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Book a Service</h1>
        <p className="text-muted-foreground text-sm mb-8">Schedule your car maintenance in a few easy steps</p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium truncate">{s}</span>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Select Service */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceTypes.map((s) => {
              const Icon = iconMap[s.icon] || Sparkles;
              const selected = selectedService === s.id;
              return (
                <Card
                  key={s.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selected ? "border-accent ring-2 ring-accent/20" : "hover:border-accent/40"
                  )}
                  onClick={() => setSelectedService(s.id)}
                >
                  <CardContent className="p-5 flex gap-4">
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", selected ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{s.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                        <span className="font-medium text-foreground">{s.priceRange}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block font-medium">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full sm:w-72 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date() || d.getDay() === 0}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="mb-2 block font-medium">Select Time</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map((t) => (
                  <Button
                    key={t}
                    variant={time === t ? "default" : "outline"}
                    size="sm"
                    className={cn("text-xs", time === t && "bg-accent text-accent-foreground hover:bg-accent/90")}
                    onClick={() => setTime(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Full Name *</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" /></div>
                <div><Label>Phone *</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 000-0000" /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" /></div>
              <div><Label>Vehicle (Year, Make, Model) *</Label><Input value={form.carInfo} onChange={(e) => update("carInfo", e.target.value)} placeholder="2024 Toyota Camry" /></div>
              <div><Label>Additional Notes</Label><Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any specific concerns..." rows={3} /></div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Booking Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Service</p><p className="font-medium mt-0.5">{service?.name}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Est. Price</p><p className="font-medium mt-0.5">{service?.priceRange}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Date</p><p className="font-medium mt-0.5">{date ? format(date, "PPP") : "—"}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Time</p><p className="font-medium mt-0.5">{time}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Name</p><p className="font-medium mt-0.5">{form.name}</p></div>
                <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium mt-0.5">{form.phone}</p></div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Vehicle</p><p className="font-medium mt-0.5">{form.carInfo}</p></div>
                {form.notes && <div className="col-span-2 bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Notes</p><p className="font-medium mt-0.5">{form.notes}</p></div>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prev} disabled={step === 0}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          {step < 3 ? (
            <Button onClick={next} disabled={!canNext()} className="bg-accent text-accent-foreground hover:bg-accent/90">Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
          ) : (
            <Button onClick={submit} className="bg-accent text-accent-foreground hover:bg-accent/90">Confirm Booking</Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Service;
