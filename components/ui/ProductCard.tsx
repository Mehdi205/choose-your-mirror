'use client';

import { Product } from '@/lib/store';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card-luxury group overflow-hidden animate-fade-in hover:animate-float">
      {/* Image container */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-luxury-navy">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-luxury-darkNavy">
            <div className="text-6xl text-luxury-gold/30">🪞</div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-luxury-darkNavy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Link
            href={`/products/${product.id}`}
            className="p-3 bg-luxury-gold rounded-full hover:bg-luxury-darkGold transition-colors"
          >
            <Eye className="w-5 h-5 text-luxury-darkNavy" />
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-luxury-gold rounded-full hover:bg-luxury-darkGold transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-luxury-darkNavy" />
          </button>
        </div>

        {/* Stock badge */}
        {product.stock < 5 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Stock limité
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-serif text-luxury-gold group-hover:text-luxury-lightGold transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-luxury-lightGold/60 mt-1">
              {product.category}
            </p>
          </div>
        </div>

        <p className="text-sm text-luxury-lightGold/70 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-luxury-gold/20">
          <div>
            <span className="text-2xl font-bold text-luxury-gold">
              {product.price} DH
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="btn-primary text-sm py-2 px-6"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
