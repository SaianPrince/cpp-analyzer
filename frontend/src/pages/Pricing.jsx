import { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

const FREE_FEATURES = [
  { text: '10 analyses per day', included: true },
  { text: 'All 4 optimization levels', included: true },
  { text: 'Shareable result links', included: true },
  { text: '7-day result history', included: true },
  { text: 'AI suggestions', included: false },
  { text: 'Unlimited analyses', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited analyses', included: true },
  { text: 'All 4 optimization levels', included: true },
  { text: 'Shareable result links', included: true },
  { text: 'Permanent result history', included: true },
  { text: 'AI-powered suggestions', included: true, premium: true },
  { text: 'Priority processing', included: true },
  { text: 'API access', included: true, soon: true },
];

const TEAM_FEATURES = [
  { text: 'Everything in Pro', included: true },
  { text: 'Team dashboard', included: true },
  { text: 'Shared analysis history', included: true },
  { text: 'SSO integration', included: true, soon: true },
];

const FAQS = [
  { q: 'How does the free tier work?', a: 'The free tier gives you 10 analyses per day with full access to all 4 optimization levels. Results are stored for 7 days.' },
  { q: 'What happens when I hit the daily limit?', a: 'You will see a friendly message asking you to upgrade or wait until the next day. Your existing results remain accessible.' },
  { q: 'Is my code stored on your servers?', a: 'Your code is compiled in an isolated Docker container and stored temporarily only to display results. We do not share or use your code.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel anytime. Your Pro features will remain active until the end of your current billing period.' },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const proPrice = annual ? '$4' : '$5';
  const teamPrice = annual ? '$10' : '$12';

  return (
    <div className="flex-1 overflow-y-auto bg-bg">

      {/* Hero */}
      <div className="text-center py-16 px-20">
        <h1 className="text-[32px] text-text font-bold mb-3">Simple, transparent pricing</h1>
        <p className="text-base text-text-muted mb-8">Start free. Upgrade when you need more.</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm ${!annual ? 'text-text' : 'text-text-muted'}`}>Monthly</span>
          <button onClick={() => setAnnual(!annual)}
            className="relative w-11 h-6 rounded-full transition-colors border-none"
            style={{ backgroundColor: annual ? '#2563EB' : '#30363D' }}>
            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform"
              style={{ left: annual ? '22px' : '2px' }} />
          </button>
          <span className={`text-sm ${annual ? 'text-text' : 'text-text-muted'}`}>
            Annual <span className="text-success text-xs font-medium">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[1000px] mx-auto px-20 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* FREE */}
        <div className="bg-card border border-border rounded-lg p-7">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-medium">Free</div>
          <div className="mb-4">
            <span className="text-[40px] text-text font-bold">$0</span>
            <span className="text-base text-text-muted"> /month</span>
          </div>
          <div className="border-t border-border pt-4 mb-6 space-y-3">
            {FREE_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                {f.included
                  ? <Check className="w-4 h-4 text-success flex-shrink-0" />
                  : <X className="w-4 h-4 text-text-dark flex-shrink-0" />}
                <span className={`text-sm ${f.included ? 'text-text' : 'text-text-dark line-through'}`}>{f.text}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-md text-sm font-medium text-text border border-border bg-transparent hover:bg-bg transition-colors">
            Get Started Free
          </button>
        </div>

        {/* PRO */}
        <div className="bg-card rounded-lg p-7 relative" style={{ border: '2px solid #2563EB', boxShadow: '0 0 30px rgba(37,99,235,0.1)' }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
            Most Popular
          </div>
          <div className="text-xs text-accent uppercase tracking-wider mb-2 font-medium">Pro</div>
          <div className="mb-4">
            <span className="text-[40px] text-text font-bold">{proPrice}</span>
            <span className="text-base text-text-muted"> /month</span>
          </div>
          <div className="border-t border-border pt-4 mb-6 space-y-3">
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className={`w-4 h-4 flex-shrink-0 ${f.premium ? 'text-accent' : 'text-success'}`} />
                <span className={`text-sm ${f.premium ? 'text-accent font-medium' : 'text-text'}`}>
                  {f.text}
                  {f.soon && <span className="ml-1.5 text-[10px] text-text-muted bg-border rounded px-1.5 py-0.5">coming soon</span>}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-md text-sm font-bold text-white bg-accent hover:bg-accent-hover transition-colors border-none">
            Start Pro — {proPrice}/mo
          </button>
        </div>

        {/* TEAM */}
        <div className="bg-card border border-border rounded-lg p-7">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2 font-medium">Team</div>
          <div className="mb-4">
            <span className="text-[40px] text-text font-bold">{teamPrice}</span>
            <span className="text-base text-text-muted"> /seat/month</span>
          </div>
          <div className="border-t border-border pt-4 mb-6 space-y-3">
            {TEAM_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text">
                  {f.text}
                  {f.soon && <span className="ml-1.5 text-[10px] text-text-muted bg-border rounded px-1.5 py-0.5">coming soon</span>}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-md text-sm font-medium text-text border border-border bg-transparent hover:bg-bg transition-colors">
            Contact Us
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-[720px] mx-auto px-20 pb-16">
        <h2 className="text-xl text-text font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-transparent border-none">
                <span className="text-sm text-text font-medium">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-text-muted leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
