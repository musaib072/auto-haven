
-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  body_type TEXT NOT NULL DEFAULT 'Sedan',
  fuel_type TEXT NOT NULL DEFAULT 'Gasoline',
  transmission TEXT NOT NULL DEFAULT 'Automatic',
  engine TEXT,
  color TEXT,
  description TEXT,
  location TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  seller_name TEXT,
  seller_phone TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Everyone can read cars
CREATE POLICY "Cars are publicly readable" ON public.cars FOR SELECT USING (true);

-- Allow all operations for admin demo
CREATE POLICY "Anyone can insert cars" ON public.cars FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cars" ON public.cars FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete cars" ON public.cars FOR DELETE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for car photos
INSERT INTO storage.buckets (id, name, public) VALUES ('car-photos', 'car-photos', true);

-- Storage policies
CREATE POLICY "Car photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'car-photos');
CREATE POLICY "Anyone can upload car photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'car-photos');
CREATE POLICY "Anyone can update car photos" ON storage.objects FOR UPDATE USING (bucket_id = 'car-photos');
CREATE POLICY "Anyone can delete car photos" ON storage.objects FOR DELETE USING (bucket_id = 'car-photos');
