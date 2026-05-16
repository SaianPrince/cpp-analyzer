# cpp-analyzer ⚡

C++ kodunuzu tarayıcıdan yapıştırın — derleme süresi, bellek kullanımı ve optimizasyon önerilerini anında görün.

---

## 🚀 Hızlı Başlangıç (Docker ile)

Projeyi tüm servisleriyle birlikte (Veritabanı, Backend, Engine, Frontend) tek komutla ayağa kaldırabilirsiniz.

### Gereksinimler
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) kurulu ve çalışıyor olmalı.

### Çalıştırma
1. Proje ana dizinine gidin.
2. Aşağıdaki komutu çalıştırın:
   ```bash
   docker-compose up --build
   ```

### Erişim
Sistem ayağa kalktığında aşağıdaki adreslerden ulaşabilirsiniz:
- **Frontend (Arayüz):** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Swagger API Dökümantasyonu:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Manuel Geliştirme ve Test Süreci

Eğer servisleri Docker dışında ayrı ayrı çalıştırmak isterseniz:

### 1. C++ Motoru (Engine)
- **Linux/Docker:** `g++ main.cpp -o engine -lpthread`
- **Windows:** `engine/` klasörünü Visual Studio ile açıp derleyebilirsiniz.
- **Mock Motor:** C++ derleyiciniz yoksa `python engine/mock_engine.py` ile simüle edebilirsiniz.

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
./venv/Scripts/activate # Windows
pip install -r requirements.txt
python main.py
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 📐 Proje Mimarisi

| Katman | Teknoloji | Port |
|--------|-----------|------|
| **Frontend** | React, Monaco Editor, Recharts | 3000 |
| **Backend** | Python, FastAPI, SQLAlchemy | 8000 |
| **Engine** | C++ (Cross-platform) | 8080 |
| **Database** | PostgreSQL (Docker) / SQLite (Local) | 5432 |

---

## 🛡️ Güvenlik ve Limitler
- Her kod çalışması **5 saniye** ile sınırlıdır.
- Bellek tüketimi ve tehlikeli sistem çağrıları (`system`, `exec` vb.) sandbox tarafından denetlenir.
- **Rate Limit:** Kullanıcı başına günlük **20 analiz** sınırı bulunmaktadır (IP bazlı).

---

## 👥 Ekip
- **C++ Engine & Performance:** [@arkadasin]
- **Full Stack & Docker:** [@sen]

---

## English <a name="english"></a>

### Quick Start (with Docker)
1. Run `docker-compose up --build` in the root directory.
2. Open `http://localhost:3000` for the UI.
3. Open `http://localhost:8000/docs` for the API documentation.

### Tech Stack
- **Frontend:** React + Vite + Monaco Editor
- **Backend:** FastAPI + PostgreSQL (SQLAlchemy)
- **Engine:** C++ (POSIX & Win32 compatible)
