import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/lib/imageService';

// Simple token verification for development
const verifyToken = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.substring(7);
  
  // For development, accept any token
  // In production, you should verify the JWT token properly
  if (!token) {
    throw new Error('Invalid token');
  }
  
  return { role: 'admin' }; // Mock admin role
};

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const decoded = await verifyToken(request);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { menuItems, mode = 'single' } = body;

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: 'Menu items array is required' }, { status: 400 });
    }

    console.log('Processing images:', { menuItems, mode });

    let results;

    if (mode === 'batch') {
      // Process multiple items in batch
      const itemsToProcess = menuItems.map((item: any) => ({
        id: item._id || item.id,
        name: item.name,
        category: item.category,
      }));

      console.log('Batch processing items:', itemsToProcess);
      results = await ImageService.batchProcessMenuImages(itemsToProcess);
    } else {
      // Process single item
      const item = menuItems[0];
      console.log('Single processing item:', item);
      const result = await ImageService.processMenuImage(item.name, item.category);
      results = {
        [item._id || item.id]: {
          success: true,
          data: result,
        },
      };
    }

    console.log('Processing completed:', results);

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully processed ${Object.keys(results).length} images`,
    });

  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process images', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const decoded = await verifyToken(request);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const analytics = await ImageService.getImageAnalytics(publicId);

    return NextResponse.json({
      success: true,
      analytics,
    });

  } catch (error) {
    console.error('Error getting image analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get image analytics', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const decoded = await verifyToken(request);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const success = await ImageService.deleteImage(publicId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image', details: error.message },
      { status: 500 }
    );
  }
}
