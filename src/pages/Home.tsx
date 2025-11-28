import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { CheckCircle, TrendingUp, Zap, Shield, Clock, Users } from 'lucide-react';
import heroChart from '@/assets/hero-chart.jpg';
import patternBg from '@/assets/pattern-bg.jpg';
import demo1 from '@/assets/demo-1.jpg';
import demo2 from '@/assets/demo-2.jpg';
import demo3 from '@/assets/demo-3.jpg';

const Home = () => {
  const featuredProducts = products.slice(0, 6);

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Real-time Accuracy',
      description: 'Precise signals based on Smart Money Concepts and institutional order flow'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Access',
      description: 'Get TradingView access within minutes after purchase confirmation'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Lifetime Updates',
      description: 'Free updates and improvements for the lifetime of the indicator'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Priority Support',
      description: '24/7 WhatsApp support for setup, troubleshooting, and trading guidance'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={patternBg} 
            alt="Trading Chart Pattern" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Trusted by 10,000+ traders</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Premium TradingView Indicators for{' '}
              <span className="neon-text">Serious Traders</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Smart Money Concepts • Supply–Demand • Volume Algos • Instant Access
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg shadow-neon"
                >
                  Explore Indicators
                </Button>
              </Link>
              <Link to="/shop?filter=free">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
                >
                  Try Free Tools
                </Button>
              </Link>
            </div>

            {/* Hero Image */}
            <div className="pt-12">
              <div className="relative rounded-2xl overflow-hidden border border-primary/30 shadow-neon">
                <img 
                  src={heroChart} 
                  alt="TradingView Chart" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Line */}
      <section className="py-8 border-y border-border bg-panel/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">10,000+ Active Traders</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Lifetime Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Premium & Free Indicators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional TradingView tools built for accuracy and ease of use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10"
              >
                View All Indicators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-panel/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx}
                className="bg-panel rounded-[22px] p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon"
              >
                <div className="text-primary mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demos */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              See Our Indicators in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real chart examples showing indicator precision and clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-2xl overflow-hidden border border-primary/30 bg-panel hover:shadow-neon transition-all duration-300">
              <img src={demo1} alt="Supply & Demand Zones" className="w-full h-auto" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Supply & Demand Zones</h3>
                <p className="text-muted-foreground">Auto-detected institutional zones with entry signals</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border border-primary/30 bg-panel hover:shadow-neon transition-all duration-300">
              <img src={demo2} alt="Volume Spread Analysis" className="w-full h-auto" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Volume Spread Analysis</h3>
                <p className="text-muted-foreground">Smart money tracking with volume anomaly detection</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border border-primary/30 bg-panel hover:shadow-neon transition-all duration-300">
              <img src={demo3} alt="Central Pivot Range" className="w-full h-auto" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Central Pivot Range</h3>
                <p className="text-muted-foreground">Virgin CPR detection with support/resistance levels</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 to-secondary/10 rounded-[22px] p-12 text-center border border-primary/30">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Level Up Your Trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of traders using Atropine indicators for better entries and exits
            </p>
            <Link to="/shop">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg shadow-neon"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
