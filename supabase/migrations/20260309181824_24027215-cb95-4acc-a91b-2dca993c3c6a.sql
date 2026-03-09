
DROP POLICY "Anyone can insert cars" ON public.cars;
DROP POLICY "Anyone can update cars" ON public.cars;
DROP POLICY "Anyone can delete cars" ON public.cars;

CREATE POLICY "Authenticated users can insert cars" ON public.cars
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars" ON public.cars
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete cars" ON public.cars
  FOR DELETE TO authenticated USING (true);
