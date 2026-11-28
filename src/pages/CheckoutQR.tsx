import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Upload, QrCode, Smartphone, Download, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeCanvas } from 'qrcode.react';
import upiQrFallback from '@/assets/upi-qr.png';

const CheckoutQR = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderData = location.state?.orderData;

  const [upiId, setUpiId] = useState('8668657835@ybl');
  const [qrUrl, setQrUrl] = useState(upiQrFallback);
  const [qrView, setQrView] = useState<'dynamic' | 'custom'>('dynamic');
  const [includeAmountInQr, setIncludeAmountInQr] = useState(true);
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
    const localUpi = localStorage.getItem('admin_upi_id');
    if (localUpi) setUpiId(localUpi);
    const localQr = localStorage.getItem('admin_qr_url');
    if (localQr) setQrUrl(localQr);

    try {
      const { data: upiData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'upi_id')
        .maybeSingle();

      if (upiData?.value) {
        setUpiId(upiData.value);
      }

      const { data: qrData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'qr_url')
        .maybeSingle();

      if (qrData?.value) {
        setQrUrl(qrData.value);
      }
    } catch (e) {
      console.warn('Config fetch error:', e);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: 'Copied!',
      description: 'UPI ID copied to clipboard',
    });
  };

  const cleanAmount = orderData?.price ? String(orderData.price).replace(/[^0-9.]/g, '') : '';
  const cleanAmountVal = cleanAmount || '0';

  const copyAmount = () => {
    if (cleanAmountVal) {
      navigator.clipboard.writeText(cleanAmountVal);
      toast({
        title: 'Amount Copied!',
        description: `₹${cleanAmountVal} copied to clipboard`,
      });
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('upi-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `Atropine-QR-${orderData?.orderId || 'Payment'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast({
        title: 'Downloaded!',
        description: 'QR Code saved to device. You can open it in PhonePe/GPay from Gallery.',
      });
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    let screenshotUrl = null;

    if (screenshot) {
      try {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `screenshots/${orderData.orderId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-assets')
          .upload(fileName, screenshot);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('payment-assets')
            .getPublicUrl(fileName);
          screenshotUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.warn('Screenshot upload skipped:', err);
      }
    }

    try {
      await supabase
        .from('orders')
        .update({ payment_screenshot_url: screenshotUrl })
        .eq('order_id', orderData.orderId);
    } catch (err) {
      console.warn('Order update skipped:', err);
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

  const cleanUpi = (upiId || '8668657835@ybl').trim();
  const cleanOrderId = (orderData?.orderId || `ATR${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '');

  // 1. Dynamic UPI URI with pre-filled amount (Standard NPCI Format)
  const upiWithAmount = `upi://pay?pa=${cleanUpi}&pn=Atropine&am=${cleanAmountVal}&cu=INR&tr=${cleanOrderId}&tn=Order${cleanOrderId}`;

  // 2. Open UPI URI (P2P fallback)
  const upiOpen = `upi://pay?pa=${cleanUpi}&pn=Atropine&cu=INR`;

  // Default to amount-included QR code!
  const activeQrUri = includeAmountInQr ? upiWithAmount : upiOpen;

  // Direct app intent links for mobile devices
  const gpayUri = `gpay://upi/pay?pa=${cleanUpi}&pn=Atropine&am=${cleanAmountVal}&cu=INR&tr=${cleanOrderId}&tn=Order${cleanOrderId}`;
  const phonepeUri = `phonepe://pay?pa=${cleanUpi}&pn=Atropine&am=${cleanAmountVal}&cu=INR&tr=${cleanOrderId}&tn=Order${cleanOrderId}`;
  const paytmUri = `paytmmp://pay?pa=${cleanUpi}&pn=Atropine&am=${cleanAmountVal}&cu=INR&tr=${cleanOrderId}&tn=Order${cleanOrderId}`;
  const genericUpiUri = upiWithAmount;

  const hasCustomUploadedQr = Boolean(qrUrl && qrUrl !== upiQrFallback && !qrUrl.includes('upi-qr.png'));

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 text-center">
          Scan & Pay to Complete Order
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Scan with PhonePe, Google Pay, Paytm, or pay directly on your mobile
        </p>

        <div className="bg-panel rounded-2xl p-6 md:p-8 border border-primary/30 space-y-6 shadow-2xl">
          {/* Custom QR vs Dynamic QR Switcher if custom uploaded */}
          {hasCustomUploadedQr && (
            <div className="flex justify-center">
              <div className="bg-background border border-border p-1 rounded-xl flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setQrView('dynamic')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    qrView === 'dynamic'
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ⚡ Dynamic Scannable QR
                </button>
                <button
                  type="button"
                  onClick={() => setQrView('custom')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    qrView === 'custom'
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Custom Merchant QR
                </button>
              </div>
            </div>
          )}

          {/* QR Code Container */}
          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-emerald-500/40 shadow-inner">
            {hasCustomUploadedQr && qrView === 'custom' ? (
              <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-300">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-64 h-64 object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* QR Format Selector */}
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIncludeAmountInQr(true)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      includeAmountInQr
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    ⚡ Auto-Amount: ₹{cleanAmountVal}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeAmountInQr(false)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      !includeAmountInQr
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Open Amount Scan
                  </button>
                </div>

                {/* Clean White Card with Large Simple QR modules */}
                <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-slate-100 flex items-center justify-center">
                  <QRCodeCanvas
                    id="upi-qr-canvas"
                    value={activeQrUri}
                    size={260}
                    level="L"
                    includeMargin={true}
                  />
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadQR}
                    className="text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Save QR to Phone Gallery
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-200 font-medium mt-3 flex items-center gap-1.5 text-center">
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Scan with Google Pay, PhonePe, Paytm, or BHIM camera</span>
            </p>
          </div>

          {/* Mobile Direct Pay Buttons */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-center text-muted-foreground">
              ⚡ Paying on Mobile? Tap to open your UPI app directly:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={gpayUri}
                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3 px-3 rounded-xl shadow text-center text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Google Pay (₹{cleanAmountVal})</span>
              </a>
              <a
                href={phonepeUri}
                className="bg-[#5f259f] hover:bg-[#4d1d82] text-white font-bold py-3 px-3 rounded-xl shadow text-center text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>PhonePe (₹{cleanAmountVal})</span>
              </a>
              <a
                href={paytmUri}
                className="bg-[#00b9f5] hover:bg-[#0092c2] text-white font-bold py-3 px-3 rounded-xl shadow text-center text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Paytm (₹{cleanAmountVal})</span>
              </a>
              <a
                href={genericUpiUri}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-3 rounded-xl shadow text-center text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Any UPI App (₹{cleanAmountVal})</span>
              </a>
            </div>
          </div>

          {/* Amount Box with 1-Click Copy */}
          <div className="p-4 bg-background rounded-xl border border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-extrabold text-primary">{orderData.price}</p>
              {orderData.tierLabel && (
                <p className="text-xs text-muted-foreground mt-0.5">{orderData.tierLabel}</p>
              )}
            </div>
            {cleanAmountVal && (
              <Button
                type="button"
                variant="outline"
                onClick={copyAmount}
                className="border-primary/50 text-primary hover:bg-primary/10 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy ₹{cleanAmountVal}
              </Button>
            )}
          </div>

          {/* UPI ID with 1-Click Copy */}
          <div>
            <Label className="text-foreground">UPI ID (If paying manually)</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={upiId}
                readOnly
                className="bg-background border-border text-foreground font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyUpiId}
                className="border-border text-xs shrink-0"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Copy UPI ID
              </Button>
            </div>
          </div>

          {/* Self-Payment Warning Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300">
            <p className="font-semibold flex items-center gap-1.5 text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Important Testing Note:
            </p>
            <p className="mt-1 text-amber-200/90 leading-relaxed">
              UPI apps (PhonePe, Google Pay) do not allow scanning your own UPI ID from the same phone (they block self-transfer with "Unable to scan"). To test, please scan using another device/phone, or tap the direct app buttons above.
            </p>
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
          <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border/50">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Easy Payment Steps:
            </h3>
            <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
              <li>Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM)</li>
              <li>Or tap any of the direct buttons above (Google Pay, PhonePe, Paytm)</li>
              <li>Confirm the amount: <strong className="text-primary">{orderData.price}</strong> and enter your UPI PIN</li>
              <li>Upload payment screenshot (optional) and tap <strong>"Submit Order After Payment"</strong></li>
              <li>TradingView indicator access will be granted to your username shortly</li>
            </ol>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon font-bold"
          >
            {uploading ? 'Submitting...' : 'Submit Order After Payment'}
          </Button>

          {/* Payment Apps */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground text-center">
              Accepted payment methods: UPI, Google Pay, PhonePe, Paytm, BHIM, Cred
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutQR;
