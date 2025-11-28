import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const pricingTiers = [
    {
      name: 'Free Indicators',
      price: 'Free',
      description: 'Perfect for beginners exploring technical analysis',
      features: [
        '3 Free TradingView Indicators',
        '4 Moving Average',
        'Average Range Indicator',
        'GAP Candle Indicator',
        'Basic support',
        'Lifetime access'
      ],
      cta: 'Get Free Access',
      link: '/shop?filter=free',
      highlighted: false
    },
    {
      name: 'Single Indicator',
      price: '₹699',
      priceNote: 'onwards',
      description: 'Buy individual premium indicators',
      features: [
        'Choose any premium indicator',
        'Instant TradingView access',
        'Lifetime updates',
        'Priority support',
        'Multiple pricing tiers',
        'Refund within 7 days'
      ],
      cta: 'View Indicators',
      link: '/shop?filter=premium',
      highlighted: true
    },
    {
      name: 'Bundle Packages',
      price: '₹39,999',
      priceNote: 'max',
      description: 'Complete indicator suite for professionals',
      features: [
        'All premium indicators',
        'Maximum value package',
        'Priority installation support',
        'Trading strategy guidance',
        'Lifetime updates for all',
        'VIP WhatsApp group access'
      ],
      cta: 'Contact Sales',
      link: '/contact',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your trading needs. All plans include lifetime access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative bg-panel rounded-2xl p-8 border ${
                tier.highlighted
                  ? 'border-primary shadow-neon'
                  : 'border-border'
              }`}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-primary">{tier.price}</span>
                  {tier.priceNote && (
                    <span className="text-muted-foreground ml-2">{tier.priceNote}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={tier.link}>
                <Button
                  className={`w-full py-6 text-lg ${
                    tier.highlighted
                      ? 'bg-primary hover:bg-primary-glow text-primary-foreground shadow-neon'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Individual Product Pricing */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Individual Indicator Pricing
          </h2>
          <div className="bg-panel rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Premium Indicators</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Market Profile Indicator: ₹699 - ₹39,999</li>
                  <li>• Virgin & Narrow CPR: ₹699 - ₹49,999</li>
                  <li>• Virgin CPR: ₹499 - ₹44,999</li>
                  <li>• VSA with Smart Volume: ₹699 - ₹59,999</li>
                  <li>• Auto Demand & Supply: ₹699 - ₹59,999</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Pricing Tiers Explained</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong className="text-foreground">Basic (₹499-699):</strong> Single timeframe</li>
                  <li><strong className="text-foreground">Pro (₹5,999-9,999):</strong> All timeframes</li>
                  <li><strong className="text-foreground">Premium (₹19,999-39,999):</strong> Multi-asset</li>
                  <li><strong className="text-foreground">Enterprise (₹44,999-59,999):</strong> Full access + support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Common Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-panel rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept UPI payments (Google Pay, PhonePe, Paytm, BHIM) for instant processing.</p>
            </div>
            <div className="bg-panel rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Is there a refund policy?</h3>
              <p className="text-muted-foreground">Yes! We offer a 7-day money-back guarantee on all paid indicators if you're not satisfied.</p>
            </div>
            <div className="bg-panel rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-2">How long does access take?</h3>
              <p className="text-muted-foreground">You'll receive TradingView access within 2-10 minutes after payment confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
