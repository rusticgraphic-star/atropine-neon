import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">About Us</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Who We Are</h2>
          <p>
            We are a team of retail and successful traders, investors, and developers based in Nagpur, Maharashtra, India.
          </p>

          <p>
            Over 7 years of profitable trading journey, we have understood what it takes to become a successful trader and what needs to become a setup-based trader. With this knowledge, we have developed advanced trading indicators and tools.
          </p>

          <p>
            All the tools and services available on this website were initially made for our personal use and technicals. We are now sharing these with retail traders for their benefit.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Our Mission</h2>
          <p>
            To provide premium quality TradingView indicators that help traders make informed decisions using Smart Money Concepts, Supply-Demand zones, and advanced volume analysis tools.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Battle-tested indicators used by our own trading team</li>
            <li>Instant TradingView access within 2-10 minutes</li>
            <li>24/7 WhatsApp support</li>
            <li>Lifetime updates included</li>
            <li>Trusted by 10,000+ traders worldwide</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Contact Us</h2>
          <p>
            For more details, you can reach out to us through our{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact page
            </Link>{' '}
            or via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
