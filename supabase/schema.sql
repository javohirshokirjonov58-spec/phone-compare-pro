-- ============================================
-- PhoneCompare Pro — Supabase SQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PHONES TABLE
-- ============================================
CREATE TABLE phones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Asosiy ma'lumotlar
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_uzs BIGINT,
  price_usd NUMERIC(10, 2),
  image_url TEXT,

  -- Ekran
  screen_size NUMERIC(3, 1),
  screen_type TEXT,
  screen_resolution TEXT,
  screen_refresh_rate INTEGER,
  screen_ppi INTEGER,
  screen_brightness INTEGER,

  -- Protsessor
  cpu_name TEXT,
  cpu_manufacturer TEXT,
  cpu_process INTEGER,
  cpu_cores INTEGER,
  cpu_max_clock NUMERIC(4, 2),
  gpu_name TEXT,
  antutu_score INTEGER,
  geekbench_single INTEGER,
  geekbench_multi INTEGER,

  -- Xotira
  ram INTEGER,
  ram_type TEXT,
  storage INTEGER,
  storage_type TEXT,
  microsd BOOLEAN DEFAULT FALSE,
  microsd_max INTEGER,

  -- Kamera (orqa)
  camera_rear_count INTEGER,
  camera_main_mp NUMERIC(6, 1),
  camera_main_aperture TEXT,
  camera_ultrawide_mp NUMERIC(6, 1),
  camera_telephoto_mp NUMERIC(6, 1),
  camera_telephoto_zoom NUMERIC(4, 1),
  camera_ois BOOLEAN DEFAULT FALSE,
  camera_video TEXT,
  camera_front_mp NUMERIC(6, 1),
  camera_ai BOOLEAN DEFAULT FALSE,

  -- Batareya
  battery_capacity INTEGER,
  battery_charging_wired INTEGER,
  battery_charging_wireless INTEGER,
  battery_reverse_charging BOOLEAN DEFAULT FALSE,
  battery_life_hours NUMERIC(4, 1),

  -- Aloqa
  connectivity_5g BOOLEAN DEFAULT FALSE,
  connectivity_wifi TEXT,
  connectivity_bluetooth TEXT,
  connectivity_nfc BOOLEAN DEFAULT FALSE,
  connectivity_usb TEXT,
  connectivity_gps BOOLEAN DEFAULT TRUE,

  -- Dizayn
  design_material TEXT,
  design_weight INTEGER,
  design_thickness NUMERIC(4, 1),
  design_ip_rating TEXT,
  design_fingerprint TEXT,
  design_face_recognition BOOLEAN DEFAULT FALSE,

  -- OS
  os_name TEXT,
  os_version TEXT,
  os_update_years INTEGER,

  -- Ball (scores)
  score_processor NUMERIC(4, 1) DEFAULT 0,
  score_battery NUMERIC(4, 1) DEFAULT 0,
  score_camera NUMERIC(4, 1) DEFAULT 0,
  score_screen NUMERIC(4, 1) DEFAULT 0,
  score_value NUMERIC(4, 1) DEFAULT 0,
  score_memory NUMERIC(4, 1) DEFAULT 0,
  score_connectivity NUMERIC(4, 1) DEFAULT 0,
  score_design NUMERIC(4, 1) DEFAULT 0,
  score_total NUMERIC(5, 1) DEFAULT 0
);

-- ============================================
-- COMPARISONS TABLE (taqqoslash tarixi)
-- ============================================
CREATE TABLE comparisons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  phone1_id UUID REFERENCES phones(id) ON DELETE CASCADE,
  phone2_id UUID REFERENCES phones(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES phones(id) ON DELETE SET NULL,
  phone1_score NUMERIC(5, 1),
  phone2_score NUMERIC(5, 1)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_phones_brand ON phones(brand);
CREATE INDEX idx_phones_year ON phones(year);
CREATE INDEX idx_phones_score_total ON phones(score_total DESC);
CREATE INDEX idx_comparisons_phones ON comparisons(phone1_id, phone2_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Hamma foydalanuvchilar o'qiy oladi
CREATE POLICY "Public phones are viewable by everyone"
  ON phones FOR SELECT USING (true);

CREATE POLICY "Public comparisons are viewable by everyone"
  ON comparisons FOR SELECT USING (true);

-- Hamma foydalanuvchilar qo'sha oladi
CREATE POLICY "Anyone can insert phones"
  ON phones FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update phones"
  ON phones FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete phones"
  ON phones FOR DELETE USING (true);

CREATE POLICY "Anyone can insert comparisons"
  ON comparisons FOR INSERT WITH CHECK (true);

-- ============================================
-- UPDATED_AT trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_phones_updated_at
  BEFORE UPDATE ON phones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA — Dastlabki 8 ta telefon
-- ============================================
INSERT INTO phones (
  brand, model, year, price_uzs, price_usd,
  screen_size, screen_type, screen_resolution, screen_refresh_rate, screen_ppi, screen_brightness,
  cpu_name, cpu_manufacturer, cpu_process, cpu_cores, cpu_max_clock, gpu_name, antutu_score, geekbench_single, geekbench_multi,
  ram, ram_type, storage, storage_type, microsd,
  camera_rear_count, camera_main_mp, camera_main_aperture, camera_ultrawide_mp, camera_telephoto_mp, camera_telephoto_zoom, camera_ois, camera_video, camera_front_mp,
  battery_capacity, battery_charging_wired, battery_charging_wireless, battery_reverse_charging, battery_life_hours,
  connectivity_5g, connectivity_wifi, connectivity_bluetooth, connectivity_nfc, connectivity_usb, connectivity_gps,
  design_material, design_weight, design_thickness, design_ip_rating, design_fingerprint, design_face_recognition,
  os_name, os_version, os_update_years,
  score_processor, score_battery, score_camera, score_screen, score_value, score_memory, score_connectivity, score_design, score_total
) VALUES
-- 1. Samsung Galaxy S24 Ultra
(
  'Samsung', 'Galaxy S24 Ultra', 2024, 14500000, 1200,
  6.8, 'Dynamic AMOLED 2X', 'QHD+', 120, 505, 2600,
  'Snapdragon 8 Gen 3', 'Qualcomm', 4, 8, 3.3, 'Adreno 750', 2100000, 2100, 6800,
  12, 'LPDDR5X', 256, 'UFS 4.0', false,
  4, 200, 'f/1.7', 12, 50, 5, true, '8K/30fps', 12,
  5000, 45, 15, true, 14,
  true, 'WiFi 7', '5.3', true, 'USB-C 3.2', true,
  'Titan', 232, 8.6, 'IP68', 'Ekran osti (ultrasovut)', true,
  'Android', 'Android 14', 7,
  9.8, 7.5, 9.9, 9.7, 6.0, 9.0, 10.0, 9.2, 87.4
),
-- 2. Apple iPhone 15 Pro Max
(
  'Apple', 'iPhone 15 Pro Max', 2023, 16000000, 1300,
  6.7, 'OLED ProMotion', 'QHD+', 120, 460, 2000,
  'A17 Pro', 'Apple', 3, 6, 3.78, 'Apple GPU 6-core', 1800000, 2900, 7200,
  8, 'LPDDR5', 256, 'NVMe', false,
  3, 48, 'f/1.78', 13, 12, 5, true, '4K/60fps', 12,
  4422, 27, 15, true, 15,
  true, 'WiFi 6E', '5.3', true, 'USB-C 3.0', true,
  'Titan', 221, 8.25, 'IP68', 'Yon tugma', true,
  'iOS', 'iOS 17', 6,
  9.9, 7.0, 9.5, 9.8, 5.5, 8.5, 9.5, 9.5, 85.8
),
-- 3. Xiaomi 14 Ultra
(
  'Xiaomi', '14 Ultra', 2024, 13000000, 1100,
  6.73, 'LTPO AMOLED', 'QHD+', 120, 522, 3000,
  'Snapdragon 8 Gen 3', 'Qualcomm', 4, 8, 3.3, 'Adreno 750', 2050000, 2050, 6700,
  16, 'LPDDR5X', 512, 'UFS 4.0', false,
  4, 50, 'f/1.63', 12, 50, 5, true, '8K/30fps', 32,
  5000, 90, 80, true, 13,
  true, 'WiFi 7', '5.4', true, 'USB-C 3.2', true,
  'Shisha', 222, 9.35, 'IP68', 'Ekran osti (optik)', true,
  'Android', 'Android 14', 4,
  9.7, 8.5, 9.8, 9.6, 7.0, 10.0, 10.0, 8.8, 86.9
),
-- 4. Google Pixel 8 Pro
(
  'Google', 'Pixel 8 Pro', 2023, 11000000, 900,
  6.7, 'LTPO OLED', 'QHD+', 120, 489, 2400,
  'Google Tensor G3', 'Google', 4, 9, 2.91, 'Immortalis-G715s', 700000, 1450, 4300,
  12, 'LPDDR5', 128, 'UFS 3.1', false,
  3, 50, 'f/1.68', 48, 48, 5, true, '4K/60fps', 10.5,
  5050, 30, 23, true, 15,
  true, 'WiFi 7', '5.3', true, 'USB-C 3.2', true,
  'Shisha', 213, 8.8, 'IP68', 'Ekran osti (optik)', true,
  'Android', 'Android 14', 7,
  7.5, 8.0, 9.2, 9.4, 8.0, 7.5, 10.0, 8.5, 80.5
),
-- 5. OnePlus 12
(
  'OnePlus', '12', 2024, 10500000, 850,
  6.82, 'LTPO AMOLED', 'QHD+', 120, 510, 4500,
  'Snapdragon 8 Gen 3', 'Qualcomm', 4, 8, 3.3, 'Adreno 750', 2030000, 2030, 6600,
  16, 'LPDDR5X', 512, 'UFS 4.0', false,
  3, 50, 'f/1.6', 48, 64, 3, true, '4K/60fps', 32,
  5400, 100, 50, false, 14,
  true, 'WiFi 7', '5.4', true, 'USB-C 3.2', true,
  'Shisha', 220, 9.15, 'IP65', 'Ekran osti (optik)', true,
  'Android', 'Android 14', 4,
  9.6, 9.0, 8.5, 9.3, 8.5, 10.0, 10.0, 8.7, 84.2
),
-- 6. Samsung Galaxy A55
(
  'Samsung', 'Galaxy A55', 2024, 5500000, 450,
  6.6, 'Super AMOLED', 'FHD+', 120, 391, 1000,
  'Exynos 1480', 'Samsung', 4, 8, 2.75, 'Xclipse 540', 500000, 1050, 3600,
  8, 'LPDDR4X', 128, 'UFS 3.1', true,
  3, 50, 'f/1.8', 12, 5, 0, true, '4K/30fps', 32,
  5000, 45, 0, false, 12,
  true, 'WiFi 6', '5.3', true, 'USB-C 2.0', true,
  'Plastik', 213, 8.2, 'IP67', 'Ekran osti (optik)', true,
  'Android', 'Android 14', 4,
  6.5, 7.5, 7.2, 7.8, 9.2, 7.0, 8.5, 7.5, 70.3
),
-- 7. Xiaomi Redmi Note 13 Pro+
(
  'Xiaomi', 'Redmi Note 13 Pro+', 2024, 4200000, 350,
  6.67, 'AMOLED', 'FHD+', 120, 395, 1800,
  'Dimensity 7200 Ultra', 'MediaTek', 4, 8, 2.8, 'Mali-G610', 600000, 1050, 3400,
  12, 'LPDDR5', 512, 'UFS 2.2', false,
  3, 200, 'f/1.65', 8, 2, 0, true, '4K/30fps', 16,
  5000, 120, 0, false, 13,
  false, 'WiFi 6', '5.3', true, 'USB-C 2.0', true,
  'Shisha', 204, 8.9, 'IP68', 'Yon tugma', true,
  'Android', 'Android 13', 2,
  7.0, 8.0, 8.8, 7.5, 10.0, 8.5, 7.5, 7.8, 74.2
),
-- 8. Apple iPhone 14
(
  'Apple', 'iPhone 14', 2022, 9500000, 800,
  6.1, 'OLED', 'FHD+', 60, 460, 1200,
  'A15 Bionic', 'Apple', 5, 6, 3.23, 'Apple GPU 5-core', 1200000, 1780, 4700,
  6, 'LPDDR5', 128, 'NVMe', false,
  2, 12, 'f/1.5', 12, 0, 0, true, '4K/60fps', 12,
  3279, 20, 15, true, 12,
  true, 'WiFi 6', '5.3', true, 'USB-C 2.0', true,
  'Shisha', 172, 7.8, 'IP68', 'Face ID', true,
  'iOS', 'iOS 16', 5,
  8.0, 5.5, 8.0, 8.0, 6.5, 6.0, 8.5, 9.0, 72.8
);
