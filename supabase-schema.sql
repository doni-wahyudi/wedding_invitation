-- ============================================
-- Islamic Wedding Invitation - Supabase Schema
-- ============================================

-- Guests / Invited List Table
-- slug: URL-friendly identifier, e.g. "doni-wahyudi" for ?to=doni-wahyudi
-- name: Display name shown on the invitation, e.g. "Bapak Doni Wahyudi"
-- greeting: Optional custom greeting, e.g. "Bapak/Ibu" (defaults to "Bapak/Ibu/Saudara/i")
-- max_guests: Maximum number of guests they can bring
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  greeting TEXT DEFAULT 'Bapak/Ibu/Saudara/i',
  max_guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookup
CREATE INDEX idx_guests_slug ON guests(slug);

-- Messages & Doa Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RSVP Table
CREATE TABLE rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir', 'masih_ragu')),
  guest_count INTEGER DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Public access policies (anyone can insert and read)
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on messages" ON messages FOR SELECT USING (true);

CREATE POLICY "Allow public insert on rsvp" ON rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on rsvp" ON rsvp FOR SELECT USING (true);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
-- Guests table: public read-only (you manage invitations from Supabase dashboard)
CREATE POLICY "Allow public select on guests" ON guests FOR SELECT USING (true);

-- ============================================
-- Example: Insert guests via Supabase SQL Editor
-- ============================================
-- INSERT INTO guests (slug, name, greeting, max_guests) VALUES
--   ('doni-wahyudi', 'Bapak Doni Wahyudi', 'Bapak', 2),
--   ('siti-aminah', 'Ibu Siti Aminah & Keluarga', 'Ibu', 4),
--   ('keluarga-besar-ahmad', 'Keluarga Besar Ahmad', 'Bapak/Ibu/Saudara/i', 5);

