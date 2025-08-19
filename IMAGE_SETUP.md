# 🖼️ Image Processing Setup Guide

This guide will help you set up the automated image processing system using **Unsplash API** and **Cloudinary** for your FoodFly application.

## 🎯 **What This System Does**

1. **Searches** high-quality food images from Unsplash API
2. **Downloads** images automatically
3. **Optimizes** and uploads to Cloudinary
4. **Generates** multiple sizes (thumbnail, small, medium, large)
5. **Provides** CDN URLs for fast loading

## 📋 **Prerequisites**

### 1. **Unsplash API Account**
- Go to [Unsplash Developers](https://unsplash.com/developers)
- Create a new application
- Get your **Access Key**

### 2. **Cloudinary Account**
- Sign up at [Cloudinary](https://cloudinary.com/)
- Get your **Cloud Name**, **API Key**, and **API Secret**

## 🔧 **Setup Instructions**

### **Step 1: Install Dependencies**

```bash
npm install cloudinary
```

### **Step 2: Environment Variables**

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

### **Step 3: Get API Keys**

#### **Unsplash API Key:**
1. Visit [https://unsplash.com/developers](https://unsplash.com/developers)
2. Click "New Application"
3. Fill in the form:
   - **Application name**: FoodFly Image Processor
   - **Description**: Automated food image processing for menu items
   - **What are you building**: Food delivery app with menu images
4. Accept terms and create
5. Copy your **Access Key**

#### **Cloudinary Credentials:**
1. Sign up at [https://cloudinary.com/](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 🚀 **Usage**

### **Admin Interface**

1. **Access**: Go to `/admin/images` in your admin panel
2. **Select Items**: Choose menu items that need images
3. **Process**: Click "Process Images" to automatically:
   - Search Unsplash for relevant food images
   - Download and optimize
   - Upload to Cloudinary
   - Generate multiple sizes

### **API Endpoints**

#### **Process Images**
```bash
POST /api/admin/process-images
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "menuItems": [
    {
      "_id": "item_001",
      "name": "Butter Chicken",
      "category": "Main Course"
    }
  ],
  "mode": "batch" // or "single"
}
```

#### **Get Image Analytics**
```bash
GET /api/admin/process-images?publicId=<cloudinary-public-id>
Authorization: Bearer <admin-token>
```

#### **Delete Image**
```bash
DELETE /api/admin/process-images?publicId=<cloudinary-public-id>
Authorization: Bearer <admin-token>
```

## 📊 **Features**

### **🔄 Automated Processing**
- **Smart Search**: Uses food item name + category for better results
- **Batch Processing**: Process multiple items at once
- **Rate Limiting**: Respects API limits with delays
- **Error Handling**: Graceful failure handling

### **🖼️ Image Optimization**
- **Multiple Sizes**: Thumbnail (200x200), Small (400x300), Medium (800x600), Large (1200x900)
- **Format Optimization**: Automatic WebP/AVIF conversion
- **Quality Optimization**: Automatic quality adjustment
- **CDN Delivery**: Fast global delivery

### **📈 Analytics & Management**
- **Image Analytics**: Size, format, dimensions
- **Storage Management**: Delete unused images
- **Processing History**: Track success/failure rates

## 🎨 **Image Categories**

The system automatically maps menu categories to optimized search queries:

| Category | Search Terms |
|----------|-------------|
| Bar Munchies | appetizer, snack, finger food |
| Soups | soup, broth, bisque |
| Salad Station | salad, fresh vegetables, healthy bowl |
| Appetizers | appetizer, starter, small plate |
| Main Course | main dish, entree, dinner plate |
| Sizzlers | sizzler, hot plate, sizzling dish |
| Pizza | pizza, italian pizza, wood fired pizza |
| Sandwiches | sandwich, sub, wrap |
| Burgers | burger, hamburger, cheeseburger |
| Rice & Biryani | biryani, rice dish, indian rice |
| Breads | naan, bread, flatbread |
| Desserts | dessert, sweet, cake |
| Beverages | drink, beverage, mocktail |

## 💡 **Best Practices**

### **1. Rate Limiting**
- Unsplash: 50 requests per hour (free tier)
- Process in batches of 5 items
- Add 1-second delays between batches

### **2. Image Quality**
- Use landscape orientation for better results
- Search queries include "food" for better relevance
- Automatic format optimization (WebP/AVIF)

### **3. Storage Management**
- Monitor Cloudinary usage
- Delete unused images regularly
- Use appropriate image sizes for different contexts

### **4. Error Handling**
- Failed images are logged with error details
- Retry mechanism for temporary failures
- Fallback to placeholder images

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. "Unsplash API error: 403"**
- Check your Unsplash Access Key
- Verify your application is approved
- Check rate limits

#### **2. "Cloudinary upload failed"**
- Verify Cloudinary credentials
- Check Cloudinary account limits
- Ensure proper folder permissions

#### **3. "No images found"**
- Try different search terms
- Check if the food item name is too specific
- Use category-based search

### **Debug Mode**

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📱 **Integration with Menu System**

The processed images automatically integrate with your existing menu system:

```typescript
// Example: Using processed images in menu items
const menuItem = {
  _id: 'item_001',
  name: 'Butter Chicken',
  category: 'Main Course',
  image: 'https://res.cloudinary.com/your-cloud/image/upload/w_800,h_600,c_fill,f_auto,q_auto/foodfly/menu/main-course/butter-chicken'
};
```

## 🎯 **Next Steps**

1. **Set up API keys** in your environment
2. **Test with a single item** first
3. **Process your menu items** in batches
4. **Monitor usage** and optimize as needed
5. **Integrate** processed images into your menu display

## 📞 **Support**

If you encounter any issues:
1. Check the console logs for detailed error messages
2. Verify your API keys are correct
3. Ensure your environment variables are properly set
4. Check rate limits for both APIs

---

**Happy Image Processing! 🎉**
