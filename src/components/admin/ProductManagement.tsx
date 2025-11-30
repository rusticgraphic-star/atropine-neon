import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, GripVertical, Image as ImageIcon, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  slug: string;
  type: 'free' | 'paid';
  price?: string;
  price_range?: string;
  pricing_tiers?: any;
  description: string;
  long_description?: string;
  thumbnail: string;
  images?: string[];
  videos?: string[];
  features?: string[];
  key_features?: any;
  specs: any;
  display_order: number;
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProduct({
      id: '',
      name: '',
      slug: '',
      type: 'free',
      description: '',
      thumbnail: '',
      images: [],
      videos: [],
      features: [],
      key_features: [],
      specs: { markets: '', timeframes: '', alerts: '' },
      display_order: products.length + 1,
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('products')
          .insert([{
            name: editingProduct.name,
            slug: editingProduct.slug,
            type: editingProduct.type,
            price: editingProduct.price,
            price_range: editingProduct.price_range,
            pricing_tiers: editingProduct.pricing_tiers,
            description: editingProduct.description,
            long_description: editingProduct.long_description,
            thumbnail: editingProduct.thumbnail,
            images: editingProduct.images,
            videos: editingProduct.videos,
            features: editingProduct.features,
            key_features: editingProduct.key_features,
            specs: editingProduct.specs,
            display_order: editingProduct.display_order,
          }]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: editingProduct.name,
            slug: editingProduct.slug,
            type: editingProduct.type,
            price: editingProduct.price,
            price_range: editingProduct.price_range,
            pricing_tiers: editingProduct.pricing_tiers,
            description: editingProduct.description,
            long_description: editingProduct.long_description,
            thumbnail: editingProduct.thumbnail,
            images: editingProduct.images,
            videos: editingProduct.videos,
            features: editingProduct.features,
            key_features: editingProduct.key_features,
            specs: editingProduct.specs,
            display_order: editingProduct.display_order,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Product ${isCreating ? 'created' : 'updated'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const moveProduct = async (productId: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= products.length) return;

    const newProducts = [...products];
    [newProducts[currentIndex], newProducts[newIndex]] = [newProducts[newIndex], newProducts[currentIndex]];

    try {
      const updates = newProducts.map((p, index) => 
        supabase.from('products').update({ display_order: index + 1 }).eq('id', p.id)
      );
      
      await Promise.all(updates);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Product Management</h2>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <Card key={product.id} className="p-6 bg-panel border-border">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProduct(product.id, 'up')}
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveProduct(product.id, 'down')}
                  disabled={index === products.length - 1}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              </div>

              <img 
                src={product.thumbnail} 
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border border-border"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.slug}</p>
                    <Badge 
                      variant={product.type === 'paid' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {product.type === 'paid' ? 'Premium' : 'Free'}
                    </Badge>
                    {product.type === 'paid' && product.price_range && (
                      <p className="text-sm text-primary mt-1">{product.price_range}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="border-border"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="border-border text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {(product.images?.length || 0)} images
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {(product.videos?.length || 0)} videos
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isCreating ? 'Create New Product' : 'Edit Product'}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-panel border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="bg-panel border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type</Label>
                  <Select
                    value={editingProduct.type}
                    onValueChange={(value: 'free' | 'paid') => 
                      setEditingProduct({ ...editingProduct, type: value })
                    }
                  >
                    <SelectTrigger className="bg-panel border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingProduct.type === 'paid' && (
                  <div className="space-y-2">
                    <Label htmlFor="price_range">Price Range</Label>
                    <Input
                      id="price_range"
                      value={editingProduct.price_range || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_range: e.target.value })}
                      placeholder="₹699 – ₹39,999"
                      className="bg-panel border-border text-foreground"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={2}
                  className="bg-panel border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description (Markdown supported)</Label>
                <Textarea
                  id="long_description"
                  value={editingProduct.long_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, long_description: e.target.value })}
                  rows={4}
                  className="bg-panel border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={editingProduct.thumbnail}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="bg-panel border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Additional Image URLs (one per line)</Label>
                <Textarea
                  id="images"
                  value={editingProduct.images?.join('\n') || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    images: e.target.value.split('\n').filter(url => url.trim())
                  })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg"
                  className="bg-panel border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videos">Video URLs (one per line)</Label>
                <Textarea
                  id="videos"
                  value={editingProduct.videos?.join('\n') || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    videos: e.target.value.split('\n').filter(url => url.trim())
                  })}
                  rows={2}
                  placeholder="https://example.com/video.mp4"
                  className="bg-panel border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={editingProduct.features?.join('\n') || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    features: e.target.value.split('\n').filter(f => f.trim())
                  })}
                  rows={4}
                  className="bg-panel border-border text-foreground"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-glow">
              {isCreating ? 'Create Product' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};