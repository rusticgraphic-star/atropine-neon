import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProductBySlug, products } from '@/data/products';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import upiQr from '@/assets/upi-qr.png';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = searchParams.get('product');
  const product = products.find(p => p.id === productId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tvUsername: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('9527120377@ybl');
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

    // Store order data in localStorage (in production, send to backend)
    const orderData = {
      orderId,
      ...formData,
      product: {
        id: product?.id,
        name: product?.name,
        price: product?.price
      },
      timestamp: new Date().toISOString(),
      status: 'pending_verification'
    };

    localStorage.setItem('currentOrder', JSON.stringify(orderData));

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/order-success?orderId=${orderId}`);
    }, 1000);
  };

  if (!product) {
    return null;
  }

  const displayPrice = product.type === 'paid' ? product.price : 'Free';

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

              {/* Selected Product */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.type === 'paid' ? 'Premium' : 'Free'} Indicator</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">{displayPrice}</div>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
              >
                {isSubmitting ? 'Processing...' : 'Submit Order After Payment'}
              </Button>
            </form>
          </div>

          {/* Right: Payment */}
          <div className="bg-panel rounded-2xl p-8 border border-primary/30">
            <h2 className="text-2xl font-bold text-foreground mb-6">Scan & Pay to Complete Your Order</h2>
            
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white rounded-xl p-6 flex justify-center">
                <img 
                  src={upiQr} 
                  alt="UPI QR Code" 
                  className="w-64 h-64 object-contain"
                />
              </div>

              {/* Amount */}
              {product.type === 'paid' && (
                <div className="text-center p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                  <p className="text-4xl font-bold text-primary">{product.price}</p>
                </div>
              )}

              {/* UPI ID */}
              <div>
                <Label className="text-foreground">UPI ID</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    value="9527120377@ybl" 
                    readOnly 
                    className="bg-background border-border text-foreground"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyUpiId}
                    className="border-border"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Payment Instructions:</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM)</li>
                  <li>Or manually enter the UPI ID: <span className="text-primary font-mono">9527120377@ybl</span></li>
                  <li>Pay the exact amount: {displayPrice}</li>
                  <li>After successful payment, fill the form and click "Submit Order"</li>
                  <li>You'll receive TradingView access within 2-10 minutes</li>
                </ol>
              </div>

              {/* Payment Apps */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Accepted payment methods: UPI, Google Pay, PhonePe, Paytm, BHIM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
