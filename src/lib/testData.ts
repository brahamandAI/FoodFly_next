// Test data for development and testing purposes
import { Address } from './api';

export const sampleAddresses: Address[] = [
  {
    _id: 'addr_001',
    type: 'home',
    street: '123 Main Street, Apartment 4B',
    area: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    landmark: 'Near Bandra Station',
    isDefault: true
  },
  {
    _id: 'addr_002',
    type: 'work',
    street: '456 Corporate Plaza, Floor 8',
    area: 'Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    landmark: 'Opposite Metro Station',
    isDefault: false
  },
  {
    _id: 'addr_003',
    type: 'other',
    street: '789 Friends Apartment, Block C',
    area: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    landmark: 'Near Hiranandani Gardens',
    isDefault: false
  }
];

// Comprehensive menu items for Symposium Restaurant (rest_001)
export const testMenuItems = {
  // BAR MUNCHIES
  'item_001': {
    _id: 'item_001',
    name: 'French Fries',
    description: 'Crispy golden fries with choice of plain, peri peri, or cheesy seasoning',
    price: 145,
         image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&h=600&fit=crop',
    category: 'Bar Munchies',
    isVeg: true,
    rating: 4.3,
    preparationTime: '10-15 mins',
    restaurant: 'rest_001',
    variants: ['Plain', 'Peri Peri', 'Cheesy'],
    variantPrices: [145, 195, 195]
  },
  'item_002': {
    _id: 'item_002',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs, available in plain or cheese',
    price: 145,
         image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'Bar Munchies',
    isVeg: true,
    rating: 4.2,
    preparationTime: '8-12 mins',
    restaurant: 'rest_001',
    variants: ['Plain', 'Cheese'],
    variantPrices: [145, 195]
  },
  'item_003': {
    _id: 'item_003',
    name: 'Loaded Nachos',
    description: 'Crispy tortilla chips topped with cheese, salsa, and choice of veg or chicken',
    price: 195,
         image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    category: 'Bar Munchies',
    isVeg: false,
    rating: 4.5,
    preparationTime: '12-18 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Chicken'],
    variantPrices: [195, 245]
  },
  'item_004': {
    _id: 'item_004',
    name: 'Bruschettas',
    description: 'Toasted bread topped with fresh tomatoes and herbs, available in tomato or chicken',
    price: 195,
         image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'Bar Munchies',
    isVeg: false,
    rating: 4.4,
    preparationTime: '10-15 mins',
    restaurant: 'rest_001',
    variants: ['Tomato', 'Chicken'],
    variantPrices: [195, 245]
  },

  // SOUPS
  'item_005': {
    _id: 'item_005',
    name: 'Almond Broccoli Soup',
    description: 'Creamy soup made with fresh broccoli and almonds',
    price: 145,
         image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    category: 'Soups',
    isVeg: true,
    rating: 4.1,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001'
  },
  'item_006': {
    _id: 'item_006',
    name: 'Cream of Tomato Soup',
    description: 'Rich and creamy tomato soup, available in veg or chicken',
    price: 145,
         image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    category: 'Soups',
    isVeg: false,
    rating: 4.3,
    preparationTime: '12-18 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Chicken'],
    variantPrices: [145, 195]
  },
  'item_007': {
    _id: 'item_007',
    name: 'Manchow Soup',
    description: 'Spicy and tangy soup with vegetables and noodles, available in veg or chicken',
    price: 145,
         image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    category: 'Soups',
    isVeg: false,
    rating: 4.4,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Chicken'],
    variantPrices: [145, 195]
  },

  // SALAD STATION
  'item_008': {
    _id: 'item_008',
    name: 'Greek Salad',
    description: 'Fresh salad with olives, feta cheese, and Mediterranean vegetables',
    price: 245,
         image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    category: 'Salad Station',
    isVeg: false,
    rating: 4.6,
    preparationTime: '8-12 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Chicken'],
    variantPrices: [245, 275]
  },
  'item_009': {
    _id: 'item_009',
    name: 'Quinoa Apple Vinaigrette Salad',
    description: 'Healthy quinoa salad with fresh apples and tangy vinaigrette',
    price: 345,
         image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    category: 'Salad Station',
    isVeg: true,
    rating: 4.7,
    preparationTime: '10-15 mins',
    restaurant: 'rest_001'
  },

  // APPETIZERS - CONTINENTAL
  'item_010': {
    _id: 'item_010',
    name: 'Mushroom Duplex',
    description: 'Stuffed mushrooms with cheese and herbs',
    price: 275,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: true,
    rating: 4.4,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001'
  },
  'item_011': {
    _id: 'item_011',
    name: 'Peri Peri Chicken Wings',
    description: 'Spicy peri peri marinated chicken wings',
    price: 375,
         image: 'https://images.unsplash.com/photo-1567620832904-9fc6debc209f?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    rating: 4.6,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001'
  },
  'item_012': {
    _id: 'item_012',
    name: 'Fish N Chips',
    description: 'Crispy battered fish served with golden fries',
    price: 445,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    rating: 4.5,
    preparationTime: '18-25 mins',
    restaurant: 'rest_001'
  },

  // APPETIZERS - ORIENTAL
  'item_013': {
    _id: 'item_013',
    name: 'Classic Thai Spring Rolls',
    description: 'Crispy spring rolls with fresh vegetables and Thai spices',
    price: 245,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: true,
    rating: 4.3,
    preparationTime: '12-18 mins',
    restaurant: 'rest_001'
  },
  'item_014': {
    _id: 'item_014',
    name: 'Classic Chicken Dumplings',
    description: 'Steamed or pan-tossed chicken dumplings with dipping sauce',
    price: 345,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    rating: 4.5,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001',
    variants: ['Steamed', 'Pan Tossed'],
    variantPrices: [345, 345]
  },

  // TANDOORI APPETIZERS
  'item_015': {
    _id: 'item_015',
    name: 'Tandoori Chicken',
    description: 'Marinated chicken cooked in traditional tandoor',
    price: 345,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    rating: 4.7,
    preparationTime: '25-30 mins',
    restaurant: 'rest_001',
    variants: ['Half', 'Full'],
    variantPrices: [345, 595]
  },
  'item_016': {
    _id: 'item_016',
    name: 'Amritsari Fish Tikka',
    description: 'Spiced fish tikka in traditional Amritsari style',
    price: 525,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    rating: 4.6,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001'
  },

  // CONTINENTAL MAINS
  'item_017': {
    _id: 'item_017',
    name: 'Exotic Veg Stroganoff',
    description: 'Creamy mushroom and vegetable stroganoff with rice',
    price: 345,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: true,
    rating: 4.4,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001'
  },
  'item_018': {
    _id: 'item_018',
    name: 'Grilled Chicken Steak',
    description: 'Juicy grilled chicken steak with herbs and spices',
    price: 425,
         image: 'https://images.unsplash.com/photo-1567620832904-9fc6debc209f?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: false,
    rating: 4.6,
    preparationTime: '25-30 mins',
    restaurant: 'rest_001'
  },

  // SIZZLERS
  'item_019': {
    _id: 'item_019',
    name: 'Cottage Cheese Sizzler',
    description: 'Sizzling cottage cheese with choice of chipotle, peri peri, or BBQ sauce',
    price: 425,
         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    category: 'Sizzlers',
    isVeg: true,
    rating: 4.5,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001',
    variants: ['Chipotle', 'Peri Peri', 'BBQ'],
    variantPrices: [425, 425, 425]
  },
  'item_020': {
    _id: 'item_020',
    name: 'Grilled Chicken Sizzler',
    description: 'Sizzling grilled chicken with vegetables and sauce',
    price: 475,
         image: 'https://images.unsplash.com/photo-1567620832904-9fc6debc209f?w=800&h=600&fit=crop',
    category: 'Sizzlers',
    isVeg: false,
    rating: 4.7,
    preparationTime: '25-30 mins',
    restaurant: 'rest_001'
  },

  // WOOD FIRED PIZZAS
  'item_021': {
    _id: 'item_021',
    name: 'Classic Margherita',
    description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
    price: 345,
         image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
    category: 'Pizza',
    isVeg: true,
    rating: 4.6,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001'
  },
  'item_022': {
    _id: 'item_022',
    name: 'Portugal Pepperoni Pizza',
    description: 'Spicy pepperoni pizza with cheese and herbs',
    price: 495,
         image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
    category: 'Pizza',
    isVeg: false,
    rating: 4.5,
    preparationTime: '18-25 mins',
    restaurant: 'rest_001'
  },
  'item_023': {
    _id: 'item_023',
    name: 'Spicy Chicken Tikka Pizza',
    description: 'Pizza topped with spicy chicken tikka and vegetables',
    price: 495,
         image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop',
    category: 'Pizza',
    isVeg: false,
    rating: 4.7,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001'
  },

  // SANDWICHES/BURGERS
  'item_024': {
    _id: 'item_024',
    name: 'Club Sandwich',
    description: 'Triple-decker sandwich with fresh vegetables and choice of veg or non-veg',
    price: 245,
         image: 'https://images.unsplash.com/photo-1528735602786-469f11261008?w=800&h=600&fit=crop',
    category: 'Sandwiches',
    isVeg: false,
    rating: 4.3,
    preparationTime: '12-18 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Non-Veg'],
    variantPrices: [245, 295]
  },
  'item_025': {
    _id: 'item_025',
    name: 'Peri Peri Chicken Burger',
    description: 'Spicy peri peri chicken burger with fresh vegetables',
    price: 295,
         image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    category: 'Burgers',
    isVeg: false,
    rating: 4.5,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001'
  },

  // ORIENTAL MAINS
  'item_026': {
    _id: 'item_026',
    name: 'Thai Red Curry Bowl',
    description: 'Spicy Thai red curry with choice of vegetables, chicken, or prawns',
    price: 345,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: false,
    rating: 4.6,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001',
    variants: ['Veg', 'Chicken', 'Prawn'],
    variantPrices: [345, 445, 545]
  },
  'item_027': {
    _id: 'item_027',
    name: 'Kung Pao Chicken',
    description: 'Spicy and tangy chicken with peanuts and vegetables',
    price: 395,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: false,
    rating: 4.5,
    preparationTime: '18-25 mins',
    restaurant: 'rest_001'
  },

  // INDIAN MAINS
  'item_028': {
    _id: 'item_028',
    name: 'Paneer Butter Masala',
    description: 'Creamy and rich cottage cheese curry in tomato gravy',
    price: 345,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: true,
    rating: 4.7,
    preparationTime: '20-25 mins',
    restaurant: 'rest_001'
  },
  'item_029': {
    _id: 'item_029',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken, available bone or boneless',
    price: 445,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: false,
    rating: 4.8,
    preparationTime: '25-30 mins',
    restaurant: 'rest_001',
    variants: ['Bone', 'Boneless'],
    variantPrices: [445, 445]
  },
  'item_030': {
    _id: 'item_030',
    name: 'Kashmiri Josh-e-Rogan',
    description: 'Traditional Kashmiri mutton curry with aromatic spices',
    price: 545,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Main Course',
    isVeg: false,
    rating: 4.6,
    preparationTime: '30-35 mins',
    restaurant: 'rest_001'
  },

  // RICE/BIRYANI
  'item_031': {
    _id: 'item_031',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Traditional Hyderabadi biryani with tender chicken and aromatic rice',
    price: 545,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Rice & Biryani',
    isVeg: false,
    rating: 4.8,
    preparationTime: '30-35 mins',
    restaurant: 'rest_001'
  },
  'item_032': {
    _id: 'item_032',
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with chicken and vegetables',
    price: 295,
         image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    category: 'Rice & Biryani',
    isVeg: false,
    rating: 4.4,
    preparationTime: '15-20 mins',
    restaurant: 'rest_001'
  },

  // BREADS
  'item_033': {
    _id: 'item_033',
    name: 'Garlic Naan',
    description: 'Soft bread with garlic and herbs',
    price: 75,
         image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'Breads',
    isVeg: true,
    rating: 4.3,
    preparationTime: '8-12 mins',
    restaurant: 'rest_001'
  },
  'item_034': {
    _id: 'item_034',
    name: 'Cheese Chilly Naan',
    description: 'Naan stuffed with cheese and green chillies',
    price: 95,
         image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    category: 'Breads',
    isVeg: true,
    rating: 4.5,
    preparationTime: '10-15 mins',
    restaurant: 'rest_001'
  },

  // DESSERTS
  'item_035': {
    _id: 'item_035',
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake',
    price: 245,
         image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop',
    category: 'Desserts',
    isVeg: true,
    rating: 4.6,
    preparationTime: '5-10 mins',
    restaurant: 'rest_001'
  },
  'item_036': {
    _id: 'item_036',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 325,
         image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop',
    category: 'Desserts',
    isVeg: true,
    rating: 4.7,
    preparationTime: '5-10 mins',
    restaurant: 'rest_001'
  },

  // BEVERAGES - MOCKTAILS
  'item_037': {
    _id: 'item_037',
    name: 'Virgin Mojito',
    description: 'Refreshing mint and lime mocktail',
    price: 145,
         image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    category: 'Beverages',
    isVeg: true,
    rating: 4.4,
    preparationTime: '5-8 mins',
    restaurant: 'rest_001'
  },
  'item_038': {
    _id: 'item_038',
    name: 'Sip of Sunshine',
    description: 'Fresh orange and pineapple mocktail',
    price: 195,
         image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    category: 'Beverages',
    isVeg: true,
    rating: 4.3,
    preparationTime: '5-8 mins',
    restaurant: 'rest_001'
  },

  // BEVERAGES - SHAKES
  'item_039': {
    _id: 'item_039',
    name: 'Chocolate Shake',
    description: 'Rich and creamy chocolate milkshake',
    price: 195,
         image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop',
    category: 'Beverages',
    isVeg: true,
    rating: 4.5,
    preparationTime: '5-8 mins',
    restaurant: 'rest_001'
  },
  'item_040': {
    _id: 'item_040',
    name: 'Brownie Shake',
    description: 'Chocolate shake with brownie pieces',
    price: 195,
         image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop',
    category: 'Beverages',
    isVeg: true,
    rating: 4.6,
    preparationTime: '8-12 mins',
    restaurant: 'rest_001'
  }
};

// Helper function to get menu item by ID
export const getMenuItemById = (itemId: string) => {
  return testMenuItems[itemId as keyof typeof testMenuItems] || null;
};

// Helper function to get menu items by category
export const getMenuItemsByCategory = (category: string) => {
  return Object.values(testMenuItems).filter(item => 
    item.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Initialize test data in localStorage if not present
export const initializeTestData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Initialize addresses if none exist
    const existingAddresses = localStorage.getItem('addresses');
    if (!existingAddresses) {
      localStorage.setItem('addresses', JSON.stringify(sampleAddresses));
    }
    
    // Initialize menu items for testing
    localStorage.setItem('testMenuItems', JSON.stringify(testMenuItems));
    
    // Only initialize user data if there's no existing authentication
    const existingToken = localStorage.getItem('token');
    const existingUser = localStorage.getItem('user');
    const existingIsLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Don't override existing authentication
    if (!existingToken && !existingUser && !existingIsLoggedIn) {
      // Only set test user data if explicitly in development mode
      if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
        const testUser = {
          _id: 'user_test_001',
          name: 'Test User',
          email: 'test@foodfly.com',
          phone: '+91 9876543210',
          createdAt: new Date().toISOString()
        };
        // Don't auto-login - let user choose to authenticate
        localStorage.setItem('testUser', JSON.stringify(testUser));
      }
    }
    
    // Initialize default location if none exists
    const existingLocation = localStorage.getItem('defaultLocation');
    if (!existingLocation) {
      const defaultLocation = {
        _id: 'default',
        type: 'current',
        name: 'Current Location',
        fullAddress: 'Mumbai, Maharashtra',
        isDefault: true
      };
      localStorage.setItem('defaultLocation', JSON.stringify(defaultLocation));
    }
    
  } catch (error) {
    console.error('Error initializing test data:', error);
  }
};

export const clearTestData = () => {
  if (typeof window === 'undefined') return;
  
  // Remove old unused cart systems
  localStorage.removeItem('cart');
  localStorage.removeItem('testCart');
  localStorage.removeItem('guestCart');
  
  // Remove other test data
  localStorage.removeItem('addresses');
  localStorage.removeItem('orders');
  localStorage.removeItem('testUser');
  localStorage.removeItem('defaultLocation');
  localStorage.removeItem('userLocations');
  localStorage.removeItem('testMenuItems');
};

// Function to enable test authentication (for development)
export const enableTestAuth = () => {
  if (typeof window === 'undefined') return;
  
  const testUser = localStorage.getItem('testUser');
  if (testUser) {
    localStorage.setItem('user', testUser);
    localStorage.setItem('token', 'test_token_' + Date.now());
    localStorage.setItem('isLoggedIn', 'true');
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'isLoggedIn',
      newValue: 'true',
      oldValue: null
    }));
    
    return true;
  }
  return false;
};

export default {
  sampleAddresses,
  testMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  initializeTestData,
  clearTestData,
  enableTestAuth
}; 