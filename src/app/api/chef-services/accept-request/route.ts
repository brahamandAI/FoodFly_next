import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import User from '@/lib/backend/models/user.model';
import ChefBooking from '@/lib/backend/models/chefBooking.model';
import { verifyToken } from '@/lib/backend/utils/jwt';

// POST /api/chef-services/accept-request - Chef accepts a general request
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify chef authentication
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication token required' 
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const chefId = decoded.userId;
    
    // Verify the user is a chef
    const chef = await User.findById(chefId);
    if (!chef || chef.role !== 'chef') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Chef access required' 
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { requestId, finalPrice } = body;

    if (!requestId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Request ID is required' 
        },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with atomic operation to ensure only one chef can accept
    const updatedRequest = await ChefBooking.findOneAndUpdate(
      {
        _id: requestId,
        chefId: null, // Only unassigned requests
        status: 'pending_chef_assignment' // Only pending requests
      },
      {
        $set: {
          chefId: chefId,
          status: 'confirmed',
          'timeline.confirmedAt': new Date(),
          chef: {
            id: chef._id,
            name: chef.name,
            email: chef.email,
            phone: chef.phone || '+91-0000000000',
            specialization: chef.chefProfile?.specialization || [],
            rating: chef.chefProfile?.rating || 5.0
          },
          'pricing.totalAmount': finalPrice || 0
        },
        $push: {
          'communication.messages': {
            from: 'chef',
            message: `Chef ${chef.name} has accepted your request!`,
            timestamp: new Date(),
            type: 'system_update'
          }
        }
      },
      {
        new: true, // Return the updated document
        runValidators: true
      }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Request not found or already accepted by another chef' 
        },
        { status: 404 }
      );
    }

    // Update chef's total events
    await User.findByIdAndUpdate(chefId, {
      $inc: { 'chefProfile.totalEvents': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Request accepted successfully',
      data: {
        bookingId: updatedRequest._id,
        status: updatedRequest.status,
        chef: updatedRequest.chef,
        customer: updatedRequest.customer,
        eventDate: updatedRequest.bookingDetails.eventDate,
        eventTime: updatedRequest.bookingDetails.eventTime,
        totalAmount: updatedRequest.pricing.totalAmount
      }
    });

  } catch (error) {
    console.error('Error accepting request:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to accept request: ' + (error.message || 'Unknown error')
      },
      { status: 500 }
    );
  }
}
