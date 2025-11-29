import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/data/products';
import { CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ProductDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const [selectedTier, setSelectedTier] = useState(product?.pricingTiers?.[0]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/shop">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/30 bg-panel">
              <img 
                src={product.thumbnail} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="space-y-6">
            <div>
              <Badge 
                variant={product.type === 'paid' ? 'default' : 'secondary'}
                className={
                  product.type === 'paid' 
                    ? 'bg-primary text-primary-foreground mb-4' 
                    : 'bg-secondary text-secondary-foreground mb-4'
                }
              >
                {product.type === 'paid' ? 'Premium' : 'Free Access'}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 neon-text">
                {product.name}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6">
                {product.description}
              </p>

              {/* Pricing Tiers */}
              {product.type === 'paid' && product.pricingTiers && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Select Subscription</h3>
                  <div className="space-y-2">
                    {product.pricingTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTier?.id === tier.id
                            ? 'border-primary bg-primary/10 shadow-neon'
                            : 'border-border bg-panel hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{tier.label}</p>
                            <p className="text-sm text-muted-foreground">{tier.duration}</p>
                          </div>
                          <p className="text-2xl font-bold text-primary">{tier.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedTier && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        Selected: <span className="font-semibold text-foreground">{selectedTier.label}</span> - {selectedTier.price}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Instant TradingView Access</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Lifetime Updates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* CTA */}
              <Link to={`/checkout?product=${product.id}&tier=${selectedTier?.id || ''}`}>
                <Button 
                  size="lg"
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
                >
                  {product.type === 'paid' ? 'Subscribe Now - Get Instant Access' : 'Get Free Access'}
                </Button>
              </Link>

              {/* Reviews Preview */}
              <div className="mt-6 p-4 bg-panel rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9/5 (328 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-3 p-6 bg-panel rounded-lg border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Specifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Technical Specifications</h2>
          <div className="bg-panel rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Supported Markets</h3>
                <p className="text-muted-foreground">{product.specs.markets}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Timeframes</h3>
                <p className="text-muted-foreground">{product.specs.timeframes}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Alert System</h3>
                <p className="text-muted-foreground">{product.specs.alerts}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="install" className="bg-panel rounded-lg border border-border px-6">
              <AccordionTrigger className="text-foreground">How do I install the indicator?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                After purchase, you'll receive a TradingView invite link within 2-10 minutes. Click the link, accept the invite, and the indicator will appear in your TradingView favorites. Simply add it to any chart to start using it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund" className="bg-panel rounded-lg border border-border px-6">
              <AccordionTrigger className="text-foreground">What is your refund policy?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied with the indicator, contact us via WhatsApp within 7 days of purchase for a full refund.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support" className="bg-panel rounded-lg border border-border px-6">
              <AccordionTrigger className="text-foreground">Do you provide trading support?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! We provide 24/7 WhatsApp support for indicator setup, troubleshooting, and general trading guidance. Our support team is always ready to help you get the most out of your indicators.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Final CTA */}
        <div className="text-center">
          <Link to={`/checkout?product=${product.id}&tier=${selectedTier?.id || ''}`}>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary-glow text-primary-foreground px-12 py-6 text-lg shadow-neon"
            >
              {product.type === 'paid' ? 'Subscribe Now' : 'Get Free Access'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
