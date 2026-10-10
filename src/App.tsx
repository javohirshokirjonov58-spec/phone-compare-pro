import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'
import HomePage from './pages/Home/HomePage'
import PhonesPage from './pages/Phones/PhonesPage'
import ComparePage from './pages/Compare/ComparePage'
import AddPhonePage from './pages/AddPhone/AddPhonePage'
import './styles/global.css'

function NotFound() {
  return (
    <div className="page empty-state">
      <h1 style={{ fontSize: '4rem', opacity: 0.2 }}>404</h1>
      <h3>Sahifa topilmadi</h3>
      <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Bosh sahifaga</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phones" element={<PhonesPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/add" element={<AddPhonePage />} />
        <Route path="/edit/:id" element={<AddPhonePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© 2026 PhoneCompare Pro — Eng yaxshi telefon tanlang</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Supabase · React · Vercel
          </span>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          },
          success: {
            iconTheme: { primary: '#43E97B', secondary: '#0E1221' }
          },
          error: {
            iconTheme: { primary: '#FF4757', secondary: '#0E1221' }
          }
        }}
      />
    </BrowserRouter>
  )
}
