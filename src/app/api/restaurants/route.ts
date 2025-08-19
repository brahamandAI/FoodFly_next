import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all restaurants
    // In a real app, this would query the database
    const restaurants = [
      {
        id: '1',
        name: 'Panache',
        cuisine: 'Indian',
        rating: 4.5,
        deliveryTime: '30-45 mins',
        deliveryFee: 40,
        image: '/images/restaurants/cafe.jpg',
        location: 'Downtown',
        isOpen: true,
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
          }
        ]
      },
      {
        id: '2',
        name: 'Cafe After Hours',
        cuisine: 'Italian',
        rating: 4.2,
        deliveryTime: '25-35 mins',
        deliveryFee: 35,
        image: '/images/restaurants/panache.jpg',
        location: 'City Center',
        isOpen: true,
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
      }
    ];

    return NextResponse.json({
      restaurants,
      message: 'Restaurants retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get restaurants error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 