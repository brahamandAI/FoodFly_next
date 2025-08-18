import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import { verifyToken } from '@/lib/backend/middleware/auth';
import ChefBooking from '@/lib/backend/models/chefBooking.model';
import User from '@/lib/backend/models/user.model';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const chefId = searchParams.get('chefId');
    const customerId = searchParams.get('customerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (chefId) {
      query.chefId = chefId;
    }

    if (customerId) {
      query.customerId = customerId;
    }

    // Get total count for pagination
    const totalCount = await ChefBooking.countDocuments(query);

    // Get chef bookings with populated data
    const bookings = await ChefBooking.find(query)
      .sort({ 'timeline.bookedAt': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get summary statistics
    const summaryStats = await ChefBooking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completedBookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.totalAmount', 0] } },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    // Get chef and customer details for each booking
    const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
      const chef = booking.chefId ? await User.findById(booking.chefId).select('name email phone') : null;
      const customer = await User.findById(booking.customerId).select('name email phone');

      return {
        ...booking,
        chef: chef ? {
          _id: chef._id,
          name: chef.name,
          email: chef.email,
          phone: chef.phone
        } : null,
        customer: {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      };
    }));

    return NextResponse.json({
      bookings: bookingsWithDetails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: skip + bookings.length < totalCount
      },
      summary: summaryStats[0] || {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        avgRating: 0
      },
      message: 'Chef bookings retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get chef bookings error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { 
      bookingId, 
      action, // 'update', 'cancel', 'complete'
      updates 
    } = await request.json();

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: 'Booking ID and action are required' },
        { status: 400 }
      );
    }

    const booking = await ChefBooking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Chef booking not found' },
        { status: 404 }
      );
    }

    let updateQuery: any = {};

    switch (action) {
      case 'cancel':
        updateQuery = {
          status: 'cancelled',
          'timeline.cancelledAt': new Date()
        };
        break;

      case 'complete':
        updateQuery = {
          status: 'completed',
          'timeline.completedAt': new Date()
        };
        break;

      case 'update':
        updateQuery = updates;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedBooking = await ChefBooking.findByIdAndUpdate(
      bookingId,
      { $set: updateQuery },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      booking: updatedBooking,
      message: `Chef booking ${action} successful`
    });

  } catch (error: any) {
    console.error('Update chef booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
