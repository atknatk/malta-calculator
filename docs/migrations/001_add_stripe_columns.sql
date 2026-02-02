-- Migration: Add Stripe columns to companies table
-- Run this in Supabase SQL Editor

-- Add Stripe customer and subscription columns
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription ON companies(stripe_subscription_id);

-- Add unique access token for employee portal access
-- (already exists in payslips table, just ensuring it's there)
-- access_token TEXT UNIQUE DEFAULT uuid_generate_v4()::text

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;
