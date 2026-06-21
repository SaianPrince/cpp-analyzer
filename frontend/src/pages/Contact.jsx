import { useState } from 'react';
import { Mail, MessageSquare, GitBranch, Globe, Send, CheckCircle, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT_METHODS = [
  {
    icon: Mail,
    color: '#2563EB',
    title: 'Email',
    value: 'support@cppanalyzer.com',
    desc: 'For general inquiries, bug reports, and partnership proposals.',
    action: 'mailto:support@cppanalyzer.com',
    actionLabel: 'Send Email',
  },
  {
    icon: GitBranch,
    color: '#E6EDF3',
    title: 'GitHub',
    value: 'github.com/cpp-analyzer',
    desc: 'Report issues, request features, or contribute to the project.',
    action: 'https://github.com',
    actionLabel: 'Open GitHub',
  },
  {
    icon: Globe,
    color: '#1DA1F2',
    title: 'Twitter / X',
    value: '@cppanalyzer',
    desc: 'Follow us for updates, tips, and C++ performance insights.',
    action: 'https://twitter.com',
    actionLabel: 'Follow Us',
  },
];

const FAQ = [
  {
    q: 'Is my code stored permanently?',
    a: 'Free plan analyses are stored for 90 days. Pro plan users can opt for permanent storage. You can request deletion at any time.',
  },
  {
    q: 'What compilers do you support?',
    a: 'We currently support GCC (g++) 13.2 with C++17 standard. Clang and MSVC support are planned for future releases.',
  },
  {
    q: 'Is there an API for automated analysis?',
    a: 'Yes! Our REST API is documented at /docs (Swagger). Free tier includes 20 API calls per day.',
  },
  {
    q: 'How do I report a security vulnerability?',
    a: 'Please email security@cppanalyzer.com with details. We take security seriously and will respond within 24 hours.',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg">

      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)', padding: '60px 80px 48px' }}>
        <div style={{ maxWidth: 700 }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 32, height: 3, background: '#16A34A', borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Get In Touch</span>
          </div>
          <h1 style={{ fontSize: 36, color: '#E6EDF3', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: '#8B949E', lineHeight: 1.7, maxWidth: 560 }}>
            Have a question, feature request, or just want to say hello? We'd love to hear from you. Choose a channel below or fill out the form.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div style={{ padding: '48px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: 48 }}>
          {CONTACT_METHODS.map((method) => (
            <div key={method.title} className="bg-card border border-border rounded-lg p-5 hover:border-text-dark transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-lg"
                  style={{ width: 40, height: 40, background: `${method.color}15`, border: `1px solid ${method.color}30` }}>
                  <method.icon className="w-5 h-5" style={{ color: method.color }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 700 }}>{method.title}</h3>
                  <span className="font-mono" style={{ fontSize: 13, color: '#8B949E' }}>{method.value}</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{method.desc}</p>
              <a href={method.action} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: method.color }}>
                {method.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: '0 80px' }}>
        <div style={{ height: 1, background: '#30363D' }} />
      </div>

      {/* Form + Info */}
      <div style={{ padding: '48px 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5" style={{ color: '#2563EB' }} />
              <h2 style={{ fontSize: 18, color: '#E6EDF3', fontWeight: 700 }}>Send a Message</h2>
            </div>
            <p style={{ fontSize: 14, color: '#8B949E', marginBottom: 24 }}>Fill out the form below and we'll get back to you within 24-48 hours.</p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 mb-4" style={{ color: '#16A34A' }} />
                <h3 style={{ fontSize: 20, color: '#E6EDF3', fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ fontSize: 15, color: '#8B949E', textAlign: 'center', maxWidth: 360 }}>
                  Thank you for reaching out. We'll review your message and respond as soon as possible.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 px-5 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ background: '#161B22', color: '#E6EDF3', border: '1px solid #30363D' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Name</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Your name"
                      className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none transition-colors"
                      style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#30363D'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange} required
                      placeholder="you@example.com"
                      className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none transition-colors"
                      style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#30363D'}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Subject</label>
                  <input
                    name="subject" value={form.subject} onChange={handleChange} required
                    placeholder="What is this about?"
                    className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#30363D'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: '#8B949E', fontWeight: 500, display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} required
                    placeholder="Describe your question, issue, or feedback in detail..."
                    rows={5}
                    className="w-full rounded-md px-3 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                    style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3', fontFamily: 'Inter, sans-serif' }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#30363D'}
                  />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  style={{ background: '#2563EB', color: '#fff', border: 'none' }}>
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-5">
            {/* Response Time */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5" style={{ color: '#D97706' }} />
                <h3 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 700 }}>Response Time</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'General Inquiries', time: '24-48 hours' },
                  { label: 'Bug Reports', time: '12-24 hours' },
                  { label: 'Security Issues', time: '< 24 hours' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center bg-bg border border-border rounded-md px-3 py-2">
                    <span style={{ fontSize: 13, color: '#8B949E' }}>{item.label}</span>
                    <span className="font-mono" style={{ fontSize: 13, color: '#E6EDF3', fontWeight: 600 }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5" style={{ color: '#16A34A' }} />
                <h3 style={{ fontSize: 16, color: '#E6EDF3', fontWeight: 700 }}>Location</h3>
              </div>
              <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>
                CPP Analyzer is developed and maintained remotely. We're a distributed team passionate about C++ performance and developer tooling.
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 style={{ fontSize: 14, color: '#8B949E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Pricing Plans', to: '/pricing' },
                  { label: 'Example Programs', to: '/examples' },
                  { label: 'About & How It Works', to: '/about' },
                ].map((link) => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center justify-between px-3 py-2 bg-bg border border-border rounded-md hover:border-text-dark transition-all"
                    style={{ fontSize: 14, color: '#E6EDF3' }}>
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: '#8B949E' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: '0 80px' }}>
        <div style={{ height: 1, background: '#30363D' }} />
      </div>
      <div style={{ padding: '48px 80px 64px' }}>
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width: 32, height: 3, background: '#D97706', borderRadius: 2 }} />
          <span style={{ fontSize: 13, color: '#D97706', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>FAQ</span>
        </div>
        <h2 style={{ fontSize: 26, color: '#E6EDF3', fontWeight: 800, marginBottom: 8 }}>Frequently Asked Questions</h2>
        <p style={{ fontSize: 15, color: '#8B949E', marginBottom: 32, maxWidth: 500 }}>
          Common questions about CPP Analyzer. Can't find your answer? Use the form above.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ maxWidth: 900 }}>
          {FAQ.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5 hover:border-text-dark transition-all">
              <h3 style={{ fontSize: 15, color: '#E6EDF3', fontWeight: 700, marginBottom: 8 }}>{item.q}</h3>
              <p style={{ fontSize: 14, color: '#8B949E', lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
