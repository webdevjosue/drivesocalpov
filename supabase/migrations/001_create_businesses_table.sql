-- Create businesses table for DriveSoCal POV directory
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('restaurant', 'hotel', 'attraction', 'service', 'shopping')),
    address TEXT,
    city TEXT,
    phone TEXT,
    website TEXT,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    featured BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);

-- Create index on featured for quick lookup of featured businesses
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON businesses(featured);

-- Create index on premium for quick lookup of premium businesses
CREATE INDEX IF NOT EXISTS idx_businesses_premium ON businesses(premium);

-- Create index on city for location-based filtering
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on businesses"
    ON businesses FOR SELECT
    TO anon
    USING (true);

-- Create policy to allow authenticated users to insert (if needed in future)
CREATE POLICY "Allow authenticated insert on businesses"
    ON businesses FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users to update (if needed in future)
CREATE POLICY "Allow authenticated update on businesses"
    ON businesses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO businesses (name, category, address, city, phone, website, description, latitude, longitude, featured, premium) VALUES
    ('SoCal Seafood Grill', 'restaurant', '123 Ocean Blvd', 'San Diego', '(619) 555-0123', 'https://example.com/seafood', 'Fresh seafood with a stunning ocean view', 32.7157, -117.1611, true, true),
    ('Desert Oasis Hotel', 'hotel', '456 Palm Drive', 'Palm Springs', '(760) 555-0456', 'https://example.com/hotel', 'Luxury resort with spa and golf course', 33.8303, -116.5455, true, true),
    ('Sunset Point', 'attraction', '789 Cliff Road', 'Laguna Beach', '(949) 555-0789', 'https://example.com/sunset', 'Best sunset views in Orange County', 33.5422, -117.7831, false, false),
    ('Rideshare Detail Shop', 'service', '321 Auto Lane', 'Los Angeles', '(323) 555-0321', 'https://example.com/detail', 'Professional car detailing for rideshare drivers', 34.0522, -118.2437, false, true),
    ('California Fashion Mall', 'shopping', '654 Shop Way', 'Santa Monica', '(310) 555-0654', 'https://example.com/mall', 'Premier shopping destination with 200+ stores', 34.0195, -118.4912, false, false);
