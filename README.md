# cpp-analyzer ⚡

**TR** | [EN](#english)

---

## Türkçe

C++ kodunuzu tarayıcıdan yapıştırın — derleme süresi, bellek kullanımı ve optimizasyon önerilerini anında görün.

### Özellikler

- **4 seviyeli performans karşılaştırması** — `-O0`, `-O1`, `-O2`, `-O3` arasındaki hız farkını grafik olarak görün
- **Bellek kullanımı ölçümü** — peak RAM ve virtual memory takibi
- **Optimizasyon önerileri** — kural tabanlı analiz, ilerleyen sürümlerde AI destekli
- **Monaco editör** — VS Code kalitesinde C++ syntax highlighting
- **Paylaşılabilir sonuçlar** — her analiz için benzersiz URL
- **Freemium model** — günlük 10 ücretsiz analiz, sınırsız için Pro plan

### Teknoloji Stack'i

| Katman | Teknoloji |
|--------|-----------|
| C++ Engine | Visual Studio, CMake, cpp-httplib |
| Backend | Python, FastAPI, SQLAlchemy |
| Veritabanı | PostgreSQL (Supabase) |
| Frontend | React, Monaco Editor, Recharts |
| Altyapı | Docker, Railway, Cloudflare |
| AI (v2) | Claude API (Haiku) |

### Kurulum

#### Gereksinimler

- Docker Desktop
- Node.js 20+
- Python 3.11+
- Visual Studio 2022 (C++ workload ile)

#### Projeyi Çalıştır

```bash
git clone https://github.com/KULLANICI_ADI/cpp-analyzer.git
cd cpp-analyzer
docker-compose up --build
```

Tarayıcıda `http://localhost:3000` adresini aç.

#### Servisler

| Servis | Adres |
|--------|-------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| C++ Engine | http://localhost:8080 |

### Proje Yapısı

```
cpp-analyzer/
├── engine/          # C++ derleme ve çalıştırma motoru
│   ├── src/
│   └── CMakeLists.txt
├── backend/         # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── frontend/        # React arayüzü
│   └── src/
├── docker-compose.yml
└── README.md
```

### API

#### `POST /api/analyze`

**İstek:**
```json
{
  "code": "#include<iostream>\nint main(){ ... }"
}
```

**Cevap:**
```json
{
  "id": "abc123",
  "status": "success",
  "metrics": {
    "compile_time_ms": 320,
    "run_time_ms": [45, 38, 22, 18],
    "optimization_levels": ["O0", "O1", "O2", "O3"],
    "memory_kb": 2048
  },
  "output": "Hello World",
  "suggestions": [
    "Döngü içindeki sabit hesaplamayı dışarı çek",
    "vector::reserve() ile önceden boyut ayır"
  ]
}
```

#### `GET /api/result/:id`

Daha önce yapılmış bir analizi ID ile getir.

### Güvenlik

- Her kod çalıştırma 5 saniye timeout ile sınırlıdır
- `system()`, `exec()` ve dosya silme çağrıları reddedilir
- Her proses 256MB RAM ile sınırlıdır
- Docker container izolasyonu

### Katkı Sağlama

```bash
# Yeni bir branch aç
git checkout -b ozellik/yeni-oneri-kurali

# Değişikliklerini kaydet
git add .
git commit -m "yeni optimizasyon kuralı eklendi"
git push origin ozellik/yeni-oneri-kurali

# GitHub'da Pull Request aç
```

### Ekip

| Kişi | Sorumluluk |
|------|-----------|
| [@arkadasin] | C++ engine, derleme motoru, performans ölçümü |
| [@sen] | Python backend, React frontend, deploy |

### Lisans

MIT

---

## English <a name="english"></a>

Paste your C++ code in the browser — instantly see compile time, memory usage, and optimization suggestions.

### Features

- **4-level performance comparison** — visualize speed differences across `-O0`, `-O1`, `-O2`, `-O3`
- **Memory usage tracking** — peak RAM and virtual memory measurement
- **Optimization suggestions** — rule-based analysis, AI-powered in upcoming versions
- **Monaco editor** — VS Code quality C++ syntax highlighting
- **Shareable results** — unique URL for every analysis
- **Freemium model** — 10 free daily analyses, unlimited with Pro

### Tech Stack

| Layer | Technology |
|-------|------------|
| C++ Engine | Visual Studio, CMake, cpp-httplib |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| Frontend | React, Monaco Editor, Recharts |
| Infrastructure | Docker, Railway, Cloudflare |
| AI (v2) | Claude API (Haiku) |

### Setup

#### Prerequisites

- Docker Desktop
- Node.js 20+
- Python 3.11+
- Visual Studio 2022 (with C++ workload)

#### Run the Project

```bash
git clone https://github.com/YOUR_USERNAME/cpp-analyzer.git
cd cpp-analyzer
docker-compose up --build
```

Open `http://localhost:3000` in your browser.

#### Services

| Service | Address |
|---------|---------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| C++ Engine | http://localhost:8080 |

### Project Structure

```
cpp-analyzer/
├── engine/          # C++ compile and execution engine
│   ├── src/
│   └── CMakeLists.txt
├── backend/         # FastAPI backend
│   ├── main.py
│   └── requirements.txt
├── frontend/        # React UI
│   └── src/
├── docker-compose.yml
└── README.md
```

### API

#### `POST /api/analyze`

**Request:**
```json
{
  "code": "#include<iostream>\nint main(){ ... }"
}
```

**Response:**
```json
{
  "id": "abc123",
  "status": "success",
  "metrics": {
    "compile_time_ms": 320,
    "run_time_ms": [45, 38, 22, 18],
    "optimization_levels": ["O0", "O1", "O2", "O3"],
    "memory_kb": 2048
  },
  "output": "Hello World",
  "suggestions": [
    "Move the constant calculation outside the loop",
    "Use vector::reserve() to pre-allocate memory"
  ]
}
```

#### `GET /api/result/:id`

Retrieve a previously run analysis by ID.

### Security

- Every code execution is limited to a 5-second timeout
- `system()`, `exec()` and file deletion calls are rejected
- Each process is capped at 256MB RAM
- Docker container isolation

### Contributing

```bash
# Create a new branch
git checkout -b feature/new-suggestion-rule

# Commit your changes
git add .
git commit -m "add new optimization rule"
git push origin feature/new-suggestion-rule

# Open a Pull Request on GitHub
```

### Team

| Person | Responsibility |
|--------|---------------|
| [@SaianPrince] | C++ engine, compiler wrapper, performance measurement |
| [@Imaliure] | Python backend, React frontend, deployment |

### License

MIT
