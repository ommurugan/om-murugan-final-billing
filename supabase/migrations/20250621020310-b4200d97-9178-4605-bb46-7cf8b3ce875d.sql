
-- Add hsn_code column to parts table
ALTER TABLE public.parts ADD COLUMN hsn_code TEXT;

-- Add hsn_code column to services table  
ALTER TABLE public.services ADD COLUMN hsn_code TEXT;

-- Update existing services with default HSN codes
UPDATE public.services SET hsn_code = '998314' WHERE hsn_code IS NULL;

-- Update existing parts with default HSN codes
UPDATE public.parts SET hsn_code = '998313' WHERE hsn_code IS NULL;
