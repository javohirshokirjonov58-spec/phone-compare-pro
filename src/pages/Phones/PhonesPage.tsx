import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, PlusCircle, X } from 'lucide-react'
import { phoneService } from '../../services/phoneService'
import PhoneCard from '../../components/PhoneCard/PhoneCard'
import type { Phone } from '../../types/phone'
import { BRANDS } from '../../types/phone'
import toast from 'react-hot-toast'
import './PhonesPage.css'

export default function PhonesPage() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [filtered, setFiltered] = useState<Phone[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ brand: '', os: '', minYear: '', maxPrice: '' })
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'year'>('score')
  const [showFilters, setShowFilters] = useState(false)

  const loadPhones = async () => {
    setLoading(true)
    try {
      const data = await phoneService.getAll()
      setPhones(data)
    } catch {
      toast.error('Ma\'lumotlarni yuklashda xato!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPhones() }, [])

  useEffect(() => {
    let result = [...phones]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
      )
    }
    if (filters.brand) result = result.filter(p => p.brand === filters.brand)
    if (filters.os) result = result.filter(p => p.os_name === filters.os)
    if (filters.minYear) result = result.filter(p => p.year >= parseInt(filters.minYear))
    if (filters.maxPrice) result = result.filter(p => (p.price_usd || 0) <= parseInt(filters.maxPrice))

    result.sort((a, b) => {
      if (sortBy === 'score') return (b.score_total || 0) - (a.score_total || 0)
      if (sortBy === 'price_asc') return (a.price_usd || 0) - (b.price_usd || 0)
      if (sortBy === 'price_desc') return (b.price_usd || 0) - (a.price_usd || 0)
      if (sortBy === 'year') return b.year - a.year
      return 0
    })
    setFiltered(result)
  }, [phones, search, filters, sortBy])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu telefonni o\'chirishni xohlaysizmi?')) return
    try {
      await phoneService.delete(id)
      toast.success('Telefon o\'chirildi!')
      loadPhones()
    } catch {
      toast.error('O\'chirishda xato!')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilters({ brand: '', os: '', minYear: '', maxPrice: '' })
    setSortBy('score')
  }

  const hasFilters = search || filters.brand || filters.os || filters.minYear || filters.maxPrice

  return (
    <div className="phones-page page">
      <div className="container">
        {/* Header */}
        <div className="phones-page__header">
          <div>
            <h1>Telefon bazasi</h1>
            <p>{filtered.length} ta telefon topildi</p>
          </div>
          <Link to="/add" className="btn btn-primary">
            <PlusCircle size={18} />
            Yangi telefon
          </Link>
        </div>

        {/* Toolbar */}
        <div className="phones-toolbar card">
          <div className="search-box">
            <Search size={18} className="search-box__icon" />
            <input
              type="text"
              className="search-box__input"
              placeholder="Brend yoki model qidiring..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-box__clear" onClick={() => setSearch('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            <select
              className="form-select toolbar-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="score">Ball bo'yicha</option>
              <option value="price_asc">Narx: arzon avval</option>
              <option value="price_desc">Narx: qimmat avval</option>
              <option value="year">Yangi avval</option>
            </select>

            <button
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filter {hasFilters ? '•' : ''}
            </button>

            <div className="view-toggle">
              <button
                className={`btn btn-icon btn-sm ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <Grid size={16} />
              </button>
              <button
                className={`btn btn-icon btn-sm ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="filter-panel card animate-fade-up">
            <div className="filter-panel__grid">
              <div className="form-group">
                <label className="form-label">Brend</label>
                <select
                  className="form-select"
                  value={filters.brand}
                  onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}
                >
                  <option value="">Barcha brendlar</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">OS</label>
                <select
                  className="form-select"
                  value={filters.os}
                  onChange={e => setFilters(f => ({ ...f, os: e.target.value }))}
                >
                  <option value="">Barcha OS</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="HarmonyOS">HarmonyOS</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Minimal yil</label>
                <select
                  className="form-select"
                  value={filters.minYear}
                  onChange={e => setFilters(f => ({ ...f, minYear: e.target.value }))}
                >
                  <option value="">Har qanday</option>
                  {[2024, 2023, 2022, 2021, 2020].map(y => (
                    <option key={y} value={y}>{y} yildan</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Maks narx ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Masalan: 800"
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                />
              </div>
            </div>
            {hasFilters && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                <X size={14} />
                Filterni tozalash
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="phones-grid stagger">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 400 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>Hech narsa topilmadi</h3>
            <p>Qidiruv yoki filter shartlarini o'zgartiring</p>
            {hasFilters && (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Filterni tozalash
              </button>
            )}
          </div>
        ) : (
          <div className={`phones-grid ${view === 'list' ? 'phones-grid--list' : ''} stagger`}>
            {filtered.map(phone => (
              <PhoneCard
                key={phone.id}
                phone={phone}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
