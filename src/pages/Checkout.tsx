import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import upiQr from '@/assets/upi-qr.png';
import { products as localProducts } from '@/data/products';

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
    tvUsername: ''
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

      let targetProduct = data;
      if (error || !targetProduct) {
        targetProduct = localProducts.find(p => p.id === productId || p.slug === productId);
      }

      if (!targetProduct) {
        navigate('/shop');
        return;
      }

      const tiers = targetProduct.pricing_tiers || targetProduct.pricingTiers || [];
      const normalized = {
        ...targetProduct,
        pricing_tiers: tiers
      };

      setProduct(normalized);
      
      if (tiers && Array.isArray(tiers) && tiers.length > 0) {
        const tier = tierId 
          ? tiers.find((t: any) => t.id === tierId)
          : tiers[0];
        setSelectedTier(tier || tiers[0]);
      }
    } catch (error) {
      const local = localProducts.find(p => p.id === productId || p.slug === productId);
      if (local) {
        const tiers = local.pricingTiers || [];
        setProduct({ ...local, pricing_tiers: tiers });
        setSelectedTier(tiers[0] || null);
      } else {
        navigate('/shop');
      }
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
      product_id: product?.id || '',
      product_name: product?.name || '',
      tier_label: selectedTier?.label || null,
      price: selectedTier?.price || product?.price || 'Free',
      status: 'pending_verification',
    };

    try {
      await supabase
        .from('orders')
        .insert([orderData]);
    } catch (e) {
      console.warn('Supabase order insert skipped:', e);
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
      <div className="container mx-auto px-4 max-w-lg">
        {/* Header with Price */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">{product.name}</p>
          <p className="text-3xl font-bold text-primary mt-2">{displayPrice}</p>
          {selectedTier && (
            <p className="text-sm text-muted-foreground">{selectedTier.label} • {selectedTier.duration}</p>
          )}
        </div>

        {/* Form */}
        <div className="bg-panel rounded-2xl p-8 border border-border">
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

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
