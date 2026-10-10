import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts'
import { GitCompare, Trophy, ArrowRight, X, Minus } from 'lucide-react'
import { phoneService } from '../../services/phoneService'
import PhoneCard from '../../components/PhoneCard/PhoneCard'
import { comparePhones } from '../../utils/scoring'
import type { Phone, ComparisonResult } from '../../types/phone'

import './ComparePage.css'

const CATEGORY_ICONS: Record<string, string> = {
  processor: '⚡', battery: '🔋', camera: '📷', screen: '🖥️',
  value: '💰', memory: '💾', connectivity: '📡', design: '🎨'
}

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const [allPhones, setAllPhones] = useState<Phone[]>([])
  const [phone1, setPhone1] = useState<Phone | null>(null)
  const [phone2, setPhone2] = useState<Phone | null>(null)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<1 | 2 | null>(null)
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    phoneService.getAll().then(data => {
      setAllPhones(data)
      const phone1Id = searchParams.get('phone1')
      if (phone1Id) {
        const found = data.find(p => p.id === phone1Id)
        if (found) setPhone1(found)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (phone1 && phone2) {
      const res = comparePhones(phone1, phone2)
      setResult(res)
      // Save to history
      if (phone1.id && phone2.id) {
        phoneService.saveComparison(
          phone1.id, phone2.id,
          res.winner?.id || null,
          res.phone1Score, res.phone2Score
        ).catch(() => {})
      }
    } else {
      setResult(null)
    }
  }, [phone1, phone2])

  const handleSelectPhone = (phone: Phone) => {
    if (selecting === 1) { setPhone1(phone); setSelecting(null) }
    if (selecting === 2) { setPhone2(phone); setSelecting(null) }
    setSearchQ('')
  }

  const filtered = allPhones.filter(p =>
    searchQ
      ? (`${p.brand} ${p.model}`).toLowerCase().includes(searchQ.toLowerCase())
      : true
  )



  return (
    <div className="compare-page page">
      <div className="container">
        {/* Header */}
        <div className="compare-header">
          <h1>📱 Telefonlarni solishtirish</h1>
          <p>Ikki smartfonni tanlang va aqlli algoritmimiz g'olibni aniqlasin</p>
        </div>

        {/* Phone Selectors */}
        <div className="phone-selectors">
          {/* Phone 1 */}
          <div className={`phone-selector-slot ${!phone1 ? 'empty' : ''} ${selecting === 1 ? 'selecting' : ''}`}>
            {phone1 ? (
              <div className="selected-phone">
                <button className="phone-slot__remove" onClick={() => setPhone1(null)}><X size={16} /></button>
                <div className="phone-slot__name">
                  <span className="phone-slot__badge">Telefon 1</span>
                  <h3>{phone1.brand} {phone1.model}</h3>
                  <span className="phone-slot__score">{(phone1.score_total || 0).toFixed(1)} ball</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelecting(1)}
                >
                  Almashtirish
                </button>
              </div>
            ) : (
              <button
                className="phone-slot__empty-btn"
                onClick={() => setSelecting(1)}
              >
                <div className="phone-slot__empty-icon">+</div>
                <span>Telefon 1 tanlang</span>
              </button>
            )}
          </div>

          <div className="vs-divider">
            <div className="vs-badge">VS</div>
            {phone1 && phone2 && <ArrowRight size={20} className="vs-arrow" />}
          </div>

          {/* Phone 2 */}
          <div className={`phone-selector-slot ${!phone2 ? 'empty' : ''} ${selecting === 2 ? 'selecting' : ''}`}>
            {phone2 ? (
              <div className="selected-phone">
                <button className="phone-slot__remove" onClick={() => setPhone2(null)}><X size={16} /></button>
                <div className="phone-slot__name">
                  <span className="phone-slot__badge phone-slot__badge--2">Telefon 2</span>
                  <h3>{phone2.brand} {phone2.model}</h3>
                  <span className="phone-slot__score">{(phone2.score_total || 0).toFixed(1)} ball</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelecting(2)}
                >
                  Almashtirish
                </button>
              </div>
            ) : (
              <button
                className="phone-slot__empty-btn"
                onClick={() => setSelecting(2)}
              >
                <div className="phone-slot__empty-icon phone-slot__empty-icon--2">+</div>
                <span>Telefon 2 tanlang</span>
              </button>
            )}
          </div>
        </div>

        {/* Phone Selection Panel */}
        {selecting && (
          <div className="selection-panel card animate-fade-up">
            <div className="selection-panel__header">
              <h4>Telefon {selecting} ni tanlang</h4>
              <button className="btn btn-icon btn-sm" onClick={() => setSelecting(null)}>
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Brend yoki model qidirish..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              autoFocus
            />
            <div className="selection-panel__grid">
              {loading ? (
                Array(6).fill(null).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 300 }} />
                ))
              ) : filtered.length === 0 ? (
                <p className="text-muted text-center" style={{ gridColumn: '1/-1' }}>Topilmadi</p>
              ) : (
                filtered.map(phone => (
                  <PhoneCard
                    key={phone.id}
                    phone={phone}
                    selectable
                    selected={
                      (selecting === 1 && phone1?.id === phone.id) ||
                      (selecting === 2 && phone2?.id === phone.id)
                    }
                    onSelect={handleSelectPhone}
                    showActions={false}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {result && (
          <div className="compare-results animate-fade-up">

            {/* Winner Banner */}
            <div className={`winner-banner ${result.winner ? '' : 'winner-banner--tie'}`}>
              <div className="winner-banner__icon">
                {result.winner ? <Trophy size={32} /> : <Minus size={32} />}
              </div>
              <div className="winner-banner__content">
                {result.winner ? (
                  <>
                    <div className="winner-banner__label">🏆 G'OLIB</div>
                    <div className="winner-banner__name">
                      {result.winner.brand} {result.winner.model}
                    </div>
                    <div className="winner-banner__score">
                      {result.winner === result.phone1
                        ? `${result.phone1Score.toFixed(1)} vs ${result.phone2Score.toFixed(1)}`
                        : `${result.phone2Score.toFixed(1)} vs ${result.phone1Score.toFixed(1)}`
                      } ball
                    </div>
                  </>
                ) : (
                  <>
                    <div className="winner-banner__label">🤝 TENGLASHDI</div>
                    <div className="winner-banner__name">Ikki telefon teng natija ko'rsatdi</div>
                  </>
                )}
              </div>
              <div className="winner-banner__diff">
                {result.winner && (
                  <span className="diff-badge">
                    +{Math.abs(result.phone1Score - result.phone2Score).toFixed(1)} ball ustunlik
                  </span>
                )}
              </div>
            </div>

            {/* Score Overview */}
            <div className="score-overview grid-2">
              {[
                { phone: result.phone1, score: result.phone1Score, label: 'Telefon 1', isWinner: result.winner === result.phone1 },
                { phone: result.phone2, score: result.phone2Score, label: 'Telefon 2', isWinner: result.winner === result.phone2 },
              ].map(({ phone, score, label, isWinner }) => (
                <div key={label} className={`score-overview__card card ${isWinner ? 'score-overview__card--winner' : ''}`}>
                  {isWinner && <div className="winner-crown">👑 G'OLIB</div>}
                  <div className="score-overview__label">{label}</div>
                  <div className="score-overview__name">{phone.brand} {phone.model}</div>
                  <div className="score-overview__score">{score.toFixed(1)}</div>
                  <div className="score-bar">
                    <div className="score-bar__fill" style={{ width: `${score}%` }} />
                  </div>
                  <div className="score-overview__sub">Umumiy ball / 100</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              {/* Radar */}
              <div className="card">
                <h3 className="chart-title">📊 Radar diagramma</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={result.radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    />
                    <Radar
                      name={`${result.phone1.brand} ${result.phone1.model}`}
                      dataKey="phone1"
                      stroke="#7C6FF7"
                      fill="#7C6FF7"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Radar
                      name={`${result.phone2.brand} ${result.phone2.model}`}
                      dataKey="phone2"
                      stroke="#FF6B9D"
                      fill="#FF6B9D"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="card">
                <h3 className="chart-title">📈 Kategoriya taqqoslash</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={result.categories} layout="vertical">
                    <XAxis type="number" domain={[0, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                    <Bar dataKey="phone1Score" name={`${result.phone1.brand} ${result.phone1.model}`} fill="#7C6FF7" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="phone2Score" name={`${result.phone2.brand} ${result.phone2.model}`} fill="#FF6B9D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Winners */}
            <div className="card">
              <h3 className="chart-title">🏅 Kategoriya natijalari</h3>
              <div className="category-grid">
                {result.categories.map(cat => (
                  <div key={cat.key} className={`category-card category-card--${cat.winner}`}>
                    <div className="category-card__icon">{CATEGORY_ICONS[cat.key]}</div>
                    <div className="category-card__name">{cat.name}</div>
                    <div className="category-card__scores">
                      <span className={cat.winner === 'phone1' ? 'cat-winner' : ''}>{cat.phone1Score.toFixed(1)}</span>
                      <span className="cat-vs">—</span>
                      <span className={cat.winner === 'phone2' ? 'cat-winner' : ''}>{cat.phone2Score.toFixed(1)}</span>
                    </div>
                    <div className="category-card__weight">Og'irlik: {cat.weight}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="card">
              <h3 className="chart-title">📋 Batafsil xususiyatlar</h3>
              <div className="detail-table-header">
                <div></div>
                <div className="detail-col-head">{result.phone1.brand} {result.phone1.model}</div>
                <div className="detail-col-head">{result.phone2.brand} {result.phone2.model}</div>
              </div>
              <table className="compare-table">
                <tbody>
                  {[
                    { label: '🖥️ Ekran o\'lchami', v1: result.phone1.screen_size ? `${result.phone1.screen_size}"` : '—', v2: result.phone2.screen_size ? `${result.phone2.screen_size}"` : '—', higher: 'none' },
                    { label: '📺 Ekran turi', v1: result.phone1.screen_type || '—', v2: result.phone2.screen_type || '—', higher: 'none' },
                    { label: '🔄 Yangilanish tezligi', v1: result.phone1.screen_refresh_rate ? `${result.phone1.screen_refresh_rate}Hz` : '—', v2: result.phone2.screen_refresh_rate ? `${result.phone2.screen_refresh_rate}Hz` : '—', higher: 'number', n1: result.phone1.screen_refresh_rate || 0, n2: result.phone2.screen_refresh_rate || 0 },
                    { label: '⚡ Protsessor', v1: result.phone1.cpu_name || '—', v2: result.phone2.cpu_name || '—', higher: 'none' },
                    { label: '🎯 AnTuTu', v1: result.phone1.antutu_score?.toLocaleString() || '—', v2: result.phone2.antutu_score?.toLocaleString() || '—', higher: 'number', n1: result.phone1.antutu_score || 0, n2: result.phone2.antutu_score || 0 },
                    { label: '💾 RAM', v1: result.phone1.ram ? `${result.phone1.ram}GB` : '—', v2: result.phone2.ram ? `${result.phone2.ram}GB` : '—', higher: 'number', n1: result.phone1.ram || 0, n2: result.phone2.ram || 0 },
                    { label: '📦 Xotira', v1: result.phone1.storage ? `${result.phone1.storage}GB` : '—', v2: result.phone2.storage ? `${result.phone2.storage}GB` : '—', higher: 'number', n1: result.phone1.storage || 0, n2: result.phone2.storage || 0 },
                    { label: '📷 Asosiy kamera', v1: result.phone1.camera_main_mp ? `${result.phone1.camera_main_mp}MP` : '—', v2: result.phone2.camera_main_mp ? `${result.phone2.camera_main_mp}MP` : '—', higher: 'number', n1: result.phone1.camera_main_mp || 0, n2: result.phone2.camera_main_mp || 0 },
                    { label: '🎥 Video sifati', v1: result.phone1.camera_video || '—', v2: result.phone2.camera_video || '—', higher: 'none' },
                    { label: '🔋 Batareya', v1: result.phone1.battery_capacity ? `${result.phone1.battery_capacity}mAh` : '—', v2: result.phone2.battery_capacity ? `${result.phone2.battery_capacity}mAh` : '—', higher: 'number', n1: result.phone1.battery_capacity || 0, n2: result.phone2.battery_capacity || 0 },
                    { label: '⚡ Quvvatlash', v1: result.phone1.battery_charging_wired ? `${result.phone1.battery_charging_wired}W` : '—', v2: result.phone2.battery_charging_wired ? `${result.phone2.battery_charging_wired}W` : '—', higher: 'number', n1: result.phone1.battery_charging_wired || 0, n2: result.phone2.battery_charging_wired || 0 },
                    { label: '🌐 5G', v1: result.phone1.connectivity_5g ? '✅' : '❌', v2: result.phone2.connectivity_5g ? '✅' : '❌', higher: 'none' },
                    { label: '📶 WiFi', v1: result.phone1.connectivity_wifi || '—', v2: result.phone2.connectivity_wifi || '—', higher: 'none' },
                    { label: '🛡️ IP reytingi', v1: result.phone1.design_ip_rating || '—', v2: result.phone2.design_ip_rating || '—', higher: 'none' },
                    { label: '⚖️ Og\'irlik', v1: result.phone1.design_weight ? `${result.phone1.design_weight}g` : '—', v2: result.phone2.design_weight ? `${result.phone2.design_weight}g` : '—', higher: 'lower', n1: result.phone1.design_weight || 999, n2: result.phone2.design_weight || 999 },
                    { label: '💻 OS', v1: result.phone1.os_version || '—', v2: result.phone2.os_version || '—', higher: 'none' },
                    { label: '🔄 Yangilanish garanti', v1: result.phone1.os_update_years ? `${result.phone1.os_update_years} yil` : '—', v2: result.phone2.os_update_years ? `${result.phone2.os_update_years} yil` : '—', higher: 'number', n1: result.phone1.os_update_years || 0, n2: result.phone2.os_update_years || 0 },
                    { label: '💰 Narx (USD)', v1: result.phone1.price_usd ? `$${result.phone1.price_usd}` : '—', v2: result.phone2.price_usd ? `$${result.phone2.price_usd}` : '—', higher: 'lower', n1: result.phone1.price_usd || 0, n2: result.phone2.price_usd || 0 },
                  ].map((row) => {
                    let c1 = '', c2 = ''
                    const n1 = 'n1' in row ? (row.n1 ?? 0) : 0
                    const n2 = 'n2' in row ? (row.n2 ?? 0) : 0
                    if (row.higher === 'number') {
                      if (n1 > n2) { c1 = 'winner'; c2 = 'loser' }
                      else if (n2 > n1) { c2 = 'winner'; c1 = 'loser' }
                    } else if (row.higher === 'lower') {
                      if (n1 < n2) { c1 = 'winner'; c2 = 'loser' }
                      else if (n2 < n1) { c2 = 'winner'; c1 = 'loser' }
                    }
                    return (
                      <tr key={row.label}>
                        <td className="label-col">{row.label}</td>
                        <td className={`val-col ${c1}`}>{row.v1}</td>
                        <td className={`val-col ${c2}`}>{row.v2}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!phone1 && !phone2 && !selecting && (
          <div className="compare-empty card">
            <GitCompare size={64} className="compare-empty__icon" />
            <h3>Solishtirishni boshlang</h3>
            <p>Yuqoridagi tugmalar orqali ikki telefon tanlang</p>
          </div>
        )}
      </div>
    </div>
  )
}
