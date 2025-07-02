-- Add hsn_code column to invoice_items table to store HSN/SAC codes
ALTER TABLE public.invoice_items ADD COLUMN hsn_code TEXT;