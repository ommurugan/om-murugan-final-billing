
-- Add the missing labor_charges column to the services table
ALTER TABLE public.services 
ADD COLUMN labor_charges numeric NOT NULL DEFAULT 0;
