import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test API endpoint called');
    
    const body = await request.json();
    console.log('Request body:', body);

    // Simple test response
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: body
    });

  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Test endpoint failed', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
