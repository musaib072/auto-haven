import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Car } from "@/data/cars";

export type DbCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  engine: string | null;
  color: string | null;
  description: string | null;
  location: string | null;
  image_url: string | null;
  gallery: string[] | null;
  features: string[] | null;
  seller_name: string | null;
  seller_phone: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

/** Convert a DB car row to the app's Car type */
export function dbCarToAppCar(db: DbCar): Car {
  return {
    id: db.id,
    make: db.make,
    model: db.model,
    year: db.year,
    price: db.price,
    mileage: db.mileage,
    bodyType: db.body_type,
    fuelType: db.fuel_type,
    transmission: db.transmission,
    engine: db.engine ?? "",
    color: db.color ?? "",
    location: db.location ?? "",
    image: db.image_url ?? "/placeholder.svg",
    images: db.gallery?.length ? db.gallery : [db.image_url ?? "/placeholder.svg"],
    features: db.features ?? [],
    description: db.description ?? "",
    seller: {
      name: db.seller_name ?? "Unknown",
      phone: db.seller_phone ?? "",
      rating: 4.5,
      memberSince: new Date(db.created_at).getFullYear().toString(),
    },
    featured: db.is_featured,
    createdAt: db.created_at,
  };
}

export function useDbCars() {
  return useQuery({
    queryKey: ["db-cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DbCar[]).map(dbCarToAppCar);
    },
  });
}

export function useAddCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (car: Omit<DbCar, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("cars").insert(car).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-cars"] }),
  });
}

export function useUpdateCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbCar> & { id: string }) => {
      const { error } = await supabase.from("cars").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-cars"] }),
  });
}

export function useDeleteCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["db-cars"] }),
  });
}

export async function uploadCarPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("autoflexii").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("autoflexii").getPublicUrl(path);
  return data.publicUrl;
}
