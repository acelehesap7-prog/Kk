# KK Exchange - Gelişmiş Trading Platformu

KK Exchange, 7 farklı piyasa türünde işlem yapabileceğiniz gelişmiş bir trading platformudur. Modern teknolojiler kullanılarak geliştirilmiş, kullanıcı dostu arayüzü ve güçlü özellikleri ile profesyonel trading deneyimi sunar.

## 🚀 Özellikler

### 📊 7 Farklı Piyasa Türü
- **Spot Trading**: Gerçek zamanlı kripto para alım-satımı
- **Futures**: Vadeli işlemler ve leverage seçenekleri
- **Options**: Opsiyon sözleşmeleri ve Greeks hesaplamaları
- **Forex**: Döviz çiftleri ve majör paralar
- **Stocks**: Hisse senedi analizi ve işlemleri
- **Commodities**: Emtia fiyat takibi ve işlemleri
- **Indices**: Endeks performans metrikleri

### 💰 KK99 Token Sistemi
- **Token Ödülleri**: Her işlemde KK99 token kazanın
- **Komisyon İndirimleri**: %75'e varan indirimler
- **Staking Rewards**: Token stake ederek ek gelir
- **VIP Avantajları**: Özel analiz ve öncelikli destek

### 🎨 Modern UI/UX
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Dark/Light Mode**: Tema seçenekleri
- **Gelişmiş Grafikler**: Interactive trading charts
- **Real-time Data**: WebSocket ile canlı güncellemeler

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Tremor React
- **UI Components**: Radix UI, Headless UI
- **Charts**: Lightweight Charts, TradingView
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Supabase
- **Deployment**: GitHub Pages

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm
- PostgreSQL (opsiyonel, token işlemleri için)

### Hızlı Başlangıç

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/acelehesap6-design/Kk.git
cd Kk
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcınızda açın:**
```
http://localhost:3000
```

### Production Build

```bash
npm run build
```

### GitHub Pages Deployment

Proje otomatik olarak GitHub Actions ile GitHub Pages'e deploy edilir:

1. **GitHub Pages Ayarları:**
   - Repository Settings > Pages
   - Source: "GitHub Actions" seçin
   - Workflow dosyası: `.github/workflows/deploy.yml`

2. **Otomatik Deployment:**
   - `main` branch'e push yapıldığında otomatik deploy
   - Build süreci: Next.js static export
   - Deploy URL: `https://acelehesap6-design.github.io/Kk/`

3. **Manuel Deployment:**
   ```bash
   # Değişiklikleri commit edin
   git add .
   git commit -m "Update"
   git push origin main
   ```

## 📁 Proje Yapısı

```
/app
  /admin          # Admin paneli
  /auth           # Kimlik doğrulama (login/register)
  /dashboard      # Ana kullanıcı paneli
  /markets        # 7 farklı piyasa türü
    /spot         # Spot trading
    /futures      # Vadeli işlemler
    /options      # Opsiyon işlemleri
    /forex        # Döviz işlemleri
    /stocks       # Hisse senedi
    /commodities  # Emtia
    /indices      # Endeksler
  /wallet         # KK99 token cüzdanı
  /token          # KK99 Token bilgileri
  /trade          # Trading arayüzü
/components       # React bileşenleri
  /ui            # UI bileşenleri (card, button, input, etc.)
  /layout        # Layout bileşenleri (navbar)
/lib             # Yardımcı fonksiyonlar
/public          # Statik dosyalar
```

## 🌐 Canlı Demo

Platform GitHub Pages üzerinde yayınlanmaktadır:
- **Ana Site**: [https://acelehesap6-design.github.io/Kk](https://acelehesap6-design.github.io/Kk)

## 📚 Dokümantasyon

Detaylı dokümantasyon için:
- [Kurulum Kılavuzu](./docs/SETUP.md)
- [Geliştirici Dokümantasyonu](./docs/DEVELOPMENT.md)
- [API Dokümantasyonu](./docs/API.md)

## 🔧 Konfigürasyon

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url

# Market API Keys (opsiyonel)
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_secret
```

## 🚀 Deployment

### GitHub Pages

Proje otomatik olarak GitHub Actions ile deploy edilir:

1. `main` branch'e push yapın
2. GitHub Actions workflow otomatik çalışır
3. Site `gh-pages` branch'ine deploy edilir

### Manuel Deployment

```bash
pnpm build
# Build dosyları ./out klasöründe oluşturulur
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Website**: [https://acelehesap6-design.github.io/Kk](https://acelehesap6-design.github.io/Kk)
- **GitHub**: [https://github.com/acelehesap6-design/Kk](https://github.com/acelehesap6-design/Kk)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
