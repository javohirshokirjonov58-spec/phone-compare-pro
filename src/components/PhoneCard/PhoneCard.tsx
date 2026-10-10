import { GitCompare, Trash2, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Phone } from '../../types/phone'
import './PhoneCard.css'

interface PhoneCardProps {
  phone: Phone
  selectable?: boolean
  selected?: boolean
  onSelect?: (phone: Phone) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'success' : score >= 60 ? 'primary' : 'danger'
  return <span className={`score-badge score-badge--${color}`}>{score.toFixed(1)}</span>
}

export default function PhoneCard({
  phone,
  selectable,
  selected,
  onSelect,
  onDelete,
  showActions = true,
}: PhoneCardProps) {
  const handleSelect = () => {
    if (selectable && onSelect) onSelect(phone)
  }

  return (
    <div
      className={`phone-card ${selectable ? 'phone-card--selectable' : ''} ${selected ? 'phone-card--selected' : ''}`}
      onClick={selectable ? handleSelect : undefined}
    >
      {selected && (
        <div className="phone-card__selected-badge">
          <span>✓ Tanlandi</span>
        </div>
      )}

      {/* Image */}
      <div className="phone-card__img-wrap">
        {phone.image_url ? (
          <img src={phone.image_url} alt={`${phone.brand} ${phone.model}`} className="phone-card__img" />
        ) : (
          <div className="phone-card__img-placeholder">
            <Smartphone size={40} />
          </div>
        )}
        <ScoreBadge score={phone.score_total || 0} />
      </div>

      {/* Info */}
      <div className="phone-card__info">
        <div className="phone-card__brand">{phone.brand}</div>
        <h3 className="phone-card__model">{phone.model}</h3>
        <div className="phone-card__year">{phone.year}</div>

        <div className="phone-card__specs">
          {phone.ram && <span className="spec-tag">{phone.ram}GB RAM</span>}
          {phone.storage && <span className="spec-tag">{phone.storage}GB</span>}
          {phone.camera_main_mp && <span className="spec-tag">{phone.camera_main_mp}MP</span>}
          {phone.connectivity_5g && <span className="spec-tag spec-tag--5g">5G</span>}
        </div>

        {phone.price_uzs && (
          <div className="phone-card__price">
            {phone.price_uzs.toLocaleString('uz-UZ')} so'm
          </div>
        )}
      </div>

      {/* Category scores mini */}
      <div className="phone-card__scores">
        {[
          { label: 'CPU', val: phone.score_processor },
          { label: 'Kamera', val: phone.score_camera },
          { label: 'Batareya', val: phone.score_battery },
          { label: 'Ekran', val: phone.score_screen },
        ].map(({ label, val }) => (
          <div key={label} className="mini-score">
            <span className="mini-score__label">{label}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((val || 0) / 10) * 100}%` }}
              />
            </div>
            <span className="mini-score__val">{(val || 0).toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && !selectable && (
        <div className="phone-card__actions">
          <Link
            to={`/compare?phone1=${phone.id}`}
            className="btn btn-secondary btn-sm"
            onClick={e => e.stopPropagation()}
          >
            <GitCompare size={14} />
            Solishtir
          </Link>
          <Link
            to={`/edit/${phone.id}`}
            className="btn btn-sm"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-glass)' }}
            onClick={e => e.stopPropagation()}
          >
            Tahrirlash
          </Link>
          {onDelete && (
            <button
              className="btn btn-icon btn-sm"
              style={{ color: 'var(--color-accent-red)', background: 'rgba(255,71,87,0.1)' }}
              onClick={e => { e.stopPropagation(); onDelete(phone.id!) }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {selectable && !selected && (
        <div className="phone-card__select-hint">Tanlash uchun bosing</div>
      )}
    </div>
  )
}
