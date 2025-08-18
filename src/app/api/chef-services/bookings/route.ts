import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import ChefBooking from '@/lib/backend/models/chefBooking.model';
import { verifyToken as verifyApiToken } from '@/lib/backend/middleware/auth';

// Force dynamic
export const dynamic = 'force-dynamic';

// GET /api/chef-services/bookings
// Returns bookings for the authenticated customer
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication (reads Authorization header)
    let user;
    try {
      user = verifyApiToken(request);
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch bookings for this customer
    const bookings = await ChefBooking.find({ customerId: user._id })
      .sort({ 'timeline.bookedAt': -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching chef bookings:', error);
    return NextResponse.json(
      { error: 'Failed to load bookings' },
      { status: 500 }
    );
  }
}
