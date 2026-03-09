import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { bodyTypes, fuelTypes, transmissionTypes } from "@/data/cars";
import { toast } from "sonner";

const steps = ["Car Details", "Description & Photos", "Pricing", "Review"];

const SellCar = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    make: "", model: "", year: "", bodyType: "", fuelType: "", transmission: "", engine: "", color: "", mileage: "",
    description: "", location: "", price: "", name: "", phone: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const next = () => { if (step < 3) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const submit = () => {
    toast.success("Listing submitted! (Demo only — no data saved)");
    setStep(0);
    setForm({ make: "", model: "", year: "", bodyType: "", fuelType: "", transmission: "", engine: "", color: "", mileage: "", description: "", location: "", price: "", name: "", phone: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sell Your Car</h1>
        <p className="text-muted-foreground text-sm mb-8">List your vehicle in just a few steps</p>

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

        <Card>
          <CardContent className="p-6 space-y-5">
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Make</Label><Input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Toyota" /></div>
                  <div><Label>Model</Label><Input value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="e.g. Camry" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="2024" /></div>
                  <div><Label>Mileage</Label><Input type="number" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} placeholder="15000" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Body Type</Label>
                    <Select value={form.bodyType} onValueChange={(v) => update("bodyType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fuel Type</Label>
                    <Select value={form.fuelType} onValueChange={(v) => update("fuelType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Transmission</Label>
                    <Select value={form.transmission} onValueChange={(v) => update("transmission", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{transmissionTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Engine</Label><Input value={form.engine} onChange={(e) => update("engine", e.target.value)} placeholder="2.5L I4" /></div>
                </div>
                <div><Label>Color</Label><Input value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="Silver" /></div>
              </>
            )}

            {step === 1 && (
              <>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your vehicle..." rows={5} /></div>
                <div><Label>Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, State" /></div>
                <div className="rounded-xl border-2 border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Photo Upload</p>
                  <p>Drag & drop or click to upload (demo only)</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div><Label>Asking Price ($)</Label><Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="35000" /></div>
                <div><Label>Your Name</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" /></div>
                <div><Label>Phone Number</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 000-0000" /></div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Review Your Listing</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(form).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                      <p className="font-medium mt-0.5">{k === "price" ? `$${Number(v).toLocaleString()}` : v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prev} disabled={step === 0}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              {step < 3 ? (
                <Button onClick={next} className="bg-accent text-accent-foreground hover:bg-accent/90">Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
              ) : (
                <Button onClick={submit} className="bg-accent text-accent-foreground hover:bg-accent/90">Submit Listing</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SellCar;
