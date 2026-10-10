import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, PlusCircle, TrendingUp, Database, Zap, Shield, Star } from 'lucide-react'
import { phoneService } from '../../services/phoneService'
import PhoneCard from '../../components/PhoneCard/PhoneCard'
import type { Phone } from '../../types/phone'
import './HomePage.css'

const features = [
  { icon: Zap, title: '50+ xususiyat', desc: 'Ekran, CPU, kamera, batareya va boshqa ko\'plab texnik ma\'lumotlar' },
  { icon: TrendingUp, title: 'Aqlli algoritm', desc: '8 kategoriya bo\'yicha og\'irlikli hisoblash tizimi' },
  { icon: Shield, title: 'Ob\'ektiv natija', desc: 'Reklama yo\'q — faqat haqiqiy texnik ko\'rsatkichlar' },
]

export default function HomePage() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, brands: 0 })

  useEffect(() => {
    phoneService.getAll().then(data => {
      setPhones(data.slice(0, 6))
      const brands = new Set(data.map(p => p.brand)).size
      setStats({ total: data.length, brands })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="container">
          <div className="hero__content animate-fade-up">
            <div className="hero__badge">
              <Star size={12} />
              Eng yaxshi telefon taqqoslash tizimi
            </div>
            <h1 className="hero__title">
              Qaysi telefon <br />
              <span className="text-gradient">Sizga mos?</span>
            </h1>
            <p className="hero__subtitle">
              Ikki telefonni 50+ texnik xususiyat bo'yicha solishtiring va <br />
              aqlli algoritmimiz eng yaxshi tanlovni aniqlaydi.
            </p>
            <div className="hero__actions">
              <Link to="/compare" className="btn btn-primary btn-lg">
                <GitCompare size={20} />
                Solishtirish boshlash
              </Link>
              <Link to="/phones" className="btn btn-secondary btn-lg">
                <Database size={20} />
                Telefon bazasi
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="hero__stats stagger">
            <div className="stat-card animate-fade-up">
              <span className="stat-card__value">{stats.total}+</span>
              <span className="stat-card__label">Telefon</span>
            </div>
            <div className="stat-card animate-fade-up">
              <span className="stat-card__value">{stats.brands}+</span>
              <span className="stat-card__label">Brend</span>
            </div>
            <div className="stat-card animate-fade-up">
              <span className="stat-card__value">50+</span>
              <span className="stat-card__label">Xususiyat</span>
            </div>
            <div className="stat-card animate-fade-up">
              <span className="stat-card__value">8</span>
              <span className="stat-card__label">Kategoriya</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section">
        <div className="container">
          <div className="section__header text-center">
            <h2>Qanday ishlaydi?</h2>
            <p>3 oddiy qadamda eng yaxshi telefonni toping</p>
          </div>
          <div className="steps stagger">
            {[
              { num: '01', title: 'Telefonni tanlang', desc: 'Bazadan yoki yangi ma\'lumot kiritib 2 ta telefon tanlang' },
              { num: '02', title: 'Taqqoslang', desc: 'Algoritmimiz 8 kategoriya bo\'yicha avtomatik hisoblaydi' },
              { num: '03', title: 'Natijani ko\'ring', desc: 'G\'olibni, radar diagrammasini va batafsil tahlilni oling' },
            ].map(step => (
              <div key={step.num} className="step-card animate-fade-up">
                <div className="step-card__num">{step.num}</div>
                <h4 className="step-card__title">{step.title}</h4>
                <p className="step-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="section section--dark">
        <div className="container">
          <div className="section__header text-center">
            <h2>Nima uchun <span className="text-primary-gradient">PhoneCompare Pro?</span></h2>
          </div>
          <div className="features-grid stagger">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card animate-fade-up">
                <div className="feature-card__icon">
                  <Icon size={24} />
                </div>
                <h4 className="feature-card__title">{title}</h4>
                <p className="feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TOP PHONES ─── */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2>Top telefonlar</h2>
              <p>Eng yuqori ball olgan smartfonlar</p>
            </div>
            <div className="section__header-actions">
              <Link to="/phones" className="btn btn-secondary btn-sm">
                Hammasini ko'rish
              </Link>
              <Link to="/add" className="btn btn-primary btn-sm">
                <PlusCircle size={16} />
                Qo'shish
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="phones-grid">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 380 }} />
              ))}
            </div>
          ) : phones.length === 0 ? (
            <div className="empty-state card">
              <Database size={48} />
              <h3>Hozircha telefon yo'q</h3>
              <p>Birinchi telefonni qo'shing</p>
              <Link to="/add" className="btn btn-primary">
                <PlusCircle size={16} />
                Telefon qo'shish
              </Link>
            </div>
          ) : (
            <div className="phones-grid stagger">
              {phones.map(phone => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Telefon solishtirishga tayor?</h2>
            <p>Ikki telefonni tanlang va eng yaxshi tanlovni aniqlang</p>
            <div className="hero__actions">
              <Link to="/compare" className="btn btn-primary btn-lg">
                <GitCompare size={20} />
                Hozir boshlash
              </Link>
              <Link to="/add" className="btn btn-secondary btn-lg">
                <PlusCircle size={20} />
                Telefon qo'shish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
