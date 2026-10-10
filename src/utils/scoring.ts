import type { Phone, ComparisonResult } from '../types/phone'

const WEIGHTS = {
  processor: 0.20,
  battery: 0.18,
  camera: 0.17,
  screen: 0.15,
  value: 0.12,
  memory: 0.10,
  connectivity: 0.05,
  design: 0.03,
}

// Protsessor bali (0–10)
function calcProcessorScore(phone: Phone): number {
  let score = 0
  if (phone.antutu_score) score += (Math.min(phone.antutu_score, 2200000) / 2200000) * 5
  if (phone.cpu_process) score += ((12 - Math.min(phone.cpu_process, 12)) / 9) * 2.5
  if (phone.cpu_max_clock) score += (Math.min(phone.cpu_max_clock, 4) / 4) * 2.5
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Batareya bali (0–10)
function calcBatteryScore(phone: Phone): number {
  let score = 0
  if (phone.battery_capacity) score += (Math.min(phone.battery_capacity, 6000) / 6000) * 4
  if (phone.battery_charging_wired) score += (Math.min(phone.battery_charging_wired, 150) / 150) * 3
  if (phone.battery_charging_wireless) score += (Math.min(phone.battery_charging_wireless, 100) / 100) * 1.5
  if (phone.battery_life_hours) score += (Math.min(phone.battery_life_hours, 20) / 20) * 1.5
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Kamera bali (0–10)
function calcCameraScore(phone: Phone): number {
  let score = 0
  if (phone.camera_main_mp) score += (Math.min(phone.camera_main_mp, 200) / 200) * 3
  if (phone.camera_main_aperture) {
    const ap = parseFloat(phone.camera_main_aperture.replace('f/', ''))
    score += ((3.5 - Math.min(ap, 3.5)) / 2) * 2
  }
  if (phone.camera_ois) score += 1.5
  if (phone.camera_video) {
    const videoMap: Record<string, number> = {
      '8K/30fps': 2, '8K/24fps': 1.8, '4K/60fps': 1.5,
      '4K/30fps': 1.0, '1080p/60fps': 0.5, '1080p/30fps': 0.2
    }
    score += videoMap[phone.camera_video] || 0
  }
  if (phone.camera_telephoto_zoom) score += Math.min(phone.camera_telephoto_zoom / 10, 1)
  if (phone.camera_front_mp) score += (Math.min(phone.camera_front_mp, 32) / 32) * 0.5
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Ekran bali (0–10)
function calcScreenScore(phone: Phone): number {
  let score = 0
  const screenTypeMap: Record<string, number> = {
    'Dynamic AMOLED': 3, 'LTPO AMOLED': 3, 'ProMotion OLED': 3,
    'AMOLED': 2.5, 'OLED': 2.5, 'IPS LCD': 1.5, 'Mini-LED': 2, 'TFT': 0.5
  }
  if (phone.screen_type) score += screenTypeMap[phone.screen_type] || 1.5
  const resMap: Record<string, number> = { 'QHD+': 3, 'FHD+': 2, 'HD+': 1, '4K': 3.5 }
  if (phone.screen_resolution) score += resMap[phone.screen_resolution] || 1
  if (phone.screen_refresh_rate) score += (Math.min(phone.screen_refresh_rate, 165) / 165) * 2
  if (phone.screen_brightness) score += (Math.min(phone.screen_brightness, 3000) / 3000) * 2
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Narx/sifat bali (0–10)
function calcValueScore(phone: Phone, baseScore: number): number {
  if (!phone.price_usd || phone.price_usd === 0) return 5
  const ratio = baseScore / phone.price_usd * 100
  return Math.min(Math.round(ratio * 10) / 10, 10)
}

// Xotira bali (0–10)
function calcMemoryScore(phone: Phone): number {
  let score = 0
  if (phone.ram) score += (Math.min(phone.ram, 24) / 24) * 4
  const ramTypeMap: Record<string, number> = { 'LPDDR5X': 2, 'LPDDR5': 1.5, 'LPDDR4X': 1, 'LPDDR4': 0.5 }
  if (phone.ram_type) score += ramTypeMap[phone.ram_type] || 0.5
  if (phone.storage) score += (Math.min(phone.storage, 1024) / 1024) * 3
  const stTypeMap: Record<string, number> = { 'UFS 4.0': 1, 'NVMe': 1, 'UFS 3.1': 0.7, 'UFS 2.2': 0.4, 'UFS 2.1': 0.2 }
  if (phone.storage_type) score += stTypeMap[phone.storage_type] || 0.1
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Aloqa bali (0–10)
function calcConnectivityScore(phone: Phone): number {
  let score = 0
  if (phone.connectivity_5g) score += 2.5
  const wifiMap: Record<string, number> = { 'WiFi 7': 2.5, 'WiFi 6E': 2, 'WiFi 6': 1.5, 'WiFi 5': 0.5 }
  if (phone.connectivity_wifi) score += wifiMap[phone.connectivity_wifi] || 0.5
  const btMap: Record<string, number> = { '5.4': 2, '5.3': 1.8, '5.2': 1.5, '5.1': 1.2, '5.0': 1 }
  if (phone.connectivity_bluetooth) score += btMap[phone.connectivity_bluetooth] || 0.5
  if (phone.connectivity_nfc) score += 1.5
  if (phone.connectivity_gps) score += 1
  const usbMap: Record<string, number> = { 'USB-C 3.2': 0.5, 'USB-C 3.0': 0.4, 'USB-C 2.0': 0.3, 'Lightning': 0.2, 'Micro-USB': 0 }
  if (phone.connectivity_usb) score += usbMap[phone.connectivity_usb] || 0
  return Math.min(Math.round(score * 10) / 10, 10)
}

// Dizayn bali (0–10)
function calcDesignScore(phone: Phone): number {
  let score = 0
  const matMap: Record<string, number> = { 'Titan': 3, 'Keramika': 2.8, 'Shisha': 2.5, 'Alyuminiy': 2, 'Teri': 2.2, 'Plastik': 1 }
  if (phone.design_material) score += matMap[phone.design_material] || 1
  const ipMap: Record<string, number> = { 'IP69K': 3, 'IP68': 2.5, 'IP67': 2, 'IP54': 1, 'Yo\'q': 0 }
  if (phone.design_ip_rating) score += ipMap[phone.design_ip_rating] || 0
  const fpMap: Record<string, number> = {
    'Ekran osti (ultrasovut)': 2, 'Ekran osti (optik)': 1.5,
    'Face ID': 2, 'Yon tugma': 1, 'Orqa': 0.5, 'Yo\'q': 0
  }
  if (phone.design_fingerprint) score += fpMap[phone.design_fingerprint] || 0
  if (phone.design_weight) {
    score += phone.design_weight < 200 ? 2 : phone.design_weight < 220 ? 1.5 : phone.design_weight < 240 ? 1 : 0.5
  }
  return Math.min(Math.round(score * 10) / 10, 10)
}

export function calculateScores(phone: Phone): Phone {
  const score_processor = calcProcessorScore(phone)
  const score_battery = calcBatteryScore(phone)
  const score_camera = calcCameraScore(phone)
  const score_screen = calcScreenScore(phone)
  const score_memory = calcMemoryScore(phone)
  const score_connectivity = calcConnectivityScore(phone)
  const score_design = calcDesignScore(phone)

  const baseTotal =
    score_processor * WEIGHTS.processor +
    score_battery * WEIGHTS.battery +
    score_camera * WEIGHTS.camera +
    score_screen * WEIGHTS.screen +
    score_memory * WEIGHTS.memory +
    score_connectivity * WEIGHTS.connectivity +
    score_design * WEIGHTS.design

  const score_value = calcValueScore(phone, baseTotal * 10)
  const score_total = Math.round(
    (baseTotal + score_value * WEIGHTS.value) * 100 * 10
  ) / 10

  return {
    ...phone,
    score_processor,
    score_battery,
    score_camera,
    score_screen,
    score_value,
    score_memory,
    score_connectivity,
    score_design,
    score_total: Math.min(score_total, 100),
  }
}

export function comparePhones(phone1: Phone, phone2: Phone): ComparisonResult {
  const p1 = calculateScores(phone1)
  const p2 = calculateScores(phone2)

  const categories = [
    { name: 'Protsessor', key: 'processor', weight: 20, phone1Score: p1.score_processor || 0, phone2Score: p2.score_processor || 0 },
    { name: 'Batareya', key: 'battery', weight: 18, phone1Score: p1.score_battery || 0, phone2Score: p2.score_battery || 0 },
    { name: 'Kamera', key: 'camera', weight: 17, phone1Score: p1.score_camera || 0, phone2Score: p2.score_camera || 0 },
    { name: 'Ekran', key: 'screen', weight: 15, phone1Score: p1.score_screen || 0, phone2Score: p2.score_screen || 0 },
    { name: 'Narx/Sifat', key: 'value', weight: 12, phone1Score: p1.score_value || 0, phone2Score: p2.score_value || 0 },
    { name: 'Xotira', key: 'memory', weight: 10, phone1Score: p1.score_memory || 0, phone2Score: p2.score_memory || 0 },
    { name: 'Aloqa', key: 'connectivity', weight: 5, phone1Score: p1.score_connectivity || 0, phone2Score: p2.score_connectivity || 0 },
    { name: 'Dizayn', key: 'design', weight: 3, phone1Score: p1.score_design || 0, phone2Score: p2.score_design || 0 },
  ].map(cat => ({
    ...cat,
    winner: (cat.phone1Score > cat.phone2Score
      ? 'phone1'
      : cat.phone2Score > cat.phone1Score
        ? 'phone2'
        : 'tie') as 'phone1' | 'phone2' | 'tie',
  }))

  const phone1Score = p1.score_total || 0
  const phone2Score = p2.score_total || 0
  const winner = phone1Score > phone2Score ? p1 : phone2Score > phone1Score ? p2 : null

  const radarData = categories.map(cat => ({
    subject: cat.name,
    phone1: parseFloat(cat.phone1Score.toFixed(1)),
    phone2: parseFloat(cat.phone2Score.toFixed(1)),
  }))

  return { phone1: p1, phone2: p2, winner, phone1Score, phone2Score, categories, radarData }
}
