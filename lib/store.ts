export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
  customizable?: boolean; // NOUVEAU
}

export interface CartItem extends Product {
  quantity: number;
  customization?: string; // NOUVEAU - Texte de personnalisation
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  hasCustomItems?: boolean; // NOUVEAU - Indique si commande contient personnalisations
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: string[];
  createdAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'cym_products',
  CART: 'cym_cart',
  ORDERS: 'cym_orders',
  CUSTOMERS: 'cym_customers',
  ADMIN_AUTH: 'cym_admin_auth',
};

// Helper functions
const isBrowser = typeof window !== 'undefined';

// Products
export const getProducts = (): Product[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
};

// Cart
export const getCart = (): CartItem[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const addToCart = (product: Product, quantity: number = 1, customization?: string): void => {
  const cart = getCart();
  
  // Si le produit a une personnalisation, on l'ajoute comme un nouvel item
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
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// Orders
export const getOrders = (): Order[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrders = (orders: Order[]): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const createOrder = (
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  items: CartItem[]
): Order => {
  const orders = getOrders();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const newOrder: Order = {
    id: Date.now().toString(),
    customerName,
    customerPhone,
    customerEmail,
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  saveOrders(orders);
  
  // Add or update customer
  saveCustomer(customerName, customerPhone, customerEmail, newOrder.id);
  
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
};

// Customers
export const getCustomers = (): Customer[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  return data ? JSON.parse(data) : [];
};

export const saveCustomers = (customers: Customer[]): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
};

export const saveCustomer = (
  name: string,
  phone: string,
  email: string,
  orderId: string
): void => {
  const customers = getCustomers();
  const existing = customers.find(c => c.phone === phone || c.email === email);
  
  if (existing) {
    if (!existing.orders.includes(orderId)) {
      existing.orders.push(orderId);
    }
  } else {
    customers.push({
      id: Date.now().toString(),
      name,
      phone,
      email,
      orders: [orderId],
      createdAt: new Date().toISOString(),
    });
  }
  
  saveCustomers(customers);
};

// Admin Authentication
export const isAdminAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuthenticated = (value: boolean): void => {
  if (!isBrowser) return;
  if (value) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

// Initialize with demo data if empty
export const initializeDemoData = (): void => {
  if (!isBrowser) return;
  
  const products = getProducts();
  if (products.length === 0) {
    const demoProducts: Product[] = [
      {
        id: '1',
        name: 'Miroir Élégance Dorée',
        description: 'Miroir luxueux avec cadre doré finement travaillé. Parfait pour votre salon ou chambre.',
        price: 2500,
        images: ['/images/mirror1.jpg'],
        category: 'Premium',
        stock: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Miroir Moderne Minimaliste',
        description: 'Design épuré et élégant, idéal pour les intérieurs contemporains.',
        price: 1800,
        images: ['/images/mirror2.jpg'],
        category: 'Moderne',
        stock: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Miroir Vintage Classique',
        description: 'Un chef-d\'œuvre intemporel avec des détails ornementaux exquis.',
        price: 3200,
        images: ['/images/mirror3.jpg'],
        category: 'Vintage',
        stock: 5,
        createdAt: new Date().toISOString(),
      },
    ];
    saveProducts(demoProducts);
  }
};
