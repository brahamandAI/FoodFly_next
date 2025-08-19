// Complete Symposium Restaurant Menu Data
export const symposiumRestaurantMenu = {
  // BAR MUNCHIES
  barMunchies: [
    {
      _id: 'bm_001',
      name: 'French Fries',
      description: 'Crispy golden fries with choice of plain, peri peri, or cheesy seasoning',
      price: 145,
      variants: ['Plain', 'Peri Peri', 'Cheesy'],
      variantPrices: [145, 195, 195],
      category: 'Bar Munchies',
      isVeg: true,
      rating: 4.3,
      preparationTime: '10-15 mins',
      image: '/images/categories/french-fries.jpg'
    },
    {
      _id: 'bm_002',
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs, available in plain or cheese',
      price: 145,
      variants: ['Plain', 'Cheese'],
      variantPrices: [145, 195],
      category: 'Bar Munchies',
      isVeg: true,
      rating: 4.2,
      preparationTime: '8-12 mins',
      image: '/images/categories/garlic-bread.jpg'
    },
    {
      _id: 'bm_003',
      name: 'Loaded Nachos',
      description: 'Crispy tortilla chips topped with cheese, salsa, and choice of veg or chicken',
      price: 195,
      variants: ['Veg', 'Chicken'],
      variantPrices: [195, 245],
      category: 'Bar Munchies',
      isVeg: false,
      rating: 4.5,
      preparationTime: '12-18 mins',
      image: '/images/categories/nachos.jpg'
    },
    {
      _id: 'bm_004',
      name: 'Bruschettas',
      description: 'Toasted bread topped with fresh tomatoes and herbs, available in tomato or chicken',
      price: 195,
      variants: ['Tomato', 'Chicken'],
      variantPrices: [195, 245],
      category: 'Bar Munchies',
      isVeg: false,
      rating: 4.4,
      preparationTime: '10-15 mins',
      image: '/images/categories/bruschetta.jpg'
    }
  ],

  // SOUPS
  soups: [
    {
      _id: 'soup_001',
      name: 'Almond Broccoli Soup',
      description: 'Creamy soup made with fresh broccoli and almonds',
      price: 145,
      category: 'Soups',
      isVeg: true,
      rating: 4.1,
      preparationTime: '15-20 mins',
      image: '/images/categories/soup.jpg'
    },
    {
      _id: 'soup_002',
      name: 'Cream of Tomato Soup',
      description: 'Rich and creamy tomato soup, available in veg or chicken',
      price: 145,
      variants: ['Veg', 'Chicken'],
      variantPrices: [145, 195],
      category: 'Soups',
      isVeg: false,
      rating: 4.3,
      preparationTime: '12-18 mins',
      image: '/images/categories/tomato-soup.jpg'
    },
    {
      _id: 'soup_003',
      name: 'Manchow Soup',
      description: 'Spicy and tangy soup with vegetables and noodles, available in veg or chicken',
      price: 145,
      variants: ['Veg', 'Chicken'],
      variantPrices: [145, 195],
      category: 'Soups',
      isVeg: false,
      rating: 4.4,
      preparationTime: '15-20 mins',
      image: '/images/categories/manchow-soup.jpg'
    }
  ],

  // SALAD STATION
  salads: [
    {
      _id: 'salad_001',
      name: 'Greek Salad',
      description: 'Fresh salad with olives, feta cheese, and Mediterranean vegetables',
      price: 245,
      variants: ['Veg', 'Chicken'],
      variantPrices: [245, 275],
      category: 'Salad Station',
      isVeg: false,
      rating: 4.6,
      preparationTime: '8-12 mins',
      image: '/images/categories/greek-salad.jpg'
    },
    {
      _id: 'salad_002',
      name: 'Quinoa Apple Vinaigrette Salad',
      description: 'Healthy quinoa salad with fresh apples and tangy vinaigrette',
      price: 345,
      category: 'Salad Station',
      isVeg: true,
      rating: 4.7,
      preparationTime: '10-15 mins',
      image: '/images/categories/quinoa-salad.jpg'
    }
  ],

  // APPETIZERS - CONTINENTAL
  continentalAppetizers: [
    {
      _id: 'ca_001',
      name: 'Mushroom Duplex',
      description: 'Stuffed mushrooms with cheese and herbs',
      price: 275,
      category: 'Appetizers',
      isVeg: true,
      rating: 4.4,
      preparationTime: '15-20 mins',
      image: '/images/categories/mushroom-duplex.jpg'
    },
    {
      _id: 'ca_002',
      name: 'Peri Peri Chicken Wings',
      description: 'Spicy peri peri marinated chicken wings',
      price: 375,
      category: 'Appetizers',
      isVeg: false,
      rating: 4.6,
      preparationTime: '20-25 mins',
      image: '/images/categories/chicken-wings.jpg'
    },
    {
      _id: 'ca_003',
      name: 'Fish N Chips',
      description: 'Crispy battered fish served with golden fries',
      price: 445,
      category: 'Appetizers',
      isVeg: false,
      rating: 4.5,
      preparationTime: '18-25 mins',
      image: '/images/categories/fish-chips.jpg'
    }
  ],

  // APPETIZERS - ORIENTAL
  orientalAppetizers: [
    {
      _id: 'oa_001',
      name: 'Classic Thai Spring Rolls',
      description: 'Crispy spring rolls with fresh vegetables and Thai spices',
      price: 245,
      category: 'Appetizers',
      isVeg: true,
      rating: 4.3,
      preparationTime: '12-18 mins',
      image: '/images/categories/spring-rolls.jpg'
    },
    {
      _id: 'oa_002',
      name: 'Classic Chicken Dumplings',
      description: 'Steamed or pan-tossed chicken dumplings with dipping sauce',
      price: 345,
      variants: ['Steamed', 'Pan Tossed'],
      variantPrices: [345, 345],
      category: 'Appetizers',
      isVeg: false,
      rating: 4.5,
      preparationTime: '15-20 mins',
      image: '/images/categories/dumplings.jpg'
    }
  ],

  // TANDOORI APPETIZERS
  tandooriAppetizers: [
    {
      _id: 'ta_001',
      name: 'Tandoori Chicken',
      description: 'Marinated chicken cooked in traditional tandoor',
      price: 345,
      variants: ['Half', 'Full'],
      variantPrices: [345, 595],
      category: 'Appetizers',
      isVeg: false,
      rating: 4.7,
      preparationTime: '25-30 mins',
      image: '/images/categories/tandoori-chicken.jpg'
    },
    {
      _id: 'ta_002',
      name: 'Amritsari Fish Tikka',
      description: 'Spiced fish tikka in traditional Amritsari style',
      price: 525,
      category: 'Appetizers',
      isVeg: false,
      rating: 4.6,
      preparationTime: '20-25 mins',
      image: '/images/categories/fish-tikka.jpg'
    }
  ],

  // CONTINENTAL MAINS
  continentalMains: [
    {
      _id: 'cm_001',
      name: 'Exotic Veg Stroganoff',
      description: 'Creamy mushroom and vegetable stroganoff with rice',
      price: 345,
      category: 'Main Course',
      isVeg: true,
      rating: 4.4,
      preparationTime: '20-25 mins',
      image: '/images/categories/stroganoff.jpg'
    },
    {
      _id: 'cm_002',
      name: 'Grilled Chicken Steak',
      description: 'Juicy grilled chicken steak with herbs and spices',
      price: 425,
      category: 'Main Course',
      isVeg: false,
      rating: 4.6,
      preparationTime: '25-30 mins',
      image: '/images/categories/chicken-steak.jpg'
    }
  ],

  // SIZZLERS
  sizzlers: [
    {
      _id: 'sizz_001',
      name: 'Cottage Cheese Sizzler',
      description: 'Sizzling cottage cheese with choice of chipotle, peri peri, or BBQ sauce',
      price: 425,
      variants: ['Chipotle', 'Peri Peri', 'BBQ'],
      variantPrices: [425, 425, 425],
      category: 'Sizzlers',
      isVeg: true,
      rating: 4.5,
      preparationTime: '20-25 mins',
      image: '/images/categories/sizzler.jpg'
    },
    {
      _id: 'sizz_002',
      name: 'Grilled Chicken Sizzler',
      description: 'Sizzling grilled chicken with vegetables and sauce',
      price: 475,
      category: 'Sizzlers',
      isVeg: false,
      rating: 4.7,
      preparationTime: '25-30 mins',
      image: '/images/categories/chicken-sizzler.jpg'
    }
  ],

  // WOOD FIRED PIZZAS
  pizzas: [
    {
      _id: 'pizza_001',
      name: 'Classic Margherita',
      description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
      price: 345,
      category: 'Pizza',
      isVeg: true,
      rating: 4.6,
      preparationTime: '15-20 mins',
      image: '/images/categories/margherita-pizza.jpg'
    },
    {
      _id: 'pizza_002',
      name: 'Portugal Pepperoni Pizza',
      description: 'Spicy pepperoni pizza with cheese and herbs',
      price: 495,
      category: 'Pizza',
      isVeg: false,
      rating: 4.5,
      preparationTime: '18-25 mins',
      image: '/images/categories/pepperoni-pizza.jpg'
    },
    {
      _id: 'pizza_003',
      name: 'Spicy Chicken Tikka Pizza',
      description: 'Pizza topped with spicy chicken tikka and vegetables',
      price: 495,
      category: 'Pizza',
      isVeg: false,
      rating: 4.7,
      preparationTime: '20-25 mins',
      image: '/images/categories/chicken-tikka-pizza.jpg'
    }
  ],

  // SANDWICHES/BURGERS
  sandwiches: [
    {
      _id: 'sand_001',
      name: 'Club Sandwich',
      description: 'Triple-decker sandwich with fresh vegetables and choice of veg or non-veg',
      price: 245,
      variants: ['Veg', 'Non-Veg'],
      variantPrices: [245, 295],
      category: 'Sandwiches',
      isVeg: false,
      rating: 4.3,
      preparationTime: '12-18 mins',
      image: '/images/categories/club-sandwich.jpg'
    }
  ],

  burgers: [
    {
      _id: 'burger_001',
      name: 'Peri Peri Chicken Burger',
      description: 'Spicy peri peri chicken burger with fresh vegetables',
      price: 295,
      category: 'Burgers',
      isVeg: false,
      rating: 4.5,
      preparationTime: '15-20 mins',
      image: '/images/categories/chicken-burger.jpg'
    }
  ],

  // ORIENTAL MAINS
  orientalMains: [
    {
      _id: 'om_001',
      name: 'Thai Red Curry Bowl',
      description: 'Spicy Thai red curry with choice of vegetables, chicken, or prawns',
      price: 345,
      variants: ['Veg', 'Chicken', 'Prawn'],
      variantPrices: [345, 445, 545],
      category: 'Main Course',
      isVeg: false,
      rating: 4.6,
      preparationTime: '20-25 mins',
      image: '/images/categories/thai-curry.jpg'
    },
    {
      _id: 'om_002',
      name: 'Kung Pao Chicken',
      description: 'Spicy and tangy chicken with peanuts and vegetables',
      price: 395,
      category: 'Main Course',
      isVeg: false,
      rating: 4.5,
      preparationTime: '18-25 mins',
      image: '/images/categories/kung-pao-chicken.jpg'
    }
  ],

  // INDIAN MAINS
  indianMains: [
    {
      _id: 'im_001',
      name: 'Paneer Butter Masala',
      description: 'Creamy and rich cottage cheese curry in tomato gravy',
      price: 345,
      category: 'Main Course',
      isVeg: true,
      rating: 4.7,
      preparationTime: '20-25 mins',
      image: '/images/categories/paneer-butter-masala.jpg'
    },
    {
      _id: 'im_002',
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken, available bone or boneless',
      price: 445,
      variants: ['Bone', 'Boneless'],
      variantPrices: [445, 445],
      category: 'Main Course',
      isVeg: false,
      rating: 4.8,
      preparationTime: '25-30 mins',
      image: '/images/categories/butter-chicken.jpg'
    },
    {
      _id: 'im_003',
      name: 'Kashmiri Josh-e-Rogan',
      description: 'Traditional Kashmiri mutton curry with aromatic spices',
      price: 545,
      category: 'Main Course',
      isVeg: false,
      rating: 4.6,
      preparationTime: '30-35 mins',
      image: '/images/categories/kashmiri-mutton.jpg'
    }
  ],

  // RICE/BIRYANI
  riceBiryani: [
    {
      _id: 'rb_001',
      name: 'Hyderabadi Chicken Dum Biryani',
      description: 'Traditional Hyderabadi biryani with tender chicken and aromatic rice',
      price: 545,
      category: 'Rice & Biryani',
      isVeg: false,
      rating: 4.8,
      preparationTime: '30-35 mins',
      image: '/images/categories/chicken-biryani.jpg'
    },
    {
      _id: 'rb_002',
      name: 'Chicken Fried Rice',
      description: 'Wok-tossed rice with chicken and vegetables',
      price: 295,
      category: 'Rice & Biryani',
      isVeg: false,
      rating: 4.4,
      preparationTime: '15-20 mins',
      image: '/images/categories/fried-rice.jpg'
    }
  ],

  // BREADS
  breads: [
    {
      _id: 'bread_001',
      name: 'Garlic Naan',
      description: 'Soft bread with garlic and herbs',
      price: 75,
      category: 'Breads',
      isVeg: true,
      rating: 4.3,
      preparationTime: '8-12 mins',
      image: '/images/categories/garlic-naan.jpg'
    },
    {
      _id: 'bread_002',
      name: 'Cheese Chilly Naan',
      description: 'Naan stuffed with cheese and green chillies',
      price: 95,
      category: 'Breads',
      isVeg: true,
      rating: 4.5,
      preparationTime: '10-15 mins',
      image: '/images/categories/cheese-naan.jpg'
    }
  ],

  // DESSERTS
  desserts: [
    {
      _id: 'dessert_001',
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake',
      price: 245,
      category: 'Desserts',
      isVeg: true,
      rating: 4.6,
      preparationTime: '5-10 mins',
      image: '/images/categories/cheesecake.jpg'
    },
    {
      _id: 'dessert_002',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 325,
      category: 'Desserts',
      isVeg: true,
      rating: 4.7,
      preparationTime: '5-10 mins',
      image: '/images/categories/tiramisu.jpg'
    }
  ],

  // BEVERAGES - MOCKTAILS
  mocktails: [
    {
      _id: 'mock_001',
      name: 'Virgin Mojito',
      description: 'Refreshing mint and lime mocktail',
      price: 145,
      category: 'Beverages',
      isVeg: true,
      rating: 4.4,
      preparationTime: '5-8 mins',
      image: '/images/categories/mojito.jpg'
    },
    {
      _id: 'mock_002',
      name: 'Sip of Sunshine',
      description: 'Fresh orange and pineapple mocktail',
      price: 195,
      category: 'Beverages',
      isVeg: true,
      rating: 4.3,
      preparationTime: '5-8 mins',
      image: '/images/categories/orange-mocktail.jpg'
    }
  ],

  // BEVERAGES - SHAKES
  shakes: [
    {
      _id: 'shake_001',
      name: 'Chocolate Shake',
      description: 'Rich and creamy chocolate milkshake',
      price: 195,
      category: 'Beverages',
      isVeg: true,
      rating: 4.5,
      preparationTime: '5-8 mins',
      image: '/images/categories/chocolate-shake.jpg'
    },
    {
      _id: 'shake_002',
      name: 'Brownie Shake',
      description: 'Chocolate shake with brownie pieces',
      price: 195,
      category: 'Beverages',
      isVeg: true,
      rating: 4.6,
      preparationTime: '8-12 mins',
      image: '/images/categories/brownie-shake.jpg'
    }
  ]
};

// Helper function to get all menu items
export const getAllSymposiumMenuItems = () => {
  const allItems = [];
  
  Object.values(symposiumRestaurantMenu).forEach(category => {
    if (Array.isArray(category)) {
      allItems.push(...category);
    }
  });
  
  return allItems;
};

// Helper function to get menu items by category
export const getSymposiumMenuByCategory = (categoryName: string) => {
  const categoryKey = Object.keys(symposiumRestaurantMenu).find(key => 
    key.toLowerCase().includes(categoryName.toLowerCase())
  );
  
  return categoryKey ? symposiumRestaurantMenu[categoryKey as keyof typeof symposiumRestaurantMenu] : [];
};

// Helper function to get menu items by restaurant ID
export const getSymposiumMenuForRestaurant = (restaurantId: string) => {
  if (restaurantId === 'rest_001') {
    return getAllSymposiumMenuItems();
  }
  return [];
};
