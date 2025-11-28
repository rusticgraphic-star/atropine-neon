import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="group relative bg-panel rounded-[22px] p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-neon">
        {/* Premium/Free Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge 
            variant={product.type === 'paid' ? 'default' : 'secondary'}
            className={
              product.type === 'paid' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }
          >
            {product.type === 'paid' ? 'Premium' : 'Free Access'}
          </Badge>
        </div>

        {/* Thumbnail */}
        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
          <img 
            src={product.thumbnail} 
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Price/Action */}
          <div className="flex items-center justify-between pt-2">
            {product.type === 'paid' && product.price && (
              <div>
                <span className="text-2xl font-bold text-primary">{product.price}</span>
                {product.priceRange && (
                  <span className="text-xs text-muted-foreground ml-2">onwards</span>
                )}
              </div>
            )}
            {product.type === 'free' && (
              <span className="text-lg font-semibold text-secondary">Free</span>
            )}
            
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary-glow text-primary-foreground"
            >
              View Details
            </Button>
          </div>

          {/* Features Preview */}
          <div className="flex flex-wrap gap-2 pt-2">
            {product.features.slice(0, 2).map((feature, idx) => (
              <span 
                key={idx}
                className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
