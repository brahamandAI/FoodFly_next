import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const restaurantId = params.id;
    
    // Mock restaurant data - in real app, this would query database
    const restaurants = {
      '1': {
        id: '1',
        name: 'Panache',
        cuisine: 'Indian',
        rating: 4.5,
        deliveryTime: '30-45 mins',
        deliveryFee: 40,
        image: '/images/restaurants/cafe.jpg',
        location: 'Downtown',
        isOpen: true,
        description: 'Authentic Indian cuisine with traditional flavors',
        address: '123 Main Street, Downtown',
        phone: '+1234567890',
        menu: [
          {
            id: 'chicken-biryani',
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken',
            price: 250,
            category: 'Main Course',
            image: '/images/categories/chicken.jpg'
          },
          {
            id: 'dal-makhani',
            name: 'Dal Makhani',
            description: 'Rich and creamy black lentils',
            price: 180,
            category: 'Main Course',
            image: '/images/categories/North-indian.jpg'
          },
          {
            id: 'shahi-paneer',
            name: 'Shahi Paneer',
            description: 'Royal cottage cheese curry',
            price: 200,
            category: 'Main Course',
            image: '/images/categories/North-indian.jpg'
          }
        ]
      },
      '2': {
        id: '2',
        name: 'Cafe After Hours',
        cuisine: 'Italian',
        rating: 4.2,
        deliveryTime: '25-35 mins',
        deliveryFee: 35,
        image: '/images/restaurants/panache.jpg',
        location: 'City Center',
        isOpen: true,
        description: 'Authentic Italian pizzas and pasta',
        address: '456 Pizza Street, City Center',
        phone: '+1234567891',
        menu: [
          {
            id: 'margherita-pizza',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato, mozzarella, and basil',
            price: 320,
            category: 'Pizza',
            image: '/images/categories/pizza-2.jpeg'
          },
          {
            id: 'pasta-alfredo',
            name: 'Pasta Alfredo',
            description: 'Creamy white sauce pasta',
            price: 280,
            category: 'Pasta',
            image: '/images/categories/pasta.jpg'
          }
        ]
      },
      '3': {
        id: '3',
        name: 'Symposium Restaurant',
        cuisine: 'Multi-Cuisine',
        rating: 4.7,
        deliveryTime: '30-40 mins',
        deliveryFee: 50,
        image: '/images/restaurants/symposium.jpg',
        location: 'Andheri, Mumbai',
        isOpen: true,
        description: 'Multi-cuisine restaurant with traditional and modern dishes',
        address: '789 Food Street, Andheri, Mumbai',
        phone: '+1234567892',
        menu: [
          {
            id: 'butter-chicken',
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken',
            price: 280,
            category: 'North Indian',
            image: '/images/categories/chicken.jpg'
          },
          {
            id: 'dal-makhani',
            name: 'Dal Makhani',
            description: 'Rich and creamy black lentils',
            price: 180,
            category: 'North Indian',
            image: '/images/categories/North-indian.jpg'
          },
          {
            id: 'masala-dosa',
            name: 'Masala Dosa',
            description: 'Crispy rice crepe filled with spiced potato',
            price: 120,
            category: 'South Indian',
            image: '/images/categories/South-indian.jpg'
          }
        ]
      }
    };

    const restaurant = restaurants[restaurantId as keyof typeof restaurants];
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      restaurant,
      message: 'Restaurant retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 