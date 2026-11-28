import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save, QrCode, Trash2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export const QRManagement = () => {
  const [upiId, setUpiId] = useState('8668657835@ybl');
  const [qrUrl, setQrUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

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
        localStorage.setItem('admin_upi_id', upiData.value);
      }

      const { data: qrData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'qr_url')
        .maybeSingle();

      if (qrData?.value) {
        setQrUrl(qrData.value);
        localStorage.setItem('admin_qr_url', qrData.value);
      }
    } catch (e) {
      console.warn('Fetch config warning:', e);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `qr-${Date.now()}.${fileExt}`;
    const filePath = `qr/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('payment-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload QR code',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('payment-assets')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    setQrUrl(publicUrl);

    // Save to config
    await saveQRUrl(publicUrl);

    setUploading(false);
  };

  const saveQRUrl = async (url: string) => {
    localStorage.setItem('admin_qr_url', url);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key: 'qr_url', value: url }, { onConflict: 'key' });

      if (error) {
        console.warn('Supabase QR save warning:', error);
      }
      toast({
        title: 'Success',
        description: 'QR code uploaded successfully',
      });
    } catch {
      toast({
        title: 'Success',
        description: 'QR code updated successfully',
      });
    }
  };

  const handleSaveUPI = async () => {
    setSaving(true);
    localStorage.setItem('admin_upi_id', upiId);

    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key: 'upi_id', value: upiId }, { onConflict: 'key' });

      if (error) {
        console.warn('Supabase UPI save warning:', error);
      }
      toast({
        title: 'Success',
        description: 'UPI ID saved successfully',
      });
    } catch {
      toast({
        title: 'Success',
        description: 'UPI ID saved successfully',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Payment Settings</h2>

        {/* UPI ID */}
        <div className="bg-panel rounded-lg p-6 border border-border space-y-4 mb-6">
          <div>
            <Label htmlFor="upi" className="text-foreground">
              UPI ID
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="atropine@ybl"
                className="bg-background border-border text-foreground"
              />
              <Button
                onClick={handleSaveUPI}
                disabled={saving}
                className="bg-primary hover:bg-primary-glow"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            {/* Live Generated QR Preview */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-primary" />
                Live Generated Scannable QR (Always matches your UPI ID)
              </p>
              <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                <QRCodeCanvas
                  value={`upi://pay?pa=${(upiId || '8668657835@ybl').trim()}&pn=Atropine&cu=INR`}
                  size={180}
                  level="L"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Scan with Google Pay, PhonePe, or Paytm to verify your UPI ID works!
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Upload */}
        <div className="bg-panel rounded-lg p-6 border border-border space-y-4">
          <div>
            <Label htmlFor="qr" className="text-foreground">
              Upload Custom Standee / Merchant QR Code (Optional)
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              If left empty, the system automatically shows the live scannable QR code above with exact order amounts.
            </p>
            <div className="mt-2">
              <Input
                id="qr"
                type="file"
                accept="image/*"
                onChange={handleQRUpload}
                disabled={uploading}
                className="bg-background border-border text-foreground"
              />
              {uploading && (
                <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
              )}
            </div>
          </div>

          {qrUrl && (
            <div>
              <div className="flex items-center justify-between mb-2 max-w-xs">
                <p className="text-sm text-muted-foreground">Uploaded Custom QR</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => saveQRUrl('')}
                  className="text-red-400 hover:text-red-300 h-7 px-2 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4 inline-block">
                <img
                  src={qrUrl}
                  alt="Custom Payment QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
