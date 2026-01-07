import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  customizable?: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
  customization?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total: number;
  status: 'pending' | 'confirmed' | 'completed';
  has_custom_items?: boolean;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: CartItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

// ============================================
// PRODUCTS
// ============================================

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const addProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }

  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return false;
  }

  return true;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
};

// ============================================
// CART (toujours localStorage)
// ============================================

const CART_KEY = 'cym_cart';
const isBrowser = typeof window !== 'undefined';

export const getCart = (): CartItem[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (!isBrowser) return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: Product, quantity: number = 1, customization?: string): void => {
  const cart = getCart();
  
  if (customization) {
    cart.push({ ...product, quantity, customization });
  } else {
    const existingItem = cart.find(item => item.id === product.id && !item.customization);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
  }
  
  saveCart(cart);
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
};

export const clearCart = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(CART_KEY);
};

// ============================================
// ORDERS
// ============================================

export const getOrders = async (): Promise<OrderWithItems[]> => {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  const ordersWithItems = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        return { ...order, items: [] };
      }

      const cartItems: CartItem[] = items.map(item => ({
        id: item.product_id,
        name: item.product_name,
        description: '',
        price: parseFloat(item.product_price),
        images: [],
        category: '',
        stock: 0,
        quantity: item.quantity,
        customization: item.customization || undefined
      }));

      return {
        ...order,
        items: cartItems
      };
    })
  );

  return ordersWithItems;
};

export const createOrder = async (
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  items: CartItem[]
): Promise<Order | null> => {
  const total = items.reduce((sum, item) => {
    if (item.customization) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  const hasCustomItems = items.some(item => item.customization);

  // Créer ou récupérer le client
  let customerId = null;
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .or(`phone.eq.${customerPhone},email.eq.${customerEmail}`)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert([{ name: customerName, phone: customerPhone, email: customerEmail }])
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer:', customerError);
    } else {
      customerId = newCustomer?.id;
    }
  }

  // Créer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id: customerId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      total,
      status: 'pending',
      has_custom_items: hasCustomItems
    }])
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }

  // Ajouter les items de la commande
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    product_price: item.price,
    quantity: item.quantity,
    customization: item.customization || null
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
  }

  return order;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
};

// ============================================
// CUSTOMERS
// ============================================

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data || [];
};

// ============================================
// ADMIN AUTH (toujours localStorage)
// ============================================

const ADMIN_AUTH_KEY = 'cym_admin_auth';

export const isAdminAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const setAdminAuthenticated = (value: boolean): void => {
  if (!isBrowser) return;
  if (value) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

// ============================================
// DEMO DATA (pour initialiser)
// ============================================

export const initializeDemoData = async (): Promise<void> => {
  const products = await getProducts();
  
  if (products.length === 0) {
    const demoProducts = [
      {
        name: 'Miroir Élégance Dorée',
        description: 'Miroir luxueux avec cadre doré finement travaillé. Parfait pour votre salon ou chambre.',
        price: 2500,
        images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800'],
        category: 'Premium',
        stock: 10,
        customizable: true
      },
      {
        name: 'Miroir Moderne Minimaliste',
        description: 'Design épuré et élégant, idéal pour les intérieurs contemporains.',
        price: 1800,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800'],
        category: 'Moderne',
        stock: 15,
        customizable: false
      },
      {
        name: 'Miroir Vintage Classique',
        description: 'Un chef-d\'œuvre intemporel avec des détails ornementaux exquis.',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
        category: 'Vintage',
        stock: 5,
        customizable: true
      }
    ];

    for (const product of demoProducts) {
      await addProduct(product);
    }
  }
};