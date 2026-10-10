import { Link, useLocation } from 'react-router-dom'
import { Smartphone, PlusCircle, GitCompare, Database, BarChart2 } from 'lucide-react'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Bosh sahifa', icon: BarChart2 },
  { to: '/phones', label: 'Telefon bazasi', icon: Database },
  { to: '/add', label: 'Qo\'shish', icon: PlusCircle },
  { to: '/compare', label: 'Solishtirish', icon: GitCompare },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Smartphone size={20} />
          </div>
          <span className="navbar__logo-text">
            Phone<span className="text-primary-gradient">Compare</span>
          </span>
          <span className="badge badge-primary">Pro</span>
        </Link>

        <nav className="navbar__nav">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <Link to="/add" className="btn btn-primary btn-sm navbar__cta">
          <PlusCircle size={16} />
          Telefon qo'shish
        </Link>
      </div>
    </header>
  )
}
