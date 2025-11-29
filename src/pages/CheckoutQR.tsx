import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import upiQrFallback from '@/assets/upi-qr.png';

const CheckoutQR = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderData = location.state?.orderData;

  const [upiId, setUpiId] = useState('atropine@ybl');
  const [qrUrl, setQrUrl] = useState(upiQrFallback);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!orderData) {
      navigate('/shop');
      return;
    }

    fetchConfig();
  }, [orderData, navigate]);

  const fetchConfig = async () => {
    const { data: upiData } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'upi_id')
      .maybeSingle();

    if (upiData) {
      setUpiId(upiData.value);
    }

    const { data: qrData } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'qr_url')
      .maybeSingle();

    if (qrData && qrData.value) {
      setQrUrl(qrData.value);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    let screenshotUrl = null;

    // Upload screenshot if provided
    if (screenshot) {
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `screenshots/${orderData.orderId}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('payment-assets')
        .upload(fileName, screenshot);

      if (uploadError) {
        toast({
          title: 'Error',
          description: 'Failed to upload screenshot',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('payment-assets')
        .getPublicUrl(fileName);

      screenshotUrl = urlData.publicUrl;
    }

    // Update order with screenshot
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_screenshot_url: screenshotUrl })
      .eq('order_id', orderData.orderId);

    if (updateError) {
      toast({
        title: 'Error',
        description: 'Failed to submit order',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    toast({
      title: 'Success',
      description: 'Order submitted successfully',
    });

    setUploading(false);
    navigate(`/order-success?orderId=${orderData.orderId}`);
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          Scan & Pay to Complete Your Order
        </h1>

        <div className="bg-panel rounded-2xl p-8 border border-primary/30 space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-xl p-6 flex justify-center">
            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Amount */}
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold text-primary">{orderData.price}</p>
            {orderData.tierLabel && (
              <p className="text-xs text-muted-foreground mt-2">{orderData.tierLabel}</p>
            )}
          </div>

          {/* UPI ID */}
          <div>
            <Label className="text-foreground">UPI ID</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={upiId}
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

          {/* Screenshot Upload */}
          <div>
            <Label htmlFor="screenshot" className="text-foreground">
              Upload Payment Screenshot (Optional)
            </Label>
            <div className="mt-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="bg-background border-border text-foreground"
              />
              {screenshot && (
                <p className="text-sm text-green-500 mt-2">
                  Screenshot selected: {screenshot.name}
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Payment Instructions:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM)</li>
              <li>Or manually enter the UPI ID: <span className="text-primary font-mono">{upiId}</span></li>
              <li>Pay the exact amount: {orderData.price}</li>
              <li>Upload payment screenshot (optional) and click "Submit Order"</li>
              <li>You'll receive TradingView access within 2-10 minutes</li>
            </ol>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
          >
            {uploading ? 'Submitting...' : 'Submit Order After Payment'}
          </Button>

          {/* Payment Apps */}
          <div className="pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Accepted payment methods: UPI, Google Pay, PhonePe, Paytm, BHIM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutQR;
