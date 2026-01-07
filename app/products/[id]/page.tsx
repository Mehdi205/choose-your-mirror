'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Product, getProducts, addToCart } from '@/lib/store';
import { ArrowLeft, ShoppingCart, Package, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCustomized, setIsCustomized] = useState(false);
  const [customizationText, setCustomizationText] = useState('');

  useEffect(() => {
    const products = getProducts();
    const found = products.find(p => p.id === params.id);
    
    if (found) {
      setProduct(found);
    } else {
      router.push('/products');
    }
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (product) {
      if (isCustomized && !customizationText.trim()) {
        alert('⚠️ Veuillez décrire votre personnalisation');
        return;
      }

      addToCart(product, quantity, isCustomized ? customizationText : undefined);
      window.dispatchEvent(new Event('cartUpdated'));
      
      if (isCustomized) {
        alert('✨ Produit personnalisé ajouté au panier ! Le prix sera discuté sur WhatsApp.');
      } else {
        alert(`✨ ${quantity} produit(s) ajouté(s) au panier !`);
      }
      
      // Reset
      setCustomizationText('');
      setIsCustomized(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-luxury-gold border-t-transparent mx-auto mb-4"></div>
          <p className="text-luxury-lightGold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center space-x-2 text-sm">
            <Link href="/" className="text-luxury-lightGold/70 hover:text-luxury-gold transition-colors">
              Accueil
            </Link>
            <span className="text-luxury-lightGold/50">/</span>
            <Link href="/products" className="text-luxury-lightGold/70 hover:text-luxury-gold transition-colors">
              Produits
            </Link>
            <span className="text-luxury-lightGold/50">/</span>
            <span className="text-luxury-gold">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link 
            href="/products"
            className="inline-flex items-center space-x-2 text-luxury-gold hover:text-luxury-lightGold transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux produits</span>
          </Link>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-luxury-navy border-2 border-luxury-gold/20">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-luxury-darkNavy">
                    <div className="text-9xl text-luxury-gold/30">🪞</div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-luxury-gold scale-105'
                          : 'border-luxury-gold/20 hover:border-luxury-gold/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Title & Category */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-4 py-1 bg-luxury-gold/10 text-luxury-gold text-sm rounded-full border border-luxury-gold/30">
                    {product.category}
                  </span>
                  {product.stock < 5 && (
                    <span className="px-4 py-1 bg-red-600/20 text-red-400 text-sm rounded-full border border-red-600/30">
                      Stock limité
                    </span>
                  )}
                  {product.customizable && (
                    <span className="px-4 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full border border-purple-600/30 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Personnalisable</span>
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-luxury-gold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />
                  ))}
                  <span className="text-luxury-lightGold/70 ml-2">(128 avis)</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-luxury-gold/20 py-6">
                {isCustomized ? (
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      Prix à discuter
                    </div>
                    <p className="text-luxury-lightGold/70">
                      Le prix sera confirmé sur WhatsApp selon vos personnalisations
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl font-bold text-luxury-gold">
                      {product.price} DH
                    </div>
                    <p className="text-luxury-lightGold/70 mt-2">TVA incluse</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-serif text-luxury-gold mb-4">Description</h3>
                <p className="text-luxury-lightGold/80 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Customization Option */}
              <div className="bg-gradient-navy rounded-xl p-6 border-2 border-luxury-gold/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 text-luxury-gold" />
                    <h3 className="text-lg font-serif text-luxury-gold">Personnalisation</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomized}
                      onChange={(e) => setIsCustomized(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-luxury-navy peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-luxury-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-luxury-gold"></div>
                  </label>
                </div>

                {isCustomized && (
                  <div className="space-y-3 animate-slide-up">
                    <p className="text-sm text-luxury-lightGold/70">
                      Décrivez les modifications que vous souhaitez (dimensions, couleur, gravure, etc.)
                    </p>
                    <textarea
                      value={customizationText}
                      onChange={(e) => setCustomizationText(e.target.value)}
                      className="input-luxury min-h-[120px] resize-y"
                      placeholder="Exemple : Je souhaite un miroir de 120x80cm avec un cadre doré mat et une gravure de mes initiales 'M.B.' en bas à droite..."
                    />
                    <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4">
                      <p className="text-sm text-purple-400 flex items-start space-x-2">
                        <span>💬</span>
                        <span>Le prix final sera discuté et confirmé sur WhatsApp selon votre demande.</span>
                      </p>
                    </div>
                  </div>
                )}

                {!isCustomized && (
                  <p className="text-sm text-luxury-lightGold/70">
                    Activez cette option pour personnaliser ce produit selon vos préférences
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="bg-luxury-navy/30 rounded-xl p-6 border border-luxury-gold/20">
                <h3 className="text-lg font-serif text-luxury-gold mb-4">Caractéristiques</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-luxury-lightGold/80">
                    <Package className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <span>Livraison gratuite partout au Maroc</span>
                  </li>
                  <li className="flex items-center space-x-3 text-luxury-lightGold/80">
                    <Package className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <span>Garantie 2 ans</span>
                  </li>
                  <li className="flex items-center space-x-3 text-luxury-lightGold/80">
                    <Package className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <span>Installation disponible sur demande</span>
                  </li>
                  <li className="flex items-center space-x-3 text-luxury-lightGold/80">
                    <Package className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    <span>Stock disponible : {product.stock} unités</span>
                  </li>
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              {!isCustomized && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-luxury-lightGold/70 mb-2">Quantité</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 rounded-lg bg-luxury-navy border-2 border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-luxury-lightGold w-16 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-12 rounded-lg bg-luxury-navy border-2 border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || (isCustomized && !customizationText.trim())}
                className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>
                  {product.stock === 0 
                    ? 'Rupture de stock' 
                    : isCustomized 
                    ? 'Ajouter avec personnalisation' 
                    : 'Ajouter au panier'}
                </span>
              </button>

              <Link href="/cart" className="block w-full">
                <button className="w-full btn-secondary text-lg py-4">
                  Voir le panier
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-luxury-gold/20">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-xs text-luxury-lightGold/70">Paiement sécurisé</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🚚</div>
                  <p className="text-xs text-luxury-lightGold/70">Livraison rapide</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="text-xs text-luxury-lightGold/70">Qualité premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}