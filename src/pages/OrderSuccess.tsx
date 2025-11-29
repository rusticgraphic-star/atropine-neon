import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get order data from localStorage
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  const handleWhatsAppConfirm = () => {
    if (!orderData) return;

    const message = `Hello, I have completed my payment for Atropine.
Order ID: ${orderData.orderId}
- Name: ${orderData.name}
- Email: ${orderData.email}
- TradingView Username: ${orderData.tvUsername}
- Indicator: ${orderData.product.name}
- Payment Screenshot: (I will send it)`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918668657835?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-6">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Order Received!</h1>
          <p className="text-xl text-muted-foreground">
            Payment verification in progress
          </p>
        </div>

        {/* Message */}
        <div className="bg-panel rounded-2xl p-8 border border-border mb-8">
          <p className="text-foreground text-center mb-4">
            We will send TradingView access after confirmation (expected 2-10 minutes).
          </p>
          <p className="text-sm text-muted-foreground text-center">
            You'll receive an email at <span className="text-foreground font-semibold">{orderData?.email}</span> with access instructions.
          </p>
        </div>

        {/* Order Summary */}
        {orderData && (
          <div className="bg-panel rounded-2xl p-8 border border-border mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-mono">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="text-foreground">{orderData.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-primary font-bold text-xl">{orderData.product.price || 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TradingView Username</span>
                <span className="text-foreground">{orderData.tvUsername}</span>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Confirmation */}
        <div className="bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 rounded-2xl p-8 border border-[#25D366]/30 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">
            Speed Up Verification
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Confirm your payment on WhatsApp for instant verification
          </p>
          <Button 
            onClick={handleWhatsAppConfirm}
            className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-6 text-lg"
          >
            Confirm Payment on WhatsApp
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Please attach your payment screenshot when confirming
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-panel rounded-2xl p-8 border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">What Happens Next?</h3>
          <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
            <li>We verify your payment (usually within 2-10 minutes)</li>
            <li>You receive TradingView invite link via email</li>
            <li>Accept the invite and add indicator to your charts</li>
            <li>Start trading with professional tools!</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link to="/shop">
            <Button variant="outline" className="border-border">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-border">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-12 p-6 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us on{' '}
            <a 
              href="https://wa.me/918668657835" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WhatsApp: +91 86686 57835
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
