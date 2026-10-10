export interface Phone {
  id?: string
  created_at?: string
  updated_at?: string

  // Asosiy
  brand: string
  model: string
  year: number
  price_uzs?: number
  price_usd?: number
  image_url?: string

  // Ekran
  screen_size?: number
  screen_type?: string
  screen_resolution?: string
  screen_refresh_rate?: number
  screen_ppi?: number
  screen_brightness?: number

  // CPU
  cpu_name?: string
  cpu_manufacturer?: string
  cpu_process?: number
  cpu_cores?: number
  cpu_max_clock?: number
  gpu_name?: string
  antutu_score?: number
  geekbench_single?: number
  geekbench_multi?: number

  // Xotira
  ram?: number
  ram_type?: string
  storage?: number
  storage_type?: string
  microsd?: boolean
  microsd_max?: number

  // Kamera
  camera_rear_count?: number
  camera_main_mp?: number
  camera_main_aperture?: string
  camera_ultrawide_mp?: number
  camera_telephoto_mp?: number
  camera_telephoto_zoom?: number
  camera_ois?: boolean
  camera_video?: string
  camera_front_mp?: number
  camera_ai?: boolean

  // Batareya
  battery_capacity?: number
  battery_charging_wired?: number
  battery_charging_wireless?: number
  battery_reverse_charging?: boolean
  battery_life_hours?: number

  // Aloqa
  connectivity_5g?: boolean
  connectivity_wifi?: string
  connectivity_bluetooth?: string
  connectivity_nfc?: boolean
  connectivity_usb?: string
  connectivity_gps?: boolean

  // Dizayn
  design_material?: string
  design_weight?: number
  design_thickness?: number
  design_ip_rating?: string
  design_fingerprint?: string
  design_face_recognition?: boolean

  // OS
  os_name?: string
  os_version?: string
  os_update_years?: number

  // Ballar
  score_processor?: number
  score_battery?: number
  score_camera?: number
  score_screen?: number
  score_value?: number
  score_memory?: number
  score_connectivity?: number
  score_design?: number
  score_total?: number
}

export interface ComparisonResult {
  phone1: Phone
  phone2: Phone
  winner: Phone | null
  phone1Score: number
  phone2Score: number
  categories: {
    name: string
    key: string
    weight: number
    phone1Score: number
    phone2Score: number
    winner: 'phone1' | 'phone2' | 'tie'
  }[]
  radarData: {
    subject: string
    phone1: number
    phone2: number
  }[]
}

export const BRANDS = [
  'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Oppo',
  'Realme', 'OnePlus', 'Google', 'Sony', 'Motorola',
  'Nokia', 'Vivo', 'Tecno', 'Infinix', 'Boshqa'
]

export const SCREEN_TYPES = ['AMOLED', 'Dynamic AMOLED', 'OLED', 'IPS LCD', 'TFT', 'Mini-LED', 'ProMotion OLED']
export const SCREEN_RESOLUTIONS = ['HD+', 'FHD+', 'QHD+', '4K']
export const REFRESH_RATES = [60, 90, 120, 144, 165]
export const RAM_OPTIONS = [2, 3, 4, 6, 8, 12, 16, 18, 24]
export const RAM_TYPES = ['LPDDR4', 'LPDDR4X', 'LPDDR5', 'LPDDR5X']
export const STORAGE_OPTIONS = [32, 64, 128, 256, 512, 1024]
export const STORAGE_TYPES = ['eMMC', 'UFS 2.1', 'UFS 2.2', 'UFS 3.1', 'UFS 4.0', 'NVMe']
export const CPU_MANUFACTURERS = ['Qualcomm', 'MediaTek', 'Apple', 'Samsung', 'Google', 'Huawei']
export const CPU_PROCESSES = [3, 4, 5, 6, 7, 8, 10, 12]
export const WIFI_STANDARDS = ['WiFi 5', 'WiFi 6', 'WiFi 6E', 'WiFi 7']
export const BLUETOOTH_VERSIONS = ['5.0', '5.1', '5.2', '5.3', '5.4']
export const USB_TYPES = ['Micro-USB', 'USB-C 2.0', 'USB-C 3.0', 'USB-C 3.2', 'Lightning']
export const MATERIALS = ['Plastik', 'Shisha', 'Titan', 'Alyuminiy', 'Keramika', 'Teri']
export const IP_RATINGS = ['Yo\'q', 'IP54', 'IP67', 'IP68', 'IP69K']
export const FINGERPRINT_TYPES = ['Yo\'q', 'Yon tugma', 'Orqa', 'Ekran osti (optik)', 'Ekran osti (ultrasovut)', 'Face ID']
export const OS_NAMES = ['Android', 'iOS', 'HarmonyOS']
export const VIDEO_QUALITIES = ['1080p/30fps', '1080p/60fps', '4K/30fps', '4K/60fps', '8K/24fps', '8K/30fps']
