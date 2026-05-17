import { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const PLANS = [
  {
    name: 'Free',
    label: 'FREE',
    price: 0,
    period: 'month',
    features: [
      { text: '10 analyses per day', included: true },
      { text: 'All 4 optimization levels', included: true },
      { text: 'Shareable result links', included: true },
      { text: '7-day result history', included: true },
      { text: 'AI suggestions', included: false },
      { text: 'Unlimited analyses', included: false },
    ],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    name: 'Pro',
    label: 'PRO',
    price: 5,
    period: 'month',
    features: [
      { text: 'Unlimited analyses', included: true },
      { text: 'All 4 optimization levels', included: true },
      { text: 'Shareable result links', included: true },
      { text: 'Permanent result history', included: true },
      { text: 'AI-powered suggestions', included: true, premium: true },
      { text: 'Priority processing', included: true },
      { text: 'API access', included: true, comingSoon: true },
    ],
    cta: 'Start Pro — $5/mo',
    featured: true,
  },
  {
    name: 'Team',
    label: 'TEAM',
    price: 12,
    period: 'seat/month',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team dashboard', included: true },
      { text: 'Shared history', included: true },
      { text: 'SSO', included: true, comingSoon: true },
    ],
    cta: 'Contact Us',
    featured: false,
  },
];

const FAQ_ITEMS = [
  {
    question: 'How does the free tier work?',
    answer:
      'The free tier allows you to run up to 10 code analyses per day. You get access to all optimization levels (O0-O3) and can share your results with others. Results are kept for 7 days.',
  },
  {
    question: 'What happens when I hit the daily limit?',
    answer:
      'Once you reach your daily limit on the free tier, you will need to wait until the next day (reset at midnight UTC) or upgrade to Pro for unlimited analyses.',
  },
  {
    question: 'Is my code stored on your servers?',
    answer:
      'Your code is temporarily stored only for the duration of the analysis. Free tier results are kept for 7 days, while Pro users get permanent storage. We never share your code with third parties.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time from your account settings. You will continue to have access until the end of your current billing period.',
  },
];

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="flex-1 overflow-auto bg-[#0D1117]">
      {/* Hero */}
      <div className="px-20 py-16 text-center">
        <h1 className="text-3xl text-[#E6EDF3] font-bold mb-2">Simple, transparent pricing</h1>
        <p className="text-base text-[#8B949E] mb-8">Start free. Upgrade when you need more.</p>

        {/* Toggle */}
        <div className="inline-flex items-center gap-0 bg-[#1C2128] border border-[#30363D] rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md text-sm transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-md text-sm transition-all ${
              billingPeriod === 'annual'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Annual <span className="text-[#16A34A] ml-1">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-20 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#1C2128] rounded-lg p-7 relative transition-all ${
                plan.featured
                  ? 'border-2 border-[#2563EB]'
                  : 'border border-[#30363D] hover:border-[#4B5563]'
              }`}
              style={
                plan.featured
                  ? {
                      boxShadow: '0 0 24px rgba(37, 99, 235, 0.2)',
                    }
                  : undefined
              }
            >
              {plan.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#2563EB] rounded-full text-[10px] text-white uppercase tracking-wider"
                >
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-3">
                  {plan.label}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl text-[#E6EDF3] font-bold">${plan.price}</span>
                  <span className="text-sm text-[#8B949E]">/{plan.period}</span>
                </div>
              </div>

              <div className="h-px bg-[#30363D] mb-6" />

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm">
                    {feature.included ? (
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          feature.premium ? 'text-[#2563EB]' : 'text-[#16A34A]'
                        }`}
                      />
                    ) : (
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#4B5563]" />
                    )}
                    <span
                      className={`${
                        feature.included
                          ? feature.premium
                            ? 'text-[#2563EB]'
                            : 'text-[#E6EDF3]'
                          : 'text-[#4B5563] line-through'
                      }`}
                    >
                      {feature.text}
                      {feature.comingSoon && (
                        <span className="ml-2 px-1.5 py-0.5 bg-[#30363D] rounded text-[10px] text-[#8B949E]">
                          coming soon
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-md text-sm font-medium transition-all ${
                  plan.featured
                    ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                    : 'bg-transparent border border-[#30363D] text-[#E6EDF3] hover:bg-[#1C2128]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl text-[#E6EDF3] font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion.Root type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-[#1C2128] border border-[#30363D] rounded-lg overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#30363D20] transition-colors group">
                    <span className="text-sm text-[#E6EDF3]">{item.question}</span>
                    <ChevronDown className="w-4 h-4 text-[#8B949E] transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-5 pb-4 text-sm text-[#8B949E] leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}
