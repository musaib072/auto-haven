import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Upload, X, Image, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { bodyTypes, fuelTypes, transmissionTypes } from "@/data/cars";
import { useDbCars, useAddCar, useUpdateCar, useDeleteCar, uploadCarPhoto } from "@/hooks/useCars";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const emptyForm = {
  make: "", model: "", year: "", price: "", mileage: "", body_type: "Sedan",
  fuel_type: "Gasoline", transmission: "Automatic", engine: "", color: "",
  description: "", location: "", image_url: "", gallery: [] as string[],
  features: "", seller_name: "", seller_phone: "", is_featured: false,
};

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else toast.success("Account created! You are now logged in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const { data: cars = [], isLoading } = useDbCars();
  const addCar = useAddCar();
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <h1 className="text-xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Login</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "First time?"}{" "}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-accent underline">
                    {isSignUp ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const update = (field: string, value: string | boolean | string[]) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadCarPhoto(file);
        urls.push(url);
      }
      if (!form.image_url && urls.length > 0) {
        update("image_url", urls[0]);
      }
      update("gallery", [...form.gallery, ...urls]);
      toast.success(`${urls.length} photo(s) uploaded`);
    } catch (err) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    const newGallery = form.gallery.filter((u) => u !== url);
    update("gallery", newGallery);
    if (form.image_url === url) {
      update("image_url", newGallery[0] || "");
    }
  };

  const setMainPhoto = (url: string) => update("image_url", url);

  const handleSubmit = async () => {
    if (!form.make || !form.model || !form.year || !form.price) {
      toast.error("Please fill in make, model, year, and price");
      return;
    }
    const payload = {
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      price: parseFloat(form.price),
      mileage: parseInt(form.mileage) || 0,
      body_type: form.body_type,
      fuel_type: form.fuel_type,
      transmission: form.transmission,
      engine: form.engine || null,
      color: form.color || null,
      description: form.description || null,
      location: form.location || null,
      image_url: form.image_url || null,
      gallery: form.gallery.length ? form.gallery : null,
      features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : null,
      seller_name: form.seller_name || null,
      seller_phone: form.seller_phone || null,
      is_featured: form.is_featured,
    };

    try {
      if (editing) {
        await updateCar.mutateAsync({ id: editing, ...payload });
        toast.success("Car updated!");
      } else {
        await addCar.mutateAsync(payload);
        toast.success("Car added!");
      }
      resetForm();
    } catch (err) {
      toast.error("Failed to save car");
    }
  };

  const handleEdit = (car: typeof cars[0]) => {
    setForm({
      make: car.make,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      mileage: car.mileage.toString(),
      body_type: car.bodyType,
      fuel_type: car.fuelType,
      transmission: car.transmission,
      engine: car.engine,
      color: car.color,
      description: car.description,
      location: car.location,
      image_url: car.image,
      gallery: car.images.filter((i) => i !== "/placeholder.svg"),
      features: car.features.join(", "),
      seller_name: car.seller.name,
      seller_phone: car.seller.phone,
      is_featured: car.featured,
    });
    setEditing(car.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this car listing?")) return;
    try {
      await deleteCar.mutateAsync(id);
      toast.success("Car deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Manage Cars
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Add, edit, and remove your car listings</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" /> Add Car
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {editing ? "Edit Car" : "Add New Car"}
                </h2>
                <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><Label>Make *</Label><Input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="Toyota" /></div>
                <div><Label>Model *</Label><Input value={form.model} onChange={(e) => update("model", e.target.value)} placeholder="Camry" /></div>
                <div><Label>Year *</Label><Input type="number" value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="2024" /></div>
                <div><Label>Price *</Label><Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="35000" /></div>
                <div><Label>Mileage</Label><Input type="number" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} placeholder="15000" /></div>
                <div><Label>Color</Label><Input value={form.color} onChange={(e) => update("color", e.target.value)} placeholder="Silver" /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>Body Type</Label>
                  <Select value={form.body_type} onValueChange={(v) => update("body_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{bodyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fuel Type</Label>
                  <Select value={form.fuel_type} onValueChange={(v) => update("fuel_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transmission</Label>
                  <Select value={form.transmission} onValueChange={(v) => update("transmission", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{transmissionTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>Engine</Label><Input value={form.engine} onChange={(e) => update("engine", e.target.value)} placeholder="2.5L I4" /></div>
                <div><Label>Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, State" /></div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the vehicle..." rows={3} />
              </div>

              <div>
                <Label>Features (comma-separated)</Label>
                <Input value={form.features} onChange={(e) => update("features", e.target.value)} placeholder="Sunroof, Leather Seats, Navigation" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><Label>Seller Name</Label><Input value={form.seller_name} onChange={(e) => update("seller_name", e.target.value)} placeholder="John Doe" /></div>
                <div><Label>Seller Phone</Label><Input value={form.seller_phone} onChange={(e) => update("seller_phone", e.target.value)} placeholder="(555) 000-0000" /></div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={form.is_featured} onCheckedChange={(v) => update("is_featured", v)} />
                <Label>Featured listing</Label>
              </div>

              {/* Photo Upload */}
              <div>
                <Label className="mb-2 block">Photos</Label>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-accent/40 transition-colors">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Photos"}
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                </label>
                {form.gallery.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {form.gallery.map((url) => (
                      <div key={url} className="relative group rounded-lg overflow-hidden w-24 h-24 border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {form.image_url === url && (
                          <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">Main</span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button onClick={() => setMainPhoto(url)} className="text-white p-1 hover:text-accent"><Image className="h-3.5 w-3.5" /></button>
                          <button onClick={() => removePhoto(url)} className="text-white p-1 hover:text-red-400"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={addCar.isPending || updateCar.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {editing ? "Update Car" : "Add Car"}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cars List */}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2">No cars yet</p>
            <p className="text-muted-foreground text-sm">Click "Add Car" to create your first listing</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{car.price.toLocaleString('en-IN')} · {car.mileage.toLocaleString('en-IN')} km · {car.location || "No location"}
                    </p>
                    {car.featured && <span className="text-xs text-accent font-medium">Featured</span>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(car)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(car.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
