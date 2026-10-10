# 📱 PhoneCompare Pro

> Ikki telefonni 50+ xususiyat bo'yicha solishtiring va aqlli algoritm yordamida eng yaxshi tanlovni aniqlang.

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-green)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)

---

## 🚀 Texnologiya to'plami

| Texnologiya | Maqsad |
|------------|--------|
| **React + Vite** | Frontend framework |
| **TypeScript** | Type safety |
| **Supabase** | Database + Backend |
| **Recharts** | Diagrammalar |
| **React Router** | Routing |
| **React Hot Toast** | Bildirishnomalar |
| **Vercel** | Deployment |

---

## 📋 Funksiyalar

- ✅ **50+ texnik xususiyat** kiritish (8 qadam forma)
- ✅ **Aqlli baholash algoritmi** (8 kategoriya, og'irliklar)
- ✅ **Radar diagramma** va bar chart (Recharts)
- ✅ **Batafsil solishtirish jadvali** (yashil/qizil ajratish)
- ✅ **Qidiruv va filter** (brend, narx, yil, OS)
- ✅ **Grid/List view** almashtirish
- ✅ **Supabase** orqali bulut ma'lumotlar bazasi
- ✅ **8 ta dastlabki telefon** (seed data)
- ✅ **Vercel** deploy tayyor

---

## ⚡ Ishga tushirish

### 1. Clone qiling
```bash
git clone https://github.com/YOUR_USERNAME/phone-compare-pro.git
cd phone-compare-pro
```

### 2. Paketlarni o'rnating
```bash
npm install
```

### 3. Supabase sozlash

1. [supabase.com](https://supabase.com) ga boring
2. Yangi loyiha yarating
3. **SQL Editor** ga kiring va `supabase/schema.sql` ni ishga tushiring
4. **Settings → API** dan URL va anon key ni ko'ching

### 4. .env.local fayl yarating
```bash
cp .env.example .env.local
```

`.env.local` faylini oching va to'ldiring:
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Ishga tushiring
```bash
npm run dev
```

Brauzerda: **http://localhost:5173**

---

## 🗄️ Supabase sozlash (batafsil)

```sql
-- supabase/schema.sql faylini SQL Editor da ishlating
-- Bu fayl quyidagilarni qiladi:
-- 1. phones jadvalini yaratadi
-- 2. comparisons jadvalini yaratadi
-- 3. RLS (Row Level Security) sozlaydi
-- 4. 8 ta dastlabki telefon ma'lumotlarini qo'shadi
```

---

## 🌐 Vercel Deploy

### Variant 1: Avtomatik (GitHub orqali)
1. GitHub ga push qiling
2. [vercel.com](https://vercel.com) ga boring
3. "New Project" → GitHub repo tanlang
4. Environment Variables qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. "Deploy" ni bosing

### Variant 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## 📊 Baholash algoritmi

| Kategoriya | Og'irlik |
|-----------|---------|
| Protsessor | 20% |
| Batareya | 18% |
| Kamera | 17% |
| Ekran | 15% |
| Narx/Sifat | 12% |
| Xotira | 10% |
| Aloqa | 5% |
| Dizayn | 3% |

---

## 📁 Loyiha tuzilmasi

```
src/
├── components/
│   ├── Navbar/          # Navigatsiya
│   └── PhoneCard/       # Telefon kartochkasi
├── pages/
│   ├── Home/            # Bosh sahifa
│   ├── Phones/          # Telefon bazasi
│   ├── Compare/         # Solishtirish
│   └── AddPhone/        # Qo'shish/tahrirlash
├── services/
│   └── phoneService.ts  # Supabase CRUD
├── types/
│   └── phone.ts         # TypeScript turlar
├── utils/
│   └── scoring.ts       # Ball algoritmi
├── lib/
│   └── supabase.ts      # Supabase client
└── styles/
    └── global.css       # Dizayn tizimi
```

---

## 🤝 Hissa qo'shish

1. Fork qiling
2. Branch yarating: `git checkout -b feature/yangi-funksiya`
3. Commit qiling: `git commit -m 'Yangi funksiya qo'shildi'`
4. Push qiling: `git push origin feature/yangi-funksiya`
5. Pull Request oching

---

## 📄 Litsenziya

MIT © 2026 PhoneCompare Pro
