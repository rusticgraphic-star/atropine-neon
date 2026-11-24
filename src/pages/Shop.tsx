import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { products as localProducts } from '@/data/products';

type FilterType = 'all' | 'premium' | 'free';

const Shop = () => {
  const [products, setProducts] = useState<any[]>(localProducts);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        setProducts(localProducts);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.warn('Supabase not reachable, using local products:', error);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    switch (activeFilter) {
      case 'premium':
        return products.filter(p => p.type === 'paid');
      case 'free':
        return products.filter(p => p.type === 'free');
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();
  const paidCount = products.filter(p => p.type === 'paid').length;
  const freeCount = products.filter(p => p.type === 'free').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            All Indicators
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium & Free TradingView tools for professional traders
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('all')}
            className={
              activeFilter === 'all'
                ? 'bg-primary hover:bg-primary-glow text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }
          >
            All ({products.length})
          </Button>
          <Button
            variant={activeFilter === 'premium' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('premium')}
            className={
              activeFilter === 'premium'
                ? 'bg-primary hover:bg-primary-glow text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }
          >
            Premium ({paidCount})
          </Button>
          <Button
            variant={activeFilter === 'free' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('free')}
            className={
              activeFilter === 'free'
                ? 'bg-primary hover:bg-primary-glow text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }
          >
            Free ({freeCount})
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
