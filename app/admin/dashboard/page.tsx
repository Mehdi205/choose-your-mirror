'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated, setAdminAuthenticated, getProducts, getOrders, getCustomers, Product, Order, Customer } from '@/lib/store';
import { Package, ShoppingBag, Users, TrendingUp, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers'>('products');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
      return;
    }

    loadData();
  }, [router]);

  const loadData = () => {
    setProducts(getProducts());
    setOrders(getOrders());
    setCustomers(getCustomers());
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push('/admin');
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.total, 0);
  };

  const getRecentOrders = () => {
    return orders.slice(-5).reverse();
  };

  return (
    <div className="min-h-screen bg-luxury-darkNavy">
      {/* Top Bar */}
      <div className="bg-gradient-navy border-b border-luxury-gold/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-luxury-gold">Dashboard Admin</h1>
              <p className="text-sm text-luxury-lightGold/70">Choose Your Mirror</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="btn-secondary text-sm">
                Voir le site
              </Link>
              <button onClick={handleLogout} className="btn-primary text-sm flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-luxury-lightGold/70 text-sm mb-2">Produits</p>
                <p className="text-3xl font-bold text-luxury-gold">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-luxury-lightGold/70 text-sm mb-2">Commandes</p>
                <p className="text-3xl font-bold text-luxury-gold">{orders.length}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-luxury-lightGold/70 text-sm mb-2">Clients</p>
                <p className="text-3xl font-bold text-luxury-gold">{customers.length}</p>
              </div>
              <Users className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-luxury-lightGold/70 text-sm mb-2">Revenus</p>
                <p className="text-3xl font-bold text-luxury-gold">{calculateTotalRevenue()} DH</p>
              </div>
              <TrendingUp className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-luxury mb-8">
          <div className="flex border-b border-luxury-gold/20">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/70 hover:text-luxury-gold'
              }`}
            >
              Produits ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/70 hover:text-luxury-gold'
              }`}
            >
              Commandes ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'customers'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/70 hover:text-luxury-gold'
              }`}
            >
              Clients ({customers.length})
            </button>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-serif text-luxury-gold">Gestion des Produits</h2>
                  <Link href="/admin/products/add" className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un produit</span>
                  </Link>
                </div>

                {products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-luxury-gold/20">
                          <th className="text-left py-3 px-4 text-luxury-gold">Produit</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Catégorie</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Prix</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Stock</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-luxury-gold/10 hover:bg-luxury-navy/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-luxury-darkNavy rounded-lg flex items-center justify-center text-2xl">
                                  🪞
                                </div>
                                <span className="text-luxury-lightGold">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-luxury-lightGold/70">{product.category}</td>
                            <td className="py-3 px-4 text-luxury-gold font-semibold">{product.price} DH</td>
                            <td className="py-3 px-4 text-luxury-lightGold/70">{product.stock}</td>
                            <td className="py-3 px-4">
                              <Link
                                href={`/admin/products/edit/${product.id}`}
                                className="text-luxury-gold hover:text-luxury-lightGold text-sm"
                              >
                                Modifier
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-luxury-lightGold/70">Aucun produit. Commencez par en ajouter un !</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif text-luxury-gold">Commandes Récentes</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {getRecentOrders().map((order) => (
                      <div key={order.id} className="bg-luxury-navy/30 rounded-lg p-4 border border-luxury-gold/20">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-luxury-gold font-semibold">{order.customerName}</p>
                            <p className="text-sm text-luxury-lightGold/70">{order.customerPhone}</p>
                            <p className="text-xs text-luxury-lightGold/50">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-luxury-gold">{order.total} DH</p>
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status === 'completed' ? 'Complété' :
                               order.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-luxury-lightGold/70 flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span>{item.price * item.quantity} DH</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-luxury-lightGold/70">Aucune commande pour le moment</p>
                  </div>
                )}
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif text-luxury-gold">Base Clients</h2>
                {customers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-luxury-gold/20">
                          <th className="text-left py-3 px-4 text-luxury-gold">Nom</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Téléphone</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Email</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Commandes</th>
                          <th className="text-left py-3 px-4 text-luxury-gold">Inscrit le</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.id} className="border-b border-luxury-gold/10 hover:bg-luxury-navy/30">
                            <td className="py-3 px-4 text-luxury-lightGold">{customer.name}</td>
                            <td className="py-3 px-4 text-luxury-lightGold/70">{customer.phone}</td>
                            <td className="py-3 px-4 text-luxury-lightGold/70">{customer.email}</td>
                            <td className="py-3 px-4 text-luxury-gold font-semibold">{customer.orders.length}</td>
                            <td className="py-3 px-4 text-luxury-lightGold/70 text-sm">
                              {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-luxury-lightGold/70">Aucun client enregistré</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
