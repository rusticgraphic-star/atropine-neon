import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import upiQr from '@/assets/upi-qr.png';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = searchParams.get('product');
  const tierId = searchParams.get('tier');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tvUsername: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    if (!productId) {
      navigate('/shop');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate('/shop');
        return;
      }

      setProduct(data);
      
      // Set selected tier based on URL param or default to first tier
      if (data.pricing_tiers && Array.isArray(data.pricing_tiers)) {
        const tier = tierId 
          ? data.pricing_tiers.find((t: any) => t.id === tierId)
          : data.pricing_tiers[0];
        setSelectedTier(tier);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('8668657835@ybl');
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.tvUsername) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Generate order ID
    const orderId = `ATR-${Date.now()}`;

    // Create order in database
    const orderData = {
      order_id: orderId,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      tv_username: formData.tvUsername,
      notes: formData.notes,
      product_id: product?.id || '',
      product_name: product?.name || '',
      tier_label: selectedTier?.label || null,
      price: selectedTier?.price || product?.price || 'Free',
      status: 'pending_verification',
    };

    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Store for current session
    localStorage.setItem('currentOrder', JSON.stringify({
      orderId,
      ...formData,
      product: {
        id: product?.id,
        name: product?.name,
        price: selectedTier?.price || product?.price || 'Free',
        tier: selectedTier?.label
      }
    }));

    setIsSubmitting(false);
    
    // Navigate to QR payment page
    navigate('/checkout-qr', {
      state: {
        orderData: {
          orderId,
          price: selectedTier?.price || product?.price || 'Free',
          tierLabel: selectedTier?.label || null,
          productName: product?.name
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const displayPrice = product.type === 'paid' 
    ? (selectedTier?.price || product.price) 
    : 'Free';

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-panel rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="tvUsername" className="text-foreground">
                  TradingView Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tvUsername"
                  name="tvUsername"
                  value={formData.tvUsername}
                  onChange={handleInputChange}
                  placeholder="your_tv_username"
                  required
                  className="mt-2 bg-background border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send indicator access to this TradingView account
                </p>
              </div>

              <div>
                <Label htmlFor="notes" className="text-foreground">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or questions..."
                  className="mt-2 bg-background border-border text-foreground"
                  rows={3}
                />
              </div>

              {/* Selected Tier Display (Read-only) */}
              {product.type === 'paid' && selectedTier && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Selected Plan</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{selectedTier.label}</p>
                      <p className="text-xs text-muted-foreground">{selectedTier.duration}</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{selectedTier.price}</p>
                  </div>
                </div>
              )}

              {/* Selected Product Summary */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.type === 'paid' ? 'Premium' : 'Free'} Indicator</p>
                      {selectedTier && (
                        <p className="text-xs text-muted-foreground mt-1">{selectedTier.label}</p>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">{displayPrice}</div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-panel rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-6">
              {/* Product Info */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                {selectedTier && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Selected Plan</p>
                    <p className="text-sm font-semibold text-foreground">{selectedTier.label}</p>
                    <p className="text-2xl font-bold text-primary mt-2">{selectedTier.price}</p>
                  </div>
                )}
                {!selectedTier && product.price && (
                  <p className="text-2xl font-bold text-primary mt-2">{product.price}</p>
                )}
              </div>

              {/* What's Included */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Instant TradingView Access
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Lifetime Updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    24/7 Support
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    Setup within 2-10 minutes
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Next Steps:</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Fill in your details on the left</li>
                  <li>Click "Continue to Payment"</li>
                  <li>Scan QR code and pay</li>
                  <li>Upload payment screenshot</li>
                  <li>Receive TradingView access!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
