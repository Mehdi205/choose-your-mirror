'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCart } from '@/lib/store';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-luxury-darkNavy/95 backdrop-blur-md shadow-2xl border-b border-luxury-gold/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-luxury-gold group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 bg-luxury-gold/20 blur-xl group-hover:bg-luxury-gold/40 transition-all duration-500"></div>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gradient-gold">
                Choose Your Mirror
              </h1>
              <p className="text-xs text-luxury-gold/70 tracking-widest">LUXURY MIRRORS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300 font-medium"
            >
              Accueil
            </Link>
            <Link 
              href="/products" 
              className="text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300 font-medium"
            >
              Produits
            </Link>
            <Link 
              href="/cart" 
              className="relative group"
            >
              <div className="flex items-center space-x-2 text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300">
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-darkNavy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-luxury-gold hover:text-luxury-lightGold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 space-y-4 animate-slide-up">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300 font-medium py-2"
            >
              Accueil
            </Link>
            <Link 
              href="/products" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300 font-medium py-2"
            >
              Produits
            </Link>
            <Link 
              href="/cart" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-luxury-lightGold hover:text-luxury-gold transition-colors duration-300 font-medium py-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Panier ({cartItemsCount})</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
