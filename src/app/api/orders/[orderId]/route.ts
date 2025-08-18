import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import Order from '@/lib/backend/models/order.model';
import { verifyToken } from '@/lib/backend/utils/jwt';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();
    
    const orderId = params.orderId;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch order
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns this order or is admin
    // Use customerId instead of user field
    if (order.customerId !== decoded.userId && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Format the response to match the actual order structure
    const formattedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      restaurant: {
        _id: order.restaurantId || 'default-restaurant',
        name: order.restaurantName || 'FoodFly Kitchen',
        image: '/images/restaurants/cafe.jpg', // Default image
        phone: '+91 9876543210', // Default phone
        address: {
          street: 'Main Street',
          city: 'Your City',
          area: 'Food District'
        }
      },
      items: order.items.map((item: any) => ({
        _id: item._id,
        menuItem: {
          _id: item.menuItemId || item._id,
          name: item.name,
          price: item.price,
          image: '/images/placeholder.svg', // Default image
          isVeg: true, // Default value
          description: item.description,
          category: 'Main Course' // Default category
        },
        quantity: item.quantity,
        price: item.price,
        customization: item.customizations ? item.customizations.join(', ') : ''
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      deliveryFee: order.deliveryFee || 0,
      tax: order.taxes || 0,
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      placedAt: order.placedAt,
      deliveredAt: order.deliveredAt,
      rating: order.rating,
      review: order.review,
      createdAt: order.createdAt,
      cancelledAt: order.cancelledAt,
      deliveryPartner: null // Not implemented yet
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder
    });

  } catch (error: any) {
    console.error('Error fetching order details:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 