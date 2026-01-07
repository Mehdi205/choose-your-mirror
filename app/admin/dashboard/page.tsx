'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, OrderWithItems, Customer, getProducts, getOrders, getCustomers, updateOrderStatus, setAdminAuthenticated } from '@/lib/store';
import { Package, ShoppingCart, Users, LogOut, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsData, ordersData, customersData] = await Promise.all([
      getProducts(),
      getOrders(),
      getCustomers()
    ]);
    setProducts(productsData);
    setOrders(ordersData);
    setCustomers(customersData);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push('/admin');
  };

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    await updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-luxury-darkNavy">
      {/* Header */}
      <div className="bg-gradient-navy border-b border-luxury-gold/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-luxury-gold">Dashboard Admin</h1>
              <p className="text-luxury-lightGold/70 mt-1">Choose Your Mirror</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 border-2 border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-lightGold/60 mb-1">Produits</p>
                <p className="text-3xl font-bold text-luxury-gold">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-lightGold/60 mb-1">Commandes</p>
                <p className="text-3xl font-bold text-luxury-gold">{orders.length}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-lightGold/60 mb-1">Clients</p>
                <p className="text-3xl font-bold text-luxury-gold">{customers.length}</p>
              </div>
              <Users className="w-12 h-12 text-luxury-gold/30" />
            </div>
          </div>

          <div className="card-luxury">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-luxury-lightGold/60 mb-1">Revenus</p>
                <p className="text-3xl font-bold text-luxury-gold">{totalRevenue} DH</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-luxury">
          <div className="flex space-x-1 mb-6 border-b border-luxury-gold/20">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/60 hover:text-luxury-gold'
              }`}
            >
              Produits ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/60 hover:text-luxury-gold'
              }`}
            >
              Commandes ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'customers'
                  ? 'text-luxury-gold border-b-2 border-luxury-gold'
                  : 'text-luxury-lightGold/60 hover:text-luxury-gold'
              }`}
            >
              Clients ({customers.length})
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-gold">Gestion des Produits</h2>
                <button
                  onClick={() => router.push('/admin/products/add')}
                  className="btn-primary"
                >
                  + Ajouter un produit
                </button>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-luxury-navy/30 rounded-lg p-4 border border-luxury-gold/20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-luxury-darkNavy rounded-lg flex items-center justify-center text-2xl">
                          🪞
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-luxury-gold">{product.name}</h3>
                        <p className="text-sm text-luxury-lightGold/60">{product.category} • {product.price} DH</p>
                        <p className="text-xs text-luxury-lightGold/50">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="btn-secondary px-4 py-2 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Voir</span>
                      </button>
                      <button
                        onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                        className="btn-primary px-4 py-2"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-luxury-gold mb-6">Gestion des Commandes</h2>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-luxury-navy/30 rounded-lg p-6 border border-luxury-gold/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-luxury-gold mb-2">Commande #{order.id.slice(0, 8)}</h3>
                        <div className="text-sm text-luxury-lightGold/60">Client: {order.customer_name}</div>
                        <div className="text-sm text-luxury-lightGold/60">Tél: {order.customer_phone}</div>
                        <div className="text-sm text-luxury-lightGold/60">Date: {new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-luxury-gold mb-2">{order.total} DH</div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className="input-luxury text-sm"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="completed">Complété</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-luxury-gold/20 pt-4">
                      <h4 className="text-sm font-semibold text-luxury-gold mb-2">Produits commandés :</h4>
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm text-luxury-lightGold/70 flex justify-between py-1">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{item.price * item.quantity} DH</span>
                        </div>
                      ))}
                    </div>

                    {order.has_custom_items && (
                      <div className="mt-4 bg-purple-600/10 border border-purple-600/30 rounded-lg p-3">
                        <p className="text-sm text-purple-400">⚠️ Cette commande contient des produits personnalisés</p>
                      </div>
                    )}
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-12 text-luxury-lightGold/50">
                    Aucune commande pour le moment
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-luxury-gold mb-6">Base de Clients</h2>
              
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-luxury-navy/30 rounded-lg p-4 border border-luxury-gold/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-luxury-gold">{customer.name}</h3>
                        <div className="text-sm text-luxury-lightGold/60">📱 {customer.phone}</div>
                        <div className="text-sm text-luxury-lightGold/60">📧 {customer.email}</div>
                        <div className="text-sm text-luxury-lightGold/60">Client enregistré</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-luxury-lightGold/50">{new Date(customer.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {customers.length === 0 && (
                  <div className="text-center py-12 text-luxury-lightGold/50">
                    Aucun client enregistré
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}