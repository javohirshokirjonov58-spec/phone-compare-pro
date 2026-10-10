import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Save, Check } from 'lucide-react'
import { phoneService } from '../../services/phoneService'
import type { Phone } from '../../types/phone'
import {
  BRANDS, SCREEN_TYPES, SCREEN_RESOLUTIONS, REFRESH_RATES,
  RAM_OPTIONS, RAM_TYPES, STORAGE_OPTIONS, STORAGE_TYPES,
  CPU_MANUFACTURERS, CPU_PROCESSES, WIFI_STANDARDS, BLUETOOTH_VERSIONS,
  USB_TYPES, MATERIALS, IP_RATINGS, FINGERPRINT_TYPES, OS_NAMES, VIDEO_QUALITIES
} from '../../types/phone'
import toast from 'react-hot-toast'
import './AddPhonePage.css'

const STEPS = [
  { id: 1, title: 'Asosiy', icon: '📱' },
  { id: 2, title: 'Ekran', icon: '🖥️' },
  { id: 3, title: 'Protsessor', icon: '⚡' },
  { id: 4, title: 'Xotira', icon: '💾' },
  { id: 5, title: 'Kamera', icon: '📷' },
  { id: 6, title: 'Batareya', icon: '🔋' },
  { id: 7, title: 'Aloqa', icon: '📡' },
  { id: 8, title: 'Dizayn & OS', icon: '🎨' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 9 }, (_, i) => CURRENT_YEAR - i)

type FormData = Omit<Phone, 'id' | 'created_at' | 'updated_at'>

const initialForm: FormData = {
  brand: '', model: '', year: CURRENT_YEAR,
  screen_type: '', screen_resolution: '', screen_refresh_rate: 60,
  cpu_manufacturer: '', cpu_process: 4, cpu_cores: 8,
  ram_type: '', storage_type: '',
  camera_ois: false, camera_ai: false, camera_rear_count: 3,
  connectivity_5g: false, connectivity_nfc: false, connectivity_gps: true,
  microsd: false, battery_reverse_charging: false, battery_charging_wireless: 0,
  design_face_recognition: false, os_name: 'Android',
}

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="form-group">
      <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      {children}
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}

export default function AddPhonePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEdit && id) {
      phoneService.getById(id).then(phone => {
        if (phone) setForm(phone as FormData)
      })
    }
  }, [id])

  const set = (key: keyof FormData, val: unknown) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => { const n = { ...e }; delete n[key]; return n })
  }

  const num = (key: keyof FormData, val: string) =>
    set(key, val === '' ? undefined : parseFloat(val))

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {}
    if (step === 1) {
      if (!form.brand) errs.brand = 'Brend majburiy'
      if (!form.model) errs.model = 'Model majburiy'
      if (!form.year) errs.year = 'Yil majburiy'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (isEdit && id) {
        await phoneService.update(id, form)
        toast.success('Telefon yangilandi! ✅')
      } else {
        await phoneService.create(form)
        toast.success('Telefon qo\'shildi! 🎉')
      }
      navigate('/phones')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xato yuz berdi'
      toast.error(`Xato: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="add-phone-page page">
      <div className="container">
        <div className="add-phone-header">
          <h1>{isEdit ? '✏️ Telefon tahrirlash' : '➕ Yangi telefon qo\'shish'}</h1>
          <p>Telefon ma'lumotlarini to'ldiring — tizim avtomatik ball hisoblaydi</p>
        </div>

        {/* Progress Steps */}
        <div className="steps-progress">
          {STEPS.map(s => (
            <button
              key={s.id}
              className={`step-pill ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}
              onClick={() => step > s.id && setStep(s.id)}
            >
              <span className="step-pill__icon">
                {step > s.id ? <Check size={12} /> : s.icon}
              </span>
              <span className="step-pill__label">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="progress-bar" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="progress-fill" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>

        {/* Form Steps */}
        <div className="form-card card animate-fade-up">
          <div className="form-step-title">
            <span className="step-icon">{STEPS[step - 1].icon}</span>
            <div>
              <h3>Qadam {step} / {STEPS.length}: {STEPS[step - 1].title}</h3>
            </div>
          </div>

          <div className="divider" />

          {/* Step 1: Asosiy */}
          {step === 1 && (
            <div className="form-grid">
              <Field label="Brend" required>
                <select className="form-select" value={form.brand} onChange={e => set('brand', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.brand && <p className="form-error">{errors.brand}</p>}
              </Field>
              <Field label="Model nomi" required>
                <input className="form-input" value={form.model || ''} onChange={e => set('model', e.target.value)} placeholder="Galaxy S24 Ultra" />
                {errors.model && <p className="form-error">{errors.model}</p>}
              </Field>
              <Field label="Yil" required>
                <select className="form-select" value={form.year} onChange={e => set('year', parseInt(e.target.value))}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Narx (so'm)" hint="Masalan: 12500000">
                <input type="number" className="form-input" value={form.price_uzs || ''} onChange={e => num('price_uzs', e.target.value)} placeholder="12500000" />
              </Field>
              <Field label="Narx ($)" hint="USD da narx">
                <input type="number" className="form-input" value={form.price_usd || ''} onChange={e => num('price_usd', e.target.value)} placeholder="1000" />
              </Field>
              <Field label="Rasm URL" hint="Telefon rasmi URL manzili (ixtiyoriy)">
                <input className="form-input" value={form.image_url || ''} onChange={e => set('image_url', e.target.value)} placeholder="https://example.com/phone.png" />
              </Field>
            </div>
          )}

          {/* Step 2: Ekran */}
          {step === 2 && (
            <div className="form-grid">
              <Field label="Ekran o'lchami (dyuym)">
                <input type="number" step="0.1" min="4" max="8" className="form-input" value={form.screen_size || ''} onChange={e => num('screen_size', e.target.value)} placeholder="6.7" />
              </Field>
              <Field label="Ekran turi">
                <select className="form-select" value={form.screen_type || ''} onChange={e => set('screen_type', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {SCREEN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Rezolyutsiya">
                <select className="form-select" value={form.screen_resolution || ''} onChange={e => set('screen_resolution', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {SCREEN_RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Yangilanish tezligi (Hz)">
                <select className="form-select" value={form.screen_refresh_rate || 60} onChange={e => set('screen_refresh_rate', parseInt(e.target.value))}>
                  {REFRESH_RATES.map(r => <option key={r} value={r}>{r}Hz</option>)}
                </select>
              </Field>
              <Field label="Yorqinlik (nits)" hint="Maksimal yorqinlik">
                <input type="number" className="form-input" value={form.screen_brightness || ''} onChange={e => num('screen_brightness', e.target.value)} placeholder="2000" />
              </Field>
              <Field label="PPI (piksel zichligi)">
                <input type="number" className="form-input" value={form.screen_ppi || ''} onChange={e => num('screen_ppi', e.target.value)} placeholder="460" />
              </Field>
            </div>
          )}

          {/* Step 3: Protsessor */}
          {step === 3 && (
            <div className="form-grid">
              <Field label="Chip nomi">
                <input className="form-input" value={form.cpu_name || ''} onChange={e => set('cpu_name', e.target.value)} placeholder="Snapdragon 8 Gen 3" />
              </Field>
              <Field label="Ishlab chiqaruvchi">
                <select className="form-select" value={form.cpu_manufacturer || ''} onChange={e => set('cpu_manufacturer', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {CPU_MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Texnologik jarayon (nm)">
                <select className="form-select" value={form.cpu_process || 4} onChange={e => set('cpu_process', parseInt(e.target.value))}>
                  {CPU_PROCESSES.map(p => <option key={p} value={p}>{p}nm</option>)}
                </select>
              </Field>
              <Field label="Yadra soni">
                <select className="form-select" value={form.cpu_cores || 8} onChange={e => set('cpu_cores', parseInt(e.target.value))}>
                  {[4, 6, 8, 10, 12].map(c => <option key={c} value={c}>{c} yadro</option>)}
                </select>
              </Field>
              <Field label="Maksimal chastota (GHz)">
                <input type="number" step="0.1" className="form-input" value={form.cpu_max_clock || ''} onChange={e => num('cpu_max_clock', e.target.value)} placeholder="3.3" />
              </Field>
              <Field label="GPU nomi">
                <input className="form-input" value={form.gpu_name || ''} onChange={e => set('gpu_name', e.target.value)} placeholder="Adreno 750" />
              </Field>
              <Field label="AnTuTu bali" hint="Benchmark natijasi">
                <input type="number" className="form-input" value={form.antutu_score || ''} onChange={e => num('antutu_score', e.target.value)} placeholder="2100000" />
              </Field>
              <Field label="Geekbench Single-core">
                <input type="number" className="form-input" value={form.geekbench_single || ''} onChange={e => num('geekbench_single', e.target.value)} placeholder="2100" />
              </Field>
              <Field label="Geekbench Multi-core">
                <input type="number" className="form-input" value={form.geekbench_multi || ''} onChange={e => num('geekbench_multi', e.target.value)} placeholder="6800" />
              </Field>
            </div>
          )}

          {/* Step 4: Xotira */}
          {step === 4 && (
            <div className="form-grid">
              <Field label="RAM (GB)">
                <select className="form-select" value={form.ram || ''} onChange={e => set('ram', parseInt(e.target.value))}>
                  <option value="">Tanlang...</option>
                  {RAM_OPTIONS.map(r => <option key={r} value={r}>{r}GB</option>)}
                </select>
              </Field>
              <Field label="RAM turi">
                <select className="form-select" value={form.ram_type || ''} onChange={e => set('ram_type', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {RAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Ichki xotira (GB)">
                <select className="form-select" value={form.storage || ''} onChange={e => set('storage', parseInt(e.target.value))}>
                  <option value="">Tanlang...</option>
                  {STORAGE_OPTIONS.map(s => <option key={s} value={s}>{s >= 1024 ? `${s / 1024}TB` : `${s}GB`}</option>)}
                </select>
              </Field>
              <Field label="Xotira turi">
                <select className="form-select" value={form.storage_type || ''} onChange={e => set('storage_type', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {STORAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="MicroSD slot">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.microsd || false} onChange={e => set('microsd', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.microsd ? 'Mavjud' : 'Yo\'q'}</span>
                </div>
              </Field>
              {form.microsd && (
                <Field label="MicroSD maks. hajmi (GB)">
                  <input type="number" className="form-input" value={form.microsd_max || ''} onChange={e => num('microsd_max', e.target.value)} placeholder="1024" />
                </Field>
              )}
            </div>
          )}

          {/* Step 5: Kamera */}
          {step === 5 && (
            <div className="form-grid">
              <Field label="Orqa kameralar soni">
                <select className="form-select" value={form.camera_rear_count || 3} onChange={e => set('camera_rear_count', parseInt(e.target.value))}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ta kamera</option>)}
                </select>
              </Field>
              <Field label="Asosiy kamera (MP)">
                <input type="number" className="form-input" value={form.camera_main_mp || ''} onChange={e => num('camera_main_mp', e.target.value)} placeholder="200" />
              </Field>
              <Field label="Asosiy kamera aperturasi">
                <input className="form-input" value={form.camera_main_aperture || ''} onChange={e => set('camera_main_aperture', e.target.value)} placeholder="f/1.7" />
              </Field>
              <Field label="Ultra-wide kamera (MP)">
                <input type="number" className="form-input" value={form.camera_ultrawide_mp || ''} onChange={e => num('camera_ultrawide_mp', e.target.value)} placeholder="12" />
              </Field>
              <Field label="Telephoto kamera (MP)">
                <input type="number" className="form-input" value={form.camera_telephoto_mp || ''} onChange={e => num('camera_telephoto_mp', e.target.value)} placeholder="50" />
              </Field>
              <Field label="Optik zoom (x)">
                <input type="number" step="0.1" className="form-input" value={form.camera_telephoto_zoom || ''} onChange={e => num('camera_telephoto_zoom', e.target.value)} placeholder="5" />
              </Field>
              <Field label="Selfie kamera (MP)">
                <input type="number" className="form-input" value={form.camera_front_mp || ''} onChange={e => num('camera_front_mp', e.target.value)} placeholder="12" />
              </Field>
              <Field label="Video sifati">
                <select className="form-select" value={form.camera_video || ''} onChange={e => set('camera_video', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {VIDEO_QUALITIES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="OIS (optik stabilizatsiya)">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.camera_ois || false} onChange={e => set('camera_ois', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.camera_ois ? 'Mavjud' : 'Yo\'q'}</span>
                </div>
              </Field>
              <Field label="AI kamera">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.camera_ai || false} onChange={e => set('camera_ai', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.camera_ai ? 'Mavjud' : 'Yo\'q'}</span>
                </div>
              </Field>
            </div>
          )}

          {/* Step 6: Batareya */}
          {step === 6 && (
            <div className="form-grid">
              <Field label="Batareya hajmi (mAh)">
                <input type="number" className="form-input" value={form.battery_capacity || ''} onChange={e => num('battery_capacity', e.target.value)} placeholder="5000" />
              </Field>
              <Field label="Sim quvvatlash tezligi (W)">
                <input type="number" className="form-input" value={form.battery_charging_wired || ''} onChange={e => num('battery_charging_wired', e.target.value)} placeholder="65" />
              </Field>
              <Field label="Simsiz quvvatlash (W)">
                <input type="number" className="form-input" value={form.battery_charging_wireless || ''} onChange={e => num('battery_charging_wireless', e.target.value)} placeholder="15" />
              </Field>
              <Field label="Taxminiy ishlash vaqti (soat)">
                <input type="number" step="0.5" className="form-input" value={form.battery_life_hours || ''} onChange={e => num('battery_life_hours', e.target.value)} placeholder="12" />
              </Field>
              <Field label="Teskari quvvatlash">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.battery_reverse_charging || false} onChange={e => set('battery_reverse_charging', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.battery_reverse_charging ? 'Mavjud' : 'Yo\'q'}</span>
                </div>
              </Field>
            </div>
          )}

          {/* Step 7: Aloqa */}
          {step === 7 && (
            <div className="form-grid">
              <Field label="5G">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.connectivity_5g || false} onChange={e => set('connectivity_5g', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.connectivity_5g ? '5G mavjud ✅' : '5G yo\'q'}</span>
                </div>
              </Field>
              <Field label="WiFi standarti">
                <select className="form-select" value={form.connectivity_wifi || ''} onChange={e => set('connectivity_wifi', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {WIFI_STANDARDS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </Field>
              <Field label="Bluetooth versiyasi">
                <select className="form-select" value={form.connectivity_bluetooth || ''} onChange={e => set('connectivity_bluetooth', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {BLUETOOTH_VERSIONS.map(b => <option key={b} value={b}>BT {b}</option>)}
                </select>
              </Field>
              <Field label="NFC">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.connectivity_nfc || false} onChange={e => set('connectivity_nfc', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.connectivity_nfc ? 'NFC mavjud ✅' : 'NFC yo\'q'}</span>
                </div>
              </Field>
              <Field label="USB turi">
                <select className="form-select" value={form.connectivity_usb || ''} onChange={e => set('connectivity_usb', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {USB_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="GPS">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.connectivity_gps !== false} onChange={e => set('connectivity_gps', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.connectivity_gps !== false ? 'GPS mavjud ✅' : 'GPS yo\'q'}</span>
                </div>
              </Field>
            </div>
          )}

          {/* Step 8: Dizayn & OS */}
          {step === 8 && (
            <div className="form-grid">
              <Field label="Material (orqa)">
                <select className="form-select" value={form.design_material || ''} onChange={e => set('design_material', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Og'irlik (gramm)">
                <input type="number" className="form-input" value={form.design_weight || ''} onChange={e => num('design_weight', e.target.value)} placeholder="200" />
              </Field>
              <Field label="Qalinligi (mm)">
                <input type="number" step="0.1" className="form-input" value={form.design_thickness || ''} onChange={e => num('design_thickness', e.target.value)} placeholder="8.5" />
              </Field>
              <Field label="IP reytingi">
                <select className="form-select" value={form.design_ip_rating || ''} onChange={e => set('design_ip_rating', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {IP_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Barmoq izi sensori">
                <select className="form-select" value={form.design_fingerprint || ''} onChange={e => set('design_fingerprint', e.target.value)}>
                  <option value="">Tanlang...</option>
                  {FINGERPRINT_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Yuz tanish">
                <div className="toggle-group">
                  <label className="toggle">
                    <input type="checkbox" checked={form.design_face_recognition || false} onChange={e => set('design_face_recognition', e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                  <span>{form.design_face_recognition ? 'Mavjud ✅' : 'Yo\'q'}</span>
                </div>
              </Field>
              <Field label="Operatsion tizim">
                <select className="form-select" value={form.os_name || 'Android'} onChange={e => set('os_name', e.target.value)}>
                  {OS_NAMES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="OS versiyasi">
                <input className="form-input" value={form.os_version || ''} onChange={e => set('os_version', e.target.value)} placeholder="Android 14" />
              </Field>
              <Field label="Yangilanish garanti (yil)">
                <select className="form-select" value={form.os_update_years || ''} onChange={e => set('os_update_years', parseInt(e.target.value))}>
                  <option value="">Tanlang...</option>
                  {[2, 3, 4, 5, 6, 7].map(y => <option key={y} value={y}>{y} yil</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* Navigation */}
          <div className="form-navigation">
            <button
              className="btn btn-secondary"
              onClick={() => setStep(s => Math.max(s - 1, 1))}
              disabled={step === 1}
            >
              <ChevronLeft size={18} />
              Orqaga
            </button>

            <div className="step-counter">
              {step} / {STEPS.length}
            </div>

            {step < STEPS.length ? (
              <button className="btn btn-primary" onClick={handleNext}>
                Keyingi
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEdit ? 'Yangilash' : 'Saqlash'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
