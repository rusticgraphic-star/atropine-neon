import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save } from 'lucide-react';

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

    if (qrData) {
      setQrUrl(qrData.value);
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
    const { error } = await supabase
      .from('site_config')
      .upsert({ key: 'qr_url', value: url }, { onConflict: 'key' });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save QR URL',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'QR code uploaded successfully',
      });
    }
  };

  const handleSaveUPI = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .upsert({ key: 'upi_id', value: upiId }, { onConflict: 'key' });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save UPI ID',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'UPI ID saved successfully',
      });
    }

    setSaving(false);
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
          </div>
        </div>

        {/* QR Code Upload */}
        <div className="bg-panel rounded-lg p-6 border border-border space-y-4">
          <div>
            <Label htmlFor="qr" className="text-foreground">
              Upload QR Code
            </Label>
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
              <p className="text-sm text-muted-foreground mb-2">Current QR Code</p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <img
                  src={qrUrl}
                  alt="Payment QR Code"
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
