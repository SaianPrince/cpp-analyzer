import { Shield, Eye, Cookie, Server, UserCheck, Trash2, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: Eye,
    color: '#2563EB',
    title: 'Information We Collect',
    items: [
      'IP Address — Hashed (SHA-256) and stored solely for rate limiting purposes. We do not store your raw IP address.',
      'Submitted Code — The C++ source code you submit for analysis is stored temporarily to generate results and enable shareable links.',
      'Usage Analytics — Anonymous page view counts and feature usage statistics to improve the service. No personally identifiable information is tracked.',
      'Browser Metadata — Standard HTTP headers (user agent, language preference) for compatibility and debugging purposes only.',
    ],
  },
  {
    icon: Cookie,
    color: '#D97706',
    title: 'Cookies & Local Storage',
    items: [
      'We use essential cookies only — no third-party tracking cookies are placed by our application.',
      'Local storage may be used to save your editor preferences (theme, font size) for a better experience.',
      'If Google AdSense is enabled, Google may place advertising cookies. You can manage these via your browser settings or Google\'s Ad Settings page.',
      'You can disable all cookies through your browser settings. Note that this may affect some functionality.',
    ],
  },
  {
    icon: Server,
    color: '#16A34A',
    title: 'How We Use Your Data',
    items: [
      'Code Analysis — Your submitted code is compiled and executed in an isolated Docker sandbox solely to generate performance metrics.',
      'Rate Limiting — Hashed IP addresses are used to enforce daily usage limits (20 analyses per day for free users).',
      'Service Improvement — Aggregated, anonymized usage statistics help us understand which features are most valuable.',
      'We never sell, rent, or share your personal data or submitted code with third parties.',
    ],
  },
  {
    icon: Shield,
    color: '#F97316',
    title: 'Data Security',
    items: [
      'All communication between your browser and our servers is encrypted via TLS/SSL (HTTPS).',
      'Submitted code runs in isolated Docker containers with strict resource limits (5s timeout, 256MB RAM cap).',
      'Dangerous system calls (system(), exec(), file deletion) are blocked by our security sandbox before compilation.',
      'Database access is restricted and credentials are stored as environment variables, never in source code.',
    ],
  },
  {
    icon: UserCheck,
    color: '#8B5CF6',
    title: 'Your Rights',
    items: [
      'Access — You can request a copy of any data we hold associated with your account or IP hash.',
      'Deletion — You can request the removal of your analysis history and associated data at any time.',
      'Opt-Out — You may choose not to use the service. No account registration is required for basic usage.',
      'For GDPR/KVKK compliance, contact us at the email address listed on our Contact page to exercise any of these rights.',
    ],
  },
  {
    icon: Trash2,
    color: '#DC2626',
    title: 'Data Retention',
    items: [
      'Analysis results are retained for 90 days by default, after which they are automatically purged.',
      'Pro plan users may opt for permanent storage of their analysis history.',
      'Hashed IP addresses used for rate limiting are cleared on a rolling 24-hour basis.',
      'You can manually request immediate deletion of your data by contacting us.',
    ],
  },
];

const Privacy = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-bg">

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)', padding: '60px 80px 48px' }}>
        <div style={{ maxWidth: 700 }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 32, height: 3, background: '#2563EB', borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 36, color: '#E6EDF3', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 16, color: '#8B949E', lineHeight: 1.7, maxWidth: 560 }}>
            Your privacy matters to us. This page explains what data we collect, how we use it, and your rights as a user of CPP Analyzer.
          </p>
          <p style={{ fontSize: 13, color: '#4B5563', marginTop: 16 }}>
            Last updated: June 2026
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '48px 80px' }}>
        <div className="space-y-5" style={{ maxWidth: 900 }}>
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-card border border-border rounded-lg p-6 hover:border-text-dark transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, background: `${section.color}15`, border: `1px solid ${section.color}30` }}>
                  <section.icon className="w-5 h-5" style={{ color: section.color }} />
                </div>
                <h2 style={{ fontSize: 18, color: '#E6EDF3', fontWeight: 700 }}>{section.title}</h2>
              </div>
              <ul className="space-y-3" style={{ paddingLeft: 0, listStyle: 'none' }}>
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3" style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.7 }}>
                    <div className="flex-shrink-0 mt-2" style={{ width: 6, height: 6, borderRadius: '50%', background: section.color, opacity: 0.6 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Third-Party Services */}
      <div style={{ padding: '0 80px 48px' }}>
        <div className="bg-card border border-border rounded-lg p-6" style={{ maxWidth: 900 }}>
          <h3 style={{ fontSize: 14, color: '#8B949E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Third-Party Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Hosting', value: 'Railway / Render', note: 'EU & US regions' },
              { label: 'Database', value: 'Supabase (PostgreSQL)', note: 'Encrypted at rest' },
              { label: 'Advertising', value: 'Google AdSense', note: 'When enabled' },
            ].map((item) => (
              <div key={item.label} className="bg-bg border border-border rounded-md p-4">
                <div style={{ fontSize: 11, color: '#8B949E', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                <div className="font-mono" style={{ fontSize: 14, color: '#E6EDF3', fontWeight: 600 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: '#4B5563', marginTop: 4 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '32px 80px 64px', textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, color: '#E6EDF3', fontWeight: 700, marginBottom: 8 }}>Have questions about your data?</h3>
        <p style={{ fontSize: 15, color: '#8B949E', marginBottom: 20 }}>We're happy to answer any privacy-related concerns.</p>
        <Link to="/contact"
          className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ padding: '12px 28px', background: '#2563EB', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
          Contact Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Privacy;
