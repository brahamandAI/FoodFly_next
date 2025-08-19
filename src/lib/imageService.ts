import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export class ImageService {
  /**
   * Search for food images on Unsplash
   */
  static async searchFoodImages(query: string, count: number = 1): Promise<UnsplashImage[]> {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching Unsplash images:', error);
      throw error;
    }
  }

  /**
   * Download image from URL
   */
  static async downloadImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Upload image to Cloudinary with optimization
   */
  static async uploadToCloudinary(
    imageBuffer: Buffer,
    folder: string = 'foodfly/menu',
    transformation: string = 'f_auto,q_auto,w_800,h_600,c_fill'
  ): Promise<CloudinaryUploadResult> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            transformation,
            resource_type: 'image',
            format: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );

        uploadStream.end(imageBuffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Generate optimized image URLs for different sizes
   */
  static generateOptimizedUrls(publicId: string, baseUrl: string) {
    return {
      thumbnail: `${baseUrl}/w_200,h_200,c_fill,f_auto,q_auto/${publicId}`,
      small: `${baseUrl}/w_400,h_300,c_fill,f_auto,q_auto/${publicId}`,
      medium: `${baseUrl}/w_800,h_600,c_fill,f_auto,q_auto/${publicId}`,
      large: `${baseUrl}/w_1200,h_900,c_fill,f_auto,q_auto/${publicId}`,
      original: baseUrl + '/' + publicId,
    };
  }

  /**
   * Complete pipeline: Search → Download → Upload → Return URLs
   */
  static async processMenuImage(
    foodItem: string,
    category: string,
    folder: string = 'foodfly/menu'
  ): Promise<{
    public_id: string;
    urls: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    };
    metadata: {
      width: number;
      height: number;
      format: string;
      bytes: number;
    };
  }> {
    try {
      // 1. Search for food image on Unsplash
      const searchQuery = `${foodItem} food ${category}`;
      const images = await this.searchFoodImages(searchQuery, 1);
      
      if (images.length === 0) {
        throw new Error(`No images found for: ${searchQuery}`);
      }

      const unsplashImage = images[0];

      // 2. Download the image
      const imageBuffer = await this.downloadImage(unsplashImage.urls.regular);

      // 3. Upload to Cloudinary with optimization
      const uploadResult = await this.uploadToCloudinary(
        imageBuffer,
        `${folder}/${category.toLowerCase().replace(/\s+/g, '-')}`,
        'f_auto,q_auto,w_800,h_600,c_fill'
      );

      // 4. Generate optimized URLs
      const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
      const urls = this.generateOptimizedUrls(uploadResult.public_id, baseUrl);

      return {
        public_id: uploadResult.public_id,
        urls,
        metadata: {
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
      };
    } catch (error) {
      console.error('Error processing menu image:', error);
      throw error;
    }
  }

  /**
   * Batch process multiple menu items
   */
  static async batchProcessMenuImages(
    menuItems: Array<{ name: string; category: string; id: string }>
  ): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    const batchSize = 5; // Process 5 at a time to avoid rate limits

    for (let i = 0; i < menuItems.length; i += batchSize) {
      const batch = menuItems.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (item) => {
        try {
          const result = await this.processMenuImage(item.name, item.category);
          return { id: item.id, success: true, data: result };
        } catch (error) {
          console.error(`Failed to process image for ${item.name}:`, error);
          return { id: item.id, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(result => {
        results[result.id] = result;
      });

      // Add delay between batches to respect rate limits
      if (i + batchSize < menuItems.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }

  /**
   * Get image analytics from Cloudinary
   */
  static async getImageAnalytics(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId, {
        fields: 'public_id,bytes,format,width,height,created_at,url',
      });
      return result;
    } catch (error) {
      console.error('Error getting image analytics:', error);
      throw error;
    }
  }
}

// Utility functions for common food categories
export const FOOD_IMAGE_QUERIES = {
  'Bar Munchies': ['appetizer', 'snack', 'finger food'],
  'Soups': ['soup', 'broth', 'bisque'],
  'Salad Station': ['salad', 'fresh vegetables', 'healthy bowl'],
  'Appetizers': ['appetizer', 'starter', 'small plate'],
  'Main Course': ['main dish', 'entree', 'dinner plate'],
  'Sizzlers': ['sizzler', 'hot plate', 'sizzling dish'],
  'Pizza': ['pizza', 'italian pizza', 'wood fired pizza'],
  'Sandwiches': ['sandwich', 'sub', 'wrap'],
  'Burgers': ['burger', 'hamburger', 'cheeseburger'],
  'Rice & Biryani': ['biryani', 'rice dish', 'indian rice'],
  'Breads': ['naan', 'bread', 'flatbread'],
  'Desserts': ['dessert', 'sweet', 'cake'],
  'Beverages': ['drink', 'beverage', 'mocktail'],
};

export default ImageService;
