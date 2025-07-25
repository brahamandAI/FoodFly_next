// API service for handling cart, orders, and restaurant data
import axios from 'axios';

// Use relative path to avoid port conflicts
const API_URL = '';

console.log('API_URL:', API_URL || 'Using relative paths');

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable sending cookies
});

// Debug interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      delete axiosInstance.defaults.headers.Authorization;
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }

    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }

    // Handle API errors - support multiple response formats
    let message = 'An error occurred';
    const responseData = error.response?.data;
    
    if (responseData) {
      // Try different error message formats
      message = responseData.error || 
                responseData.message || 
                responseData.data?.error || 
                responseData.data?.message ||
                error.message;
    } else {
      message = error.message;
    }
    
    console.error('Final error message:', message);
    throw new Error(message);
  }
);

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: string;
  customizations?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
}

export interface CartItem {
  _id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations?: {
    name: string;
    selectedOption: string;
    price: number;
  }[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  user: string;
  restaurant: {
    _id: string;
    name: string;
    image: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'payment_failed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'cash' | 'upi';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  deliveryInstructions?: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Database cart service - uses actual API endpoints
export const cartService = {
  getCart: async (): Promise<{ items: any[]; subtotal: number; totalItems: number }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Cart API Error:', error);
      throw new Error(error.error || 'Failed to fetch cart');
    }

    const data = await response.json();
    console.log('Cart data received:', data);
    return {
      items: data.cart.items || [],
      subtotal: data.cart.subtotal || 0,
      totalItems: data.cart.totalItems || 0
    };
  },

  addToCart: async (menuItemId: string, name: string, description: string, price: number, quantity: number, image: string, restaurantId: string, restaurantName: string, customizations: any[] = []): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    console.log('Adding to cart:', { menuItemId, name, price, quantity });

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuItemId,
        name,
        description,
        price,
        quantity,
        image,
        restaurantId,
        restaurantName,
        customizations
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Add to cart API Error:', error);
      throw new Error(error.error || 'Failed to add item to cart');
    }

    console.log('Item added to cart successfully');
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  },

  updateCartItem: async (menuItemId: string, quantity: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    console.log('Updating cart item:', { menuItemId, quantity });

    const response = await fetch(`/api/cart/items/${menuItemId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Update cart item API Error:', error, 'URL:', `/api/cart/items/${menuItemId}`);
      throw new Error(error.error || 'Failed to update cart item');
    }

    console.log('Cart item updated successfully');
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  },

  removeFromCart: async (menuItemId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    console.log('Removing from cart:', { menuItemId });

    const response = await fetch(`/api/cart/items/${menuItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Remove from cart API Error:', error, 'URL:', `/api/cart/items/${menuItemId}`);
      throw new Error(error.error || 'Failed to remove item from cart');
    }

    console.log('Item removed from cart successfully');
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  },

  clearCart: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Clear cart API Error:', error);
      throw new Error(error.error || 'Failed to clear cart');
    }

    console.log('Cart cleared successfully');
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  },

  updateItemQuantity: async (menuItemId: string, quantity: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    console.log('Updating item quantity:', { menuItemId, quantity });

    const response = await fetch(`/api/cart/items/${menuItemId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Update item quantity API Error:', error, 'URL:', `/api/cart/items/${menuItemId}`);
      throw new Error(error.error || 'Failed to update item quantity');
    }

    console.log('Item quantity updated successfully');
    // Dispatch event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  },
};

export const addressService = {
  getAddresses: (): Address[] => {
    if (typeof window === 'undefined') return [];
    const addresses = localStorage.getItem('addresses');
    return addresses ? JSON.parse(addresses) : [];
  },

  addAddress: (address: Omit<Address, '_id'>): void => {
    if (typeof window === 'undefined') return;
    const addresses = addressService.getAddresses();
    const newAddress = { ...address, _id: Date.now().toString() };
    
    if (address.isDefault) {
      // Remove default from other addresses
      addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses.push(newAddress);
    localStorage.setItem('addresses', JSON.stringify(addresses));
  },

  updateAddress: (addressId: string, updates: Partial<Address>): void => {
    if (typeof window === 'undefined') return;
    const addresses = addressService.getAddresses();
    const addressIndex = addresses.findIndex(addr => addr._id === addressId);
    
    if (addressIndex > -1) {
      if (updates.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      addresses[addressIndex] = { ...addresses[addressIndex], ...updates };
      localStorage.setItem('addresses', JSON.stringify(addresses));
    }
  },

  deleteAddress: (addressId: string): void => {
    if (typeof window === 'undefined') return;
    const addresses = addressService.getAddresses();
    const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
  },

  getDefaultAddress: (): Address | null => {
    const addresses = addressService.getAddresses();
    return addresses.find(addr => addr.isDefault) || addresses[0] || null;
  }
};

export const orderService = {
  createOrder: async (orderData: {
    paymentMethod: Order['paymentMethod'];
    deliveryAddress: Order['deliveryAddress'];
    deliveryInstructions?: string;
  }): Promise<Order> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    // Clear cart after successful order
    await cartService.clearCart();
    return response.json();
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }

    return response.json();
  },

  getOrderHistory: async (page: number = 1, limit: number = 10): Promise<{ orders: Order[]; total: number; hasMore: boolean }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders/history?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order history');
    }

    return response.json();
  },

  reorder: async (orderId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders/${orderId}/reorder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder');
    }

    // Dispatch event for cart update since items were added
    window.dispatchEvent(new Event('cartUpdated'));
  },

  trackOrder: async (orderId: string): Promise<{
    status: Order['status'];
    currentLocation?: Order['currentLocation'];
    estimatedDelivery: Date;
  }> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders/${orderId}/track`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to track order');
    }

    return response.json();
  },

  cancelOrder: async (orderId: string, reason: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel order');
    }
  },

  async placeOrder(orderData: any) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to place order');
    }

    return await response.json();
  },

  async getOrders() {
    const response = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return await response.json();
  }
};

// Mock payment service
export const paymentService = {
  processPayment: async (amount: number, method: 'cod' | 'online'): Promise<{ success: boolean; transactionId?: string }> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (method === 'cod') {
      return { success: true, transactionId: `COD_${Date.now()}` };
    } else {
      // Simulate online payment (90% success rate for testing)
      const success = Math.random() > 0.1;
      return success 
        ? { success: true, transactionId: `TXN_${Date.now()}` }
        : { success: false };
    }
  }
};

// API client with authentication
class ApiClient {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const authHeaders = this.getAuthHeaders();
    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    };

    console.log(`Making API request to: ${API_URL}${endpoint}`);
    console.log('Request config:', { method: options.method, headers, body: options.body });

    const response = await axiosInstance.request({
      url: endpoint,
      method: (options.method as any) || 'GET',
      data: options.body,
      headers,
    });

    return response.data;
  }

  // Authentication APIs
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');
    }

    return response;
  }

  async register(userData: { name: string; email: string; password: string; phone?: string }) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(updates: { name?: string; phone?: string; preferences?: any }) {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Address Management APIs
  async getAddresses() {
    return this.request('/users/addresses');
  }

  async addAddress(address: {
    label: string;
    name: string;
    phone: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }) {
    return this.request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateAddress(addressId: string, updates: any) {
    return this.request(`/users/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAddress(addressId: string) {
    return this.request(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  async setDefaultAddress(addressId: string) {
    return this.request(`/users/addresses/${addressId}/default`, {
      method: 'PATCH',
    });
  }

  // Order APIs
  async createOrder(orderData: {
    restaurantId: string;
    restaurantName: string;
    items: any[];
    deliveryAddress: any;
    deliveryInstructions?: string;
    paymentMethod: string;
    billing: any;
  }) {
    return this.request('/orders/create-mock', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderHistory(page: number = 1, limit: number = 10) {
    return this.request(`/users/orders?page=${page}&limit=${limit}`);
  }

  async getOrderDetails(orderId: string) {
    return this.request(`/users/orders/${orderId}`);
  }

  async cancelOrder(orderId: string, reason?: string) {
    return this.request(`/users/orders/${orderId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  async reviewOrder(orderId: string, rating: number, review?: string) {
    return this.request(`/users/orders/${orderId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  }
}

export const api = new ApiClient();

// Authentication utilities
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    // Get current user info before clearing auth data
    const currentUser = getCurrentUser();
    const userId = currentUser?.email || currentUser?._id || currentUser?.id;
    
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Clear user-specific data for security/privacy
    if (userId) {
      try {
        userStorage.clearUserData(userId);
      } catch (error) {
        console.error('Error clearing user data:', error);
        // Fallback to manual cleanup
        localStorage.removeItem(`user_addresses_${userId}`);
        localStorage.removeItem(`user_orders_${userId}`);
        localStorage.removeItem(`foodfly_cart_${userId}`);
      }
    }
    
    // Clear generic data that might contain user info
    localStorage.removeItem('selectedLocation');
    localStorage.removeItem('testCart');
    localStorage.removeItem('guestCart');
    localStorage.removeItem('cart');
    localStorage.removeItem('userAddresses');
    localStorage.removeItem('userOrders');
    localStorage.removeItem('testMenuItems');
    
    // Clear admin data if present
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear axios authorization header
    if (typeof axiosInstance !== 'undefined') {
      delete axiosInstance.defaults.headers.Authorization;
    }
    
    // Trigger events to update UI
    window.dispatchEvent(new Event('userLoggedOut'));
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('addressesUpdated'));
    
    // Redirect to home page
    window.location.href = '/';
  }
};

// User-specific storage management
export const userStorage = {
  // Get current user for storage keys
  getCurrentUserId: (): string | null => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : null;
    } catch {
      return null;
    }
  },

  // Generate user-specific storage key
  getUserKey: (baseKey: string, userId?: string): string => {
    const actualUserId = userId || userStorage.getCurrentUserId();
    if (!actualUserId) {
      throw new Error('User not authenticated');
    }
    return `${baseKey}_${actualUserId}`;
  },

  // Address management
  getUserAddresses: (userId?: string): any[] => {
    try {
      const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      if (!isAuthenticated) return [];

      const addressKey = userStorage.getUserKey('user_addresses', userId);
      const addressData = localStorage.getItem(addressKey);
      return addressData ? JSON.parse(addressData) : [];
    } catch {
      return [];
    }
  },

  setUserAddresses: (addresses: any[], userId?: string): void => {
    try {
      const addressKey = userStorage.getUserKey('user_addresses', userId);
      localStorage.setItem(addressKey, JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  },

  addUserAddress: (address: any, userId?: string): void => {
    try {
      const addresses = userStorage.getUserAddresses(userId);
      
      if (addresses.length === 0) {
        address.isDefault = true;
      }
      
      if (address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      
      if (!address._id) {
        address._id = `addr_${Date.now()}`;
      }
      
      addresses.push(address);
      userStorage.setUserAddresses(addresses, userId);
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('addressesUpdated'));
    } catch (error) {
      console.error('Error adding address:', error);
    }
  },

  updateUserAddress: (addressId: string, updates: any, userId?: string): void => {
    try {
      const addresses = userStorage.getUserAddresses(userId);
      const index = addresses.findIndex(addr => addr._id === addressId);
      
      if (index !== -1) {
        if (updates.isDefault) {
          addresses.forEach(addr => addr.isDefault = false);
        }
        
        addresses[index] = { ...addresses[index], ...updates };
        userStorage.setUserAddresses(addresses, userId);
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('addressesUpdated'));
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  },

  deleteUserAddress: (addressId: string, userId?: string): void => {
    try {
      const addresses = userStorage.getUserAddresses(userId);
      const index = addresses.findIndex(addr => addr._id === addressId);
      
      if (index !== -1) {
        const wasDefault = addresses[index].isDefault;
        addresses.splice(index, 1);
        
        if (wasDefault && addresses.length > 0) {
          addresses[0].isDefault = true;
        }
        
        userStorage.setUserAddresses(addresses, userId);
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('addressesUpdated'));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  },

  // Order management
  getUserOrders: (userId?: string): any[] => {
    try {
      const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      if (!isAuthenticated) return [];

      const orderKey = userStorage.getUserKey('user_orders', userId);
      const orderData = localStorage.getItem(orderKey);
      return orderData ? JSON.parse(orderData) : [];
    } catch {
      return [];
    }
  },

  addUserOrder: (order: any, userId?: string): void => {
    try {
      const orders = userStorage.getUserOrders(userId);
      orders.unshift(order); // Add to beginning
      const orderKey = userStorage.getUserKey('user_orders', userId);
      localStorage.setItem(orderKey, JSON.stringify(orders));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    } catch (error) {
      console.error('Error adding order:', error);
    }
  },

  updateUserOrder: (orderId: string, updates: any, userId?: string): void => {
    try {
      const orders = userStorage.getUserOrders(userId);
      const index = orders.findIndex(order => order._id === orderId);
      
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        const orderKey = userStorage.getUserKey('user_orders', userId);
        localStorage.setItem(orderKey, JSON.stringify(orders));
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('ordersUpdated'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  },

  // Cart management
  getUserCart: (userId?: string): any => {
    try {
      const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      if (!isAuthenticated) return { items: [], subtotal: 0, totalItems: 0 };

      const cartKey = userStorage.getUserKey('foodfly_cart', userId);
      const cartData = localStorage.getItem(cartKey);
      return cartData ? JSON.parse(cartData) : { items: [], subtotal: 0, totalItems: 0 };
    } catch {
      return { items: [], subtotal: 0, totalItems: 0 };
    }
  },

  setUserCart: (cart: any, userId?: string): void => {
    try {
      const cartKey = userStorage.getUserKey('foodfly_cart', userId);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  clearUserCart: (userId?: string): void => {
    try {
      const cartKey = userStorage.getUserKey('foodfly_cart', userId);
      localStorage.removeItem(cartKey);
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  // Migration helper - move generic data to user-specific
  migrateToUserSpecific: (userId: string): void => {
    try {
      // Migrate addresses
      const genericAddresses = localStorage.getItem('userAddresses') || localStorage.getItem('user_addresses');
      if (genericAddresses) {
        const userAddressKey = `user_addresses_${userId}`;
        if (!localStorage.getItem(userAddressKey)) {
          localStorage.setItem(userAddressKey, genericAddresses);
        }
        localStorage.removeItem('userAddresses');
        localStorage.removeItem('user_addresses');
      }

      // Migrate orders
      const genericOrders = localStorage.getItem('user_orders');
      if (genericOrders) {
        const userOrderKey = `user_orders_${userId}`;
        if (!localStorage.getItem(userOrderKey)) {
          localStorage.setItem(userOrderKey, genericOrders);
        }
        localStorage.removeItem('user_orders');
      }

      // Migrate cart
      const genericCart = localStorage.getItem('foodfly_cart');
      if (genericCart) {
        const userCartKey = `foodfly_cart_${userId}`;
        if (!localStorage.getItem(userCartKey)) {
          localStorage.setItem(userCartKey, genericCart);
        }
        localStorage.removeItem('foodfly_cart');
      }

      // Clean up old cart systems
      localStorage.removeItem('testCart');
      localStorage.removeItem('guestCart');
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  },

  // Load user data on login
  loadUserData: (userId: string): void => {
    try {
      // Migrate any existing generic data
      userStorage.migrateToUserSpecific(userId);
      
      // Trigger events to update UI
      window.dispatchEvent(new CustomEvent('userDataLoaded', { detail: { userId } }));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      window.dispatchEvent(new CustomEvent('addressesUpdated'));
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  // Clear user data on logout
  clearUserData: (userId: string): void => {
    try {
      // Clear user-specific data
      localStorage.removeItem(`user_addresses_${userId}`);
      localStorage.removeItem(`user_orders_${userId}`);
      localStorage.removeItem(`foodfly_cart_${userId}`);
      
      // Clear any remaining generic data
      localStorage.removeItem('userAddresses');
      localStorage.removeItem('user_addresses');
      localStorage.removeItem('user_orders');
      localStorage.removeItem('foodfly_cart');
      
      // Trigger events to update UI
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      window.dispatchEvent(new CustomEvent('addressesUpdated'));
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
};

// Types for API responses
export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: ApiAddress[];
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
}

export interface ApiAddress {
  _id: string;
  label: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface ApiOrder {
  _id: string;
  user: string;
  restaurant: any;
  items: ApiOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'payment_failed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'cash' | 'upi' | 'wallet';
  deliveryAddress: any;
  deliveryInstructions?: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  review?: string;
  restaurantData?: {
    name: string;
    image: string;
    phone: string;
  };
}

export interface ApiOrderItem {
  menuItem: string;
  quantity: number;
  customization?: string;
  price: number;
  itemData?: {
    name: string;
    image: string;
    description?: string;
  };
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    addresses: Address[];
  };
  token: string;
}

export const authService = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    try {
      console.log('Registration attempt with:', { 
        name: userData.name,
        email: userData.email,
        passwordLength: userData.password.length 
      });
      
      // Format data exactly as backend expects
      const formattedData = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: 'user' // Explicitly set role
      };

      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      console.log('Registration response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration error response:', errorText);
        
        let errorMessage = 'Registration failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use the text
          errorMessage = errorText.includes('<!DOCTYPE') 
            ? 'Server error - please try again' 
            : errorText;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    // Use centralized logout function instead
    logout();
  },

  getCurrentUser: async (): Promise<AuthResponse['user'] | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const result = await response.json();
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  updateProfile: async (updates: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    const result = await response.json();
    const user = result.user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export const menuService = {
  getRestaurantMenu: async (restaurantId: string): Promise<MenuItem[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch menu');
    }

    const result = await response.json();
    return result.menu || [];
  },

  getMenuItem: async (restaurantId: string, menuItemId: string): Promise<MenuItem> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/menu?category=${menuItemId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch menu item');
    }

    const result = await response.json();
    return result.items[0] || null;
  },
};

export default {
  cartService,
  addressService,
  orderService,
  paymentService
};

// Cart API functions
export const cartApi = {
  // Get cart for a restaurant
  getCart: async (restaurantId: string) => {
    const response = await axiosInstance.get(`/cart/${restaurantId}`);
    return response.data.cart;
  },

  // Add item to cart
  addToCart: async (restaurantId: string, menuItemId: string, quantity: number, customization?: string, specialInstructions?: string) => {
    const response = await axiosInstance.post(`/cart/${restaurantId}/items`, {
      menuItemId,
      quantity,
      customization,
      specialInstructions
    });
    
    // Update local storage after successful server update
    await updateLocalCartFromServer(response.data.cart);
    
    return response.data.cart;
  },

  // Update item quantity
  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await axiosInstance.put(`/cart/items/${itemId}`, { quantity });
    
    // Update local storage after successful server update
    await updateLocalCartFromServer(response.data.cart);
    
    return response.data.cart;
  },

  // Remove item from cart
  removeItem: async (itemId: string) => {
    const response = await axiosInstance.delete(`/cart/items/${itemId}`);
    
    if (!response.data.cart) {
      // Cart is empty after removal
      localStorage.removeItem('testCart');
      localStorage.removeItem('currentRestaurantId');
      return null;
    }
    
    // Update local storage after successful server update
    await updateLocalCartFromServer(response.data.cart);
    return response.data.cart;
  },

  // Clear cart
  clearCart: async (restaurantId: string) => {
    await axiosInstance.delete(`/cart/${restaurantId}`);
    
    // Clear local storage
    localStorage.removeItem('testCart');
    localStorage.removeItem('currentRestaurantId');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
  },

  // Sync cart with server
  syncCart: async (restaurantId: string, items: Array<{ menuItemId: string; quantity: number }>, clearExisting: boolean = false) => {
    if (clearExisting) {
      await cartApi.clearCart(restaurantId);
    }
    
    const response = await axiosInstance.post(`/cart/${restaurantId}/sync`, { items });
    await updateLocalCartFromServer(response.data.cart);
    return response.data.cart;
  }
};

// Helper function to update localStorage from server cart data
const updateLocalCartFromServer = async (cart: any) => {
  if (!cart || !cart.items) {
    localStorage.removeItem('testCart');
    return;
  }
  
  // Convert server cart format to localStorage format
  const localCart: Record<string, number> = {};
  cart.items.forEach((item: any) => {
    const menuItemId = typeof item.menuItem === 'string' ? item.menuItem : item.menuItem._id;
    localCart[menuItemId] = item.quantity;
  });
  
  localStorage.setItem('testCart', JSON.stringify(localCart));
  localStorage.setItem('currentRestaurantId', cart.restaurant._id || cart.restaurant);
  
  // Trigger cart update event for UI updates
  window.dispatchEvent(new Event('cartUpdated'));
};

// Enhanced cart service with user-specific persistence
export const enhancedCartService = {
  // Initialize cart on login - load user-specific data and migrate any existing cart
  initializeCartOnLogin: async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      
      const userId = currentUser._id || currentUser.id;
      
      // Migrate any existing generic cart data to user-specific storage
      const existingCart = localStorage.getItem('testCart');
      if (existingCart) {
        try {
          const cartItems = JSON.parse(existingCart);
          const userCart = userStorage.getUserCart();
          
          // Merge existing cart with user cart (user cart takes precedence)
          Object.keys(cartItems).forEach(itemId => {
            if (!userCart[itemId]) {
              userCart[itemId] = cartItems[itemId];
            }
          });
          
          // Save merged cart to user-specific storage
          userStorage.setUserCart(userCart);
          
          // Clear old generic cart
          localStorage.removeItem('testCart');
        } catch (error) {
          console.error('Error migrating cart data:', error);
        }
      }
      
      // Load user-specific data
      userStorage.loadUserData(userId);
      
      // Trigger UI updates
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('addressesUpdated'));
      
    } catch (error) {
      console.error('Error initializing cart on login:', error);
    }
  },

  // Add to cart with user-specific persistence
  addToCart: async (restaurantId: string, menuItemId: string, quantity: number = 1, customization?: string, specialInstructions?: string) => {
    try {
      // Get user-specific cart
      const currentCart = userStorage.getUserCart();
      const currentQuantity = currentCart[menuItemId] || 0;
      currentCart[menuItemId] = currentQuantity + quantity;
      
      // Save to user-specific storage
      userStorage.setUserCart(currentCart);
      
      // Store restaurant ID for this user
      const currentUser = getCurrentUser();
      const userId = currentUser?._id || currentUser?.id || 'guest';
      localStorage.setItem(`currentRestaurantId_${userId}`, restaurantId);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      return { success: true, cart: currentCart };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Get cart items with proper menu item details (user-specific)
  getCartItems: () => {
    try {
      const cartData = userStorage.getUserCart();
      const testMenuItems = localStorage.getItem('testMenuItems');
      
      if (Object.keys(cartData).length === 0 || !testMenuItems) {
        return [];
      }
      
      const menuItems = JSON.parse(testMenuItems);
      
      return Object.entries(cartData).map(([menuItemId, quantity]) => {
        const menuItem = menuItems[menuItemId];
        if (!menuItem) {
          // Fallback for unknown items
          return {
            _id: `cart_${menuItemId}`,
            menuItem: {
              _id: menuItemId,
              name: 'Unknown Item',
              description: 'Item details not available',
              price: 0,
              image: '/images/placeholder.jpg',
              category: 'Unknown',
              isVeg: true
            },
            quantity,
            totalPrice: 0
          };
        }
        
        return {
          _id: `cart_${menuItemId}`,
          menuItem: {
            _id: menuItem._id,
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            image: menuItem.image,
            category: menuItem.category,
            isVeg: menuItem.isVeg,
            rating: menuItem.rating,
            preparationTime: menuItem.preparationTime
          },
          quantity,
          totalPrice: Number(menuItem.price) * Number(quantity),
          customizations: [],
          specialInstructions: ''
        };
      });
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  },

  // Get cart count for header display (user-specific)
  getCartCount: () => {
    try {
      const cartData = userStorage.getUserCart();
      return Object.values(cartData).reduce((total: number, quantity: number) => total + quantity, 0);
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  },

  // Get cart total
  getCartTotal: () => {
    try {
      const items = enhancedCartService.getCartItems();
      return items.reduce((total, item) => total + item.totalPrice, 0);
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  },

  // Update item quantity (user-specific)
  updateItemQuantity: async (menuItemId: string, quantity: number) => {
    try {
      const cartData = userStorage.getUserCart();
      
      if (quantity <= 0) {
        delete cartData[menuItemId];
      } else {
        cartData[menuItemId] = quantity;
      }
      
      userStorage.setUserCart(cartData);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  },

  // Remove item from cart (user-specific)
  removeItem: async (menuItemId: string) => {
    try {
      const cartData = userStorage.getUserCart();
      delete cartData[menuItemId];
      
      userStorage.setUserCart(cartData);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },

  // Clear cart completely (user-specific)
  clearCart: async () => {
    try {
      // Clear user-specific cart
      userStorage.clearUserCart();
      
      // Clear user-specific restaurant ID
      const currentUser = getCurrentUser();
      const userId = currentUser?._id || currentUser?.id || 'guest';
      localStorage.removeItem(`currentRestaurantId_${userId}`);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axiosInstance.post('/api/auth/login', { 
        email: email.trim().toLowerCase(),
        password 
      });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Update axios instance headers
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(message);
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      // Validate input
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('All fields are required');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Format data exactly as backend expects
      const formattedData = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: 'user'
      };

      console.log('Attempting registration with:', { email: formattedData.email, data: formattedData });
      const response = await axiosInstance.post('/api/auth/register', formattedData);
      console.log('Full registration response:', response);
      console.log('Registration response data:', response.data);
      
      // Handle different response formats from backend
      let token, user;
      
      if (response.data.token && response.data.user) {
        // Direct format: { token, user }
        token = response.data.token;
        user = response.data.user;
      } else if (response.data.success && response.data.data) {
        // Wrapped format: { success: true, data: { token, user } }
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        throw new Error('Invalid response format from server');
      }
      
      console.log('Extracted token and user:', { token: token?.substring(0, 20), user });
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Update axios instance headers
      axiosInstance.defaults.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      return { token, user };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Enhanced error handling
      let errorMessage = 'Registration failed';
      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || data.data?.error || data.data?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Final registration error message:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    // Use centralized logout function instead
    logout();
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const result = await response.json();
      const user = result.user;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axiosInstance.defaults.headers.Authorization;
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Restaurant API functions
export const restaurantApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/api/restaurants');
    return response.data.restaurants;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/api/restaurants/${id}`);
    return response.data.restaurant;
  },

  search: async (query: string) => {
    const response = await axiosInstance.get(`/api/restaurants/search?q=${encodeURIComponent(query)}`);
    return response.data.restaurants;
  }
};

// Menu API functions
export const menuApi = {
  getRestaurantMenu: async (restaurantId: string) => {
    const response = await axiosInstance.get(`/api/restaurants/${restaurantId}`);
    return response.data.menu;
  },

  getMenuItem: async (itemId: string) => {
    const response = await axiosInstance.get(`/api/menu?category=${itemId}`);
    return response.data.menuItem;
  }
};

// Order API functions
export const orderApi = {
  placeOrder: async (orderData: any) => {
    const response = await axiosInstance.post('/api/orders', orderData);
    return response.data.order;
  },

  getUserOrders: async (status: string = 'all', limit: number = 20) => {
    const response = await axiosInstance.get('/api/orders', {
      params: { status, limit }
    });
    return response.data.orders;
  },

  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}`);
    return response.data.order;
  },

  trackOrder: async (orderId: string) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}/track`);
    return response.data.tracking;
  },

  updateOrderStatus: async (orderId: string, status: string, message?: string) => {
    const response = await axiosInstance.patch(`/api/orders/${orderId}/status`, {
      status,
      message
    });
    return response.data.order;
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    const response = await axiosInstance.patch(`/api/orders/${orderId}/cancel`, {
      reason
    });
    return response.data;
  },

  rateOrder: async (orderId: string, rating: number, review?: string) => {
    const response = await axiosInstance.patch(`/api/orders/${orderId}/review`, {
      rating,
      review
    });
    return response.data;
  },

  reorderItems: async (orderId: string) => {
    const response = await axiosInstance.post(`/api/orders/${orderId}/reorder`);
    return response.data.cart;
  },

  getOrderAnalytics: async () => {
    const response = await axiosInstance.get('/api/orders/analytics');
    return response.data.analytics;
  },

  // Real-time order status polling
  pollOrderStatus: async (orderId: string) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}`);
    return response.data.order;
  }
};

// User API
export const userApi = {
  updateProfile: async (userData: any) => {
    const response = await axiosInstance.put('/api/users/profile', userData);
    return response.data;
  },

  updateAddress: async (addressData: any) => {
    const response = await axiosInstance.post('/api/users/addresses', addressData);
    return response.data;
  }
};

// Health API functions
export const healthApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/api/health/profile');
    return response.data.profile;
  },

  updateProfile: async (profileData: any) => {
    const response = await axiosInstance.put('/api/health/profile', profileData);
    return response.data.profile;
  }
};

// Recommendations API functions
export const recommendationApi = {
  getPersonalized: async () => {
    const response = await axiosInstance.get('/api/recommendations/for-you');
    return response.data;
  },

  getTrending: async () => {
    const response = await axiosInstance.get('/api/recommendations/trending');
    return response.data;
  },

  getByCuisine: async (cuisine: string) => {
    const response = await axiosInstance.get(`/api/recommendations/cuisine/${cuisine}`);
    return response.data;
  },

  getDietaryRecommendations: async () => {
    const response = await axiosInstance.get('/api/recommendations/for-you');
    return response.data;
  }
};

// Admin API functions
export const adminApi = {
  // Admin login
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/admin/login', { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, user } = response.data;
      
      // Check if user is admin
      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store admin token and user data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      console.error('Admin login error:', error);
      const message = error.response?.data?.error || error.message || 'Admin login failed';
      throw new Error(message);
    }
  },

  // Get all orders for admin
  getAllOrders: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Admin authentication required');
      
      const response = await axiosInstance.get('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.orders;
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string, message?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Admin authentication required');
      
      const response = await axiosInstance.put('/api/admin/orders', 
        { orderId, status, message },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.data.order;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.response?.data?.error || 'Failed to update order status');
    }
  },

  // Get order details
  getOrderDetails: async (orderId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Admin authentication required');
      
      const response = await axiosInstance.get(`/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.order;
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch order details');
    }
  },

  // Get admin dashboard stats
  getDashboardStats: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Admin authentication required');
      
      const response = await axiosInstance.get('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard stats');
    }
  }
};

// Function to clear invalid authentication
export const clearInvalidAuth = () => {
  const token = localStorage.getItem('token');
  
  // Check if token looks like a test token or is invalid
  if (token && (token.startsWith('test_token_') || !token.includes('.'))) {
    console.log('Clearing invalid authentication token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    
    // Clean up old cart systems
    localStorage.removeItem('testCart');
    localStorage.removeItem('guestCart');
    localStorage.removeItem('cart');
    
    delete axiosInstance.defaults.headers.Authorization;
    return true;
  }
  
  return false;
}; 