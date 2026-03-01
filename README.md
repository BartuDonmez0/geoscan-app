# 🏙️ GeoScan for New York City

**GeoScan**, New York şehrinin saatlik taksi ve araç hareketliliğini gelişmiş mekansal (spatial) analiz yöntemleriyle görselleştiren tam yığın (full-stack) bir web uygulamasıdır. Açık kaynaklı gerçek hayattan alınmış veri setlerini makine öğrenmesi (DBSCAN) kullanarak işler ve çok şık, interaktif bir karanlık tema haritası üzerinde sunar.

![GeoScan Dashboard](https://raw.githubusercontent.com/fivethirtyeight/uber-tlc-foil-response/master/README.md) <!-- Replace with actual Github URL after push -->

## 🌟 Neler Yapıldı? (Özellikler)
- **Makine Öğrenmesi (DBSCAN)**: 80,000'den fazla gerçek seyahat koordinatını, birbirine olan yakınlık ve yoğunluklarına göre saat saat filtreden geçirir ve kümeler (cluster) oluşturur.
- **Dinamik Zaman Çizelgesi**: 24 saatlik zaman kaydırıcısı ile saat ilerledikçe trafiğin ve insan popülasyonunun şehir içindeki yer değiştirmesini simüle eder (Örn: İş saatlerinde Manhattan merkezinin yoğunlaşıp gece saatlerinde eğlence mekanlarına kayması).
- **Zifiri Karanlık & Kırmızı Tema**: Harita üzerindeki gereksiz detaylar kaldırılarak tamamen yollar ve veri noktalarına (kırmızı tonlarda) odaklanılması sağlanmıştır.
- **İnteraktif Bölge Raporla (Dashboard)**: Harita üzerinde beliren yoğunluk kırmızı noktalarına veya aşağıdaki seçim çubuğuna tıklayarak spesifik bir bölgenin analiz paneline ulaşılabilir. Bu panelde **Recharts** kullanılarak görsel hacim/yolcu grafikleri ve matematiksel harita sınırları anlık olarak çizilir.

## 🛠️ Mimari ve Kullanılan Teknolojiler

GeoScan, iki ana modül (Frontend & Backend) etrafında modern bir sistemle kurgulanmıştır:

### Backend (Veri Bilimi ve API)
- **Python & FastAPI**: Verileri hızlı bir şekilde hesaplayıp JSON objesi olarak React'e sunan yüksek performanslı REST API.
- **Scikit-Learn (DBSCAN)**: Sadece koordinat yığınlarını ekrana basmak yerine, verileri anlamlı kümelere ayırarak (Density-Based Spatial Clustering) hesaplama yükünü optimize eden ve görsel veri oluşturan ML kütüphanesi.
- **Pandas & PyArrow**: Açık kaynaklı The New York City Taxi and Limousine Commission (TLC) Parquet/CSV veri setlerinin temizlenmesi ve işlenmesi.

### Frontend (Kullanıcı Arayüzü ve Görselleştirme)
- **React.js & Vite**: Modern, hızlı ve state yönetimli kullanıcı ve DOM yapısı.
- **Deck.gl & MapLibre**: Uber'in geliştirdiği, on binlerce veriyi tarayıcıyı dondurmadan WebGL üzerinden (ekran kartını kullanarak) render eden yüksek performanslı 2D/3D harita katmanı yapıbozumu.
- **Recharts**: Seçilen kümelerin (regionların) verilerini işleyen dinamik sütun grafikleri.
- **Tailwind CSS v4**: Özel renk kodları (Pitch Black & Deep Red) ile dizayn edilen karanlık mod (Dark Mode) UI bileşenleri.

## 📦 Kurulum ve Çalıştırma (Lokal)

Bu projeyi bilgisayarınızda kurmak ve denemek için aşağıdaki adımları izleyebilirsiniz.

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/geoscan-app.git
cd geoscan-app
```

### 2. Backend (Python Server) Kurulumu
Backend, `/backend` klasöründe yer alır. Python 3.9+ kullanmanız önerilir.
```bash
cd backend

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Açık veri setini (NYC TLC) otomatik indirip yapılandırmak için betiği çalıştırın:
python fetch_nyc_data.py

# FastAPI sunucusunu başlatın
uvicorn main:app --reload --port 8000
```
*Sunucu `http://localhost:8000` adresinde çalışmaya başlayacaktır.*

### 3. Frontend (React Uygulaması) Kurulumu
Farklı bir terminal sekmesi açın ve `/frontend` klasörüne gidin. Node.js yüklü olması gerekir.
```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Vite geliştirme sunucusunu başlatın
npm run dev
```
*Uygulama tarayıcınızda `http://localhost:5173` adresinde çalışmaya başlayacaktır.*

## 🌐 Veri Kaynağı (Data Source)
Uygulamada kullanılan veriler eğitim amaçlıdır.
* **FiveThirtyEight**: Uber TLC FOIL Response Data (Nisan - Eylül 2014) kullanılmıştır.
Link: [GitHub - fivethirtyeight/uber-tlc-foil-response](https://github.com/fivethirtyeight/uber-tlc-foil-response)

---
**GeoScan for New York City** - *by bartu dönmez*
