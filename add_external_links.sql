-- Create the external_links table
CREATE TABLE IF NOT EXISTS public.external_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.external_links FOR SELECT
    USING (true);

-- Admin write access
CREATE POLICY "Admins can insert external_links."
    ON public.external_links FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update external_links."
    ON public.external_links FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete external_links."
    ON public.external_links FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert initial default links
INSERT INTO public.external_links (title, description, url, sort_order) VALUES 
('APEPDCL Bill Pay', 'Pay your Eastern Power electricity bills quickly and securely online.', 'https://www.apeasternpower.com/payWithoutLogin', 1),
('GVMC Property Tax', 'Search and pay your Greater Visakhapatnam Municipal Corporation property tax.', 'https://visakhapatnam.emunicipal.ap.gov.in/ptis/citizen/search/unified-searchForm.action#no-back-button', 2);
