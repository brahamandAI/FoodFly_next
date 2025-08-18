import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import ChefBooking from '@/lib/backend/models/chefBooking.model';
import { verifyToken } from '@/lib/backend/middleware/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = verifyToken(request);
    if (user.role !== 'chef') {
      return NextResponse.json(
        { error: 'Chef authentication required' },
        { status: 401 }
      );
    }

    // 1) General requests visible to all chefs (most recent)
    const generalRequests = await ChefBooking.find({
      chefId: null,
      status: 'pending_chef_assignment'
    })
      .sort({ 'timeline.bookedAt': -1 })
      .limit(10)
      .lean();

    // 2) Requests already assigned to this chef and awaiting action
    const assignedToChef = await ChefBooking.find({
      chefId: user._id,
      status: { $in: ['pending', 'confirmed'] }
    })
      .sort({ 'timeline.bookedAt': -1 })
      .limit(10)
      .lean();

    const notifications = [
      // General available requests
      ...generalRequests.map((req: any) => ({
        id: `general_${req._id}`,
        type: 'booking_request',
        title: 'New General Chef Request',
        message: `${req.bookingDetails?.eventType || 'Event'} • ${req.bookingDetails?.guestCount || 0} guests • Budget ₹${req.pricing?.budgetRange?.min || 0}-₹${req.pricing?.budgetRange?.max || 0}`,
        timestamp: req.timeline?.bookedAt || new Date(),
        isRead: false,
        eventId: String(req._id),
      })),
      // Assigned/active requests for this chef
      ...assignedToChef.map((req: any) => ({
        id: `assigned_${req._id}`,
        type: 'booking_request',
        title: req.status === 'pending' ? 'New Booking Assigned' : 'Upcoming Confirmed Event',
        message: `${req.bookingDetails?.eventType || 'Event'} with ${req.customer?.name || 'Customer'} on ${new Date(req.bookingDetails?.eventDate).toLocaleDateString()}`,
        timestamp: req.timeline?.bookedAt || new Date(),
        isRead: false,
        eventId: String(req._id),
      })),
    ]
      // Sort newest first and cap total for performance
      .sort((a, b) => new Date(b.timestamp as any).getTime() - new Date(a.timestamp as any).getTime())
      .slice(0, 20);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching chef notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}