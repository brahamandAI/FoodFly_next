import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import { verifyToken } from '@/lib/backend/middleware/auth';
import User from '@/lib/backend/models/user.model';
import ChefBooking from '@/lib/backend/models/chefBooking.model';

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
    const status = searchParams.get('status'); // available, busy, offline
    const specialization = searchParams.get('specialization');
    const verified = searchParams.get('verified'); // true, false
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { role: 'chef' };

    if (status) {
      query['chefProfile.availability.status'] = status;
    }

    if (specialization) {
      query['chefProfile.specialization'] = { $regex: specialization, $options: 'i' };
    }

    if (verified !== null && verified !== undefined) {
      query['chefProfile.verification.isVerified'] = verified === 'true';
    }

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    // Get chefs with aggregation for performance metrics
    const chefs = await User.find(query)
      .select('-password -googleId')
      .sort({ 'chefProfile.joinedAt': -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate additional metrics for each chef
    const chefsWithMetrics = await Promise.all(chefs.map(async (chef) => {
      const profile = chef.chefProfile;
      
      // Get chef's booking statistics
      const bookingStats = await ChefBooking.aggregate([
        { $match: { chefId: chef._id.toString() } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            completedEvents: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$pricing.totalAmount', 0] } },
            avgRating: { $avg: '$rating' }
          }
        }
      ]);

      const stats = bookingStats[0] || {
        totalBookings: 0,
        completedEvents: 0,
        totalRevenue: 0,
        avgRating: 0
      };

      return {
        _id: chef._id,
        name: chef.name,
        email: chef.email,
        phone: chef.phone,
        isEmailVerified: chef.isEmailVerified,
        createdAt: chef.createdAt,
        chefProfile: {
          ...profile,
          // Calculate derived metrics
          efficiency: stats.totalBookings > 0 ? 
            Math.round((stats.completedEvents / stats.totalBookings) * 100) : 0,
          avgEarnings: stats.completedEvents > 0 ? 
            Math.round(stats.totalRevenue / stats.completedEvents) : 0,
          lastActiveFormatted: profile?.availability?.lastStatusUpdate ? 
            new Date(profile.availability.lastStatusUpdate).toLocaleString() : 'Never',
          isOnline: profile?.availability?.status === 'available' || profile?.availability?.status === 'busy',
          // Add booking statistics
          totalBookings: stats.totalBookings,
          completedEvents: stats.completedEvents,
          totalRevenue: stats.totalRevenue,
          avgRating: Math.round((stats.avgRating || profile?.rating || 5) * 10) / 10
        }
      };
    }));

    // Get summary statistics
    const summaryStats = await User.aggregate([
      { $match: { role: 'chef' } },
      {
        $group: {
          _id: null,
          totalChefs: { $sum: 1 },
          verifiedChefs: {
            $sum: {
              $cond: [{ $eq: ['$chefProfile.verification.isVerified', true] }, 1, 0]
            }
          },
          availableChefs: {
            $sum: {
              $cond: [{ $eq: ['$chefProfile.availability.status', 'available'] }, 1, 0]
            }
          },
          busyChefs: {
            $sum: {
              $cond: [{ $eq: ['$chefProfile.availability.status', 'busy'] }, 1, 0]
            }
          },
          avgRating: { $avg: '$chefProfile.rating' }
        }
      }
    ]);

    // Get total chef bookings
    const totalChefBookings = await ChefBooking.countDocuments({});

    return NextResponse.json({
      chefs: chefsWithMetrics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: skip + chefs.length < totalCount
      },
      summary: {
        ...summaryStats[0],
        totalChefBookings,
        avgRating: Math.round((summaryStats[0]?.avgRating || 5) * 10) / 10
      } || {
        totalChefs: 0,
        verifiedChefs: 0,
        availableChefs: 0,
        busyChefs: 0,
        avgRating: 5,
        totalChefBookings: 0
      },
      message: 'Chefs retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get chefs error:', error);
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
      chefId, 
      action, // 'update', 'verify', 'activate', 'deactivate', 'updatePerformance'
      updates 
    } = await request.json();

    if (!chefId || !action) {
      return NextResponse.json(
        { error: 'Chef ID and action are required' },
        { status: 400 }
      );
    }

    const chef = await User.findOne({ _id: chefId, role: 'chef' });

    if (!chef) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    let updateQuery: any = {};

    switch (action) {
      case 'verify':
        updateQuery = {
          'chefProfile.verification.isVerified': true,
          'chefProfile.verification.verifiedAt': new Date()
        };
        break;

      case 'activate':
        updateQuery = {
          'chefProfile.isActive': true
        };
        break;

      case 'deactivate':
        updateQuery = {
          'chefProfile.isActive': false
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

    const updatedChef = await User.findByIdAndUpdate(
      chefId,
      { $set: updateQuery },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      chef: updatedChef,
      message: `Chef ${action} successful`
    });

  } catch (error: any) {
    console.error('Update chef error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const chefId = searchParams.get('id');

    if (!chefId) {
      return NextResponse.json(
        { error: 'Chef ID is required' },
        { status: 400 }
      );
    }

    const chef = await User.findOne({ _id: chefId, role: 'chef' });

    if (!chef) {
      return NextResponse.json(
        { error: 'Chef not found' },
        { status: 404 }
      );
    }

    // Check if chef has active bookings
    const activeBookings = await ChefBooking.countDocuments({
      chefId: chefId,
      status: { $in: ['pending', 'confirmed', 'in_progress'] }
    });

    if (activeBookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete chef with active bookings' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(chefId);

    return NextResponse.json({
      message: 'Chef deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete chef error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
