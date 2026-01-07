'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CartItem, getCart, updateCartItemQuantity, removeFromCart, clearCart, createOrder } from '@/lib/store';
import { sendWhatsAppOrder, ADMIN_WHATSAPP } from '@/lib/whatsapp';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    setCartItems(getCart());
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
    loadCart();
  };

  const removeItem = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer ce produit ?')) {
      removeFromCart(productId);
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Si le produit est personnalisé, on ne compte pas son prix dans le total
      if (item.customization) {
        return total;
      }
      return total + item.price * item.quantity;
    }, 0);
  };

  const hasCustomItems = () => {
    return cartItems.some(item => item.customization);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !customerEmail) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setIsSubmitting(true);

    try {
  // Create order in database
  const order = await createOrder(customerName, customerPhone, customerEmail, cartItems);
  
  if (!order) {
    alert('❌ Erreur lors de la création de la commande');
    return;
  }
  
  // Send to WhatsApp
  const total = calculateTotal();
  sendWhatsAppOrder(ADMIN_WHATSAPP, customerName, customerPhone, customerEmail, cartItems, total);
      // Clear cart
      clearCart();
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      
      alert('✨ Commande créée avec succès ! Vous allez être redirigé vers WhatsApp.');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="text-8xl">🛒</div>
              <h1 className="text-4xl font-serif text-luxury-gold">Votre panier est vide</h1>
              <p className="text-luxury-lightGold/70">
                Découvrez notre collection de miroirs luxueux et ajoutez vos favoris
              </p>
              <Link href="/products" className="btn-primary inline-block">
                Découvrir la Collection
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="section-title mb-4">Mon Panier</h1>
              <p className="text-luxury-lightGold/70">
                Finalisez votre commande et contactez-nous via WhatsApp
              </p>
            </div>

            {/* Alert si produits personnalisés */}
            {hasCustomItems() && (
              <div className="mb-8 bg-purple-600/10 border-2 border-purple-600/30 rounded-xl p-6 animate-slide-up">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">
                      Produits Personnalisés Détectés
                    </h3>
                    <p className="text-luxury-lightGold/80">
                      Votre panier contient des produits personnalisés. Le prix final sera discuté et confirmé sur WhatsApp selon vos demandes spécifiques.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.customization || 'standard'}`} className="card-luxury flex flex-col sm:flex-row gap-6 animate-slide-up">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-luxury-darkNavy rounded-lg flex items-center justify-center text-4xl">
                          🪞
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-serif text-luxury-gold">{item.name}</h3>
                          <p className="text-sm text-luxury-lightGold/60">{item.category}</p>
                          
                          {/* Afficher la personnalisation */}
                          {item.customization && (
                            <div className="mt-3 bg-purple-600/10 border border-purple-600/30 rounded-lg p-3">
                              <div className="flex items-start space-x-2">
                                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-purple-400 font-semibold mb-1">
                                    Personnalisation :
                                  </p>
                                  <p className="text-sm text-luxury-lightGold/80 whitespace-pre-line">
                                    {item.customization}
                                  </p>
                                  <p className="text-xs text-purple-400 mt-2 flex items-center space-x-1">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Prix à discuter sur WhatsApp</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-400 transition-colors ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          {!item.customization ? (
                            <>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-luxury-navy border-2 border-luxury-gold/30 hover:border-luxury-gold flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4 text-luxury-gold" />
                              </button>
                              <span className="text-lg font-semibold text-luxury-lightGold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-luxury-navy border-2 border-luxury-gold/30 hover:border-luxury-gold flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4 text-luxury-gold" />
                              </button>
                            </>
                          ) : (
                            <span className="text-sm text-luxury-lightGold/70">
                              Quantité : {item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.customization ? (
                            <div className="text-lg font-bold text-purple-400">
                              À discuter
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-luxury-lightGold/60">
                                {item.price} DH × {item.quantity}
                              </div>
                              <div className="text-xl font-bold text-luxury-gold">
                                {item.price * item.quantity} DH
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-luxury sticky top-24 space-y-6">
                  <h2 className="text-2xl font-serif text-luxury-gold">Résumé</h2>

                  {/* Form */}
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm text-luxury-lightGold/70 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input-luxury"
                        placeholder="Votre nom"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-luxury-lightGold/70 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="input-luxury"
                        placeholder="+212 6XX XX XX XX"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-luxury-lightGold/70 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="input-luxury"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    {/* Total */}
                    <div className="border-t border-luxury-gold/20 pt-4 space-y-2">
                      <div className="flex justify-between text-luxury-lightGold/70">
                        <span>Sous-total</span>
                        <span>{calculateTotal()} DH</span>
                      </div>
                      
                      {hasCustomItems() && (
                        <div className="flex justify-between text-purple-400 text-sm">
                          <span>+ Personnalisations</span>
                          <span>À discuter</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-2xl font-bold text-luxury-gold">
                        <span>Total</span>
                        <span>
                          {calculateTotal()} DH
                          {hasCustomItems() && <span className="text-sm text-purple-400 ml-1">+</span>}
                        </span>
                      </div>
                      
                      {hasCustomItems() && (
                        <p className="text-xs text-purple-400 text-center">
                          + Prix des personnalisations à définir
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>
                        {isSubmitting ? 'Traitement...' : 'Confirmer via WhatsApp'}
                      </span>
                    </button>

                    <p className="text-xs text-luxury-lightGold/50 text-center">
                      En confirmant, vous serez redirigé vers WhatsApp pour finaliser votre commande
                    </p>
                  </form>
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