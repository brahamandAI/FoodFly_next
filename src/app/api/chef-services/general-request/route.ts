import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/backend/database';
import User from '@/lib/backend/models/user.model';
import ChefBooking from '@/lib/backend/models/chefBooking.model';
import { verifyToken } from '@/lib/backend/utils/jwt';

// POST /api/chef-services/general-request - Create a general chef service request
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
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
    const customerId = (decoded as any).userId;

    const body = await request.json();
    const {
      eventType,
      eventDate,
      eventTime,
      duration,
      guestCount,
      cuisine,
      venue,
      specialRequests,
      dietaryRestrictions,
      budget,
      paymentMethod = 'cod'
    } = body;

    // Validate required fields
    if (!eventType || !eventDate || !eventTime || !duration || !guestCount || !venue || !budget) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required booking details' 
        },
        { status: 400 }
      );
    }

    // Validate cuisine array
    if (!cuisine || !Array.isArray(cuisine) || cuisine.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Please select at least one cuisine' 
        },
        { status: 400 }
      );
    }

    // Get customer details
    const customer = await User.findById(customerId).select('-password');
    if (!customer) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer not found' 
        },
        { status: 404 }
      );
    }

    console.log('Customer details for booking:', {
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });

    // Ensure customer has required fields
    if (!customer.phone) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Customer phone number is required. Please update your profile.' 
        },
        { status: 400 }
      );
    }

    // Validate event date (must be in future)
    const eventDateTime = new Date(eventDate);
    if (eventDateTime <= new Date()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Event date must be in the future' 
        },
        { status: 400 }
      );
    }

    // Calculate estimated pricing based on budget
    const estimatedBasePrice = Math.min(budget.max * 0.7, 5000); // 70% of max budget or 5000, whichever is lower
    let additionalCharges = {
      ingredient_cost: 0,
      travel_fee: 0,
      equipment_rental: 0,
      extra_hours: 0
    };

    // Add charges based on guest count
    if (guestCount > 10) {
      additionalCharges.extra_hours = (guestCount - 10) * 200;
    }

    // Add travel fee if venue is customer home
    if (venue.type === 'customer_home') {
      additionalCharges.travel_fee = 500;
    }

    // Add equipment rental for large events
    if (guestCount > 20) {
      additionalCharges.equipment_rental = 1000;
    }

    const estimatedTotalAmount = estimatedBasePrice + Object.values(additionalCharges).reduce((sum, charge) => sum + charge, 0);

    // Create general request (no specific chef assigned)
    const generalRequest = new ChefBooking({
      customerId,
      chefId: null, // No specific chef assigned
      bookingDetails: {
        eventType,
        eventDate: new Date(eventDate),
        eventTime,
        duration,
        guestCount,
        specialRequests,
        dietaryRestrictions: (dietaryRestrictions || []).map(restriction => restriction.toLowerCase()),
        cuisine: Array.isArray(cuisine) ? cuisine : [cuisine],
        venue
      },
      pricing: {
        basePrice: estimatedBasePrice,
        additionalCharges,
        totalAmount: estimatedTotalAmount,
        currency: 'INR',
        budgetRange: {
          min: budget.min,
          max: budget.max,
          isFlexible: budget.isFlexible || false
        }
      },
      status: 'pending_chef_assignment', // New status for general requests
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      chef: null, // No specific chef
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '+91-0000000000'
      },
      timeline: {
        bookedAt: new Date()
      },
      communication: {
        messages: [{
          from: 'customer',
          message: `General request for ${eventType} on ${eventDate} - Budget: ₹${budget.min}-${budget.max}`,
          timestamp: new Date(),
          type: 'system_update'
        }]
      },
      metadata: {
        source: 'web',
        requestType: 'general',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    console.log('Saving booking with customer phone:', generalRequest.customer.phone);

    await generalRequest.save();

    return NextResponse.json({
      success: true,
      message: 'General chef service request created successfully',
      data: {
        requestId: generalRequest._id,
        request: {
          id: generalRequest._id,
          status: generalRequest.status,
          eventDate: generalRequest.bookingDetails.eventDate,
          eventTime: generalRequest.bookingDetails.eventTime,
          estimatedTotalAmount: generalRequest.pricing.totalAmount,
          budgetRange: generalRequest.pricing.budgetRange,
          customer: generalRequest.customer
        }
      }
    });

  } catch (error) {
    console.error('Error creating general chef request:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed: ' + validationErrors.join(', '),
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create general chef request: ' + (error.message || 'Unknown error')
      },
      { status: 500 }
    );
  }
}

// GET /api/chef-services/general-request - Get available general requests for chefs
export async function GET(request: NextRequest) {
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
    
    // Verify the user is a chef
    const chef = await User.findById((decoded as any).userId);
    if (!chef || chef.role !== 'chef') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Chef access required' 
        },
        { status: 403 }
      );
    }

    // Get available general requests (no specific chef assigned)
    const generalRequests = await ChefBooking.find({
      chefId: null,
      status: 'pending_chef_assignment'
    }).sort({ 'timeline.bookedAt': -1 });

    return NextResponse.json({
      success: true,
      data: {
        requests: generalRequests.map(request => ({
          id: request._id,
          eventType: request.bookingDetails.eventType,
          eventDate: request.bookingDetails.eventDate,
          eventTime: request.bookingDetails.eventTime,
          duration: request.bookingDetails.duration,
          guestCount: request.bookingDetails.guestCount,
          cuisine: request.bookingDetails.cuisine,
          venue: request.bookingDetails.venue,
          budgetRange: request.pricing.budgetRange,
          estimatedTotalAmount: request.pricing.totalAmount,
          customer: request.customer,
          specialRequests: request.bookingDetails.specialRequests,
          dietaryRestrictions: request.bookingDetails.dietaryRestrictions,
          bookedAt: request.timeline.bookedAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching general requests:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch general requests' 
      },
      { status: 500 }
    );
  }
}
