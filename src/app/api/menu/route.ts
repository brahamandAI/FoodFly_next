import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Mock menu data - in real app, this would query database
    const menuItems = {
             'north-indian': [
         {
           id: 'dal-makhani',
           name: 'Dal Makhani',
           description: 'Rich and creamy black lentils cooked with butter and spices',
           price: 180,
           category: 'North Indian',
           image: '/images/categories/North-indian.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.5,
           prepTime: '25 mins'
         },
         {
           id: 'shahi-paneer',
           name: 'Shahi Paneer',
           description: 'Royal cottage cheese curry in rich tomato gravy',
           price: 200,
           category: 'North Indian',
           image: '/images/categories/North-indian.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.3,
           prepTime: '20 mins'
         },
         {
           id: 'butter-chicken',
           name: 'Butter Chicken',
           description: 'Tender chicken in creamy tomato-based curry',
           price: 280,
           category: 'North Indian',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.7,
           prepTime: '30 mins'
         }
       ],
             'south-indian': [
         {
           id: 'masala-dosa',
           name: 'Masala Dosa',
           description: 'Crispy rice crepe filled with spiced potato',
           price: 120,
           category: 'South Indian',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.4,
           prepTime: '20 mins'
         },
         {
           id: 'idli-sambar',
           name: 'Idli Sambar',
           description: 'Steamed rice cakes with lentil curry',
           price: 100,
           category: 'South Indian',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.2,
           prepTime: '15 mins'
         }
       ],
             'chinese': [
         {
           id: 'hakka-noodles',
           name: 'Hakka Noodles',
           description: 'Stir-fried noodles with vegetables',
           price: 160,
           category: 'Chinese',
           image: '/images/categories/Chinese.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.1,
           prepTime: '25 mins'
         },
         {
           id: 'manchurian',
           name: 'Veg Manchurian',
           description: 'Deep-fried vegetable balls in tangy sauce',
           price: 140,
           category: 'Chinese',
           image: '/images/categories/Chinese.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.0,
           prepTime: '20 mins'
         }
       ],
             // Cafe After Hours Menu
       'bar-tidbits': [
         {
           id: 'nuts-n-bolts',
           name: 'NUTS N BOLTS',
           description: 'Assorted nuts and bolts mix',
           price: 295,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '10 mins'
         },
         {
           id: 'french-fries',
           name: 'FRENCH FRIES',
           description: 'Plain/Peri Peri/Cheesy - 299/345',
           price: 299,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '15 mins'
         },
         {
           id: 'garlic-bread',
           name: 'GARLIC BREAD',
           description: 'Plain/Cheese - 299/345',
           price: 299,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '12 mins'
         },
         {
           id: 'potato-wedges',
           name: 'POTATO WEDGES',
           description: 'Plain/Peri Peri - 299/345',
           price: 299,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '18 mins'
         },
         {
           id: 'crispy-masala-fox-nuts',
           name: 'CRISPY MASALA FOX NUTS',
           description: 'Spiced fox nuts',
           price: 295,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.2,
           prepTime: '8 mins'
         },
         {
           id: 'mumbaiya-corn-bhel',
           name: 'MUMBAIYA CORN BHEL',
           description: 'Mumbai style corn bhel',
           price: 295,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '10 mins'
         },
         {
           id: 'peanut-masala',
           name: 'PEANUT MASALA',
           description: 'Spiced peanuts',
           price: 245,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.1,
           prepTime: '5 mins'
         },
         {
           id: 'peri-peri-chana-chat',
           name: 'PERI PERI CHANA CHAT',
           description: 'Spicy chickpea chaat',
           price: 245,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '12 mins'
         },
         {
           id: 'chicken-popeyes',
           name: 'CHICKEN POPEYES',
           description: 'Crispy chicken bites',
           price: 345,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '20 mins'
         },
         {
           id: 'chicken-65',
           name: 'CHICKEN 65',
           description: 'Spicy chicken 65',
           price: 345,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '18 mins'
         },
         {
           id: 'grilled-fish-skewers',
           name: 'GRILLED FISH SKEWERS',
           description: 'Grilled fish on skewers',
           price: 495,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.7,
           prepTime: '25 mins'
         },
         {
           id: 'beer-batter-fish-fingers',
           name: 'BEER BATTER FISH FINGERS',
           description: 'Crispy beer battered fish',
           price: 495,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '22 mins'
         },
         {
           id: 'cheesy-gordita-crunch',
           name: 'CHEESY GORDITA CRUNCH',
           description: 'Cheesy gordita with crunch',
           price: 345,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '15 mins'
         },
         {
           id: 'butter-chicken-pav',
           name: 'BUTTER CHICKEN PAV',
           description: 'Butter chicken with pav',
           price: 345,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '18 mins'
         },
         {
           id: 'chilly-basil-tofu-bao',
           name: 'CHILLY BASIL TOFU BAO',
           description: 'Spicy basil tofu bao',
           price: 345,
           category: 'Bar Tidbits',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '16 mins'
         },
         {
           id: 'keema-bao',
           name: 'KEEMA BAO',
           description: 'Minced meat bao',
           price: 495,
           category: 'Bar Tidbits',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '20 mins'
         }
       ],
       'soups': [
         {
           id: 'thyme-infused-wild-mushroom-soup',
           name: 'THYME INFUSED WILD MUSHROOM SOUP',
           description: 'Thyme infused wild mushroom soup - 245/275',
           price: 245,
           category: 'Soups',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '20 mins'
         },
         {
           id: 'tomato-basil-soup',
           name: 'TOMATO BASIL SOUP',
           description: 'Tomato basil soup veg/chicken - 245/275',
           price: 245,
           category: 'Soups',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '18 mins'
         },
         {
           id: 'tibetian-thupka',
           name: 'TIBETIAN THUPKA',
           description: 'Tibetian thupka veg/chicken - 245/275',
           price: 245,
           category: 'Soups',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '25 mins'
         },
         {
           id: 'sweet-corn-soup',
           name: 'SWEET CORN SOUP',
           description: 'Sweet corn soup veg/chicken - 245/275',
           price: 245,
           category: 'Soups',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.2,
           prepTime: '15 mins'
         },
         {
           id: 'manchow-soup',
           name: 'MANCHOW SOUP',
           description: 'Manchow soup veg/chicken - 245/275',
           price: 245,
           category: 'Soups',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '22 mins'
         }
       ],
       'salads': [
         {
           id: 'figs-and-apricot',
           name: 'FIGS AND APRICOT',
           description: 'Fresh figs and apricot salad',
           price: 395,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '12 mins'
         },
         {
           id: 'fattoush',
           name: 'FATTOUSH',
           description: 'Traditional fattoush salad',
           price: 395,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '15 mins'
         },
         {
           id: 'watermelon-feta-cheese',
           name: 'WATERMELON FETA CHEESE',
           description: 'Watermelon with feta cheese',
           price: 395,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '10 mins'
         },
         {
           id: 'zesty-avocado-quinoa',
           name: 'ZESTY AVOCADO QUINOA SALAD',
           description: 'Zesty avocado quinoa salad',
           price: 395,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.7,
           prepTime: '18 mins'
         },
         {
           id: 'fresh-garden-green',
           name: 'FRESH GARDEN GREEN SALAD',
           description: 'Fresh garden green salad',
           price: 245,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '8 mins'
         },
         {
           id: 'classic-caesar',
           name: 'CLASSIC CAESAR',
           description: 'Classic caesar veg/chicken - 395/445',
           price: 395,
           category: 'Gourmet Healthy Salads',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '12 mins'
         }
       ],
       'artisan-pizzas': [
         {
           id: 'rocket-margherita-caprese',
           name: 'ROCKET MARGHERITA CAPRESE',
           description: 'Rocket margherita caprese pizza',
           price: 495,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '25 mins'
         },
         {
           id: 'roasted-veggies',
           name: 'ROASTED VEGGIES',
           description: 'Roasted vegetables pizza',
           price: 595,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '28 mins'
         },
         {
           id: 'vegetable-carnival',
           name: 'VEGETABLE CARNIVAL',
           description: 'Vegetable carnival pizza',
           price: 595,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '30 mins'
         },
         {
           id: 'quattro-formaggio',
           name: 'QUATTRO FORMAGGIO',
           description: 'Four cheese pizza',
           price: 645,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.7,
           prepTime: '32 mins'
         },
         {
           id: 'classic-pepperoni',
           name: 'CLASSIC PEPPERONI',
           description: 'Classic pepperoni pizza',
           price: 695,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '25 mins'
         },
         {
           id: 'all-the-meats',
           name: 'ALL THE MEATS',
           description: 'All the meats pizza',
           price: 695,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '30 mins'
         },
         {
           id: 'spicy-chicken-tikka',
           name: 'SPICY CHICKEN TIKKA',
           description: 'Spicy chicken tikka pizza',
           price: 695,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '28 mins'
         },
         {
           id: 'tex-mex-peri-peri-chicken',
           name: 'TEX-MEX PERI PERI CHICKEN',
           description: 'Tex-mex peri peri chicken pizza',
           price: 695,
           category: 'Artisan Pizzas',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '30 mins'
         }
       ],
       'pasta': [
         {
           id: 'penne-arabiatta',
           name: 'PENNE ARABIATTA',
           description: 'Penne with arabiatta sauce - Veg 495, Chicken 595',
           price: 495,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '20 mins'
         },
         {
           id: 'fussili-alfredo',
           name: 'FUSSILI ALFREDO',
           description: 'Fussili with alfredo sauce - Veg 495, Chicken 595',
           price: 495,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '22 mins'
         },
         {
           id: 'spaghetti-cheese-sauce',
           name: 'SPAGHETTI CHEESE SAUCE',
           description: 'Spaghetti with cheese sauce - Veg 495, Chicken 595',
           price: 495,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '18 mins'
         },
         {
           id: 'spaghetti-aglio-e-olio',
           name: 'SPAGHETTI AGLIO E OLIO',
           description: 'Spaghetti aglio e olio',
           price: 495,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '15 mins'
         },
         {
           id: 'veg-lasagna',
           name: 'VEG LASAGNA',
           description: 'Vegetable lasagna',
           price: 495,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '35 mins'
         },
         {
           id: 'spaghetti-meatballs',
           name: 'SPAGHETTI WITH MEATBALLS',
           description: 'Spaghetti with meatballs',
           price: 695,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.7,
           prepTime: '25 mins'
         },
         {
           id: 'chicken-lasagna',
           name: 'CHICKEN LASAGNA',
           description: 'Chicken lasagna',
           price: 595,
           category: 'Flavorsome Pasta',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '30 mins'
         }
       ],
       'desserts': [
         {
           id: 'andaz-e-bayaan',
           name: 'ANDAZ E BAYAAN',
           description: 'Special dessert',
           price: 395,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '10 mins'
         },
         {
           id: 'blueberry-cheesecake',
           name: 'BLUEBERRY CHEESECAKE',
           description: 'Blueberry cheesecake',
           price: 395,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.7,
           prepTime: '8 mins'
         },
         {
           id: 'red-velvet-brownie',
           name: 'RED VELVET BROWNIE WITH ICE CREAM',
           description: 'Red velvet brownie with ice cream',
           price: 345,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '12 mins'
         },
         {
           id: 'mexican-churros',
           name: 'MEXICAN CHURROS WITH ICE CREAM',
           description: 'Mexican churros with ice cream',
           price: 395,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '15 mins'
         },
         {
           id: 'fruity-nutty-sundae',
           name: 'FRUITY NUTTY SUNDAE',
           description: 'Fruity nutty sundae',
           price: 345,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.3,
           prepTime: '10 mins'
         },
         {
           id: 'apple-pie',
           name: 'APPLE PIE WITH ICE CREAM',
           description: 'Apple pie with ice cream',
           price: 345,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '12 mins'
         },
         {
           id: 'flavoured-tarts',
           name: 'FLAVOURED TARTS',
           description: 'Assorted flavoured tarts',
           price: 345,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.4,
           prepTime: '8 mins'
         },
         {
           id: 'tiramisu-jar',
           name: 'TIRAMISU JAR',
           description: 'Tiramisu in jar',
           price: 495,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.8,
           prepTime: '10 mins'
         },
         {
           id: 'creme-brulee',
           name: 'CRÈME BRULEE',
           description: 'Classic crème brûlée',
           price: 495,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.6,
           prepTime: '15 mins'
         },
         {
           id: 'mocha-mud-cake',
           name: 'MOCHA MUD CAKE',
           description: 'Mocha mud cake',
           price: 495,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Cafe After Hours',
           rating: 4.5,
           prepTime: '12 mins'
         }
       ],

             'symposium-desserts': [
         {
           id: 'gulab-jamun',
           name: 'Gulab Jamun',
           description: 'Sweet milk balls in sugar syrup',
           price: 80,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.6,
           prepTime: '10 mins'
         },
         {
           id: 'ice-cream',
           name: 'Vanilla Ice Cream',
           description: 'Creamy vanilla ice cream',
           price: 60,
           category: 'Desserts',
           image: '/images/categories/desserts.jpg',
           restaurant: 'Symposium Restaurant',
           rating: 4.3,
           prepTime: '5 mins'
         }
       ],
       
       // Multi-cuisine menu for Panache Restaurant
       'continental': [
         {
           id: 'grilled-chicken',
           name: 'Grilled Chicken',
           description: 'Herb-marinated chicken breast with roasted vegetables',
           price: 350,
           category: 'Continental',
           image: '/images/categories/chicken.jpg',
           restaurant: 'Panache',
           rating: 4.6,
           prepTime: '25 mins'
         },
         {
           id: 'caesar-salad',
           name: 'Caesar Salad',
           description: 'Fresh romaine lettuce with parmesan and croutons',
           price: 220,
           category: 'Continental',
           image: '/images/categories/South-indian.jpg',
           restaurant: 'Panache',
           rating: 4.4,
           prepTime: '15 mins'
         }
       ],
       'mediterranean': [
         {
           id: 'hummus-platter',
           name: 'Hummus Platter',
           description: 'Creamy chickpea dip with pita bread and olives',
           price: 180,
           category: 'Mediterranean',
           image: '/images/categories/North-indian.jpg',
           restaurant: 'Panache',
           rating: 4.5,
           prepTime: '10 mins'
         },
         {
           id: 'falafel-wrap',
           name: 'Falafel Wrap',
           description: 'Crispy chickpea patties in whole wheat wrap',
           price: 240,
           category: 'Mediterranean',
           image: '/images/categories/pizza-2.jpeg',
           restaurant: 'Panache',
           rating: 4.3,
           prepTime: '20 mins'
         }
       ],
       'fusion': [
         {
           id: 'indian-pasta',
           name: 'Indian Pasta',
           description: 'Pasta with Indian spices and tomato sauce',
           price: 280,
           category: 'Fusion',
           image: '/images/categories/pasta.jpg',
           restaurant: 'Panache',
           rating: 4.7,
           prepTime: '22 mins'
         },
         {
           id: 'chinese-biryani',
           name: 'Chinese Biryani',
           description: 'Rice with Chinese vegetables and soy sauce',
           price: 260,
           category: 'Fusion',
           image: '/images/categories/Chinese.jpg',
           restaurant: 'Panache',
           rating: 4.4,
           prepTime: '30 mins'
         }
       ]
    };

    if (category) {
      const categoryItems = menuItems[category.toLowerCase() as keyof typeof menuItems] || [];
      return NextResponse.json({
        items: categoryItems,
        category: category,
        message: `Menu items for ${category} retrieved successfully`
      });
    }

    // Return all items if no category specified
    const allItems = Object.values(menuItems).flat();
    return NextResponse.json({
      items: allItems,
      message: 'All menu items retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get menu error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 