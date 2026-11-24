import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  tv_username: string;
  product_name: string;
  tier_label: string | null;
  price: string;
  payment_screenshot_url: string | null;
  status: string;
  activation_link: string | null;
  created_at: string;
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activationLinks, setActivationLinks] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Orders fetch warning:', error.message);
        const storedOrder = localStorage.getItem('currentOrder');
        if (storedOrder) {
          const parsed = JSON.parse(storedOrder);
          setOrders([{
            id: 'local-1',
            order_id: parsed.orderId || 'ATR-DEMO',
            customer_name: parsed.name || 'Sample Customer',
            customer_email: parsed.email || 'customer@example.com',
            customer_phone: parsed.phone || '918668657835',
            tv_username: parsed.tvUsername || 'trader_pro',
            product_name: parsed.product?.name || 'Market Profile Indicator',
            tier_label: parsed.product?.tier || '30 Days Subscription',
            price: parsed.product?.price || '₹699',
            payment_screenshot_url: null,
            status: 'pending_verification',
            activation_link: null,
            created_at: new Date().toISOString()
          }]);
        }
      } else {
        setOrders(data || []);
      }
    } catch (e) {
      console.warn('Exception loading orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOrder = async (orderId: string) => {
    const link = activationLinks[orderId];
    if (!link) {
      toast({
        title: 'Error',
        description: 'Please enter activation link',
        variant: 'destructive',
      });
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'verified',
        activation_link: link,
        verified_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify order',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Order verified successfully',
      });
      
      // Open WhatsApp with pre-filled message
      const message = `Hello ${order.customer_name},

Your payment has been verified! 

Order ID: ${order.order_id}
Product: ${order.product_name}

TradingView Access Link: ${link}

Instructions:
1. Click the link above
2. Accept the TradingView invite
3. Add indicator to your favorites
4. Start trading!

Need help? Reply to this message.

Thank you for choosing Atropine!`;

      window.open(
        `https://wa.me/${order.customer_phone?.replace(/[^0-9]/g, '') || '918668657835'}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      
      fetchOrders();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'verified':
        return <Badge variant="default" className="bg-green-500/20 text-green-500">Verified</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-foreground">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Order Management</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-panel rounded-lg p-6 border border-border space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{order.order_id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="text-foreground font-semibold">{order.customer_name}</p>
                <p className="text-foreground">{order.customer_email}</p>
                {order.customer_phone && (
                  <p className="text-foreground">{order.customer_phone}</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Product</p>
                <p className="text-foreground font-semibold">{order.product_name}</p>
                {order.tier_label && (
                  <p className="text-muted-foreground">{order.tier_label}</p>
                )}
                <p className="text-primary font-bold">{order.price}</p>
              </div>
              <div>
                <p className="text-muted-foreground">TradingView Username</p>
                <p className="text-foreground font-semibold">{order.tv_username}</p>
              </div>
            </div>

            {order.payment_screenshot_url && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Payment Screenshot</p>
                <a
                  href={order.payment_screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View Screenshot <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {order.status === 'pending_verification' && (
              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <Label htmlFor={`link-${order.id}`} className="text-foreground">
                    TradingView Activation Link
                  </Label>
                  <Input
                    id={`link-${order.id}`}
                    value={activationLinks[order.id] || ''}
                    onChange={(e) =>
                      setActivationLinks({ ...activationLinks, [order.id]: e.target.value })
                    }
                    placeholder="https://tradingview.com/..."
                    className="mt-2 bg-background border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={() => handleVerifyOrder(order.id)}
                  className="bg-primary hover:bg-primary-glow"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify & Send WhatsApp
                </Button>
              </div>
            )}

            {order.status === 'verified' && order.activation_link && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Activation Link</p>
                <a
                  href={order.activation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  {order.activation_link} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
};
