
-- Add latitude and longitude columns to the gigs table
ALTER TABLE public.gigs
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Optional: Create an index for geospatial queries if you plan to do "nearby" searches later
-- CREATE INDEX gigs_geo_index ON public.gigs USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));
