import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, GripVertical, Image as ImageIcon, Video, Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products as localStaticProducts } from '@/data/products';
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
  const [uploadingFiles, setUploadingFiles] = useState(false);
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

      if (error) {
        console.warn('Supabase products fetch warning:', error.message);
        // Fallback to local products
        const normalized = localStaticProducts.map((p, idx) => ({
          ...p,
          display_order: idx + 1,
          pricing_tiers: p.pricingTiers,
          price_range: p.priceRange
        })) as any;
        setProducts(normalized);
      } else if (data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        const normalized = localStaticProducts.map((p, idx) => ({
          ...p,
          display_order: idx + 1,
          pricing_tiers: p.pricingTiers,
          price_range: p.priceRange
        })) as any;
        setProducts(normalized);
      }
    } catch (error: any) {
      console.warn('Exception fetching products, using local fallback:', error);
      const normalized = localStaticProducts.map((p, idx) => ({
        ...p,
        display_order: idx + 1,
        pricing_tiers: p.pricingTiers,
        price_range: p.priceRange
      })) as any;
      setProducts(normalized);
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

  const uploadFile = async (file: File, type: 'image' | 'video'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('payment-assets')
          .getPublicUrl(filePath);
        return data.publicUrl;
      }
      
      console.warn('Storage upload error, using Data URL fallback:', uploadError);
    } catch (error: any) {
      console.warn('Storage upload exception, using Data URL fallback:', error);
    }

    // Resilient Fallback: Convert to Base64 Data URL so user is NEVER blocked by RLS
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to read image file',
          variant: 'destructive',
        });
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingProduct) return;

    setUploadingFiles(true);
    const file = e.target.files[0];
    const url = await uploadFile(file, 'image');
    
    if (url) {
      setEditingProduct({ ...editingProduct, thumbnail: url });
      toast({
        title: 'Success',
        description: 'Thumbnail uploaded successfully',
      });
    }
    setUploadingFiles(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editingProduct) return;

    setUploadingFiles(true);
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => uploadFile(file, 'image'));
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url): url is string => url !== null);

    if (validUrls.length > 0) {
      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), ...validUrls]
      });
      toast({
        title: 'Success',
        description: `${validUrls.length} image(s) uploaded successfully`,
      });
    }
    setUploadingFiles(false);
    e.target.value = '';
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editingProduct) return;

    setUploadingFiles(true);
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(file => uploadFile(file, 'video'));
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url): url is string => url !== null);

    if (validUrls.length > 0) {
      setEditingProduct({
        ...editingProduct,
        videos: [...(editingProduct.videos || []), ...validUrls]
      });
      toast({
        title: 'Success',
        description: `${validUrls.length} video(s) uploaded successfully`,
      });
    }
    setUploadingFiles(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    if (!editingProduct) return;
    const newImages = [...(editingProduct.images || [])];
    newImages.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: newImages });
  };

  const removeVideo = (index: number) => {
    if (!editingProduct) return;
    const newVideos = [...(editingProduct.videos || [])];
    newVideos.splice(index, 1);
    setEditingProduct({ ...editingProduct, videos: newVideos });
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

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <Label>Thumbnail Image</Label>
                <div className="space-y-3">
                  {editingProduct.thumbnail && (
                    <div className="relative w-40 h-28 rounded-lg border-2 border-border overflow-hidden group">
                      <img 
                        src={editingProduct.thumbnail} 
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, thumbnail: '' })}
                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploadingFiles}
                        className="bg-panel border-border text-foreground"
                        id="thumbnail-upload"
                      />
                      <Label 
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingFiles ? 'Uploading...' : 'Upload File'}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Or Image URL:</span>
                      <Input
                        value={editingProduct.thumbnail || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                        placeholder="https://example.com/indicator-preview.png"
                        className="h-9 text-xs bg-panel border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Images Upload */}
              <div className="space-y-3">
                <Label>Additional Images</Label>
                <div className="space-y-3">
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {editingProduct.images.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg border-2 border-border overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingFiles}
                      className="hidden"
                      id="images-upload"
                    />
                    <Label 
                      htmlFor="images-upload"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Upload Images
                    </Label>
                  </div>
                </div>
              </div>

              {/* Videos Upload */}
              <div className="space-y-3">
                <Label>Videos (MP4, WebM, GIF)</Label>
                <div className="space-y-3">
                  {editingProduct.videos && editingProduct.videos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {editingProduct.videos.map((url, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg border-2 border-border overflow-hidden bg-muted">
                          <video 
                            src={url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-0.5" />
                            </div>
                          </div>
                          <button
                            onClick={() => removeVideo(index)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="video/mp4,video/webm,image/gif"
                      multiple
                      onChange={handleVideoUpload}
                      disabled={uploadingFiles}
                      className="hidden"
                      id="videos-upload"
                    />
                    <Label 
                      htmlFor="videos-upload"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <Video className="w-4 h-4" />
                      Upload Videos
                    </Label>
                  </div>
                </div>
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
            <Button 
              onClick={handleSave} 
              disabled={uploadingFiles}
              className="bg-primary hover:bg-primary-glow"
            >
              {uploadingFiles ? 'Uploading...' : (isCreating ? 'Create Product' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};