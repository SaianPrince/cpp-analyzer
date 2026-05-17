import { Cpu, Zap, ShieldCheck, Activity, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>
          C++ Mimarisi ve <span className="text-gradient">CPP Analyzer</span>
        </h1>
        <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
          Dünyanın en güçlü sistem programlama dillerinden biri olan C++'ın derinliklerine inin 
          ve yazdığınız kodun derleyici tarafından nasıl optimize edildiğini keşfedin.
        </p>
      </div>

      <div className="result-grid" style={{ gridTemplateColumns: '1fr', gap: '40px' }}>
        
        {/* Section 1: C++ Architecture */}
        <div className="result-card glass p-24" style={{ padding: '40px' }}>
          <div className="card-title" style={{ marginBottom: '20px' }}>
            <Layers size={28} className="icon-purple" />
            <h2 style={{ fontSize: '1.8rem' }}>C++ Mimarisi ve Çalışma Mantığı</h2>
          </div>
          <p style={{ marginBottom: '15px', lineHeight: '1.8', color: 'var(--text-main)' }}>
            C++, 1979 yılında Bjarne Stroustrup tarafından "C with Classes" (Sınıflı C) adıyla geliştirilmiş, 
            donanıma en yakın seviyede (Low-Level) çalışabilen, aynı zamanda nesne yönelimli (Object-Oriented) 
            programlama yetenekleri sunan melez bir dildir.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <div className="glass" style={{ padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '10px' }}>Zero-Overhead Abstraction</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                "Kullanmadığın şeyin bedelini ödemezsin." C++'ın temel felsefesidir. Yazdığınız yüksek seviyeli kodlar, 
                performans kaybı yaşatmadan makine koduna çevrilir.
              </p>
            </div>
            <div className="glass" style={{ padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '10px' }}>Derlemeli (Compiled) Dil</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Python veya JavaScript gibi yorumlanmaz (Interpreted). GCC veya Clang gibi derleyiciler kodu doğrudan 
                işlemcinin (CPU) anladığı 0 ve 1'lere (Makine Kodu) dönüştürür.
              </p>
            </div>
            <div className="glass" style={{ padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '10px' }}>Manuel Bellek Yönetimi</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Garbage Collector yoktur. Geliştirici, RAM üzerindeki bellek tahsisini (Pointers, new/delete, Smart Pointers) 
                kendisi yönetir, bu da ona sınırsız güç ve sorumluluk verir.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: How our site connects to C++ */}
        <div className="result-card glass p-24" style={{ padding: '40px' }}>
          <div className="card-title" style={{ marginBottom: '20px' }}>
            <Zap size={28} className="icon-cyan" />
            <h2 style={{ fontSize: '1.8rem' }}>CPP Analyzer Ne İşe Yarar?</h2>
          </div>
          <p style={{ marginBottom: '20px', lineHeight: '1.8', color: 'var(--text-main)' }}>
            C++ donanım üzerinde çok hızlı çalışsa da, bu hızı sağlayan asıl kahraman <strong>Derleyici Optimizasyonlarıdır (Compiler Optimizations)</strong>. 
            Aynı C++ kodu, farklı derleme bayraklarıyla (flags) tamamen farklı performans sergiler. İşte <strong>CPP Analyzer</strong> tam olarak 
            bu farkı sizin için şeffaf hale getirir.
          </p>
          
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '8px' }}>
                <Cpu size={20} className="icon-purple" />
              </div>
              <div>
                <strong>4 Farklı Evrende Eşzamanlı Derleme:</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                  Yazdığınız kod arka planda G++ derleyicisine gönderilir ve eşzamanlı olarak 4 farklı bayrakla (-O0, -O1, -O2, -O3) derlenir. 
                  -O0 (sıfır optimizasyon) kodun saf haliyken, -O3 derleyicinin kodu en agresif şekilde makine koduna göre yeniden yapılandırdığı (vektörizasyon, loop unrolling) versiyondur.
                </p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '8px' }}>
                <Activity size={20} className="icon-cyan" />
              </div>
              <div>
                <strong>Gerçek Zamanlı Benchmarking:</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                  Oluşturulan .exe/.elf dosyaları izole bir sistemde saniyenin binde biri (milisaniye) hassasiyetinde yarıştırılır ve 
                  hangi optimizasyonun hızı ne kadar artırdığı grafiğe dökülür.
                </p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '8px' }}>
                <ShieldCheck size={20} style={{ color: '#10b981' }} />
              </div>
              <div>
                <strong>Güvenlik ve Statik Analiz:</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                  Sonsuz döngüler Timeout ile kesilir. Ayrıca kodunuz derlenirken "endl yerine \n kullanın" gibi statik bellek yönetimi 
                  tavsiyeleri yapay algoritmalar tarafından tespit edilip size raporlanır.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Derleyicinin gücünü test etmeye hazır mısın?</h3>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '15px 30px', fontSize: '1.1rem' }}>
            Kodunu Analiz Et
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
