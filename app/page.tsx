'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { Product, getProducts, addToCart, initializeDemoData } from '@/lib/store';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeDemoData();
    const products = getProducts().slice(0, 3);
    setFeaturedProducts(products);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    window.dispatchEvent(new Event('cartUpdated'));
    alert('✨ Produit ajouté au panier avec succès !');
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-luxury-navy via-luxury-darkNavy to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Main Title */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Sparkles className="w-8 h-8 text-luxury-gold animate-pulse" />
                <span className="text-luxury-gold text-sm tracking-widest uppercase">Luxe & Élégance</span>
                <Sparkles className="w-8 h-8 text-luxury-gold animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-luxury-gold leading-tight">
                Choose Your Mirror
              </h1>
              
              <p className="text-2xl md:text-3xl text-luxury-lightGold font-light">
                L'Art du Reflet Personnalisé
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-luxury-lightGold/80 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre collection exclusive de miroirs sur mesure. 
              Chaque création est un chef-d'œuvre unique qui sublime votre intérieur.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link href="/products" className="btn-primary group">
                Découvrir la Collection
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/cart" className="btn-secondary">
                Voir le Panier
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-gold mb-2">500+</div>
                <div className="text-luxury-lightGold/70">Créations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-gold mb-2">98%</div>
                <div className="text-luxury-lightGold/70">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-gold mb-2">5★</div>
                <div className="text-luxury-lightGold/70">Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-luxury-gold rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-luxury-gold rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-navy relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title">Pourquoi Nous Choisir</h2>
            <p className="text-luxury-lightGold/70 mt-4 max-w-2xl mx-auto">
              Excellence, qualité et service personnalisé pour chaque client
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-luxury text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-serif text-luxury-gold">Qualité Premium</h3>
              <p className="text-luxury-lightGold/70">
                Matériaux nobles et finitions impeccables pour chaque miroir
              </p>
            </div>

            <div className="card-luxury text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-serif text-luxury-gold">Personnalisation</h3>
              <p className="text-luxury-lightGold/70">
                Créations sur mesure adaptées à vos goûts et votre espace
              </p>
            </div>

            <div className="card-luxury text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-serif text-luxury-gold">Livraison Sécurisée</h3>
              <p className="text-luxury-lightGold/70">
                Emballage soigné et livraison rapide partout au Maroc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title">Collection Signature</h2>
            <p className="text-luxury-lightGold/70 mt-4 max-w-2xl mx-auto">
              Découvrez nos créations les plus emblématiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary group">
              Voir Toute la Collection
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Témoignages Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Amina K.",
                text: "Un travail exceptionnel ! Mon miroir est une véritable œuvre d'art.",
                rating: 5
              },
              {
                name: "Karim M.",
                text: "Service impeccable et produit de haute qualité. Je recommande vivement !",
                rating: 5
              },
              {
                name: "Salma B.",
                text: "Exactement ce que je cherchais. L'élégance à l'état pur.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card-luxury space-y-4">
                <div className="flex justify-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-luxury-lightGold/80 italic">"{testimonial.text}"</p>
                <p className="text-luxury-gold font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}